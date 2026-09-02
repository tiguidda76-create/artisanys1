"""
Pushes all updated files to GitHub repository tiguidda76-create/artisanys1 via GitHub REST API.
"""

import os
import sys
import json
import base64
import time
import requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MCP_CONFIG_PATH = r"C:\Users\hp\.gemini\config\mcp_config.json"

with open(MCP_CONFIG_PATH, "r", encoding="utf-8") as f:
    config = json.load(f)

TOKEN = config["mcpServers"]["github"]["env"]["GITHUB_PERSONAL_ACCESS_TOKEN"]
OWNER = "tiguidda76-create"
REPO = "artisanys1"
BRANCH = "main"

headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Marrakech-Craft-Conduit-Deployer"
}

def api_request(method, url, **kwargs):
    kwargs.setdefault("headers", headers)
    kwargs.setdefault("timeout", 30)
    for attempt in range(5):
        try:
            r = requests.request(method, url, **kwargs)
            return r
        except Exception as e:
            time.sleep(2)
            if attempt == 4:
                raise e

files_to_sync = [
    "index.html",
    "styles.css",
    "app.js",
    "craftBrainService.ts",
    "craftBrainService.js",
    "package.json",
    "tsconfig.json",
    "AGENTS.md",
    ".agents/mcp_config.json",
    ".agents/skills/dashboard-standards/SKILL.md",
    ".env.example",
    "services/__init__.py",
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

def get_latest_commit_sha():
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}"
    r = api_request("GET", url)
    if r.status_code != 200:
        raise Exception(f"Failed to get branch ref: {r.status_code} {r.text}")
    return r.json()["object"]["sha"]

def get_base_tree_sha(commit_sha):
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits/{commit_sha}"
    r = api_request("GET", url)
    if r.status_code != 200:
        raise Exception(f"Failed to get commit: {r.status_code} {r.text}")
    return r.json()["tree"]["sha"]

def create_blobs_and_tree(base_tree_sha):
    tree_items = []
    for rel_path in files_to_sync:
        full_path = os.path.join(ROOT, rel_path.replace("/", os.sep))
        if not os.path.exists(full_path):
            if rel_path == "services/__init__.py":
                content_bytes = b'"""Services package"""'
            else:
                continue
        else:
            with open(full_path, "rb") as f:
                content_bytes = f.read()

        blob_resp = api_request(
            "POST",
            f"https://api.github.com/repos/{OWNER}/{REPO}/git/blobs",
            json={
                "content": base64.b64encode(content_bytes).decode("utf-8"),
                "encoding": "base64"
            }
        )
        if blob_resp.status_code != 201:
            raise Exception(f"Failed to create blob for {rel_path}: {blob_resp.status_code} {blob_resp.text}")
        
        blob_sha = blob_resp.json()["sha"]
        tree_items.append({
            "path": rel_path,
            "mode": "100644",
            "type": "blob",
            "sha": blob_sha
        })
        print(f"  ✓ Created blob for {rel_path} ({len(content_bytes)} bytes)", flush=True)

    tree_resp = api_request(
        "POST",
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/trees",
        json={
            "base_tree": base_tree_sha,
            "tree": tree_items
        }
    )
    if tree_resp.status_code != 201:
        raise Exception(f"Failed to create tree: {tree_resp.status_code} {tree_resp.text}")
    return tree_resp.json()["sha"]

def create_commit_and_update_ref(tree_sha, parent_commit_sha):
    msg = "feat: Add dedicated Craft AI 360 tab, fix navigation buttons and DOMContentLoaded initialization"
    commit_resp = api_request(
        "POST",
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits",
        json={
            "message": msg,
            "tree": tree_sha,
            "parents": [parent_commit_sha]
        }
    )
    if commit_resp.status_code != 201:
        raise Exception(f"Failed to create commit: {commit_resp.status_code} {commit_resp.text}")
    
    new_commit_sha = commit_resp.json()["sha"]
    
    ref_resp = api_request(
        "PATCH",
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}",
        json={
            "sha": new_commit_sha,
            "force": False
        }
    )
    if ref_resp.status_code != 200:
        raise Exception(f"Failed to update ref: {ref_resp.status_code} {ref_resp.text}")
    
    return new_commit_sha

if __name__ == "__main__":
    print(f"[*] Connecting to GitHub repository {OWNER}/{REPO} on branch '{BRANCH}'...", flush=True)
    parent_sha = get_latest_commit_sha()
    print(f"  ✓ Latest commit SHA: {parent_sha}", flush=True)
    
    base_tree = get_base_tree_sha(parent_sha)
    print(f"  ✓ Base tree SHA: {base_tree}", flush=True)
    
    new_tree = create_blobs_and_tree(base_tree)
    print(f"  ✓ New tree created: {new_tree}", flush=True)
    
    new_commit = create_commit_and_update_ref(new_tree, parent_sha)
    print("=" * 60, flush=True)
    print(f"🚀 SUCCESS: Pushed new commit {new_commit} to GitHub {OWNER}/{REPO}:{BRANCH}", flush=True)
    print(f"🔗 Commit URL: https://github.com/{OWNER}/{REPO}/commit/{new_commit}", flush=True)
    print("=" * 60, flush=True)
