"""
MARRAKECH CRAFT CONDUIT - API Server
Lightweight REST API backend for Discovery Trigger, Job Status, and CRM Leads.
"""

import os
import sys
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from services.worker import launch_async_discovery, get_job_status
from services.db import list_leads

class PipelineAPIHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path == "/api/health":
            self._send_json({"status": "ok", "service": "marrakech-craft-conduit-engine"})
        elif path.startswith("/api/discovery/status/"):
            job_id = path.split("/api/discovery/status/")[1]
            status = get_job_status(job_id)
            if status:
                self._send_json(status)
            else:
                self._send_json({"error": "Job not found", "job_id": job_id}, 404)
        elif path == "/api/leads":
            status_filter = query.get("status", [None])[0]
            city_filter = query.get("city", [None])[0]
            leads = list_leads(status=status_filter, city=city_filter)
            self._send_json({"total": len(leads), "leads": [l.model_dump() for l in leads]})
        else:
            self._send_json({"error": "Not Found", "path": path}, 404)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        body = {}
        if length > 0:
            try:
                body = json.loads(self.rfile.read(length).decode("utf-8"))
            except Exception:
                body = {}

        if path == "/api/discovery/trigger":
            cities = body.get("cities", ["Paris", "Madrid", "Milan"])
            niches = body.get("niches", ["concept_store", "boho_decor"])
            auto_pitch = body.get("auto_pitch", True)
            dry_run = body.get("dry_run", True)
            force = body.get("force", False)

            job_id = launch_async_discovery(cities=cities, niches=niches, auto_pitch=auto_pitch, dry_run=dry_run, force=force)
            self._send_json({
                "job_id": job_id,
                "status": "queued",
                "message": f"Discovery pipeline initiated across {cities}"
            }, 202)
        else:
            self._send_json({"error": "Not Found", "path": path}, 404)

def run_server(port=8000):
    server = HTTPServer(("0.0.0.0", port), PipelineAPIHandler)
    print(f"[*] Marrakech Craft Conduit API running on http://localhost:{port}")
    server.serve_forever()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_server(port)
