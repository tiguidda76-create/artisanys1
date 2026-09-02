import os
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

files_to_push = [
    "index.html",
    "styles.css",
    "app.js",
    ".env.example",
    "services/models.py",
    "services/db.py",
    "services/scraper.py",
    "services/lookbook.py",
    "services/outreach.py",
    "services/worker.py",
    "services/api.py",
    "scripts/test_discovery.py",
    "directives/lead_sourcing_pipeline.md",
    "directives/multi_agent_qualification.md",
    "directives/async_task_pipeline.md",
    "directives/outreach_automation.md",
    "execution/db_schema.sql",
    "execution/db_client.py",
    "execution/scrape_enrich_leads.py",
    "execution/multi_agent_engine.py",
    "execution/generate_lookbook_pdf.py",
    "execution/send_outreach_resend.py",
    "execution/async_pipeline_worker.py"
]

payload_files = []
for rel_path in files_to_push:
    full_path = os.path.join(ROOT, rel_path.replace("/", os.sep))
    if os.path.exists(full_path):
        with open(full_path, "r", encoding="utf-8") as f:
            payload_files.append({
                "path": rel_path,
                "content": f.read()
            })

out_json_path = os.path.join(ROOT, ".tmp", "github_push_payload.json")
os.makedirs(os.path.dirname(out_json_path), exist_ok=True)
with open(out_json_path, "w", encoding="utf-8") as f:
    json.dump({
        "owner": "tiguidda76-create",
        "repo": "artisanys1",
        "branch": "main",
        "message": "feat: Lead Sourcing & Outreach Engine with Multi-Agent Qualification, Lookbooks & Resend API",
        "files": payload_files
    }, f)

print(f"[+] Prepared push payload with {len(payload_files)} files at {out_json_path}")
