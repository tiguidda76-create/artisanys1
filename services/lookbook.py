"""
MARRAKECH CRAFT CONDUIT - Personalized Lookbook Generator
Matches boutique style tags against authentic Moroccan craft lines and generates tailored B2B Lookbooks.
"""

import os
import sys
import json
from typing import Dict, Any, Tuple
from datetime import datetime

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from services.models import BoutiqueLead, LookbookPayload

LOOKBOOK_STORAGE_DIR = os.path.join(os.path.dirname(__file__), "..", ".tmp", "lookbooks")
os.makedirs(LOOKBOOK_STORAGE_DIR, exist_ok=True)

CRAFT_CATEGORIES = {
    "zellige_pottery": {
        "title": "Tamegroute & Safi Glazed Ceramics & Zellige",
        "description": "Ancestral emerald green manganese pottery, handcrafted glazed terracotta zellige tiles, and bespoke artisanal tableware.",
        "sample_price": 28.00,
        "boutique_price": 23.80, # -15%
        "wholesale_price": 18.20, # -35%
        "keywords": ["pottery", "ceramics", "clay", "terracotta", "tableware", "wabi-sabi", "earthy_tones", "green"]
    },
    "brass_lighting": {
        "title": "Hand-Pierced & Hammered Solid Brass Lighting",
        "description": "Master-artisan pierced brass pendants, sconces, and lanterns casting intricate geometric shadow play across spaces.",
        "sample_price": 140.00,
        "boutique_price": 119.00,
        "wholesale_price": 91.00,
        "keywords": ["brass", "lighting", "lanterns", "sculptural", "gold", "architectural", "contemporary_moroccan"]
    },
    "berber_rugs": {
        "title": "Authentic High-Atlas Beni Ourain & Azilal Rugs",
        "description": "100% natural unbleached virgin sheep's wool, hand-knotted by Berber tribal women with ancestral minimalist geometry.",
        "sample_price": 280.00,
        "boutique_price": 238.00,
        "wholesale_price": 182.00,
        "keywords": ["rugs", "wool", "berber", "beni_ourain", "textiles", "kilim", "boho_chic"]
    },
    "tuareg_leather": {
        "title": "Hand-Tanned Leather Poufs & Artisan Goods",
        "description": "Vegetable-tanned goat and camel leather poufs, minimalist oversized totes, and embossed travel accessories.",
        "sample_price": 45.00,
        "boutique_price": 38.25,
        "wholesale_price": 29.25,
        "keywords": ["leather", "poufs", "maroquinerie", "vintage", "distressed", "natural_tanning"]
    },
    "woodcraft": {
        "title": "Essaouira Burl Thuya & Atlas Cedar Woodcraft",
        "description": "Aromatic cedar sculpted bowls, patterned thuya wood accent tables, and bespoke turned decorative vessels.",
        "sample_price": 38.00,
        "boutique_price": 32.30,
        "wholesale_price": 24.70,
        "keywords": ["wood", "cedar", "thuya", "sculpted", "craftsmanship", "natural_grain"]
    }
}

def match_craft_for_lead(lead: BoutiqueLead) -> Tuple[str, Dict[str, Any]]:
    tags = [t.lower() for t in lead.style_tags]
    niche = (lead.niche or "").lower()

    scores = {}
    for key, data in CRAFT_CATEGORIES.items():
        score = 0.3
        for kw in data["keywords"]:
            if any(kw in t for t in tags):
                score += 0.25
        if niche == "interior_design" and key in ("brass_lighting", "berber_rugs"):
            score += 0.3
        elif niche == "boho_decor" and key in ("berber_rugs", "zellige_pottery", "tuareg_leather"):
            score += 0.3
        scores[key] = min(0.99, score)

    sorted_crafts = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    best_key = sorted_crafts[0][0]
    return best_key, CRAFT_CATEGORIES[best_key]

