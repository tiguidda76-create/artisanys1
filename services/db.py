"""
MARRAKECH CRAFT CONDUIT - Database Persistence & Deduplication Layer
Supports PostgreSQL / Supabase and local SQLite with seamless fallback.
"""

import os
import sys
import json
import sqlite3
from datetime import datetime
from typing import List, Optional, Dict, Any

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from services.models import BoutiqueLead

DB_DIR = os.path.join(os.path.dirname(__file__), "..", ".tmp")
os.makedirs(DB_DIR, exist_ok=True)
SQLITE_DB_PATH = os.path.join(DB_DIR, "mcc_pipeline.db")

def get_connection():
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            city VARCHAR(100) NOT NULL,
            country VARCHAR(10) NOT NULL,
            niche VARCHAR(100),
            website VARCHAR(255),
            domain VARCHAR(255),
            instagram VARCHAR(100),
            email VARCHAR(255),
            phone VARCHAR(100),
            address TEXT,
            rating REAL DEFAULT 4.8,
            user_ratings_total INTEGER DEFAULT 0,
            style_tags TEXT, -- JSON Array
            status VARCHAR(50) DEFAULT 'discovered',
            qualification TEXT, -- JSON Payload
            lookbook_pdf_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dedup_domains (
            domain VARCHAR(255) PRIMARY KEY,
            first_contacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_contacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            lead_id VARCHAR(64),
            status VARCHAR(50) DEFAULT 'active'
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS outreach_logs (
            id VARCHAR(64) PRIMARY KEY,
            lead_id VARCHAR(64) REFERENCES leads(id),
            recipient_email VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            body_html TEXT,
            lookbook_attached BOOLEAN DEFAULT FALSE,
            provider VARCHAR(50) DEFAULT 'resend',
            provider_message_id VARCHAR(255),
            delivery_status VARCHAR(50) DEFAULT 'sent',
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS discovery_jobs (
            job_id VARCHAR(64) PRIMARY KEY,
            cities TEXT, -- JSON Array
            niches TEXT, -- JSON Array
            status VARCHAR(50) DEFAULT 'queued',
            leads_count INTEGER DEFAULT 0,
            duration_seconds REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_domain ON leads(domain);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);")

    # Automatic schema migration for existing sqlite tables
    cursor.execute("PRAGMA table_info(leads)")
    existing_cols = [r["name"] for r in cursor.fetchall()]
    
    if "address" not in existing_cols:
        cursor.execute("ALTER TABLE leads ADD COLUMN address TEXT;")
    if "rating" not in existing_cols:
        cursor.execute("ALTER TABLE leads ADD COLUMN rating REAL DEFAULT 4.8;")
    if "user_ratings_total" not in existing_cols:
        cursor.execute("ALTER TABLE leads ADD COLUMN user_ratings_total INTEGER DEFAULT 0;")
    if "style_tags" not in existing_cols:
        cursor.execute("ALTER TABLE leads ADD COLUMN style_tags TEXT;")
    if "qualification" not in existing_cols:
        cursor.execute("ALTER TABLE leads ADD COLUMN qualification TEXT;")

    conn.commit()
    conn.close()

def is_domain_contacted(domain: str) -> bool:
    if not domain:
        return False
    clean = domain.lower().replace("http://", "").replace("https://", "").split("/")[0]
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT domain FROM dedup_domains WHERE domain = ?", (clean,))
    row = cursor.fetchone()
    conn.close()
    return row is not None

def register_contacted_domain(domain: str, lead_id: str):
    if not domain:
        return
    clean = domain.lower().replace("http://", "").replace("https://", "").split("/")[0]
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        INSERT INTO dedup_domains (domain, first_contacted_at, last_contacted_at, lead_id, status)
        VALUES (?, ?, ?, ?, 'active')
        ON CONFLICT(domain) DO UPDATE SET last_contacted_at = excluded.last_contacted_at
    """, (clean, now, now, lead_id))
    conn.commit()
    conn.close()

def upsert_lead(lead: BoutiqueLead) -> BoutiqueLead:
    conn = get_connection()
    cursor = conn.cursor()
    
    clean_domain = lead.domain
    if not clean_domain and lead.website:
        clean_domain = lead.website.lower().replace("http://", "").replace("https://", "").split("/")[0]

    tags_json = json.dumps(lead.style_tags)
    qual_json = json.dumps(lead.qualification) if lead.qualification else None
    now = datetime.utcnow().isoformat()

    cursor.execute("""
        INSERT INTO leads (
            id, name, city, country, niche, website, domain,
            instagram, email, phone, address, rating, user_ratings_total,
            style_tags, status, qualification, lookbook_pdf_url, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            city = excluded.city,
            email = COALESCE(excluded.email, leads.email),
            phone = COALESCE(excluded.phone, leads.phone),
            instagram = COALESCE(excluded.instagram, leads.instagram),
            rating = excluded.rating,
            user_ratings_total = excluded.user_ratings_total,
            style_tags = excluded.style_tags,
            status = excluded.status,
            qualification = COALESCE(excluded.qualification, leads.qualification),
            lookbook_pdf_url = COALESCE(excluded.lookbook_pdf_url, leads.lookbook_pdf_url),
            updated_at = excluded.updated_at
    """, (
        lead.id,
        lead.name,
        lead.city,
        lead.country,
        lead.niche,
        lead.website or "",
        clean_domain,
        lead.instagram or "",
        lead.email or "",
        lead.phone or "",
        lead.address or "",
        lead.rating or 4.8,
        lead.user_ratings_total or 0,
        tags_json,
        lead.status,
        qual_json,
        lead.lookbook_pdf_url or "",
        now
    ))
    conn.commit()
    conn.close()
    return lead

def list_leads(status: Optional[str] = None, city: Optional[str] = None) -> List[BoutiqueLead]:
    conn = get_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM leads WHERE 1=1"
    params = []
    if status:
        query += " AND status = ?"
        params.append(status)
    if city and city.lower() != "all":
        query += " AND LOWER(city) = LOWER(?)"
        params.append(city)
    query += " ORDER BY created_at DESC"
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    leads = []
    for r in rows:
        d = dict(r)
        if d.get("style_tags"):
            try:
                parsed_tags = json.loads(d["style_tags"])
                d["style_tags"] = parsed_tags if isinstance(parsed_tags, list) else []
            except:
                d["style_tags"] = []
        else:
            d["style_tags"] = []

        if d.get("qualification"):
            try:
                d["qualification"] = json.loads(d["qualification"])
            except:
                d["qualification"] = None
        else:
            d["qualification"] = None

        leads.append(BoutiqueLead(**d))
    conn.close()
    return leads

def update_lead_status(lead_id: str, status: str, qualification: Optional[Dict] = None, lookbook_url: Optional[str] = None):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    if qualification and lookbook_url:
        cursor.execute("""
            UPDATE leads SET status = ?, qualification = ?, lookbook_pdf_url = ?, updated_at = ? WHERE id = ?
        """, (status, json.dumps(qualification), lookbook_url, now, lead_id))
    elif qualification:
        cursor.execute("""
            UPDATE leads SET status = ?, qualification = ?, updated_at = ? WHERE id = ?
        """, (status, json.dumps(qualification), now, lead_id))
    elif lookbook_url:
        cursor.execute("""
            UPDATE leads SET status = ?, lookbook_pdf_url = ?, updated_at = ? WHERE id = ?
        """, (status, lookbook_url, now, lead_id))
    else:
        cursor.execute("""
            UPDATE leads SET status = ?, updated_at = ? WHERE id = ?
        """, (status, now, lead_id))
    conn.commit()
    conn.close()

def save_job(job_id: str, cities: List[str], niches: List[str], status: str = "running"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO discovery_jobs (job_id, cities, niches, status, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(job_id) DO UPDATE SET status = excluded.status
    """, (job_id, json.dumps(cities), json.dumps(niches), status, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()

def complete_job(job_id: str, leads_count: int, duration_seconds: float, status: str = "completed"):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        UPDATE discovery_jobs
        SET status = ?, leads_count = ?, duration_seconds = ?, completed_at = ?
        WHERE job_id = ?
    """, (status, leads_count, duration_seconds, now, job_id))
    conn.commit()
    conn.close()

# Auto-initialize on import
init_db()
