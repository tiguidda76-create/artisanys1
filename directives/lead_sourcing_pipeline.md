# SOP: Automated European B2B Lead Sourcing & Enrichment

## Objective
Automatically discover, scrape, and enrich high-value B2B prospective buyers (boutiques, concept stores, interior design studios) across tier-1 European design hubs:
- **Target Cities**: Paris (FR), Madrid (ES), Milan (IT), Berlin (DE), Amsterdam (NL).
- **Target Niches**:
  1. Concept stores
  2. Bohemian / Mediterranean home decor boutiques
  3. Interior design studios & architectural specifiers
  4. Artisan & lifestyle gift shops

---

## Sourcing Workflow

### Step 1: Query Construction & Discovery
For each target city and niche, construct targeted search vectors:
- `"concept store" + [city] + ("home decor" OR "lifestyle" OR "artisan")`
- `"boutique decoration" + [city] + ("boho" OR "mediterranean" OR "crafts")`
- `"interior design studio" + [city] + ("residential" OR "hospitality" OR "procurement")`
- `"artisan gift shop" + [city] + ("handmade" OR "ceramics" OR "textiles")`

### Step 2: Extraction & Enrichment Criteria
For each discovered entity, extract and normalize:
- `name`: Official trade name / boutique name
- `city`: Location (Paris, Madrid, Milan, Berlin, Amsterdam)
- `country`: 2-letter ISO code (FR, ES, IT, DE, NL)
- `niche`: One of `concept_store`, `boho_decor`, `interior_design`, `artisan_gifts`
- `website`: Primary canonical URL
- `instagram`: Public IG handle (e.g. `@boutique_paris`)
- `email`: Verified decision-maker / buyer email (`contact@`, `buyer@`, `info@`, `bonjour@`, `hola@`, `ciao@`, `hallo@`)
- `phone`: Direct contact / WhatsApp number with international dial code
- `aesthetic_tags`: List of aesthetic keywords (e.g. `["wabi-sabi", "mediterranean", "earthy_tones", "terracotta", "raw_materials", "luxury_boho"]`)
- `status`: Initial status set to `'discovered'`

### Step 3: Domain Deduplication & Quality Filtering
- Discard duplicates by domain (`website_domain`) against the `dedup_domains` database table.
- Filter out large mass-market fast-retailers (e.g. Zara Home, H&M Home, IKEA) to keep 100% focus on independent curators and high-end design boutiques.
- Ensure verified contact email exists before passing to Agent Qualification.

---

## Execution Tool
- Script: `execution/scrape_enrich_leads.py`
- Output: Stored in database table `leads` with status `'discovered'`.
