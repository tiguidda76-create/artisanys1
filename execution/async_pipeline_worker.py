#!/usr/bin/env python3
"""
MARRAKECH CRAFT CONDUIT - Async Background Pipeline Worker
Orchestrates end-to-end jobs:
  Discovery ➔ Multi-Agent Matching ➔ PDF Lookbook Render ➔ Resend Outreach Dispatch
"""

import os
import sys
import json
import time
import argparse
from typing import Dict, Any

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Add project root to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from execution.db_client import init_db, get_leads_by_status
from execution.scrape_enrich_leads import scrape_and_enrich_leads
from execution.multi_agent_engine import qualify_all_discovered_leads
from execution.generate_lookbook_pdf import generate_lookbooks_for_all_matched
from execution.send_outreach_resend import dispatch_all_matched_leads

def run_pipeline(cities=None, niches=None, limit=10, dry_run=True, force=False) -> Dict[str, Any]:
    print("=" * 60)
    print("🚀 MARRAKECH CRAFT CONDUIT — ASYNC PIPELINE WORKER START")
    print("=" * 60)
    start_time = time.time()
    
    # 1. Discovery & Sourcing
    print("\n[STEP 1/4] Sourcing & Enriching Prospective B2B Leads...")
    sourced = scrape_and_enrich_leads(cities=cities, niches=niches, limit=limit, force=force)
    print(f"  ➔ Sourced: {len(sourced)} prospects (Status: 'discovered')")

    # 2. Multi-Agent Qualification & Catalog Matching
    print("\n[STEP 2/4] Executing Multi-Agent Qualification & Catalog Matching...")
    qualified = qualify_all_discovered_leads()
    print(f"  ➔ Qualified: {len(qualified)} prospects (Status: 'matched')")

    # 3. Dynamic Lookbook Rendering
    print("\n[STEP 3/4] Generating Custom Lookbooks...")
    lookbooks_count = generate_lookbooks_for_all_matched()
    print(f"  ➔ Rendered: {lookbooks_count} tailored B2B Lookbooks")

    # 4. Outreach Dispatch & Deduplication
    print(f"\n[STEP 4/4] Executing Outreach Engine (Dry Run: {dry_run})...")
    outreach_results = dispatch_all_matched_leads(dry_run=dry_run)
    print(f"  ➔ Dispatched: {len(outreach_results)} pitches (Status: 'pitched')")

    duration = round(time.time() - start_time, 2)
    summary = {
        "status": "success",
        "duration_seconds": duration,
        "sourced_count": len(sourced),
        "qualified_count": len(qualified),
        "lookbooks_generated": lookbooks_count,
        "pitched_count": len(outreach_results)
    }

    print("\n" + "=" * 60)
    print(f"✅ PIPELINE RUN COMPLETED IN {duration}s")
    print(f"📊 Summary: {json.dumps(summary, indent=2)}")
    print("=" * 60)

    return summary

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Marrakech Craft Conduit Async Pipeline")
    parser.add_argument("--run-all", action="store_true", help="Run complete pipeline")
    parser.add_argument("--cities", nargs="+", default=["Paris", "Madrid", "Milan", "Berlin", "Amsterdam"])
    parser.add_argument("--niches", nargs="+", default=["concept_store", "boho_decor", "interior_design", "artisan_gifts"])
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--dry-run", action="store_true", default=True)
    parser.add_argument("--force", action="store_true", help="Bypass deduplication during test run")
    args = parser.parse_args()

    run_pipeline(cities=args.cities, niches=args.niches, limit=args.limit, dry_run=args.dry_run, force=args.force)
