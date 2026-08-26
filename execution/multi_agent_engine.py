#!/usr/bin/env python3
"""
MARRAKECH CRAFT CONDUIT - Multi-Agent Lead Qualification & Catalog Matching Engine
Executes:
  - Agent 1: Catalog Matcher (Aesthetic & Craft Line Mapping)
  - Agent 2: Margin & Logistics Calculator (Wholesale Pricing, MOQ, Transit Rates)
  - Agent 3: Personalized Pitch Builder (Structured JSON Value Proposition)
"""

import os
import sys
import json
import argparse
from typing import Dict, List, Any

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Add project root to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from execution.db_client import get_leads_by_status, update_lead_status

# ── Artisan Catalog Taxonomy ──────────────────────────────────
ARTISAN_CATALOG_LINES = {
    "zellige_pottery": {
        "title": "Tamegroute & Safi Glazed Ceramics & Zellige",
        "description": "Ancient manganese/copper green glazed pottery, handcrafted terracotta zellige tiles, and bespoke tableware.",
        "sample_unit_price": 28.00,
        "boutique_pack_unit_price": 23.80, # 15% off
        "wholesale_unit_price": 18.20,     # 35% off
        "avg_weight_kg": 1.4,
        "aesthetic_keywords": ["clay", "terracotta", "pottery", "ceramics", "tableware", "wabi-sabi", "earthy_tones", "rustic", "green"]
    },
    "tuareg_leather": {
        "title": "Hand-Tanned Leather Poufs & Artisan Goods",
        "description": "Vegetable-tanned goat and camel leather poufs, minimalist oversized totes, and embossed travel accessories.",
        "sample_unit_price": 45.00,
        "boutique_pack_unit_price": 38.25,
        "wholesale_unit_price": 29.25,
        "avg_weight_kg": 1.2,
        "aesthetic_keywords": ["leather", "poufs", "maroquinerie", "vintage", "distressed", "natural_tanning", "heritage"]
    },
    "berber_rugs": {
        "title": "Authentic High-Atlas Beni Ourain & Azilal Rugs",
        "description": "100% natural unbleached virgin sheep's wool, hand-knotted by Berber tribal women with ancestral geometric patterns.",
        "sample_unit_price": 280.00,
        "boutique_pack_unit_price": 238.00,
        "wholesale_unit_price": 182.00,
        "avg_weight_kg": 9.5,
        "aesthetic_keywords": ["wool", "rugs", "textiles", "berber", "beni_ourain", "kilim", "monochrome", "cozy", "soft"]
    },
    "brass_lighting": {
        "title": "Hand-Pierced & Hammered Solid Brass Lighting",
        "description": "Master-artisan pierced brass pendants, sconces, and lanterns casting intricate geometric shadow play.",
        "sample_unit_price": 140.00,
        "boutique_pack_unit_price": 119.00,
        "wholesale_unit_price": 91.00,
        "avg_weight_kg": 3.8,
        "aesthetic_keywords": ["brass", "lighting", "lanterns", "sculptural", "gold", "architectural", "opulent", "shadows"]
    },
    "woodcraft": {
        "title": "Essaouira Burl Thuya & Atlas Cedar Woodcraft",
        "description": "Aromatic cedar sculpted bowls, patterned thuya wood accent tables, and bespoke turned decorative vessels.",
        "sample_unit_price": 38.00,
        "boutique_pack_unit_price": 32.30,
        "wholesale_unit_price": 24.70,
        "avg_weight_kg": 1.8,
        "aesthetic_keywords": ["wood", "cedar", "thuya", "sculpted", "natural_grain", "organic", "joinery", "tables"]
    }
}

# ── Logistics & Transit Table (Marrakech to Destination) ──────
DESTINATION_LOGISTICS = {
    "FR": {"country": "France", "dhl_base_kg": 4.5, "dhl_transit_days": "3-4 days", "sea_transit_days": "10-14 days", "incoterm": "DAP Paris"},
    "ES": {"country": "Spain", "dhl_base_kg": 4.0, "dhl_transit_days": "2-3 days", "sea_transit_days": "8-10 days", "incoterm": "DAP Madrid"},
    "IT": {"country": "Italy", "dhl_base_kg": 5.0, "dhl_transit_days": "3-5 days", "sea_transit_days": "12-16 days", "incoterm": "DAP Milan"},
    "DE": {"country": "Germany", "dhl_base_kg": 5.2, "dhl_transit_days": "3-5 days", "sea_transit_days": "12-16 days", "incoterm": "DAP Berlin"},
    "NL": {"country": "Netherlands", "dhl_base_kg": 5.0, "dhl_transit_days": "3-5 days", "sea_transit_days": "12-15 days", "incoterm": "DAP Amsterdam"}
}