def generate_lookbook_pdf_for_lead(lead: BoutiqueLead) -> str:
    """
    Renders a bespoke wholesale lookbook and returns the saved file path.
    """
    craft_key, craft_data = match_craft_for_lead(lead)
    
    transit_map = {
        "FR": "3-4 days (DHL Express to France)",
        "ES": "2-3 days (DHL Express to Spain)",
        "IT": "3-5 days (DHL Express to Italy)",
        "DE": "3-5 days (DHL Express to Germany)",
        "NL": "3-5 days (DHL Express to Netherlands)"
    }
    transit = transit_map.get(lead.country, "3-5 days Express Air")

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>MARRAKECH CRAFT CONDUIT — Bespoke B2B Lookbook for {lead.name}</title>
<style>
  @page {{ size: A4 portrait; margin: 15mm; }}
  body {{ font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; background: #fff; line-height: 1.5; margin: 0; padding: 0; }}
  .cover {{ border: 2px solid #D97706; border-radius: 8px; padding: 25px; margin-bottom: 20px; background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); }}
  .brand-header {{ display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D97706; padding-bottom: 12px; margin-bottom: 15px; }}
  .brand-title {{ font-size: 20px; font-weight: 800; color: #92400E; letter-spacing: 1px; text-transform: uppercase; }}
  .curated-badge {{ background: #92400E; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }}
  .greeting {{ font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 6px; }}
  .sub {{ font-size: 12px; color: #475569; margin-bottom: 10px; }}
  .craft-card {{ background: #fff; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px; margin-bottom: 18px; }}
  .craft-title {{ font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 6px; }}
  .craft-desc {{ font-size: 11.5px; color: #334155; margin-bottom: 14px; }}
  .pricing-table {{ width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }}
  .pricing-table th {{ background: #F1F5F9; color: #0F172A; text-align: left; padding: 8px 10px; border: 1px solid #CBD5E1; }}
  .pricing-table td {{ padding: 8px 10px; border: 1px solid #E2E8F0; }}
  .badge-sample {{ background: #ECFDF5; color: #047857; font-weight: 700; padding: 2px 6px; border-radius: 4px; }}
  .badge-wholesale {{ background: #FEF3C7; color: #92400E; font-weight: 700; padding: 2px 6px; border-radius: 4px; }}
  .guarantees {{ background: #F8FAFC; border-left: 4px solid #D97706; padding: 14px; border-radius: 0 8px 8px 0; font-size: 11px; color: #334155; margin-top: 15px; }}
  .footer {{ border-top: 1px solid #E2E8F0; padding-top: 12px; margin-top: 20px; font-size: 9.5px; color: #64748B; display: flex; justify-content: space-between; }}
</style>
</head>
<body>

<div class="cover">
  <div class="brand-header">
    <div>
      <div class="brand-title">🏛️ MARRAKECH CRAFT CONDUIT</div>
      <div style="font-size: 11px; color: #B45309; font-weight: 600;">Master-Artisan Direct Export Protocol • Hassan Tiguidda</div>
    </div>
    <div class="curated-badge">B2B Private Lookbook</div>
  </div>
  <div class="greeting">Curated Selection for {lead.name} ({lead.city}, {lead.country})</div>
  <div class="sub">Direct master workshop sourcing with 0 middleman markup, low-risk 0 MOQ sample packs, and custom branding options.</div>
</div>

<div class="craft-card">
  <div class="craft-title">✨ Recommended Collection: {craft_data['title']}</div>
  <div class="craft-desc">{craft_data['description']}</div>

  <table class="pricing-table">
    <thead>
      <tr>
        <th>Tier / Level</th>
        <th>Minimum Order (MOQ)</th>
        <th>Wholesale Unit Price</th>
        <th>Transit & Incoterm</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Tier 1: Sample Discovery</strong></td>
        <td><span class="badge-sample">0 MOQ (1 - 5 pcs)</span></td>
        <td><strong>${craft_data['sample_price']:.2f} USD</strong> / pc</td>
        <td>{transit} • DAP</td>
      </tr>
      <tr>
        <td><strong>Tier 2: Boutique Stock</strong></td>
        <td>6 - 50 pcs (Assorted)</td>
        <td><strong>${craft_data['boutique_price']:.2f} USD</strong> (-15% Trade)</td>
        <td>5 - 7 days • Express Air</td>
      </tr>
      <tr>
        <td><strong>Tier 3: Wholesale Container</strong></td>
        <td><span class="badge-wholesale">50+ pcs (Bulk / FCL)</span></td>
        <td><strong>${craft_data['wholesale_price']:.2f} USD</strong> (-35% Wholesale)</td>
        <td>Ocean Freight Casablanca</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="guarantees">
  <strong>🛡️ Certified Export Guarantees:</strong>
  <ul>
    <li><strong>Authenticity & Provenance:</strong> 100% Handcrafted by master artisans in Marrakech, Essaouira, and High Atlas.</li>
    <li><strong>Fiscal Exemption:</strong> Export transactions exempt from Moroccan VAT under Art. 91-II-1° CGI Morocco.</li>
    <li><strong>Custom Branding:</strong> Blind dropshipping and custom embossed boutique tags/stamps available.</li>
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

    safe_name = "".join(c for c in lead.name if c.isalnum() or c in (" ", "_", "-")).rstrip().replace(" ", "_")
    html_filename = f"lookbook_{safe_name}_{lead.id}.html"
    file_path = os.path.join(LOOKBOOK_STORAGE_DIR, html_filename)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    return file_path
