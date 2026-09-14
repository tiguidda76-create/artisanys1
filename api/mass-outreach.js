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

    const { leads = [], craft = "all" } = body;

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      const errRes = { error: "Une liste de boutiques/leads est requise" };
      if (res && res.status) return res.status(400).json(errRes);
      return new Response(JSON.stringify(errRes), { status: 400 });
    }

    const geminiKey = CONFIG.GEMINI_API_KEY;
    const leadsSlice = leads.slice(0, 25);

    const leadsSummary = leadsSlice.map((l, i) =>
      `Boutique #${i + 1} - ID: "${l.id}", Nom: "${l.name}", Ville: "${l.city || 'Europe'}", Spécialité: "${l.craftLabel || l.craft || 'Décoration & Artisanat'}", Téléphone: "${l.phone || 'Non spécifié'}", Email: "${l.email || 'Non spécifié'}"`
    ).join("\n");

    const lookbookUrl = CONFIG.LOOKBOOK_URL;
    const portfolioUrl = CONFIG.PORTFOLIO_URL;

    const prompt = `Tu es "Directeur Commercial Export B2B" pour Marrakech Craft Conduit (Plateforme d'export direct de l'artisanat marocain d'excellence depuis Marrakech vers les concept stores et galeries du monde entier).

Fondateur : Hassan Tiguidda (Marrakech).
Proposition de valeur :
- Connexion directe avec les Maâlems et maîtres artisans de la Médina de Marrakech.
- Zéro intermédiaire : marges revendeurs préservées (x2.5 à x3.5).
- Commandes test avec très faible MOQ (à partir de 5 pièces).
- Expédition internationale sécurisée en 5-7 jours.
- Lookbook officiel : ${lookbookUrl}

Voici la liste des boutiques ciblées :
${leadsSummary}

Pour CHAQUE boutique, génère des messages de prospection grossiste B2B ultra-personnalisés et percutants, au format JSON STRICT :
Une liste ordonnée d'objets JSON avec les clés exactes :
[
  {
    "leadId": (identifiant exact fourni dans la liste),
    "name": (nom de la boutique),
    "whatsapp": (Message WhatsApp court et chaleureux de 3-4 lignes, citant la ville et le style de la boutique, présentant notre sélection directe atelier avec le lien Lookbook : ${lookbookUrl} ),
    "emailSubject": (Objet d'email grossiste accrocheur, 4-7 mots),
    "emailBody": (Email B2B de 100-120 mots : valorisation de leur boutique, proposition de valeur direct atelier sans marge d'intermédiaire, proposition de commande test faible MOQ et lien Lookbook),
    "emailFollowUp": (Relance polie J+3 de 2 lignes),
    "instagramDm": (Message Instagram DM court de 2 phrases pour le gérant ou community manager),
    "phoneScript": (Script d'appel de 30 secondes pour franchir la réception et demander le responsable des achats/décoration)
  }
]

Règles impératives :
- Format JSON STRICT, sans aucun texte avant ni après les crochets JSON.
- Rédige en français soigné et commercialement persuasif.`;

    const models = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3.1-flash-lite-preview",
      "gemini-3.6-flash",
    ];

    let campaignData = null;

    if (geminiKey) {
      for (const model of models) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          const gRes = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                maxOutputTokens: 6000,
                temperature: 0.7,
                responseMimeType: "application/json",
              },
            }),
          });

          if (gRes.ok) {
            const gData = await gRes.json();
            const rawText = gData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (rawText) {
              try {
                campaignData = JSON.parse(rawText);
                if (Array.isArray(campaignData) && campaignData.length > 0) break;
              } catch (pe) {
                const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
                campaignData = JSON.parse(cleaned);
                if (Array.isArray(campaignData) && campaignData.length > 0) break;
              }
            }
          }
        } catch (e) {}
      }
    }

    // Enrichissement avec les données réelles et les liens 1-click pour TOUS les prospects
    const enrichedCampaign = leadsSlice.map((lead, idx) => {
      const aiItem = Array.isArray(campaignData)
        ? campaignData.find((item) => item && (item.leadId === lead.id || item.name === lead.name)) || campaignData[idx]
        : null;

      const cityName = lead.city || "votre ville";
      const craftName = lead.craftLabel || "l'artisanat marocain d'art";

      const defaultWhatsapp = `Bonjour l'équipe de ${lead.name} ! J'ai admiré la sélection raffinée de votre boutique à ${cityName}. Nous approvisionnons directement les concept stores en ${craftName} faits main à Marrakech, avec tarifs directs ateliers sans intermédiaire et commandes test à faible MOQ.\n\nDécouvrez notre sélection : ${lookbookUrl}\n\nSouhaitez-vous recevoir notre grille tarifaire revendeur ?\n— Hassan Tiguidda (WhatsApp : +212632155430)`;
      const defaultSubject = `Partenariat Grossiste Direct Atelier — ${lead.name}`;
      const defaultBody = `Bonjour l'équipe de ${lead.name},\n\nJ'ai découvert avec beaucoup d'intérêt l'univers de votre boutique à ${cityName}.\n\nJe dirige Marrakech Craft Conduit : nous connectons directement les meilleurs ateliers de la Médina de Marrakech avec les concept stores et boutiques de décoration en Europe, sans aucun intermédiaire.\n\nNos atouts :\n- Pièces 100% authentiques (${craftName}) façonnées par nos Maâlems.\n- Prix directs ateliers garantissant votre coefficient de marge revendeur (x2.5 à x3.5).\n- Commandes test possibles avec faible MOQ (à partir de 5 pièces) et expédition soignée.\n\nConsultez notre Lookbook officiel : ${lookbookUrl}\n\nSeriez-vous disponible pour un court échange par email ou WhatsApp cette semaine ?\n\nBien cordialement,\nHassan Tiguidda — Marrakech Craft Conduit\nWhatsApp : +212 6 32 15 54 30\nEmail : tiguidda76@gmail.com`;
      const defaultFollowUp = `Bonjour, je me permets de vous relancer concernant ${lead.name}. Avez-vous pu jeter un œil à notre Lookbook grossiste direct atelier ? Seriez-vous intéressé par une commande test d'échantillons sans engagement ?`;
      const defaultInsta = `Bonjour l'équipe de ${lead.name} ✨ Superbe univers en boutique. Pour enrichir votre sélection avec des pièces d'artisanat marocain direct atelier (prix revendeurs garantis), découvrez notre sélection : ${lookbookUrl}. Échangeons en DM !`;
      const defaultScript = `Bonjour, je cherche à joindre le responsable des achats ou de la sélection décoration de ${lead.name}. C'est au sujet de pièces d'artisanat direct atelier pour vos collections de saison.`;

      const item = {
        leadId: lead.id,
        name: lead.name,
        whatsapp: (aiItem && aiItem.whatsapp) ? aiItem.whatsapp : defaultWhatsapp,
        emailSubject: (aiItem && aiItem.emailSubject) ? aiItem.emailSubject : defaultSubject,
        emailBody: (aiItem && aiItem.emailBody) ? aiItem.emailBody : defaultBody,
        emailFollowUp: (aiItem && aiItem.emailFollowUp) ? aiItem.emailFollowUp : defaultFollowUp,
        instagramDm: (aiItem && aiItem.instagramDm) ? aiItem.instagramDm : defaultInsta,
        phoneScript: (aiItem && aiItem.phoneScript) ? aiItem.phoneScript : defaultScript,
      };

      const phone = lead.phone || "";
      const cleanPhone = lead.digits || phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
      const isMobile = lead.isMobile !== undefined ? lead.isMobile : false;
      const phoneType = lead.phoneType || "OTHER";
      const phoneTypeLabel = lead.phoneTypeLabel || (isMobile ? "📱 Mobile WhatsApp Vérifié" : "☎️ Téléphone");
      const email = lead.email || lead.inferredEmail || "";

      const waEncoded = encodeURIComponent(item.whatsapp || "");
      const emailSubEncoded = encodeURIComponent(item.emailSubject || "");
      const emailBodyEncoded = encodeURIComponent(item.emailBody || "");

      const whatsappUrl = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${waEncoded}`
        : `https://wa.me/?text=${waEncoded}`;

      const telUrl = cleanPhone ? `tel:+${cleanPhone}` : (phone ? `tel:${phone}` : "");
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${emailSubEncoded}&body=${emailBodyEncoded}`;
      const mailtoUrl = `mailto:${email}?subject=${emailSubEncoded}&body=${emailBodyEncoded}`;

      return {
        ...lead,
        ...item,
        cleanPhone,
        isMobile,
        phoneType,
        phoneTypeLabel,
        email,
        whatsappUrl,
        telUrl,
        gmailUrl,
        mailtoUrl,
        status: "TO_CONTACT",
      };
    });

    const responsePayload = {
      totalGenerated: enrichedCampaign.length,
      campaign: enrichedCampaign,
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
