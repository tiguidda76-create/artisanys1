import { CONFIG } from "../lib/config.js";

export const dynamic = "force-dynamic";

export default async function handler(req, res) {
  if (req.method && req.method !== "POST") {
    if (res && res.status) return res.status(405).json({ error: "Méthode non autorisée" });
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405 });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    if (!body && typeof req.json === "function") {
      body = await req.json();
    }
    body = body || {};

    const {
      docType = "proforma", // 'proforma' | 'commercial_invoice' | 'export_agreement' | 'packing_list'
      clientName = "Boutique Concept Store",
      clientAddress = "Paris, France",
      currency = "EUR", // 'EUR' | 'USD' | 'MAD'
      items = [],
      incoterm = "DDP Paris",
      leadId = null
    } = body;

    const invoiceNumber = `MCC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString("fr-FR");

    // Articles par défaut si non spécifiés
    const invoiceItems = items && items.length > 0 ? items : [
      { description: "Tapis Berbère Beni Ourain 100% Laine Vierge (200x300cm)", qty: 5, unitPrice: 420 },
      { description: "Céramiques de Tamegroute Émaillées Vert Médina (Lots de 10)", qty: 4, unitPrice: 180 },
      { description: "Suspensions en Laiton Ciselé Main Modèle Étoile (Diam. 40cm)", qty: 6, unitPrice: 150 },
      { description: "Poufs en Cuir Naturel Cousus Main (Finition Havane)", qty: 10, unitPrice: 45 }
    ];

    let subtotal = 0;
    invoiceItems.forEach(it => {
      subtotal += (it.qty * it.unitPrice);
    });

    const shippingFee = currency === "MAD" ? 2500 : currency === "USD" ? 280 : 250;
    const total = subtotal + shippingFee;

    const currSymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : "MAD";

    let generatedDocument = "";

    if (docType === "export_agreement") {
      generatedDocument = `ACCORD DE DISTRIBUTION & FOURNITURE ARTISANALE INTERNATIONALE
Référence : ${invoiceNumber}
Date : ${dateStr}

ENTRE LES SOUSSIGNÉS :
1. LE FOURNISSEUR : MARRAKECH CRAFT CONDUIT (Hassan Tiguidda, Auto-Entrepreneur), Médina de Marrakech, Maroc.
2. LE CLIENT ACHETEUR : ${clientName}, sis à ${clientAddress}.

ARTICLE 1 — OBJET DU CONTRAT :
Le présent accord régit la fourniture directe et l'approvisionnement en pièces d'artisanat marocain d'art (Tapis, Céramiques, Luminaires en Laiton, Cuir) façonnées à la main par les Maâlems de la Médina de Marrakech, sans intermédiaire.

ARTICLE 2 — TARIFS ET MODALITÉS DE PAIEMENT :
- Les prix sont fixés en ${currency} selon la grille tarifaire atelier convenue.
- Modalités : Acompte de 50% à la commande, solde de 50% à l'expédition contre présentation du connaissement / LTA (Lettre de Transport Aérien).
- Incoterm retenu : ${incoterm}.

ARTICLE 3 — QUALITÉ & AUTHENTICITÉ :
Le Fournisseur garantit que 100% des pièces sont authentiques, artisanales et conformes aux fiches techniques convenues. Chaque lot est accompagné d'un Certificat d'Origine artisanale marocaine.

ARTICLE 4 — DÉLAIS ET EXPÉDITION :
Les délais de confection et d'emballage sont de 10 à 21 jours ouvrés selon le volume. Le transport est opéré avec suivi international et assurance tout risque.

Fait à Marrakech, le ${dateStr}
Pour Marrakech Craft Conduit : Hassan Tiguidda
Pour le Client : ${clientName}`;
    } else {
      generatedDocument = `FACTURE PRO FORMA INTERNATIONALE (EXPORT)
N° Facture : ${invoiceNumber}
Date d'émission : ${dateStr}
Incoterm : ${incoterm}

ÉMETTEUR :
MARRAKECH CRAFT CONDUIT — Hassan Tiguidda
Médina de Marrakech, Maroc
WhatsApp / Tél : ${CONFIG.CONTACT_PHONE}
Email : ${CONFIG.CONTACT_EMAIL}

DESTINATAIRE :
${clientName}
${clientAddress}

DÉTAIL DES ARTICLES :
${invoiceItems.map((it, idx) => `${idx + 1}. ${it.description} — Qté: ${it.qty} | PU: ${it.unitPrice} ${currSymbol} | Total: ${(it.qty * it.unitPrice)} ${currSymbol}`).join("\n")}

Sous-total marchandises : ${subtotal.toLocaleString()} ${currSymbol}
Frais de fret & assurance (${incoterm}) : ${shippingFee.toLocaleString()} ${currSymbol}
TOTAL NET À PAYER : ${total.toLocaleString()} ${currSymbol}
(Exonération de TVA à l'exportation — Art. 91-II-1° du CGI Marocain)

COORDONNÉES BANCAIRES POUR VIREMENT INTERNATIONAL :
Banque : Attijariwafa Bank / BMCE Bank of Africa (Maroc)
Titulaire : Hassan Tiguidda (Marrakech Craft Conduit)
IBAN / RIB : MA64 007 450 0001234567890123 45
Code SWIFT / BIC : BCMAMAMC`;
    }

    const responsePayload = {
      invoiceNumber,
      dateStr,
      docType,
      clientName,
      clientAddress,
      currency,
      subtotal,
      shippingFee,
      total,
      formattedDocument: generatedDocument
    };

    if (res && res.status) return res.status(200).json(responsePayload);
    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorPayload = { error: err.message };
    if (res && res.status) return res.status(500).json(errorPayload);
    return new Response(JSON.stringify(errorPayload), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
