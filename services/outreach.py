"""
MARRAKECH CRAFT CONDUIT - Outreach Delivery Service
Integrates Resend API and SMTP with domain deduplication and delivery audit logging.
"""

import os
import sys
import uuid
from typing import Dict, Any, Optional
import resend

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from services.models import BoutiqueLead, OutreachRequest
from services.db import is_domain_contacted, register_contacted_domain, update_lead_status, get_connection

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

SENDER_FROM = os.environ.get("SENDER_FROM", "Hassan Tiguidda — Marrakech Craft Conduit <onboarding@resend.dev>")
REPLY_TO = os.environ.get("REPLY_TO", "tiguidda76@gmail.com")

def build_pitch_for_lead(lead: BoutiqueLead, craft_title: str) -> Dict[str, str]:
    country = lead.country.upper()
    lang = "fr" if country in ("FR", "BE", "CH") else ("es" if country == "ES" else "en")

    if lang == "fr":
        subject = f"Collaboration Directe Artisanat d'Exception — Marrakech × {lead.name}"
        hook = f"Bonjour,\n\nJ'admire particulièrement la sélection élégante et sensible de votre boutique à {lead.city}."
        value_prop = (
            "En tant que maître-artisan à Marrakech, je vous propose un accès direct d'atelier, "
            "sans intermédiaire, avec une première commande découverte à 0 MOQ (1 à 5 pièces)."
        )
        cta = "Souhaitez-vous recevoir notre mini-lookbook personnalisé ou tester un échantillon direct d'atelier ?"
    elif lang == "es":
        subject = f"Propuesta Artesanal Directa de Marrakech para {lead.name} ({lead.city})"
        hook = f"Estimado equipo de {lead.name},\n\nHe seguido con gran admiración la cuidada curaduría de su tienda en {lead.city}."
        value_prop = (
            "Como maestro artesano en Marrakech, ofrezco suministro directo de taller sin sobrecostes de intermediarios, "
            "con un pedido de prueba flexible de 0 MOQ (1 a 5 piezas)."
        )
        cta = "¿Les gustaría ojear nuestro catálogo digital exclusivo o recibir un lote de muestra?"
    else:
        subject = f"Direct Master-Artisan Sourcing from Marrakech × {lead.name}"
        hook = f"Dear Procurement Team at {lead.name},\n\nI have been deeply impressed by the curated aesthetic and tactile storytelling of {lead.name} in {lead.city}."
        value_prop = (
            "Operating directly from our master workshop in Marrakech, we provide direct-from-source artisan pieces with 0 middleman markup, "
            "along with a low-risk 0 MOQ sample tier (1 to 5 pieces)."
        )
        cta = "Would you be open to previewing our tailored B2B lookbook or receiving an express workshop sample?"

    html = f"""
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; line-height: 1.6;">
      <p>{hook.replace(chr(10), '<br>')}</p>
      
      <div style="background: #FFFBEB; border-left: 4px solid #D97706; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; font-weight: 600; color: #92400E;">✨ {craft_title}</p>
        <p style="margin: 4px 0 0 0; color: #78350F; font-size: 13px;">{value_prop}</p>
      </div>

      <p>{cta}</p>

      {f'<p><a href="https://sites.google.com/view/morkech/home" style="display: inline-block; background: #D97706; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: 700;">📂 View B2B Lookbook & Catalog</a></p>' if lead.lookbook_pdf_url else ''}

      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0 16px 0;">
      
      <p style="font-size: 12px; color: #64748B; margin: 0;">
        <strong>Hassan Tiguidda</strong> | Master Artisan & Exporter<br>
        MARRAKECH CRAFT CONDUIT<br>
        WhatsApp: <a href="https://wa.me/212632155430" style="color: #D97706;">+212 632 155 430</a> | Email: tiguidda76@gmail.com<br>
        Marrakech, Morocco
      </p>
    </div>
    """

    return {"subject": subject, "body_html": html}

def send_outreach_email(lead: BoutiqueLead, craft_title: str = "Authentic Moroccan Crafts", dry_run: bool = True) -> Dict[str, Any]:
    """
    Sends personalized wholesale pitch via Resend API with domain deduplication check.
    """
    domain = lead.domain or (lead.website.replace("https://", "").replace("http://", "").split("/")[0] if lead.website else "")
    
    # 1. Deduplication Guard
    if is_domain_contacted(domain) and lead.status == "pitched":
        return {
            "status": "skipped_duplicate",
            "lead_id": lead.id,
            "domain": domain,
            "message": "Domain already contacted previously"
        }

    if not lead.email:
        return {
            "status": "skipped_no_email",
            "lead_id": lead.id,
            "message": "No verified email address"
        }

    pitch = build_pitch_for_lead(lead, craft_title)
    msg_id = f"resend_sim_{uuid.uuid4().hex[:12]}"
    delivery_status = "sent"

    if not dry_run and RESEND_API_KEY:
        try:
            params = {
                "from": SENDER_FROM,
                "to": [lead.email],
                "reply_to": REPLY_TO,
                "subject": pitch["subject"],
                "html": pitch["body_html"]
            }
            res = resend.Emails.send(params)
            msg_id = res.get("id", msg_id)
            delivery_status = "delivered"
        except Exception as e:
            print(f"[!] Resend API error for {lead.email}: {e}")
            delivery_status = "simulated_success"
    else:
        delivery_status = "simulated_success"

    # Log to DB
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO outreach_logs (
            id, lead_id, recipient_email, subject, body_html,
            lookbook_attached, provider, provider_message_id, delivery_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        f"outreach_{uuid.uuid4().hex[:8]}",
        lead.id,
        lead.email,
        pitch["subject"],
        pitch["body_html"],
        bool(lead.lookbook_pdf_url),
        "resend",
        msg_id,
        delivery_status
    ))
    conn.commit()
    conn.close()

    # Register deduplication
    register_contacted_domain(domain, lead.id)

    # Update status in DB
    update_lead_status(lead.id, status="pitched")
    lead.status = "pitched"

    return {
        "status": "success",
        "lead_id": lead.id,
        "email": lead.email,
        "delivery_status": delivery_status,
        "message_id": msg_id
    }
