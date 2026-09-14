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

    let messages = body.messages || [];
    if (messages.length === 0 && body.message) {
      messages = [{ role: "user", content: String(body.message) }];
    }

    const context = body.context || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      const errRes = { error: "Un message ou historique de messages est requis" };
      if (res && res.status) return res.status(400).json(errRes);
      return new Response(JSON.stringify(errRes), { status: 400 });
    }

    const geminiKey = CONFIG.GEMINI_API_KEY;
    const leadsCount = context.leadsCount || 0;
    const totalPipeline = context.pipelineVal || "$0";

    const systemInstruction = `Tu es "Atlas Copilot", le Directeur Export IA & Stratège Commercial B2B de Marrakech Craft Conduit (Plateforme d'export direct de l'artisanat marocain d'excellence depuis Marrakech vers les concept stores et décorateurs du monde entier).

Fondateur : Hassan Tiguidda (Marrakech).
Lookbook : ${CONFIG.LOOKBOOK_URL}
Portfolio : ${CONFIG.PORTFOLIO_URL}

Indicateurs actuels :
- Boutiques et acheteurs enregistrés : ${leadsCount}
- Volume estimé du portefeuille : ${totalPipeline}
- Catalogue d'atelier officiel : 365 articles réels disponibles immédiatement dans l'onglet Catalogue & Tarifs (13 filières : Paniers & Cabas 37 réf, Poufs en cuir 8 réf, Ceintures 52 réf, Luminaires raphia 74 réf, Céramiques Tamegroute 36 réf, Loupe de Thuya 16 réf, Plateaux laiton 24 réf, Miroirs 16 réf, Mobilier 13 réf, Cache-pots 9 réf, Tapis 2 réf, Corbeilles 54 réf, Arts de la table 24 réf).

Tes expertises :
1. Négociation & Vente Grossiste B2B : Aider l'utilisateur à négocier avec des acheteurs exigeants (Paris, Londres, New York, Tokyo, Dubaï), structurer des remises de volume dégressives (-15% pour 6-50 pcs, -35% pour 50+ pcs) et proposer des commandes test d'échantillons avec 0 MOQ (1-5 pièces).
2. Connaissance Artisanale Pointue : Tapis Berbères (Beni Ourain, Kilims), Céramiques (Tamegroute vert émaillé de la vallée du Draa), Luminaires et Suspensions en Raphia et Laiton ciselé martelé, Maroquinerie (Poufs et Ceintures cuir pleine fleur tannage végétal), Ébénisterie en Loupe de Thuya précieux d'Essaouira.
3. Logistique & Incoterms : Maîtrise des Incoterms (EXW Marrakech, FOB Casablanca, CIF, DDP), calcul du cubage (CBM), fret aérien express (DHL/FedEx 3-5j) vs fret maritime en groupage LCL ou conteneur complet FCL (20ft / 40ft).
4. Douanes & Formalités Export : Certificats d'origine de la Chambre d'Artisanat, formulaires EUR.1 (exonération de droits de douane vers l'Union Européenne), emballage sécurisé triple cannelure et caisses bois anti-casse pour céramiques et miroirs. Exonération TVA Art 91-II-1° CGI Maroc.
5. Multilinguisme : Français impeccable, anglais commercial international, et Darija/Arabe si nécessaire.

Style de communication :
- Direct, opérationnel, structuré avec des puces claires et des émojis professionnels.
- Donne des exemples de textes et de calculs immédiatement utilisables.`;

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const models = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3.1-flash-lite-preview",
      "gemini-3.6-flash",
    ];

    let replyText = null;
    let providerUsed = "gemini";

    if (geminiKey) {
      for (const model of models) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          const gRes = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemInstruction }] },
              contents,
              generationConfig: {
                maxOutputTokens: 1500,
                temperature: 0.7,
              },
            }),
          });

          if (gRes.ok) {
            const gData = await gRes.json();
            const candidateText = gData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (candidateText) {
              replyText = candidateText;
              providerUsed = `gemini (${model})`;
              break;
            }
          }
        } catch (e) {}
      }
    }

    if (!replyText) {
      replyText = `Bonjour ! Je suis **Atlas Copilot**, votre Directeur Export IA pour **Marrakech Craft Conduit**.\n\nJe peux vous assister pour :\n- 📦 **Calculer une cotation export** (Incoterms EXW, FOB ou DDP avec fret inclus)\n- 💬 **Rédiger un pitch grossiste** pour un concept store à Paris, Londres ou New York\n- 🏺 **Conseiller sur les fiches techniques & délais de fabrication** des Maâlems\n- 📄 **Préparer les documents douaniers** (Certificat d'origine, EUR.1)\n\nQuelle opération souhaitez-vous mener ?`;
    }

    const responsePayload = {
      reply: replyText,
      provider: providerUsed,
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
