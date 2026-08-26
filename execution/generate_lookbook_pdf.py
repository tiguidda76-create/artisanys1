#!/usr/bin/env python3
"""
MARRAKECH CRAFT CONDUIT - Dynamic B2B Lookbook PDF Generator
Renders bespoke, luxury mini-lookbooks customized for each prospect using WeasyPrint / HTML5 Print Engine.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any, Optional

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Add project root to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from execution.db_client import get_leads_by_status, update_lead_status

LOOKBOOK_DIR = os.path.join(os.path.dirname(__file__), "..", ".tmp", "lookbooks")
os.makedirs(LOOKBOOK_DIR, exist_ok=True)

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>MARRAKECH CRAFT CONDUIT — Bespoke Lookbook for {store_name}</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 15mm;
  }}
  body {{
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    margin: 0;
    padding: 0;
    line-height: 1.5;
  }}
  .cover {{
    border: 2px solid #D97706;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  }}
  .brand-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #D97706;
    padding-bottom: 12px;
    margin-bottom: 18px;
  }}
  .brand-title {{
    font-size: 20px;
    font-weight: 800;
    color: #92400E;
    letter-spacing: 1px;
    text-transform: uppercase;
  }}
  .brand-subtitle {{
    font-size: 11px;
    color: #B45309;
    font-weight: 600;
  }}
  .curated-badge {{
    background: #92400E;
    color: #ffffff;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .store-greeting {{
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
  }}
  .store-sub {{
    font-size: 12px;
    color: #475569;
    margin-bottom: 15px;
  }}
  .craft-showcase {{
    background: #ffffff;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 18px;
  }}
  .craft-title {{
    font-size: 15px;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 6px;
  }}
  .craft-desc {{
    font-size: 11px;
    color: #334155;
    margin-bottom: 12px;
  }}
  .pricing-matrix {{
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 11px;
  }}
  .pricing-matrix th {{
    background: #F1F5F9;
    color: #0F172A;
    text-align: left;
    padding: 8px;
    border: 1px solid #CBD5E1;
  }}
  .pricing-matrix td {{
    padding: 8px;
    border: 1px solid #E2E8F0;
  }}
  .badge-sample {{
    background: #ECFDF5;
    color: #047857;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
  }}
  .badge-wholesale {{
    background: #FEF3C7;
    color: #92400E;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
  }}
  .provenance-box {{
    background: #F8FAFC;
    border-left: 4px solid #D97706;
    padding: 12px;
    border-radius: 0 6px 6px 0;
    margin-top: 15px;
    font-size: 10.5px;
    color: #334155;
  }}
  .footer {{
    border-top: 1px solid #E2E8F0;
    padding-top: 12px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 9.5px;
    color: #64748B;
  }}
</style>
</head>
<body>

<div class="cover">
  <div class="brand-header">
    <div>
      <div class="brand-title">🏛️ MARRAKECH CRAFT CONDUIT</div>
      <div class="brand-subtitle">Master-Artisan Direct Export Protocol • Hassan Tiguidda</div>
    </div>
    <div class="curated-badge">B2B Private Lookbook</div>
  </div>

  <div class="store-greeting">Curated Selection for {store_name} ({city}, {country})</div>
  <div class="store-sub">
    Prepared directly from our Marrakech atelier. Direct artisan pricing, 0 middleman margin, authentic cultural provenance.
  </div>
</div>

<div class="craft-showcase">
  <div class="craft-title">✨ Recommended Collection: {craft_title}</div>
  <div class="craft-desc">{craft_desc}</div>

  <table class="pricing-matrix">
    <thead>
      <tr>
        <th>Tier / Level</th>
        <th>Minimum Order (MOQ)</th>
        <th>Wholesale Unit Price</th>
        <th>Lead Time & Freight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Tier 1: Sample Discovery</strong></td>
        <td><span class="badge-sample">0 MOQ (1 - 5 pcs)</span></td>
        <td><strong>${sample_price} USD</strong> / piece</td>
        <td>3 - 5 days (DHL Express to {city})</td>
      </tr>
      <tr>
        <td><strong>Tier 2: Boutique Stock</strong></td>
        <td>6 - 50 pcs (Assorted)</td>
        <td><strong>${boutique_price} USD</strong> (-15% discount)</td>
        <td>5 - 7 days (Air / Express Road)</td>
      </tr>
      <tr>
        <td><strong>Tier 3: Wholesale Container</strong></td>
        <td><span class="badge-wholesale">50+ pcs (Bulk / FCL)</span></td>
        <td><strong>${wholesale_price} USD</strong> (-35% discount)</td>
        <td>Ocean Freight via Casablanca Port</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="provenance-box">
  <strong>🛡️ Certified Export Guarantees:</strong>
  <ul>
    <li><strong>Authenticity:</strong> 100% Handcrafted by master artisans in Marrakech, Essaouira, and High Atlas.</li>
    <li><strong>Fiscal Exemption:</strong> Export transactions exempt from Moroccan VAT under Art. 91-II-1° CGI.</li>
    <li><strong>Custom Branding:</strong> Blind dropship and custom boutique tags/embossing available upon request.</li>
    <li><strong>Direct Contact:</strong> Hassan Tiguidda | WhatsApp: +212 632 155 430 | Email: tiguidda76@gmail.com</li>
  </ul>
</div>

<div class="footer">
  <div>Marrakech Craft Conduit — Zone 16 imm 118 app 03, Marrakech, Morocco | ICE: 1161674000043</div>
  <div>Portfolio: sites.google.com/view/morkech/home</div>
</div>

</body>
</html>
"""

