import { CONFIG } from "../lib/config.js";

export const dynamic = "force-dynamic";

export default async function handler(req, res) {
  // Support à la fois GET et POST, Vercel Node (req, res) et standard web Request
  if (req.method && req.method !== "POST" && req.method !== "GET") {
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

    let queryParams = {};
    if (req.query) {
      queryParams = req.query;
    } else if (req.url && req.url.includes("?")) {
      const sp = new URL(req.url, "http://localhost").searchParams;
      queryParams = Object.fromEntries(sp.entries());
    }

    const market = body.market || queryParams.market || "FR";
    const craft = body.craft || queryParams.craft || "all";
    const city = body.city || queryParams.city || "";
    const minReviews = Number(body.minReviews || queryParams.minReviews || 2);
    const excludedPlaceIds = body.excludedPlaceIds || [];

    const apiKey = CONFIG.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      const errRes = { error: "GOOGLE_PLACES_API_KEY manquant." };
      if (res && res.status) return res.status(500).json(errRes);
      return new Response(JSON.stringify(errRes), { status: 500 });
    }

    // 1. Génération de requêtes ciblées par marché et par métier
    const searchQueries = [];

    // Requêtes spécifiques selon le métier
    const craftTerms = {
      rugs: ["Moroccan rug gallery", "Berber carpet showroom", "Beni Ourain shop", "Tapis berbere boutique"],
      ceramics: ["Artisan ceramics boutique", "Handmade pottery home decor", "Studio pottery shop", "Ceramique artisanale"],
      brass: ["Handcrafted brass lighting boutique", "Moroccan lantern showroom", "Artisan lighting shop", "Luminaires laiton"],
      leather: ["Leather goods lifestyle boutique", "Handmade leather home decor", "Maroquinerie artisanale"],
      wicker: ["Wicker homeware boutique", "Natural basketry home decor", "Vannerie artisanale"],
      all: ["Concept store home decor", "Boutique decoration interieure", "Luxury boho lifestyle store", "Artisan home decor gallery"]
    };

    const selectedTerms = craftTerms[craft] || craftTerms.all;

    // Requêtes géographiques par marché
    if (market === "FR") {
      searchQueries.push(
        "Concept store deco Paris Le Marais",
        "Boutique decoration interieure Paris Saint Germain",
        "Magasin tapis berbere et deco Paris",
        "Boutique ceramique artisanale Paris",
        "Concept store deco Paris 11",
        "Boutique decoration Aix en Provence",
        "Galerie design decoration Lyon",
        "Concept store artisanat Marseille",
        "Boutique decoration interieure Bordeaux",
        "Concept store deco Nice"
      );
      selectedTerms.forEach(t => searchQueries.push(`${t} Paris`));
    } else if (market === "UK") {
      searchQueries.push(
        "Moroccan rug gallery London Shoreditch",
        "Concept store home decor London Notting Hill",
        "Interior design boutique Chelsea London",
        "Artisan home decor shop Marylebone London",
        "Boho lifestyle boutique Soho London",
        "Handmade ceramic decor shop Brighton",
        "Interior design studio London"
      );
      selectedTerms.forEach(t => searchQueries.push(`${t} London`));
    } else if (market === "US") {
      searchQueries.push(
        "Moroccan rug showroom SoHo New York",
        "Home decor concept store Brooklyn Williamsburg",
        "Interior design studio West Village New York",
        "Bohemian lifestyle boutique Los Angeles West Hollywood",
        "Artisan home decor Miami Design District",
        "Handcrafted ceramics boutique San Francisco"
      );
      selectedTerms.forEach(t => searchQueries.push(`${t} New York`));
    } else if (market === "ES") {
      searchQueries.push(
        "Tienda decoracion diseño Madrid Salamanca",
        "Concept store decoracion Barcelona El Born",
        "Tienda artesania y alfombras Barcelona Gracia",
        "Estudio interiorismo diseño Valencia",
        "Tienda decoracion Palma de Mallorca"
      );
      selectedTerms.forEach(t => searchQueries.push(`${t} Madrid`));
    } else if (market === "AU") {
      searchQueries.push(
        "Boho coastal home decor store Byron Bay",
        "Interior design concept store Paddington Sydney",
        "Artisan homeware store Fitzroy Melbourne",
        "Moroccan rug showroom Sydney"
      );
      selectedTerms.forEach(t => searchQueries.push(`${t} Sydney`));
    } else {
      // Global (ALL)
      searchQueries.push(
        "Concept store deco Paris Le Marais",
        "Moroccan rug gallery London Shoreditch",
        "Moroccan rug showroom SoHo New York",
        "Home decor concept store Brooklyn",
        "Concept store decoracion Barcelona El Born",
        "Boho coastal home decor store Byron Bay",
        "Artisan home decor boutique Dubai Alserkal"
      );
      selectedTerms.forEach(t => {
        searchQueries.push(`${t} Paris`);
        searchQueries.push(`${t} London`);
      });
    }

    if (city) {
      searchQueries.unshift(`Concept store decoration ${city}`);
      searchQueries.unshift(`${selectedTerms[0]} ${city}`);
    }

    const allPlacesMap = new Map();

    // Fonction d'appel unitaire Google Places Text Search (New)
    const executeSearch = async (tQuery) => {
      try {
        const url = "https://places.googleapis.com/v1/places:searchText";
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.internationalPhoneNumber,places.nationalPhoneNumber,places.websiteUri,places.types",
          },
          body: JSON.stringify({
            textQuery: tQuery,
            languageCode: "en",
            maxResultCount: 20,
          }),
        });

        if (!res.ok) return [];
        const data = await res.json();
        return data.places || [];
      } catch (err) {
        return [];
      }
    };

    // Exécution en parallèle ultra-rapide (< 1.5s)
    const searchResults = await Promise.all(searchQueries.map((q) => executeSearch(q)));
    searchResults.flat().forEach((p) => {
      if (p && p.id && !allPlacesMap.has(p.id)) {
        allPlacesMap.set(p.id, p);
      }
    });

    const excludedSet = new Set(Array.isArray(excludedPlaceIds) ? excludedPlaceIds : []);
    const rawPlaces = Array.from(allPlacesMap.values());
    const qualifiedLeads = [];

    for (const p of rawPlaces) {
      if (!p || !p.id || excludedSet.has(p.id)) continue;

      const rating = p.rating || 0;
      const reviewCount = p.userRatingCount || 0;
      if (reviewCount < minReviews) continue;

      const phone = p.internationalPhoneNumber || p.nationalPhoneNumber || "";
      const website = p.websiteUri || "";
      const address = p.formattedAddress || "";
      const name = p.displayName?.text || "Boutique Design";

      // Classification du numéro de téléphone & Détection WhatsApp
      let digits = (phone || "").replace(/[^\d+]/g, "");
      if (digits.startsWith("+")) digits = digits.substring(1);
      else if (digits.startsWith("00")) digits = digits.substring(2);

      let isMobile = false;
      let phoneType = "OTHER";
      let phoneTypeLabel = "📞 Téléphone";

      if (digits) {
        // France Mobile
        if (digits.startsWith("336") || digits.startsWith("337")) {
          isMobile = true;
          phoneType = "MOBILE";
          phoneTypeLabel = "📱 Mobile WhatsApp Vérifié";
        }
        // UK Mobile
        else if (digits.startsWith("447")) {
          isMobile = true;
          phoneType = "MOBILE";
          phoneTypeLabel = "📱 Mobile WhatsApp Vérifié";
        }
        // Spain Mobile
        else if (digits.startsWith("346") || digits.startsWith("347")) {
          isMobile = true;
          phoneType = "MOBILE";
          phoneTypeLabel = "📱 Mobile WhatsApp Vérifié";
        }
        // US / Canada
        else if (digits.startsWith("1") && digits.length === 11) {
          isMobile = true;
          phoneType = "MOBILE";
          phoneTypeLabel = "📱 Mobile / SMS Vérifié";
        }
        // Fixed Landlines
        else if (
          digits.startsWith("331") || digits.startsWith("332") || digits.startsWith("333") || digits.startsWith("334") || digits.startsWith("335") ||
          digits.startsWith("442") || digits.startsWith("441") || digits.startsWith("349")
        ) {
          isMobile = false;
          phoneType = "LANDLINE";
          phoneTypeLabel = "☎️ Ligne Fixe Boutique";
        }
      }

      // Déduction de l'email acheteur / wholesale depuis le domaine web
      let inferredEmail = "";
      let domain = "";
      if (website) {
        try {
          let u = website.trim();
          if (!u.startsWith("http")) u = "https://" + u;
          const parsed = new URL(u);
          domain = parsed.hostname.replace(/^www\./, "");
          if (domain && domain.includes(".")) {
            inferredEmail = `contact@${domain}`;
          }
        } catch {}
      }

      // Détection de la ville et du pays
      let detectedCountry = market;
      let detectedCity = "Capitale";
      if (address.includes("France") || address.includes("Paris") || address.includes("Lyon") || address.includes("Marseille")) {
        detectedCountry = "FR";
        detectedCity = address.includes("Paris") ? "Paris" : address.includes("Lyon") ? "Lyon" : "France";
      } else if (address.includes("United Kingdom") || address.includes("London") || address.includes("Brighton")) {
        detectedCountry = "UK";
        detectedCity = address.includes("London") ? "London" : "UK";
      } else if (address.includes("United States") || address.includes("NY") || address.includes("CA") || address.includes("FL")) {
        detectedCountry = "US";
        detectedCity = address.includes("New York") || address.includes("NY") ? "New York" : "USA";
      } else if (address.includes("Spain") || address.includes("España") || address.includes("Madrid") || address.includes("Barcelona")) {
        detectedCountry = "ES";
        detectedCity = address.includes("Madrid") ? "Madrid" : address.includes("Barcelona") ? "Barcelona" : "Espagne";
      }

      // Score de Potentiel B2B
      let b2bScore = Math.round((rating || 4.0) * 1000) + Math.min(reviewCount * 10, 2000);
      if (isMobile) b2bScore += 1500;
      if (website) b2bScore += 800;

      // Pitches pré-configurés
      const craftLabel = craft === "rugs" ? "Tapis Berbères d'exception" : craft === "ceramics" ? "Céramiques de Tamegroute & Safi" : craft === "brass" ? "Luminaires & Lanternes en Laiton" : craft === "leather" ? "Poufs & Maroquinerie artisanale" : "Artisanat d'Art Marocain";
      const lookbookUrl = CONFIG.LOOKBOOK_URL;
      const portfolioUrl = CONFIG.PORTFOLIO_URL;

      const emailSubject = `Partenariat Grossiste Direct Atelier — ${craftLabel} pour ${name}`;
      const emailBody = `Bonjour l'équipe de ${name},

J'ai découvert l'univers raffiné de votre boutique à ${detectedCity} et la sélection soignée que vous proposez.

Je dirige Marrakech Craft Conduit : nous connectons directement les meilleurs ateliers de la Médina de Marrakech avec les concept stores et décorateurs d'Europe et d'Amérique, sans aucun intermédiaire.

Ce que nous vous apportons :
- Pièces 100% authentiques (${craftLabel}) façonnées à la main par nos Maâlems.
- Tarifs directs ateliers garantissant votre coefficient de marge revendeur (x2.5 à x3.5).
- Commandes test possibles avec faible MOQ (à partir de 5 pièces) et expédition sécurisée sous 5 à 7 jours.

Découvrez notre sélection et nos réalisations :
Lookbook B2B : ${lookbookUrl}
Portfolio ateliers : ${portfolioUrl}

Seriez-vous ouvert à recevoir notre grille tarifaire grossiste par email ?

Bien cordialement,
Hassan Tiguidda — Marrakech Craft Conduit
WhatsApp direct : +212 6 32 15 54 30
Email : tiguidda76@gmail.com`;

      const waPitch = `Bonjour l'équipe de ${name} ! J'ai admiré la sélection de votre boutique à ${detectedCity}. Nous fournissons directement les concept stores et galeries en ${craftLabel} faits main à Marrakech, avec tarifs directs ateliers et commandes test à faible MOQ.\n\nDécouvrez notre sélection : ${lookbookUrl}\n\nSouhaitez-vous recevoir notre grille tarifaire revendeur ?\n— Hassan Tiguidda (WhatsApp : +212632155430)`;

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inferredEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      const mailtoUrl = `mailto:${inferredEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      const whatsappUrl = digits ? `https://wa.me/${digits}?text=${encodeURIComponent(waPitch)}` : `https://wa.me/?text=${encodeURIComponent(waPitch)}`;

      qualifiedLeads.push({
        id: p.id,
        name,
        address,
        rating,
        reviewCount,
        phone,
        digits,
        isMobile,
        phoneType,
        phoneTypeLabel,
        website,
        domain,
        email: inferredEmail,
        inferredEmail,
        country: detectedCountry,
        city: detectedCity,
        craft: craft === "all" ? "rugs" : craft,
        craftLabel,
        volume: "$15,000 - $35,000",
        notes: `Boutique de prestige repérée à ${detectedCity} (${rating}★, ${reviewCount} avis Google)`,
        status: "Nouveau",
        b2bScore,
        emailSubject,
        emailBody,
        waPitch,
        gmailUrl,
        mailtoUrl,
        whatsappUrl,
        types: p.types || [],
        createdAt: new Date().toISOString(),
      });
    }

    // Tri des meilleurs prospects en tête
    qualifiedLeads.sort((a, b) => b.b2bScore - a.b2bScore);

    const responsePayload = {
      market,
      craft,
      totalScanned: rawPlaces.length,
      qualifiedCount: qualifiedLeads.length,
      leads: qualifiedLeads,
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
