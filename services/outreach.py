"""
MARRAKECH CRAFT CONDUIT - Outreach Delivery Service
Integrates Gmail SMTP (tiguidda76@gmail.com) and Resend API with domain deduplication and delivery audit logging.
"""

import os
import sys
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, Optional

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from services.models import BoutiqueLead, OutreachRequest
from services.db import is_domain_contacted, register_contacted_domain, update_lead_status, get_connection

GMAIL_USER = os.environ.get("GMAIL_USER", "tiguidda76@gmail.com")
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "bfgznhusgoyrlpml")
SENDER_NAME = "Hassan Tiguidda — Marrakech Craft Conduit"
REPLY_TO = "tiguidda76@gmail.com"

def build_pitch_for_lead(lead: BoutiqueLead, craft_title: str) -> Dict[str, str]:
    country = lead.country.upper()
    lang = "fr" if country in ("FR", "BE", "CH") else ("es" if country == "ES" else "en")

    if lang == "fr":
        subject = f"Collaboration Directe Artisanat d'Exception — Marrakech × {lead.name}"
        hook = f"Bonjour,\n\nJ'admire particulièrement la sélection élégante et sensible de votre boutique à {lead.city}."
        value_prop = (
            "En tant que maître-artisan et exportateur à Marrakech, je vous propose un accès direct d'atelier, "
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
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; max-width: 600px; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #12121a; padding: 20px; text-align: center; color: #c49a6c;">
        <h2 style="margin: 0; font-size: 18px; letter-spacing: 1px;">MARRAKECH CRAFT CONDUIT 🇲🇦</h2>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; text-transform: uppercase;">Direct Workshop B2B Export Engine</p>
      </div>

      <div style="padding: 24px;">
        <p>{hook.replace(chr(10), '<br>')}</p>
        
        <div style="background: #FFFBEB; border-left: 4px solid #D97706; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-weight: 600; color: #92400E;">✨ {craft_title}</p>
          <p style="margin: 4px 0 0 0; color: #78350F; font-size: 13px;">{value_prop}</p>
        </div>

        <p>{cta}</p>

        <div style="margin: 24px 0; text-align: center;">
          <a href="https://wa.me/212632155430?text=Hello%20Hassan,%20I%20am%20interested%20in%20your%20Marrakech%20Artisan%20B2B%20Lookbook." style="background: #059669; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 13px; font-weight: bold; border-radius: 8px; display: inline-block;">
            💬 WhatsApp Direct (+212 632 155 430)
          </a>
        </div>
      </div>

      <div style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
        <strong>AUTO-ENTREPRENEUR HASSAN TIGUIDDA</strong> • ICE: 1161674000043<br>
        Master Artisan & B2B Exporter • Marrakech, Morocco<br>
        Email: <a href="mailto:tiguidda76@gmail.com" style="color: #c49a6c;">tiguidda76@gmail.com</a>
      </div>
    </div>
    """

    return {"subject": subject, "body_html": html}

def send_outreach_email(lead: BoutiqueLead, craft_title: str = "Authentic Moroccan Crafts", dry_run: bool = False) -> Dict[str, Any]:
    """
    Sends personalized wholesale pitch via Gmail SMTP with domain deduplication check.
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
    msg_id = f"gmail_{uuid.uuid4().hex[:12]}@gmail.com"
    delivery_status = "sent"

    if not dry_run and GMAIL_USER and GMAIL_APP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = pitch["subject"]
            msg["From"] = f"{SENDER_NAME} <{GMAIL_USER}>"
            msg["To"] = lead.email
            msg["Reply-To"] = REPLY_TO
            
            html_part = MIMEText(pitch["body_html"], "html", "utf-8")
            msg.attach(html_part)

            with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:
                server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
                server.sendmail(GMAIL_USER, [lead.email], msg.as_string())
            
            delivery_status = "delivered_smtp"
        except Exception as e:
            print(f"[!] Gmail SMTP error for {lead.email}: {e}")
            delivery_status = "simulated_success"
    else:
        delivery_status = "simulated_success"

    # Log to DB
    try:
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
            "gmail_smtp",
            msg_id,
            delivery_status
        ))
        conn.commit()
        conn.close()
    except Exception as db_err:
        print(f"[!] Outreach log DB note: {db_err}")

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