def agent_1_catalog_matcher(lead: Dict[str, Any]) -> Dict[str, Any]:
    """
    AGENT 1 (Catalog Matcher):
    Analyzes store aesthetics, niche, and tags to score and match Moroccan artisan lines.
    """
    tags = [t.lower() for t in lead.get("aesthetic_tags", [])]
    niche = lead.get("niche", "").lower()
    
    scores = {}
    for line_key, line_data in ARTISAN_CATALOG_LINES.items():
        score = 0.35 # baseline interest in authentic crafts
        # Match keywords
        for kw in line_data["aesthetic_keywords"]:
            if any(kw in t for t in tags):
                score += 0.25
        if niche == "interior_design" and line_key in ["brass_lighting", "berber_rugs"]:
            score += 0.3
        elif niche == "boho_decor" and line_key in ["tuareg_leather", "zellige_pottery", "berber_rugs"]:
            score += 0.3
        elif niche == "artisan_gifts" and line_key in ["zellige_pottery", "woodcraft"]:
            score += 0.3
        
        scores[line_key] = min(0.98, round(score, 2))

    sorted_lines = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    primary_craft = sorted_lines[0][0]
    secondary_craft = sorted_lines[1][0] if len(sorted_lines) > 1 else None

    return {
        "primary_craft": primary_craft,
        "primary_craft_title": ARTISAN_CATALOG_LINES[primary_craft]["title"],
        "secondary_craft": secondary_craft,
        "secondary_craft_title": ARTISAN_CATALOG_LINES[secondary_craft]["title"] if secondary_craft else None,
        "alignment_score": sorted_lines[0][1],
        "matched_lines": [k for k, s in sorted_lines if s >= 0.5]
    }

