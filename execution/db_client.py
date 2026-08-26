#!/usr/bin/env python3
"""
MARRAKECH CRAFT CONDUIT - Database Client
Unified database interface for PostgreSQL (Supabase) and local SQLite.
"""

import os
import json
import sqlite3
from datetime import datetime
from typing import Dict, List, Optional, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "..", ".tmp", "mcc_pipeline.db")

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    schema_path = os.path.join(os.path.dirname(__file__), "db_schema.sql")
    if os.path.exists(schema_path):
        with open(schema_path, "r", encoding="utf-8") as f:
            cursor.executescript(f.read())
    conn.commit()
    conn.close()

def is_domain_contacted(domain: str) -> bool:
    if not domain:
        return False
    clean_domain = domain.lower().replace("http://", "").replace("https://", "").split("/")[0]
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT domain FROM dedup_domains WHERE domain = ?", (clean_domain,))
    row = cursor.fetchone()
    conn.close()
    return row is not None

def register_contacted_domain(domain: str, lead_id: str):
    if not domain:
        return
    clean_domain = domain.lower().replace("http://", "").replace("https://", "").split("/")[0]
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        INSERT INTO dedup_domains (domain, first_contacted_at, last_contacted_at, lead_id, status)
        VALUES (?, ?, ?, ?, 'active')
        ON CONFLICT(domain) DO UPDATE SET last_contacted_at = excluded.last_contacted_at
    """, (clean_domain, now, now, lead_id))
    conn.commit()
    conn.close()

def save_lead(lead_data: Dict[str, Any]) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    
    tags = json.dumps(lead_data.get("aesthetic_tags", []))
    qual_data = json.dumps(lead_data.get("qualification_data", {})) if lead_data.get("qualification_data") else None
    
    domain = lead_data.get("domain") or ""
    if not domain and lead_data.get("website"):
        domain = lead_data["website"].lower().replace("http://", "").replace("https://", "").split("/")[0]

    cursor.execute("""
        INSERT INTO leads (
            id, name, city, country, niche, website, domain,
            instagram, email, phone, contact_name, aesthetic_tags,
            status, qualification_data, lookbook_pdf_url, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            status = excluded.status,
            qualification_data = COALESCE(excluded.qualification_data, leads.qualification_data),
            lookbook_pdf_url = COALESCE(excluded.lookbook_pdf_url, leads.lookbook_pdf_url),
            updated_at = excluded.updated_at
    """, (
        lead_data["id"],
        lead_data["name"],
        lead_data.get("city", "Paris"),
        lead_data.get("country", "FR"),
        lead_data.get("niche", "concept_store"),
        lead_data.get("website", ""),
        domain,
        lead_data.get("instagram", ""),
        lead_data.get("email", ""),
        lead_data.get("phone", ""),
        lead_data.get("contact_name", ""),
        tags,
        lead_data.get("status", "discovered"),
        qual_data,
        lead_data.get("lookbook_pdf_url", ""),
        datetime.utcnow().isoformat()
    ))
    conn.commit()
    conn.close()
    return lead_data["id"]

def update_lead_status(lead_id: str, status: str, qualification_data: Optional[Dict] = None, lookbook_url: Optional[str] = None):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    
    if qualification_data and lookbook_url:
        cursor.execute("""
            UPDATE leads
            SET status = ?, qualification_data = ?, lookbook_pdf_url = ?, updated_at = ?
            WHERE id = ?
        """, (status, json.dumps(qualification_data), lookbook_url, now, lead_id))
    elif qualification_data:
        cursor.execute("""
            UPDATE leads
            SET status = ?, qualification_data = ?, updated_at = ?
            WHERE id = ?
        """, (status, json.dumps(qualification_data), now, lead_id))
    elif lookbook_url:
        cursor.execute("""
            UPDATE leads
            SET status = ?, lookbook_pdf_url = ?, updated_at = ?
            WHERE id = ?
        """, (status, lookbook_url, now, lead_id))
    else:
        cursor.execute("""
            UPDATE leads
            SET status = ?, updated_at = ?
            WHERE id = ?
        """, (status, now, lead_id))
        
    conn.commit()
    conn.close()

def get_leads_by_status(status: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    if status:
        cursor.execute("SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC", (status,))
    else:
        cursor.execute("SELECT * FROM leads ORDER BY created_at DESC")
    rows = cursor.fetchall()
    leads = []
    for r in rows:
        d = dict(r)
        if d.get("aesthetic_tags"):
            try:
                d["aesthetic_tags"] = json.loads(d["aesthetic_tags"])
            except:
                pass
        if d.get("qualification_data"):
            try:
                d["qualification_data"] = json.loads(d["qualification_data"])
            except:
                pass
        leads.append(d)
    conn.close()
    return leads

def log_outreach(log_data: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO outreach_logs (
            id, lead_id, recipient_email, subject, body_html,
            lookbook_attached, provider, provider_message_id, delivery_status, sent_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        log_data["id"],
        log_data["lead_id"],
        log_data["recipient_email"],
        log_data["subject"],
        log_data.get("body_html", ""),
        log_data.get("lookbook_attached", False),
        log_data.get("provider", "resend"),
        log_data.get("provider_message_id", "msg_sim_" + log_data["id"]),
        log_data.get("delivery_status", "sent"),
        datetime.utcnow().isoformat()
    ))
    conn.commit()
    conn.close()

# Initialize DB upon module load
init_db()
