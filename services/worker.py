"""
MARRAKECH CRAFT CONDUIT - Background Orchestrator Worker
Asynchronously executes: Sourcing ➔ Craft Matching ➔ Lookbook Rendering ➔ Resend Outreach.
"""

import os
import sys
import time
import uuid
import threading
from typing import List, Dict, Any, Optional

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from services.models import BoutiqueLead, DiscoveryJob
from services.scraper import discover_boutique_leads
from services.lookbook import match_craft_for_lead, generate_lookbook_pdf_for_lead
from services.outreach import send_outreach_email
from services.db import upsert_lead, update_lead_status, save_job, complete_job

# In-memory job registry
ACTIVE_JOBS: Dict[str, Dict[str, Any]] = {}

def execute_discovery_pipeline(job_id: str, cities: List[str], niches: List[str], auto_pitch: bool = True, dry_run: bool = True, force: bool = False) -> Dict[str, Any]:
    start_time = time.time()
    save_job(job_id, cities, niches, status="running")
    ACTIVE_JOBS[job_id] = {
        "job_id": job_id,
        "status": "running",
        "progress_step": "sourcing",
        "leads_count": 0,
        "pitched_count": 0
    }

    try:
        # Step 1: Sourcing & Deep Crawling
        leads = discover_boutique_leads(cities=cities, niches=niches, force=force)
        saved_leads = []
        for l in leads:
            upsert_lead(l)
            saved_leads.append(l)

        ACTIVE_JOBS[job_id]["leads_count"] = len(saved_leads)
        ACTIVE_JOBS[job_id]["progress_step"] = "qualifying"

        # Step 2 & 3: Craft Matching & Lookbook Generation
        pitched_count = 0
        for lead in saved_leads:
            if lead.status == "discovered":
                craft_key, craft_data = match_craft_for_lead(lead)
                
                # Render Lookbook
                lookbook_path = generate_lookbook_pdf_for_lead(lead)
                lead.lookbook_pdf_url = f"/lookbooks/{os.path.basename(lookbook_path)}"
                lead.status = "matched"
                
                # Save qualification payload
                qual_payload = {
                    "craft_key": craft_key,
                    "craft_title": craft_data["title"],
                    "sample_price": craft_data["sample_price"]
                }
                update_lead_status(lead.id, status="matched", qualification=qual_payload, lookbook_url=lead.lookbook_pdf_url)

                # Step 4: Outreach
                if auto_pitch and lead.email:
                    outreach_res = send_outreach_email(lead, craft_title=craft_data["title"], dry_run=dry_run)
                    if outreach_res["status"] == "success":
                        pitched_count += 1

        duration = round(time.time() - start_time, 2)
        complete_job(job_id, leads_count=len(saved_leads), duration_seconds=duration, status="completed")

        ACTIVE_JOBS[job_id].update({
            "status": "completed",
            "progress_step": "done",
            "leads_count": len(saved_leads),
            "pitched_count": pitched_count,
            "duration_seconds": duration
        })

        return ACTIVE_JOBS[job_id]

    except Exception as e:
        complete_job(job_id, leads_count=0, duration_seconds=0, status="failed")
        ACTIVE_JOBS[job_id].update({
            "status": "failed",
            "error": str(e)
        })
        raise e

def launch_async_discovery(cities: List[str] = None, niches: List[str] = None, auto_pitch: bool = True, dry_run: bool = True, force: bool = False) -> str:
    job_id = f"job_{uuid.uuid4().hex[:8]}"
    if not cities:
        cities = ["Paris", "Lyon", "Madrid", "Milan", "Berlin", "Amsterdam"]
    if not niches:
        niches = ["concept_store", "boho_decor"]

    save_job(job_id, cities, niches, status="queued")
    ACTIVE_JOBS[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "cities": cities,
        "niches": niches
    }

    thread = threading.Thread(
        target=execute_discovery_pipeline,
        args=(job_id, cities, niches, auto_pitch, dry_run, force),
        daemon=True
    )
    thread.start()
    return job_id

def get_job_status(job_id: str) -> Optional[Dict[str, Any]]:
    return ACTIVE_JOBS.get(job_id)
