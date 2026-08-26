# SOP: Outreach Automation & Resend Delivery Engine

## Objective
Automatically dispatch personalized wholesale pitches along with custom PDF Lookbook links/attachments directly to verified decision-makers, with bulletproof domain deduplication and deliverability protections.

---

## Deliverability & Deduplication Rules

1. **Domain Deduplication**:
   - Before queueing or dispatching any email, query `dedup_domains` or `outreach_logs`.
   - If the domain has received an outreach email within the last 90 days, abort and mark as `skipped_duplicate`.
2. **Language Localization**:
   - `FR` (Paris, Lyon, Brussels): French professional outreach.
   - `ES` (Madrid, Barcelona): Spanish professional outreach.
   - `IT` (Milan, Rome): Italian or luxury English outreach.
   - `DE` (Berlin, Munich): German or luxury English outreach.
   - `NL` (Amsterdam, Rotterdam): Dutch or luxury English outreach.
3. **Resend API Integration**:
   - Endpoint: `https://api.resend.com/emails`
   - From: `Hassan Tiguidda — Marrakech Craft Conduit <artisan@marrakechcraftconduit.com>`
   - Headers: Reply-To: `tiguidda76@gmail.com`
   - Attachments: Dynamic custom Lookbook PDF / direct CDN link.
4. **State Transition**:
   - Update lead status from `'matched'` to `'pitched'`.
   - Record timestamp, message ID, subject, and status in `outreach_logs`.

---

## Execution Tool
- Script: `execution/send_outreach_resend.py`