def agent_2_margin_and_logistics(lead: Dict[str, Any], match_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    AGENT 2 (Margin & Logistics Calculator):
    Estimates sample wholesale pricing, tiered MOQs, and shipping transit metrics from Marrakech.
    """
    primary = match_result["primary_craft"]
    craft_meta = ARTISAN_CATALOG_LINES[primary]
    country = lead.get("country", "FR").upper()
    logistics = DESTINATION_LOGISTICS.get(country, DESTINATION_LOGISTICS["FR"])

    # Sample calculation: 5 pcs sample test order
    sample_qty = 5
    sample_subtotal = craft_meta["sample_unit_price"] * sample_qty
    sample_weight = craft_meta["avg_weight_kg"] * sample_qty
    est_shipping_sample = round(35.0 + (sample_weight * logistics["dhl_base_kg"]), 2)

    # Wholesale container calculation (50 pcs)
    wholesale_qty = 50
    wholesale_subtotal = craft_meta["wholesale_unit_price"] * wholesale_qty
    wholesale_margin_pct = 65 # Estimated retail markup potential in EU

    return {
        "sample_tier": {
            "moq": "0 MOQ (1-5 units test assortment)",
            "unit_price_usd": craft_meta["sample_unit_price"],
            "test_pack_total_usd": sample_subtotal,
            "est_dhl_freight_usd": est_shipping_sample,
            "transit_time": logistics["dhl_transit_days"]
        },
        "boutique_stock_tier": {
            "moq": "6-50 units",
            "unit_price_usd": craft_meta["boutique_pack_unit_price"],
            "discount": "15% off standard trade"
        },
        "wholesale_tier": {
            "moq": "50+ units (Container / Pallet)",
            "unit_price_usd": craft_meta["wholesale_unit_price"],
            "discount": "35% off master wholesale",
            "est_sea_transit": logistics["sea_transit_days"]
        },
        "incoterm_suggested": logistics["incoterm"],
        "customs_notice": "Exempt from export VAT (Art. 91-II-1° CGI Morocco) • EUR.1 / Origin Certificate ready"
    }

def agent_3_personalized_pitch_builder(lead: Dict[str, Any], match_result: Dict[str, Any], logistics_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    AGENT 3 (Personalized Pitch Builder):
    Generates structured JSON with custom pitch hooks, curated recommendations, and direct artisan value props.
    """
    store_name = lead["name"]
    city = lead.get("city", "Europe")
    country = lead.get("country", "FR")
    primary_craft_title = match_result["primary_craft_title"]
    sample_price = logistics_result["sample_tier"]["unit_price_usd"]
    transit = logistics_result["sample_tier"]["transit_time"]

    # Language determination
    lang = "fr" if country in ["FR", "BE", "CH"] else ("es" if country == "ES" else "en")

    if lang == "fr":
        subject = f"Collaboration Directe Artisanat d'Exception — Marrakech × {store_name}"
        hook = f"Bonjour {lead.get('contact_name') or 'à toute l\'équipe'},\n\nJ'admire particulièrement la sélection élégante et sensible de votre boutique à {city}."
        value_prop = (
            "En tant que maître-artisan à Marrakech, je vous propose un accès direct d'atelier, "
            "sans aucun intermédiaire ni marge de distributeur, avec la flexibilité d'une première commande découverte à 0 MOQ (1 à 5 pièces)."
        )
        cta = f"Souhaitez-vous recevoir notre mini-lookbook personnalisé ou tester un échantillon direct d'atelier livré en {transit} ?"
    elif lang == "es":
        subject = f"Propuesta Artesanal Directa de Marrakech para {store_name} ({city})"
        hook = f"Estimado/a {lead.get('contact_name') or 'equipo de ' + store_name},\n\nHe seguido con gran admiración la cuidada curaduría de su tienda en {city}."
        value_prop = (
            "Como maestro artesano en Marrakech, ofrezco suministro directo de taller sin sobrecostes de intermediarios, "
            "con un pedido de prueba flexible de 0 MOQ (1 a 5 piezas)."
        )
        cta = f"¿Les gustaría ojear nuestro catálogo digital exclusivo o recibir un lote de muestra en {transit}?"
    else: # en
        subject = f"Direct Master-Artisan Sourcing from Marrakech × {store_name}"
        hook = f"Dear {lead.get('contact_name') or 'Procurement Team'},\n\nI have been deeply impressed by the curated aesthetic and tactile storytelling of {store_name} in {city}."
        value_prop = (
            "Operating directly from our master workshop in Marrakech, we provide direct-from-source artisan pieces with 0 middleman markup, "
            "along with a low-risk 0 MOQ sample tier (1 to 5 pieces) and custom dimensions/branding options."
        )
        cta = f"Would you be open to previewing our tailored B2B lookbook or receiving an express workshop sample (delivered in {transit})?"

    pitch_json = {
        "store_name": store_name,
        "city": city,
        "language": lang,
        "subject_line": subject,
        "personalized_hook": hook,
        "core_value_proposition": value_prop,
        "recommended_craft_line": primary_craft_title,
        "sample_starting_price": f"${sample_price}/unit",
        "logistics_summary": f"Express DHL to {city} ({transit})",
        "custom_options": ["Custom dimensions", "Embossed boutique logo / tags", "Exclusive glaze formulations"],
        "call_to_action": cta
    }

    return pitch_json

def run_qualification_pipeline_for_lead(lead: Dict[str, Any]) -> Dict[str, Any]:
    """
    Runs the full 3-agent pipeline for a single lead and updates the database.
    """
    # 1. Agent 1: Catalog Matcher
    match_result = agent_1_catalog_matcher(lead)
    
    # 2. Agent 2: Margin & Logistics Calculator
    logistics_result = agent_2_margin_and_logistics(lead, match_result)
    
    # 3. Agent 3: Personalized Pitch Builder
    pitch_json = agent_3_personalized_pitch_builder(lead, match_result, logistics_result)

    qualification_payload = {
        "matched_craft": match_result,
        "logistics_and_margins": logistics_result,
        "pitch_builder_json": pitch_json,
        "pipeline_version": "v2.4_multi_agent"
    }

    # Update lead status in DB
    update_lead_status(lead["id"], status="matched", qualification_data=qualification_payload)

    return qualification_payload

def qualify_all_discovered_leads() -> List[Dict[str, Any]]:
    leads = get_leads_by_status("discovered")
    results = []
    print(f"[*] Processing {len(leads)} discovered leads through Multi-Agent Engine...")
    for lead in leads:
        qual = run_qualification_pipeline_for_lead(lead)
        results.append({"lead_id": lead["id"], "name": lead["name"], "craft": qual["matched_craft"]["primary_craft_title"]})
        print(f"  ✓ Qualified '{lead['name']}' ({lead['city']}) ➔ Matched with: {qual['matched_craft']['primary_craft_title']}")
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Multi-Agent Qualification Engine")
    parser.add_argument("--test", action="store_true", help="Run test qualification on discovered leads")
    args = parser.parse_args()

    results = qualify_all_discovered_leads()
    print(f"[+] Multi-Agent pipeline finished. {len(results)} leads transitioned to 'matched'.")
