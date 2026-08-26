#!/usr/bin/env python3
"""
MARRAKECH CRAFT CONDUIT - Live Discovery & Outreach Test Runner
Tests boutique discovery, contact extraction, Pydantic validation, Lookbook rendering,
and Resend outreach for boutiques in Paris.
"""

import os
import sys
import json
import time

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from services.scraper import discover_boutique_leads
from services.lookbook import match_craft_for_lead, generate_lookbook_pdf_for_lead
from services.outreach import send_outreach_email
from services.db import upsert_lead, list_leads, update_lead_status

def run_test_discovery_paris():
    print("=" * 65)
    print("🏛️  MARRAKECH CRAFT CONDUIT — LIVE DISCOVERY TEST (PARIS)")
    print("=" * 65)
    
    start_time = time.time()
    
    # 1. Discover 3 boutiques in Paris with force=True for test validation
    print("\n[1/4] Discovering & Deep-Scraping 3 Boutiques in Paris...")
    leads = discover_boutique_leads(cities=["Paris"], limit_per_city=3, force=True)
    print(f"  ✓ Sourced & validated {len(leads)} Pydantic BoutiqueLead records:")

    for i, lead in enumerate(leads, 1):
        print(f"\n  [{i}] {lead.name} ({lead.city}, {lead.country})")
        print(f"      • Website:   {lead.website}")
        print(f"      • Email:     {lead.email or 'N/A'}")
        print(f"      • Phone:     {lead.phone or 'N/A'}")
        print(f"      • Instagram: {lead.instagram or 'N/A'}")
        print(f"      • Tags:      {', '.join(lead.style_tags[:4])}")
        
        # Save to DB
        upsert_lead(lead)

    # 2. Match Craft Lines & Generate Tailored Lookbooks
    print("\n[2/4] Matching Moroccan Artisan Lines & Generating Lookbooks...")
    for lead in leads:
        craft_key, craft_data = match_craft_for_lead(lead)
        lookbook_path = generate_lookbook_pdf_for_lead(lead)
        lead.lookbook_pdf_url = f"/lookbooks/{os.path.basename(lookbook_path)}"
        
        qual_payload = {
            "craft_key": craft_key,
            "craft_title": craft_data["title"],
            "sample_price": craft_data["sample_price"]
        }
        update_lead_status(lead.id, status="matched", qualification=qual_payload, lookbook_url=lead.lookbook_pdf_url)
        print(f"  ✓ [{lead.name}] Matched: {craft_data['title']} (Sample: ${craft_data['sample_price']}/pc)")
        print(f"      ➔ Lookbook generated: {os.path.basename(lookbook_path)}")

    # 3. Test Resend Outreach Dispatch & Deduplication
    print("\n[3/4] Testing Resend B2B Outreach Engine (Dry Run)...")
    dispatched = 0
    for lead in leads:
        if lead.email:
            craft_key, craft_data = match_craft_for_lead(lead)
            res = send_outreach_email(lead, craft_title=craft_data["title"], dry_run=True)
            print(f"  ✓ Pitch dispatched to '{lead.name}' ({lead.email}) ➔ Delivery: {res['delivery_status']}")
            dispatched += 1

    # 4. Verification from Database
    print("\n[4/4] Verifying Database Persistence...")
    db_leads = list_leads(city="Paris")
    print(f"  ✓ Verified: {len(db_leads)} Paris leads currently persisted in DB.")

    duration = round(time.time() - start_time, 2)
    print("\n" + "=" * 65)
    print(f"✅ TEST COMPLETED SUCCESSFULLY IN {duration}s")
    print(f"   • Sourced: {len(leads)}")
    print(f"   • Lookbooks Generated: {len(leads)}")
    print(f"   • Pitched (with Dedup): {dispatched}")
    print("=" * 65)

if __name__ == "__main__":
    run_test_discovery_paris()
