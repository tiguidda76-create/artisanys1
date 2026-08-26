-- MARRAKECH CRAFT CONDUIT Database Schema
-- Compatible with PostgreSQL (Supabase) and SQLite

CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(10) NOT NULL,
    niche VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    domain VARCHAR(255),
    instagram VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    contact_name VARCHAR(150),
    aesthetic_tags TEXT, -- JSON array of tags
    status VARCHAR(50) DEFAULT 'discovered', -- 'discovered', 'matched', 'pitched', 'replied', 'converted'
    qualification_data TEXT, -- JSON payload from Multi-Agent Engine
    lookbook_pdf_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dedup_domains (
    domain VARCHAR(255) PRIMARY KEY,
    first_contacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_contacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lead_id VARCHAR(64),
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS outreach_logs (
    id VARCHAR(64) PRIMARY KEY,
    lead_id VARCHAR(64) REFERENCES leads(id),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT,
    lookbook_attached BOOLEAN DEFAULT FALSE,
    provider VARCHAR(50) DEFAULT 'resend',
    provider_message_id VARCHAR(255),
    delivery_status VARCHAR(50) DEFAULT 'sent', -- 'queued', 'sent', 'delivered', 'opened', 'failed'
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_domain ON leads(domain);
