# SOP: Async Background Task Pipeline & Lookbook Generation

## Overview
Decouples heavy scraping, multi-agent LLM qualification, PDF generation, and email dispatching from frontend web interactions using an async event-driven pipeline pattern (Inngest / Upstash QStash / Celery compatible).

---

## State Machine & Transitions

```
[Trigger Discovery] ──> Status: 'discovered'
                           │
                           ▼
                    [Multi-Agent Run] ──> Status: 'matched'
                                             │
                                             ▼
                                     [PDF Lookbook Render] ──> URL: 'lookbook_pdf_url'
                                                                  │
                                                                  ▼
                                                          [Outreach Dispatch] ──> Status: 'pitched'
```

---

## Storage & Asset Specifications
- **Database Schema**: PostgreSQL / Supabase with SQLite fallback for local operation.
- **Lookbook Generator**: Python WeasyPrint / HTML5 Print Engine generating sleek A4 landscape PDF Lookbooks.
- **PDF Layout Elements**:
  - Cover page: Boutique Name + Marrakech Craft Conduit Artisan Seal.
  - Curated Craft Showcase: Matched artisan lines with photography, dimensions, and craft origin story.
  - Wholesale Matrix: Tiered pricing (0 MOQ Sample, Boutique Pack, Wholesale Container).
  - Export & Logistics Section: DHL/Port Casablanca specs, packaging guarantees, and Hassan Tiguidda Master Artisan signature.
- **Storage Location**: S3-compatible cloud storage / Supabase storage bucket (`lookbooks/`).

---

## Execution Tools
- PDF Generator: `execution/generate_lookbook_pdf.py`
- Worker Engine: `execution/async_pipeline_worker.py`
