/* ═══════════════════════════════════════════════════════════════
   MARRAKECH CRAFT BRAIN SERVICE (Browser & Module UMD Engine)
   Orchestrateur IA 360° & Intelligence Artisanale Déterministe
   ═══════════════════════════════════════════════════════════════ */

(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const brain = factory();
    global.CraftBrainService = brain.craftBrainService;
    global.WORKSHOPS_DATABASE = brain.WORKSHOPS_DATABASE;
    global.INVENTORY_DATABASE = brain.INVENTORY_DATABASE;
    global.EXPORT_ORDERS_DATABASE = brain.EXPORT_ORDERS_DATABASE;
  }
})(this, function () {

  const WORKSHOPS_DATABASE = [
    {
      id: 'art_driss_pottery',
      name: 'Atelier Céramique Zellige & Émail',
      masterMaalem: 'Maâlem Driss',
      category: 'ceramics',
      categoryLabel: 'Poterie & Céramique Zellige',
      quarter: 'Bab Doukkala',
      address: 'Derb El Ferrane N° 14, Bab Doukkala Médina, Marrakech',
      teamSize: 12,
      specialties: ['Vases Tamegroute vert émeraude', 'Carreaux Zellige 10x10 cm', 'Tajines de présentation émaillés'],
      capacityPerMonth: 850,
      currentWorkloadPercent: 88,
      leadTimeDays: 7,
      isCritical: false,
      phone: '+212632155430',
      whatsappDirect: '212632155430',
      email: 'atelier.driss@artisanat-marrakech.ma',
      moq: 0,
      bestSellerProduct: 'Vase Tamegroute Vert Émeraude Brut (H40cm)',
      samplePriceUsd: 28,
      wholesalePriceUsd: 18,
      stockLevel: 140,
      stockMinThreshold: 50,
      rating: 4.9,
      yearsOfMastery: 34
    },
    {
      id: 'art_abdelkader_leather',
      name: 'Tannerie & Maroquinerie Royale',
      masterMaalem: 'Maâlem Abdelkader',
      category: 'leather',
      categoryLabel: 'Cuir & Maroquinerie',
      quarter: 'Semmarine',
      address: 'Souk Cherratine N° 28, Médina, Marrakech',
      teamSize: 8,
      specialties: ['Poufs en cuir cousus main', 'Sacs de voyage Week-End', 'Babouches royales brodées'],
      capacityPerMonth: 450,
      currentWorkloadPercent: 96,
      leadTimeDays: 14,
      isCritical: true,
      criticalReason: 'Capacité saturée par les commandes de concept stores parisiens. Réappro sous 14 jours.',
      phone: '+212632155430',
      whatsappDirect: '212632155430',
      email: 'cuir.abdelkader@artisanat-marrakech.ma',
      moq: 0,
      bestSellerProduct: 'Pouf Berbère Cuir Véritable Tannage Végétal',
      samplePriceUsd: 45,
      wholesalePriceUsd: 29,
      stockLevel: 18,
      stockMinThreshold: 40,
      rating: 4.95,
      yearsOfMastery: 41
    },
    {
      id: 'art_brahim_brass',
      name: 'Fonderie & Luminaires Ciselés',
      masterMaalem: 'Maâlem Brahim',
      category: 'brass',
      categoryLabel: 'Laiton & Luminaires Ciselés',
      quarter: 'Mouassine',
      address: 'Souk Seffarine N° 42, Mouassine, Marrakech',
      teamSize: 6,
      specialties: ['Suspensions dôme perforées', 'Appliques murales géométriques', 'Lanternes arabesques'],
      capacityPerMonth: 250,
      currentWorkloadPercent: 70,
      leadTimeDays: 8,
      isCritical: false,
      phone: '+212632155430',
      whatsappDirect: '212632155430',
      email: 'brahim.laiton@artisanat-marrakech.ma',
      moq: 0,
      bestSellerProduct: 'Suspension Dôme Laiton Perforé (Ø50cm)',
      samplePriceUsd: 95,
      wholesalePriceUsd: 62,
      stockLevel: 45,
      stockMinThreshold: 20,
      rating: 4.88,
      yearsOfMastery: 29
    },
    {
      id: 'art_fatima_rugs',
      name: 'Coopérative Tissage Haut-Atlas',
      masterMaalem: 'Lalla Fatima',
      category: 'rugs',
      categoryLabel: 'Tapis Berbères Beni Ourain & Kilims',
      quarter: 'Mouassine',
      address: 'Souk des Tapis Zrabia N° 9, Mouassine, Marrakech',
      teamSize: 18,
      specialties: ['Tapis Beni Ourain 100% laine vierge', 'Kilims Taznakht géométriques', 'Plaids laine brute'],
      capacityPerMonth: 35,
      currentWorkloadPercent: 82,
      leadTimeDays: 12,
      isCritical: false,
      phone: '+212632155430',
      whatsappDirect: '212632155430',
      email: 'fatima.tapis@artisanat-marrakech.ma',
      moq: 0,
      bestSellerProduct: 'Tapis Beni Ourain 200x300cm Laine Vierge Naturelle',
      samplePriceUsd: 320,
      wholesalePriceUsd: 210,
      stockLevel: 22,
      stockMinThreshold: 10,
      rating: 4.98,
      yearsOfMastery: 37
    },
    {
      id: 'art_hassan_wood',
      name: 'Ébénisterie Fine de Thuya & Cèdre',
      masterMaalem: 'Maâlem Hassan',
      category: 'wood',
      categoryLabel: 'Bois de Cèdre & Loupe de Thuya',
      quarter: 'Kasbah',
      address: 'Derb Chtouka N° 5, Kasbah, Marrakech',
      teamSize: 5,
      specialties: ['Boîtes en loupe de thuya incrustées nacre', 'Plateaux moucharabieh', 'Mobilier sculpté'],
      capacityPerMonth: 300,
      currentWorkloadPercent: 65,
      leadTimeDays: 6,
      isCritical: false,
      phone: '+212632155430',
      whatsappDirect: '212632155430',
      email: 'hassan.thuya@artisanat-marrakech.ma',
      moq: 0,
      bestSellerProduct: 'Coffret Précieux Loupe de Thuya & Citronnier',
      samplePriceUsd: 38,
      wholesalePriceUsd: 24,
      stockLevel: 85,
      stockMinThreshold: 30,
      rating: 4.85,
      yearsOfMastery: 26
    },
    {
      id: 'art_youssef_wicker',
      name: 'Vannerie Doum & Décoration Organique',
      masterMaalem: 'Maâlem Youssef',
      category: 'wicker',
      categoryLabel: 'Vannerie & Palmier Doum',
      quarter: 'Sidi Ghanem',
      address: 'Zone Industrielle Sidi Ghanem N° 218, Marrakech',
      teamSize: 14,
      specialties: ['Suspensions Chapeau Frangées XXL', 'Paniers cabas brodés', 'Sets de table en doum naturel'],
      capacityPerMonth: 1400,
      currentWorkloadPercent: 92,
      leadTimeDays: 5,
      isCritical: true,
      criticalReason: 'Forte demande saisonnière sur les suspensions XXL. Prioriser réapprovisionnement.',
      phone: '+212632155430',
      whatsappDirect: '212632155430',
      email: 'youssef.doum@artisanat-marrakech.ma',
      moq: 0,
      bestSellerProduct: 'Suspension Chapeau Géante Palmier Doum (Ø80cm)',
      samplePriceUsd: 22,
      wholesalePriceUsd: 13.5,
      stockLevel: 32,
      stockMinThreshold: 60,
      rating: 4.92,
      yearsOfMastery: 22
    }
  ];

  const INVENTORY_DATABASE = [
    { id: 'inv_1', title: 'Vase Tamegroute Vert Émeraude Brut', artisanId: 'art_driss_pottery', artisanName: 'Maâlem Driss', category: 'ceramics', stockQty: 140, minThreshold: 50, unitPriceUsd: 28, unitPriceMad: 275, status: 'In Stock', quarter: 'Bab Doukkala' },
    { id: 'inv_2', title: 'Carreaux Zellige Fès Émaillés Verts (m²)', artisanId: 'art_driss_pottery', artisanName: 'Maâlem Driss', category: 'ceramics', stockQty: 25, minThreshold: 40, unitPriceUsd: 55, unitPriceMad: 540, status: 'Low Stock', quarter: 'Bab Doukkala' },
    { id: 'inv_3', title: 'Pouf Berbère Cuir Véritable Tannage Végétal', artisanId: 'art_abdelkader_leather', artisanName: 'Maâlem Abdelkader', category: 'leather', stockQty: 18, minThreshold: 40, unitPriceUsd: 45, unitPriceMad: 440, status: 'Critical Reorder', quarter: 'Semmarine' },
    { id: 'inv_4', title: 'Sac de Voyage Week-End Cuir Pleine Fleur', artisanId: 'art_abdelkader_leather', artisanName: 'Maâlem Abdelkader', category: 'leather', stockQty: 32, minThreshold: 20, unitPriceUsd: 110, unitPriceMad: 1080, status: 'In Stock', quarter: 'Semmarine' },
    { id: 'inv_5', title: 'Suspension Dôme Laiton Perforé (Ø50cm)', artisanId: 'art_brahim_brass', artisanName: 'Maâlem Brahim', category: 'brass', stockQty: 45, minThreshold: 20, unitPriceUsd: 95, unitPriceMad: 935, status: 'In Stock', quarter: 'Mouassine' },
    { id: 'inv_6', title: 'Tapis Beni Ourain 200x300cm Laine Vierge', artisanId: 'art_fatima_rugs', artisanName: 'Lalla Fatima', category: 'rugs', stockQty: 22, minThreshold: 10, unitPriceUsd: 320, unitPriceMad: 3150, status: 'In Stock', quarter: 'Mouassine' },
    { id: 'inv_7', title: 'Suspension Chapeau Géante Doum (Ø80cm)', artisanId: 'art_youssef_wicker', artisanName: 'Maâlem Youssef', category: 'wicker', stockQty: 32, minThreshold: 60, unitPriceUsd: 22, unitPriceMad: 215, status: 'Critical Reorder', quarter: 'Sidi Ghanem' },
    { id: 'inv_8', title: 'Coffret Précieux Loupe de Thuya & Citronnier', artisanId: 'art_hassan_wood', artisanName: 'Maâlem Hassan', category: 'wood', stockQty: 85, minThreshold: 30, unitPriceUsd: 38, unitPriceMad: 375, status: 'In Stock', quarter: 'Kasbah' }
  ];

  const EXPORT_ORDERS_DATABASE = [
    { id: 'EXP-2026-081', clientName: 'Maison Mère Décoration', destinationCity: 'Paris', destinationCountry: 'FR', craft: 'rugs', totalUnits: 12, totalAmountUsd: 3840, totalAmountMad: 37824, shippingMethod: 'DHL Express Air', status: 'Dispatched', estimatedDeliveryDays: 3, trackingNumber: 'DHL-MA-9842104', maalemInCharge: 'Lalla Fatima' },
    { id: 'EXP-2026-082', clientName: 'Casa Nomad Madrid', destinationCity: 'Madrid', destinationCountry: 'ES', craft: 'ceramics', totalUnits: 65, totalAmountUsd: 1430, totalAmountMad: 14085, shippingMethod: 'Air Cargo Priority', status: 'Customs Prep', estimatedDeliveryDays: 4, trackingNumber: 'AC-MAD-55019', maalemInCharge: 'Maâlem Driss' },
    { id: 'EXP-2026-083', clientName: 'SoHo Interior Living NYC', destinationCity: 'New York', destinationCountry: 'US', craft: 'brass', totalUnits: 28, totalAmountUsd: 2660, totalAmountMad: 26201, shippingMethod: 'DHL Express Air', status: 'Production', estimatedDeliveryDays: 6, trackingNumber: 'DHL-US-772198', maalemInCharge: 'Maâlem Brahim' },
    { id: 'EXP-2026-084', clientName: 'Byron Bay Living Co.', destinationCity: 'Byron Bay', destinationCountry: 'AU', craft: 'wicker', totalUnits: 120, totalAmountUsd: 1800, totalAmountMad: 17730, shippingMethod: 'Ocean FCL (Casablanca)', status: 'Quality Check', estimatedDeliveryDays: 22, trackingNumber: 'CMA-CAS-88190', maalemInCharge: 'Maâlem Youssef' }
  ];

  class CraftBrainEngine {
    constructor() {
      this.workshops = [...WORKSHOPS_DATABASE];
      this.inventory = [...INVENTORY_DATABASE];
      this.orders = [...EXPORT_ORDERS_DATABASE];
      this.exchangeRates = { USD: 1.00, EUR: 0.92, MAD: 9.85, GBP: 0.79, AUD: 1.53 };
      this.refreshFromStorage();
    }

    refreshFromStorage() {
      try {
        const storedWorkshops = localStorage.getItem('mcc_custom_workshops');
        if (storedWorkshops) {
          this.workshops = JSON.parse(storedWorkshops);
        }
      } catch (e) {
        console.warn('CraftBrain: using fallback seed workshops.');
      }
    }

    getFinancialKPIs() {
      const pipelineUsd = this.orders.reduce((sum, o) => sum + o.totalAmountUsd, 0) + 48200;
      const pipelineMad = Math.round(pipelineUsd * this.exchangeRates.MAD);
      const pipelineEur = Math.round(pipelineUsd * this.exchangeRates.EUR);
      const activeOrdersUsd = this.orders.reduce((sum, o) => sum + o.totalAmountUsd, 0);
      const criticalWorkshopsCount = this.workshops.filter(w => w.isCritical).length;
      const lowStockItemsCount = this.inventory.filter(i => i.status === 'Critical Reorder' || i.status === 'Low Stock').length;

      return {
        pipelineUsd,
        pipelineMad,
        pipelineEur,
        activeOrdersUsd,
        averageMarginPercent: 38.5,
        totalWorkshops: this.workshops.length,
        criticalWorkshopsCount,
        lowStockItemsCount
      };
    }

    getWorkshops() { return this.workshops; }
    getInventory() { return this.inventory; }
    getOrders() { return this.orders; }

    findWorkshopById(id) {
      return this.workshops.find(w => w.id === id);
    }

    findWorkshopsByQuarter(quarter) {
      const q = quarter.toLowerCase().trim();
      return this.workshops.filter(w => w.quarter.toLowerCase().includes(q) || w.address.toLowerCase().includes(q));
    }

    findWorkshopsByCategory(cat) {
      const c = cat.toLowerCase().trim();
      return this.workshops.filter(w => 
        w.category.toLowerCase() === c || 
        w.categoryLabel.toLowerCase().includes(c) ||
        w.specialties.some(s => s.toLowerCase().includes(c))
      );
    }

    async processQuery(query) {
      const q = (query || '').toLowerCase().trim();

      if (q.includes('check everything') || q.includes('bilan') || q.includes('vue d\'ensemble') || q.includes('overview') || q.includes('status') || q.includes('360')) {
        return this.handleGlobalBilan(query);
      }

      if (q.includes('stock') || q.includes('inventaire') || q.includes('reappro') || q.includes('rupture')) {
        return this.handleStockBilan(query);
      }

      if (q.includes('critique') || q.includes('tension') || q.includes('retard') || q.includes('alerte') || q.includes('goulot')) {
        return this.handleCriticalArtisans(query);
      }

      if (q.includes('commande') || q.includes('export') || q.includes('livraison') || q.includes('fret') || q.includes('dhl') || q.includes('suivi')) {
        return this.handleExportOrders(query);
      }

      if (q.includes('chiffre d\'affaires') || q.includes('ca') || q.includes('revenu') || q.includes('mad') || q.includes('eur') || q.includes('usd') || q.includes('marge') || q.includes('finance')) {
        return this.handleFinancialKpis(query);
      }

      const quarters = ['Mouassine', 'Semmarine', 'Bab Doukkala', 'Sidi Ghanem', 'Kasbah', 'Rahba Kedima', 'Mellah'];
      for (const quarter of quarters) {
        if (q.includes(quarter.toLowerCase())) {
          return this.handleQuarterSearch(query, quarter);
        }
      }

      const craftMap = {
        'tapis': 'rugs',
        'kilim': 'rugs',
        'berbere': 'rugs',
        'beni ourain': 'rugs',
        'poterie': 'ceramics',
        'ceramique': 'ceramics',
        'zellige': 'ceramics',
        'tamegroute': 'ceramics',
        'laiton': 'brass',
        'luminaire': 'brass',
        'cuivre': 'brass',
        'suspension': 'brass',
        'cuir': 'leather',
        'pouf': 'leather',
        'maroquinerie': 'leather',
        'vannerie': 'wicker',
        'palmier': 'wicker',
        'doum': 'wicker',
        'panier': 'wicker',
        'bois': 'wood',
        'thuya': 'wood',
        'cedre': 'wood'
      };

      for (const [keyword, category] of Object.entries(craftMap)) {
        if (q.includes(keyword)) {
          return this.handleCraftSearch(query, category, keyword);
        }
      }

      for (const w of this.workshops) {
        const maalemParts = w.masterMaalem.toLowerCase().split(' ');
        if (maalemParts.some(p => p.length > 3 && q.includes(p))) {
          return this.handleSingleWorkshop(query, w);
        }
      }

      if (q.includes('devis') || q.includes('facture') || q.includes('pro forma') || q.includes('ice') || q.includes('bmce') || q.includes('rib')) {
        return this.handleProFormaIntent(query);
      }

      return this.handleSmartFallback(query);
    }

    handleGlobalBilan(query) {
      const kpis = this.getFinancialKPIs();
      const criticalArtisans = this.workshops.filter(w => w.isCritical);
      const lowStock = this.inventory.filter(i => i.status === 'Critical Reorder' || i.status === 'Low Stock');

      const text = `📊 **BILAN GLOBAL 360° — MARRAKECH CRAFT CONDUIT**\n\n` +
        `• **Pipeline Commercial :** $${kpis.pipelineUsd.toLocaleString()} USD (~${kpis.pipelineMad.toLocaleString()} MAD / ${kpis.pipelineEur.toLocaleString()} EUR)\n` +
        `• **Ateliers Connectés :** ${kpis.totalWorkshops} maîtres-artisans (${criticalArtisans.length} en alerte de charge)\n` +
        `• **Stocks Sous Tension :** ${lowStock.length} références nécessitant un réapprovisionnement urgent\n` +
        `• **Expéditions B2B en cours :** ${this.orders.length} commandes en transit (DHL Express, Air Cargo, Mer)\n` +
        `• **Conformité & Exonération :** Statut officiel certifié ICE 1161674000043 (Art 91-II-1° CGI)`;

      const voiceText = `Bilan global à jour. Pipeline à ${kpis.pipelineUsd.toLocaleString()} dollars, ${kpis.totalWorkshops} ateliers actifs, et ${this.orders.length} commandes export en cours d'acheminement.`;

      const actionCards = [
        { type: 'workshop_profile', label: 'Voir Ateliers Critiques', icon: '⚠️', payload: { filter: 'critical' } },
        { type: 'check_stock', label: 'Gérer les Réappros', icon: '📦', payload: { action: 'open_catalog' } },
        { type: 'track_order', label: 'Suivi des Expéditions', icon: '🚢', payload: { action: 'view_orders' } },
        { type: 'pro_forma_quote', label: 'Émettre un Devis Pro Forma', icon: '💼', payload: { action: 'open_invoice' } }
      ];

      return {
        query,
        intent: 'check_everything',
        text,
        voiceText,
        highlights: [
          `💰 Pipeline : $${kpis.pipelineUsd.toLocaleString()} USD`,
          `🏺 ${this.workshops.length} Ateliers Médina`,
          `⚠️ ${criticalArtisans.length} Alerte Capacité`
        ],
        actionCards
      };
    }

    handleStockBilan(query) {
      const lowStock = this.inventory.filter(i => i.status === 'Critical Reorder' || i.status === 'Low Stock');
      const inStock = this.inventory.filter(i => i.status === 'In Stock');

      let text = `📦 **AUDIT D'INVENTAIRE & STOCKS ATELIERS**\n\n`;
      text += `• **Articles en Stock Optimal :** ${inStock.length} références\n`;
      text += `• **Articles en Réappro / Seuil Critique :** ${lowStock.length} références\n\n`;
      text += `🔍 **Détail des Alertes Stocks :**\n`;

      lowStock.forEach(item => {
        text += `- ⚠️ **${item.title}** (${item.artisanName}, ${item.quarter}) : **${item.stockQty} pcs restantes** (Seuil mini: ${item.minThreshold})\n`;
      });

      const voiceText = `Inventaire analysé. ${lowStock.length} articles sont sous le seuil critique, notamment les poufs en cuir et les suspensions en doum.`;

      const actionCards = lowStock.map(item => ({
        type: 'whatsapp_direct',
        label: `Commander à ${item.artisanName}`,
        icon: '💬',
        payload: {
          artisanId: item.artisanId,
          message: `Bonjour ${item.artisanName}, nous devons lancer un réapprovisionnement urgent pour ${item.title} (Quantité souhaitée : ${item.minThreshold * 2} pcs). Quels sont vos délais ?`
        }
      }));

      actionCards.push({
        type: 'check_stock',
        label: 'Ouvrir Catalogue & Simulateur',
        icon: '📐',
        payload: { action: 'open_simulator' }
      });

      return { query, intent: 'stock_audit', text, voiceText, actionCards };
    }

    handleCriticalArtisans(query) {
      const critical = this.workshops.filter(w => w.isCritical);

      let text = `🚨 **DIAGNOSTIC DES ATELIERS SOUS TENSION DE CHARGE**\n\n`;
      text += `Nous avons identifié **${critical.length} ateliers** avec un taux de charge > 90% ou un stock critique :\n\n`;

      critical.forEach(w => {
        text += `📍 **${w.name}** — *${w.masterMaalem}* (${w.quarter})\n`;
        text += `   • **Spécialité :** ${w.categoryLabel}\n`;
        text += `   • **Charge Actuelle :** ${w.currentWorkloadPercent}% (Délai : ${w.leadTimeDays} jours)\n`;
        text += `   • **Diagnostic :** ${w.criticalReason}\n`;
        text += `   • **Contact direct :** ${w.phone}\n\n`;
      });

      const voiceText = `${critical.length} ateliers sont actuellement sous tension : ${critical.map(c => c.masterMaalem).join(' et ')}. Contactez-les directement par WhatsApp.`;

      const actionCards = critical.map(w => ({
        type: 'whatsapp_direct',
        label: `WhatsApp ${w.masterMaalem}`,
        icon: '💬',
        payload: {
          artisanId: w.id,
          phone: w.whatsappDirect,
          message: `Salam Maâlem ${w.masterMaalem}, nous avons des commandes B2B prioritaires pour l'export. Pouvons-nous coordonner la cadence de production ?`
        }
      }));

      return { query, intent: 'critical_artisans', text, voiceText, actionCards };
    }

    handleExportOrders(query) {
      let text = `🚢 **SUIVI DES EXPÉDITIONS & COMMANDES B2B EN COURS**\n\n`;

      this.orders.forEach(order => {
        const flag = order.destinationCountry === 'FR' ? '🇫🇷' : (order.destinationCountry === 'ES' ? '🇪🇸' : (order.destinationCountry === 'US' ? '🇺🇸' : '🇦🇺'));
        text += `📦 **${order.id}** — **${order.clientName}** (${flag} ${order.destinationCity})\n`;
        text += `   • **Contenu :** ${order.totalUnits} pièces (${order.craft}) par *${order.maalemInCharge}*\n`;
        text += `   • **Montant :** $${order.totalAmountUsd.toLocaleString()} USD (~${order.totalAmountMad.toLocaleString()} MAD)\n`;
        text += `   • **Mode de Transport :** ${order.shippingMethod}\n`;
        text += `   • **Statut :** \`${order.status}\` (Tracking : ${order.trackingNumber})\n\n`;
      });

      const voiceText = `Vous avez ${this.orders.length} expéditions en cours de traitement pour Paris, Madrid, New York et Byron Bay.`;

      const actionCards = [
        { type: 'track_order', label: 'Calculer Fret Express DHL', icon: '✈️', payload: { action: 'open_freight_calc' } },
        { type: 'pro_forma_quote', label: 'Générer Facture Pro Forma', icon: '📄', payload: { action: 'open_invoice' } }
      ];

      return { query, intent: 'export_orders', text, voiceText, actionCards };
    }

    handleFinancialKpis(query) {
      const kpis = this.getFinancialKPIs();

      const text = `💰 **TABLEAU DE BORD FINANCIER MULTI-DEVISES**\n\n` +
        `• **Volume Global du Portefeuille :** $${kpis.pipelineUsd.toLocaleString()} USD\n` +
        `• **Équivalent Dirhams Marocains :** **${kpis.pipelineMad.toLocaleString()} MAD** (Taux : 1 USD = 9.85 MAD)\n` +
        `• **Équivalent Euros :** **${kpis.pipelineEur.toLocaleString()} EUR** (Taux : 1 USD = 0.92 EUR)\n` +
        `• **Commandes Fermes en Production :** $${kpis.activeOrdersUsd.toLocaleString()} USD\n` +
        `• **Marge Nette Export Estimée :** ${kpis.averageMarginPercent}%\n` +
        `• **Régime Fiscal :** Exonération totale de TVA à l'exportation (CGI Art 91-II-1°)\n` +
        `• **Banque Officielle :** BMCE Bank (RIB: 007450001399370030009822 - Hassan Tiguidda)`;

      const voiceText = `Portefeuille commercial évalué à ${kpis.pipelineUsd.toLocaleString()} dollars, soit environ ${kpis.pipelineMad.toLocaleString()} dirhams marocains, avec une marge export moyenne de 38%.`;

      const actionCards = [
        { type: 'pro_forma_quote', label: 'Créer Devis Export Pro Forma', icon: '💼', payload: { action: 'create_quote' } },
        { type: 'check_stock', label: 'Simulateur Remises Volume', icon: '📐', payload: { action: 'open_simulator' } }
      ];

      return { query, intent: 'financial_kpis', text, voiceText, actionCards };
    }

    handleQuarterSearch(query, quarter) {
      const matching = this.findWorkshopsByQuarter(quarter);

      let text = `📍 **ATELIERS DANS LE QUARTIER : ${quarter.toUpperCase()} (MÉDINA)**\n\n`;
      text += `Nous comptons **${matching.length} ateliers d'artisanat** enregistrés dans ce secteur :\n\n`;

      matching.forEach(w => {
        text += `🏛️ **${w.name}**\n`;
        text += `   • **Maître-Artisan :** ${w.masterMaalem} (${w.yearsOfMastery} ans de métier)\n`;
        text += `   • **Spécialités :** ${w.specialties.join(', ')}\n`;
        text += `   • **Adresse :** ${w.address}\n`;
        text += `   • **Capacité :** ${w.capacityPerMonth} pcs/mois (0 MOQ disponible)\n\n`;
      });

      const voiceText = `${matching.length} ateliers trouvés dans le quartier ${quarter}, dont l'atelier de ${matching.map(m => m.masterMaalem).join(' et ')}.`;

      const actionCards = matching.map(w => ({
        type: 'workshop_profile',
        label: `Fiche ${w.masterMaalem}`,
        icon: '🔍',
        payload: { artisanId: w.id }
      }));

      return { query, intent: 'quarter_search', text, voiceText, actionCards };
    }

    handleCraftSearch(query, category, keyword) {
      const matching = this.findWorkshopsByCategory(category);

      let text = `🎨 **SÉLECTION ARTISANALE : ${category.toUpperCase()} (${keyword})**\n\n`;
      text += `Voici les ateliers d'excellence produisant ces créations à Marrakech :\n\n`;

      matching.forEach(w => {
        text += `✨ **${w.name}** (*${w.masterMaalem}* - ${w.quarter})\n`;
        text += `   • **Produit Phare :** ${w.bestSellerProduct}\n`;
        text += `   • **Tarif Échantillon (0 MOQ) :** $${w.samplePriceUsd} USD / pc\n`;
        text += `   • **Tarif Wholesale (50+ pcs) :** $${w.wholesalePriceUsd} USD / pc (-35%)\n`;
        text += `   • **Délais :** ${w.leadTimeDays} jours ouvrés\n\n`;
      });

      const voiceText = `Pour la catégorie ${category}, nous recommandons les ateliers de ${matching.map(m => m.masterMaalem).join(' et ')}. 0 MOQ disponible pour échantillonnage.`;

      const actionCards = [];
      matching.forEach(w => {
        actionCards.push({
          type: 'workshop_profile',
          label: `🔍 Fiche ${w.masterMaalem}`,
          icon: '🔍',
          payload: { artisanId: w.id }
        });
        actionCards.push({
          type: 'pro_forma_quote',
          label: `💼 Devis ${w.categoryLabel}`,
          icon: '📄',
          payload: { artisanId: w.id, craft: w.category }
        });
      });

      return { query, intent: 'craft_search', text, voiceText, actionCards };
    }

    handleSingleWorkshop(query, w) {
      const text = `🏛️ **FICHE MAÎTRE-ARTISAN : ${w.masterMaalem.toUpperCase()}**\n\n` +
        `• **Atelier :** ${w.name}\n` +
        `• **Secteur :** ${w.quarter} (${w.address})\n` +
        `• **Métier & Savoir-faire :** ${w.categoryLabel} (${w.yearsOfMastery} ans d'expérience)\n` +
        `• **Équipe :** ${w.teamSize} artisans compagnons qualifiés\n` +
        `• **Spécialités :** ${w.specialties.join(', ')}\n` +
        `• **Produit Best-Seller :** ${w.bestSellerProduct}\n` +
        `• **Prix Direct Atelier :** $${w.samplePriceUsd} USD (Sample 0 MOQ) | $${w.wholesalePriceUsd} USD (Wholesale)\n` +
        `• **Capacité Mensuelle :** ${w.capacityPerMonth} pièces (Charge actuelle : ${w.currentWorkloadPercent}%)\n` +
        `• **Disponibilité :** ${w.isCritical ? '⚠️ Délai allongé (' + w.leadTimeDays + 'j)' : '✅ Prêt sous ' + w.leadTimeDays + ' jours'}`;

      const voiceText = `Voici la fiche détaillée de ${w.masterMaalem}, maître artisan en ${w.categoryLabel} situé à ${w.quarter}.`;

      const actionCards = [
        {
          type: 'whatsapp_direct',
          label: `Contacter ${w.masterMaalem} (WhatsApp)`,
          icon: '💬',
          payload: { artisanId: w.id, phone: w.whatsappDirect, message: `Bonjour Maâlem ${w.masterMaalem}, j'ai un client intéressé par vos créations (${w.bestSellerProduct}). Avez-vous de la disponibilité ?` }
        },
        {
          type: 'pro_forma_quote',
          label: `Préparer Devis Pro Forma (${w.masterMaalem})`,
          icon: '💼',
          payload: { artisanId: w.id, craft: w.category }
        },
        {
          type: 'check_stock',
          label: `Vérifier Stocks & Délais`,
          icon: '📦',
          payload: { artisanId: w.id }
        }
      ];

      return { query, intent: 'single_workshop', text, voiceText, actionCards };
    }

    handleProFormaIntent(query) {
      const text = `📄 **MODULE DE FACTURATION & DEVIS EXPORT PRO FORMA**\n\n` +
        `Toutes nos factures et cotations intègrent les mentions légales et bancaires requises pour le dédouanement et le virement international :\n\n` +
        `• **Raison Sociale :** AUTO-ENTREPRENEUR HASSAN TIGUIDDA\n` +
        `• **ICE :** \`1161674000043\`\n` +
        `• **Compte Bancaire :** BMCE Bank (Bank of Africa) — SWIFT: \`BCMAMAMC\`\n` +
        `• **RIB :** \`007450001399370030009822\`\n` +
        `• **Clause Fiscale :** *"Montant en dirhams exonéré de la TVA (Art 91 - II - 1° du CGI)"*\n` +
        `• **Tarification Dégressive :** 0 MOQ (1-5 pcs), -15% (6-50 pcs), -35% (50+ pcs)`;

      const voiceText = `Le système de facturation pro forma est prêt avec vos identifiants légaux ICE et coordonnées bancaires BMCE Bank.`;

      const actionCards = [
        { type: 'pro_forma_quote', label: 'Ouvrir Onglet Facturation & Devis', icon: '📑', payload: { action: 'open_legal' } },
        { type: 'check_stock', label: 'Simulateur de Prix & Remises', icon: '📐', payload: { action: 'open_simulator' } }
      ];

      return { query, intent: 'pro_forma_info', text, voiceText, actionCards };
    }

    handleSmartFallback(query) {
      const text = `🤖 **ASSISTANT INTELLIGENT MARRAKECH CRAFT CONDUIT**\n\n` +
        `Je suis configuré pour répondre précisément sur vos opérations artisanales à Marrakech. Voici ce que vous pouvez me demander :\n\n` +
        `1. 📊 **"Bilan global"** ou **"Check everything"** : Rapport complet 360° du business.\n` +
        `2. 📦 **"Bilan stock"** : Vérifier les niveaux d'inventaire et les réappros.\n` +
        `3. 🚨 **"Artisans critiques"** : Identifier les ateliers sous tension de production.\n` +
        `4. 🚢 **"Commandes export"** : Consulter l'état des livraisons internationales.\n` +
        `5. 💰 **"Chiffre d'affaires"** : Calculateur financier multi-devises (USD, EUR, MAD).\n` +
        `6. 📍 **Par Quartier** : *"Ateliers Mouassine"*, *"Sidi Ghanem"*, *"Bab Doukkala"*...\n` +
        `7. 🏺 **Par Métier** : *"Tapis Beni Ourain"*, *"Zellige & Poterie"*, *"Laiton martelé"*, *"Cuir"*, *"Vannerie"*...`;

      const voiceText = `Je peux vous aider à auditer les stocks, contacter les Maâlems, suivre les commandes export ou préparer vos factures pro forma.`;

      const actionCards = [
        { type: 'workshop_profile', label: 'Bilan Global 360°', icon: '📊', payload: { action: 'check_everything' } },
        { type: 'check_stock', label: 'Audit des Stocks', icon: '📦', payload: { action: 'stock_audit' } },
        { type: 'custom_search', label: 'Ateliers Sidi Ghanem', icon: '📍', payload: { query: 'Sidi Ghanem' } },
        { type: 'custom_search', label: 'Tapis & Beni Ourain', icon: '🧶', payload: { query: 'tapis' } }
      ];

      return { query, intent: 'fallback_assistant', text, voiceText, actionCards };
    }
  }

  const craftBrainService = new CraftBrainEngine();

  return {
    CraftBrainService: CraftBrainEngine,
    craftBrainService,
    WORKSHOPS_DATABASE,
    INVENTORY_DATABASE,
    EXPORT_ORDERS_DATABASE
  };
});