def generate_lookbook_for_lead(lead: Dict[str, Any]) -> str:
    """
    Generates an HTML / PDF lookbook file for the qualified lead.
    """
    store_name = lead["name"]
    city = lead.get("city", "Europe")
    country = lead.get("country", "FR")
    
    qual = lead.get("qualification_data", {})
    matched_craft = qual.get("matched_craft", {})
    craft_title = matched_craft.get("primary_craft_title", "Authentic Moroccan Artisan Crafts")
    
    from execution.multi_agent_engine import ARTISAN_CATALOG_LINES
    primary_key = matched_craft.get("primary_craft", "zellige_pottery")
    craft_meta = ARTISAN_CATALOG_LINES.get(primary_key, ARTISAN_CATALOG_LINES["zellige_pottery"])
    
    html_content = HTML_TEMPLATE.format(
        store_name=store_name,
        city=city,
        country=country,
        craft_title=craft_title,
        craft_desc=craft_meta["description"],
        sample_price=f"{craft_meta['sample_unit_price']:.2f}",
        boutique_price=f"{craft_meta['boutique_pack_unit_price']:.2f}",
        wholesale_price=f"{craft_meta['wholesale_unit_price']:.2f}"
    )

    safe_name = "".join(c for c in store_name if c.isalnum() or c in (" ", "_", "-")).rstrip().replace(" ", "_")
    html_filename = f"lookbook_{safe_name}_{lead['id']}.html"
    pdf_filename = f"lookbook_{safe_name}_{lead['id']}.pdf"
    
    html_path = os.path.join(LOOKBOOK_DIR, html_filename)
    pdf_path = os.path.join(LOOKBOOK_DIR, pdf_filename)

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    # Attempt WeasyPrint conversion if available, otherwise serve HTML Lookbook
    pdf_generated = False
    try:
        from weasyprint import HTML
        HTML(string=html_content).write_pdf(pdf_path)
        pdf_generated = True
    except Exception as e:
        # Fallback: HTML lookbook is ready for print / browser view
        pdf_generated = False

    target_path = pdf_path if pdf_generated else html_path
    lookbook_url = f"/lookbooks/{os.path.basename(target_path)}"

    # Update lead in DB
    update_lead_status(lead["id"], status=lead.get("status", "matched"), lookbook_url=lookbook_url)

    return target_path

def generate_lookbooks_for_all_matched() -> int:
    leads = get_leads_by_status("matched")
    count = 0
    print(f"[*] Generating custom B2B lookbooks for {len(leads)} matched leads...")
    for lead in leads:
        path = generate_lookbook_for_lead(lead)
        count += 1
        print(f"  ✓ Rendered Lookbook for '{lead['name']}' ➔ {os.path.basename(path)}")
    return count

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate B2B Mini-Lookbooks")
    parser.add_argument("--test", action="store_true", help="Generate lookbooks for matched leads")
    args = parser.parse_args()

    count = generate_lookbooks_for_all_matched()
    print(f"[+] Lookbook generation complete. {count} lookbooks created in .tmp/lookbooks/")
