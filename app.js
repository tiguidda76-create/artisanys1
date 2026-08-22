/* ═══════════════════════════════════════════════════════════════
   MARRAKECH CRAFT CONDUIT — Application Logic & Mock Data
   ═══════════════════════════════════════════════════════════════ */

// ── Currency Exchange Rates (Mock Live) ─────────────────────
const EXCHANGE_RATES = {
  USD: 1.00,
  EUR: 0.92,
  GBP: 0.79,
  MAD: 9.85,
  AUD: 1.53
};

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', MAD: 'د.م.', AUD: 'A$'
};

let currentCurrency = 'USD';

// ── Tab Navigation ──────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('panel-' + btn.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

// ── Live Clock ──────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' };
  document.getElementById('headerTime').textContent = now.toLocaleTimeString('en-GB', opts);
}
setInterval(updateClock, 1000);
updateClock();

// ── Toast Notifications ─────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ═══════════════════════════════════════════════════════════
// TAB 1: GLOBAL LEAD RADAR
// ═══════════════════════════════════════════════════════════

const LEADS_DATA = [
  { name: 'Maison Bohème', type: 'concept', typeName: 'Concept Store', city: 'Le Marais, Paris', country: 'FR', flag: '🇫🇷', craft: 'rugs', craftName: 'Rugs & Kilims', channel: 'Physical', volume: '€45K/yr', moq: true },
  { name: 'Côté Sud Living', type: 'boutique', typeName: 'Online Boutique', city: 'Aix-en-Provence', country: 'FR', flag: '🇫🇷', craft: 'ceramics', craftName: 'Ceramics', channel: 'Online', volume: '€18K/yr', moq: true },
  { name: 'L\'Atelier du Maroc', type: 'wholesale', typeName: 'Wholesale Importer', city: 'Lyon', country: 'FR', flag: '🇫🇷', craft: 'brass', craftName: 'Brassware', channel: 'Hybrid', volume: '€120K/yr', moq: false },
  { name: 'East London Artisan Co.', type: 'concept', typeName: 'Concept Store', city: 'Shoreditch, London', country: 'UK', flag: '🇬🇧', craft: 'leather', craftName: 'Leather Goods', channel: 'Physical', volume: '£32K/yr', moq: true },
  { name: 'Bohemia Home Studio', type: 'interior', typeName: 'Interior Design', city: 'Notting Hill, London', country: 'UK', flag: '🇬🇧', craft: 'rugs', craftName: 'Rugs & Kilims', channel: 'Hybrid', volume: '£85K/yr', moq: false },
  { name: 'The Souk Garden', type: 'boutique', typeName: 'Online Boutique', city: 'Brighton', country: 'UK', flag: '🇬🇧', craft: 'wicker', craftName: 'Wicker & Basketry', channel: 'Online', volume: '£12K/yr', moq: true },
  { name: 'Casa Étnica Madrid', type: 'concept', typeName: 'Concept Store', city: 'Gràcia, Barcelona', country: 'ES', flag: '🇪🇸', craft: 'ceramics', craftName: 'Ceramics', channel: 'Physical', volume: '€28K/yr', moq: true },
  { name: 'Rincón Bereber', type: 'boutique', typeName: 'Online Boutique', city: 'Madrid', country: 'ES', flag: '🇪🇸', craft: 'rugs', craftName: 'Rugs & Kilims', channel: 'Online', volume: '€22K/yr', moq: true },
  { name: 'Deco Mediterráneo', type: 'wholesale', typeName: 'Wholesale Importer', city: 'Valencia', country: 'ES', flag: '🇪🇸', craft: 'brass', craftName: 'Brassware', channel: 'Hybrid', volume: '€95K/yr', moq: false },
  { name: 'Brooklyn Artisan Collective', type: 'concept', typeName: 'Concept Store', city: 'Brooklyn, NY', country: 'US', flag: '🇺🇸', craft: 'leather', craftName: 'Leather Goods', channel: 'Physical', volume: '$52K/yr', moq: true },
  { name: 'Soho Interiors NYC', type: 'interior', typeName: 'Interior Design', city: 'SoHo, New York', country: 'US', flag: '🇺🇸', craft: 'rugs', craftName: 'Rugs & Kilims', channel: 'Hybrid', volume: '$140K/yr', moq: false },
  { name: 'Desert Modern LA', type: 'boutique', typeName: 'Online Boutique', city: 'Los Angeles', country: 'US', flag: '🇺🇸', craft: 'ceramics', craftName: 'Ceramics', channel: 'Online', volume: '$35K/yr', moq: true },
  { name: 'Faire Marketplace (Top Seller)', type: 'wholesale', typeName: 'Wholesale Importer', city: 'San Francisco', country: 'US', flag: '🇺🇸', craft: 'wood', craftName: 'Woodwork', channel: 'Online', volume: '$200K/yr', moq: false },
  { name: 'Byron Bay Living Co.', type: 'concept', typeName: 'Concept Store', city: 'Byron Bay', country: 'AU', flag: '🇦🇺', craft: 'wicker', craftName: 'Wicker & Basketry', channel: 'Physical', volume: 'A$24K/yr', moq: true },
  { name: 'Coastal Nomad Store', type: 'boutique', typeName: 'Online Boutique', city: 'Bondi Beach, Sydney', country: 'AU', flag: '🇦🇺', craft: 'rugs', craftName: 'Rugs & Kilims', channel: 'Online', volume: 'A$38K/yr', moq: true },
  { name: 'Melbourne Artisan Hub', type: 'interior', typeName: 'Interior Design', city: 'Melbourne', country: 'AU', flag: '🇦🇺', craft: 'brass', craftName: 'Brassware', channel: 'Hybrid', volume: 'A$55K/yr', moq: true },
  { name: 'Ankorstore France Hub', type: 'wholesale', typeName: 'Wholesale Importer', city: 'Paris', country: 'FR', flag: '🇫🇷', craft: 'ceramics', craftName: 'Ceramics', channel: 'Online', volume: '€180K/yr', moq: false },
  { name: 'Williamsburg Design Studio', type: 'interior', typeName: 'Interior Design', city: 'Williamsburg, NY', country: 'US', flag: '🇺🇸', craft: 'brass', craftName: 'Brassware', channel: 'Hybrid', volume: '$78K/yr', moq: true },
];

// Selection state
let selectedLeadNames = new Set();
let currentFilteredLeads = [...LEADS_DATA];
let currentCampaignPreset = 'sample';

function sanitizeId(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '_');
}

function renderLeads(data) {
  currentFilteredLeads = data;
  const tbody = document.getElementById('leadsBody');
  const typeClasses = {
    concept: 'pill-blue',
    boutique: 'pill-green',
    wholesale: 'pill-gold',
    interior: 'pill-purple'
  };
  const craftClasses = {
    rugs: 'pill-terra',
    ceramics: 'pill-blue',
    leather: 'pill-gold',
    brass: 'pill-purple',
    wicker: 'pill-green',
    wood: 'pill-slate'
  };
  const channelIcons = { Physical: '🏪', Online: '🌐', Hybrid: '🔄' };

  tbody.innerHTML = data.map(lead => {
    const isSelected = selectedLeadNames.has(lead.name);
    return `
    <tr class="${isSelected ? 'row-selected' : ''}" id="lead-row-${sanitizeId(lead.name)}">
      <td class="col-cb">
        <input type="checkbox" class="lead-cb-input" ${isSelected ? 'checked' : ''} onchange="toggleLeadSelection('${lead.name}', this.checked)">
      </td>
      <td>
        <div class="cell-primary">${lead.name}</div>
      </td>
      <td><span class="pill ${typeClasses[lead.type]}">${lead.typeName}</span></td>
      <td>
        <span class="flag">${lead.flag}</span>
        <span class="cell-secondary" style="margin-left: 0.3rem;">${lead.city}</span>
      </td>
      <td><span class="pill ${craftClasses[lead.craft]}">${lead.craftName}</span></td>
      <td><span>${channelIcons[lead.channel]} ${lead.channel}</span></td>
      <td><span class="cell-primary">${lead.volume}</span></td>
      <td>${lead.moq
        ? '<span class="moq-badge moq-yes">✓ 0 MOQ OK</span>'
        : '<span class="moq-badge moq-no">✗ MOQ 50+</span>'
      }</td>
      <td>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline" onclick="showStoreAudit('${lead.name}')">🔍 Audit</button>
          <button class="btn btn-sm btn-primary" onclick="openSinglePitchModal('${lead.name}')">📦 Pitch</button>
          <button class="btn btn-sm btn-success" onclick="openSingleWhatsApp('${lead.name}')">💬</button>
        </div>
      </td>
    </tr>
  `;
  }).join('');

  updateSelectAllCheckbox();
  updateBatchActionBar();
}

function filterLeads() {
  const country = document.getElementById('filterCountry').value;
  const bizType = document.getElementById('filterBizType').value;
  const craft = document.getElementById('filterCraft').value;
  const search = document.getElementById('filterSearch').value.toLowerCase();

  let filtered = LEADS_DATA.filter(lead => {
    if (country !== 'all' && lead.country !== country) return false;
    if (bizType !== 'all' && lead.type !== bizType) return false;
    if (craft !== 'all' && lead.craft !== craft) return false;
    if (search && !lead.name.toLowerCase().includes(search) && !lead.city.toLowerCase().includes(search)) return false;
    return true;
  });

  renderLeads(filtered);
}

function toggleLeadSelection(name, isChecked) {
  if (isChecked) {
    selectedLeadNames.add(name);
  } else {
    selectedLeadNames.delete(name);
  }

  const row = document.getElementById(`lead-row-${sanitizeId(name)}`);
  if (row) {
    if (isChecked) row.classList.add('row-selected');
    else row.classList.remove('row-selected');
  }

  updateSelectAllCheckbox();
  updateBatchActionBar();
}

function toggleSelectAllLeads(masterCheckbox) {
  const isChecked = masterCheckbox.checked;
  currentFilteredLeads.forEach(lead => {
    if (isChecked) {
      selectedLeadNames.add(lead.name);
    } else {
      selectedLeadNames.delete(lead.name);
    }
  });

  renderLeads(currentFilteredLeads);
}

function clearLeadSelection() {
  selectedLeadNames.clear();
  renderLeads(currentFilteredLeads);
}

function updateSelectAllCheckbox() {
  const master = document.getElementById('selectAllCheckbox');
  if (!master) return;
  if (currentFilteredLeads.length === 0) {
    master.checked = false;
    master.indeterminate = false;
    return;
  }
  const selectedCountInFiltered = currentFilteredLeads.filter(l => selectedLeadNames.has(l.name)).length;
  if (selectedCountInFiltered === 0) {
    master.checked = false;
    master.indeterminate = false;
  } else if (selectedCountInFiltered === currentFilteredLeads.length) {
    master.checked = true;
    master.indeterminate = false;
  } else {
    master.checked = false;
    master.indeterminate = true;
  }
}

function updateBatchActionBar() {
  const bar = document.getElementById('batchActionBar');
  if (!bar) return;

  const count = selectedLeadNames.size;
  if (count === 0) {
    bar.classList.remove('active');
    return;
  }

  bar.classList.add('active');
  const countBadge = document.getElementById('batchCountBadge');
  if (countBadge) countBadge.textContent = `${count} Selected`;

  // Calculate estimated pipeline
  const selectedLeads = LEADS_DATA.filter(l => selectedLeadNames.has(l.name));
  let totalUSD = 0;
  const countryCounts = {};

  selectedLeads.forEach(l => {
    const volNum = parseFloat(l.volume.replace(/[^0-9.]/g, '')) || 0;
    if (l.volume.includes('€')) totalUSD += volNum * 1.08;
    else if (l.volume.includes('£')) totalUSD += volNum * 1.27;
    else if (l.volume.includes('A$')) totalUSD += volNum * 0.65;
    else totalUSD += volNum;

    countryCounts[l.flag] = (countryCounts[l.flag] || 0) + 1;
  });

  const pipeVal = document.getElementById('batchPipelineVal');
  if (pipeVal) pipeVal.textContent = `$${Math.round(totalUSD)}K USD`;

  const tagsEl = document.getElementById('batchCountryTags');
  if (tagsEl) {
    tagsEl.innerHTML = Object.entries(countryCounts).map(([flag, cnt]) => `
      <span class="pill pill-blue" style="font-size: 0.68rem; padding: 0.15rem 0.45rem;">${flag} ${cnt}</span>
    `).join('');
  }
}

// ═══════════════════════════════════════════════════════════
// PERSONALIZED PITCH GENERATOR ENGINE
// ═══════════════════════════════════════════════════════════

function getPersonalizedPitchForLead(lead, presetKey = 'sample', autoLocalize = true) {
  let lang = 'en';
  if (autoLocalize) {
    if (lead.country === 'FR') lang = 'fr';
    else if (lead.country === 'ES') lang = 'es';
    else lang = 'en';
  }

  const craftDetails = {
    rugs: { en: 'Beni Ourain, Azilal & Vintage Kilim Rugs', fr: 'Tapis Beni Ouarain, Azilal et Kilims berbères', es: 'Alfombras Beni Ourain, Azilal y Kilims bereberes' },
    ceramics: { en: 'Handmade Tamegroute & Safi Ceramic Tableware', fr: 'Poteries et céramiques artisanales de Tamegroute & Safi', es: 'Cerámica artesanal de Tamegroute y Safi' },
    brass: { en: 'Hand-Hammered Brass Pendant Lighting & Lamps', fr: 'Luminaires et suspensions en laiton martelé à la main', es: 'Lámparas y colgantes de latón cincelado a mano' },
    leather: { en: 'Handcrafted Marrakech Leather Poufs & Goods', fr: 'Poufs et maroquinerie artisanale de Marrakech', es: 'Puffs y artículos de cuero artesanal de Marrakech' },
    wicker: { en: 'Natural Palm Wicker & Woven Basketry', fr: 'Vannerie fine en fibres de palmier doum', es: 'Cestería fina y mimbre natural de palma' },
    wood: { en: 'Hand-Carved Atlas Cedar Wood Decor', fr: 'Ébénisterie fine en bois de thuya et cèdre de l\'Atlas', es: 'Artesanía en madera de cedro del Atlas y tuya' }
  };

  const craftPhrase = (craftDetails[lead.craft] && craftDetails[lead.craft][lang]) || lead.craftName;

  if (lang === 'fr') {
    if (presetKey === 'wholesale') {
      return {
        subject: `Partenariat Grossiste & Import Direct — Ateliers Artisanaux Marrakech (${lead.name})`,
        body: `Bonjour à l'équipe de ${lead.name},\n\nJe vous contacte depuis notre atelier à Marrakech. Nous accompagnons les professionnels de la décoration et importateurs en France sur des commandes directes d'atelier.\n\n✦ Spécialisation : ${craftPhrase}\n✦ Tarifs direct atelier : 40% à 60% sous les tarifs de distribution conventionnels\n✦ Capacités de production : De la commande sur-mesure au conteneur complet\n✦ Traçabilité & Certificat d'Authenticité fait-main délivré avec chaque pièce\n✦ Expédition rapide et gestion douanière facilitée (Incoterms EXW / FOB / DDP).\n\nSeriez-vous disponibles pour recevoir notre grille tarifaire professionnelle ainsi que notre lookbook numérique 2026 ?\n\nBien cordialement,\nHassan Tiguidda — Directeur Export\nMARRAKECH CRAFT CONDUIT\n📱 WhatsApp : +212 632 155 430 | ✉️ tiguidda76@gmail.com`
      };
    } else if (presetKey === 'lookbook') {
      return {
        subject: `Nouveau Lookbook Printemps 2026 — Collections Artisanales de Marrakech pour ${lead.name}`,
        body: `Bonjour à l'équipe de ${lead.name},\n\nNous avons le plaisir de vous présenter notre tout nouveau Lookbook Numérique 2026, mettant à l'honneur l'artisanat marocain d'exception : ${craftPhrase}.\n\nDécouvrez nos créations exclusives directement en ligne :\n🔗 https://sites.google.com/view/morkech/home\n\n✦ 0 Minimum de Commande (0 MOQ) pour tester en boutique\n✦ Expédition Express DHL (3 à 5 jours ouvrés à ${lead.city})\n\nNous serions ravis de composer une sélection sur mesure pour votre univers.\n\nBien à vous,\nHassan Tiguidda | +212 632 155 430`
      };
    } else {
      return {
        subject: `Collection Artisanale Marrakech — 0 Minimum de Commande pour ${lead.name}`,
        body: `Bonjour à l'équipe de ${lead.name},\n\nJe vous contacte car votre concept à ${lead.city} correspond parfaitement à l'esprit de nos créations artisanales de Marrakech, en particulier notre collection de ${craftPhrase}.\n\n✦ Zéro MOQ (0 Minimum de Commande) : Testez avec 1 à 5 pièces sans risque d'inventaire\n✦ Tarifs direct atelier : Sans intermédiaires\n✦ Expédition DHL Express en 3-5 jours\n✦ Certificat d'Authenticité Marocaine fourni\n\nNous serions ravis de vous envoyer un coffret échantillon découverte et notre catalogue numérique.\n\nConsultez notre univers : https://sites.google.com/view/morkech/home\n\nChaleureusement,\nHassan Tiguidda\nArtisan Maître & Exportation\n📱 WhatsApp : +212 632 155 430 | ✉️ tiguidda76@gmail.com`
      };
    }
  } else if (lang === 'es') {
    if (presetKey === 'wholesale') {
      return {
        subject: `Alianza Mayorista Directa de Taller en Marrakech — ${lead.name}`,
        body: `Hola equipo de ${lead.name},\n\nLes escribo directamente desde nuestro taller artesanal en Marrakech. Especializados en ${craftPhrase}, ofrecemos acuerdos directos para tiendas y proyectos en España.\n\n✦ Precios directos de taller (sin intermediarios)\n✦ Producción a medida y etiquetado privado\n✦ Certificados oficiales de artesanía marroquí hecha a mano\n✦ Envíos exprés a ${lead.city} con gestión ágil\n\n¿Podemos enviarles nuestra tarifa mayorista y lookbook digital?\n\nAtentamente,\nHassan Tiguidda | +212 632 155 430 | tiguidda76@gmail.com`
      };
    } else {
      return {
        subject: `Colección Artesanal de Marrakech — Sin Pedido Mínimo (0 MOQ) para ${lead.name}`,
        body: `Hola equipo de ${lead.name},\n\nLes escribo desde Marrakech porque su tienda en ${lead.city} encaja a la perfección con nuestras piezas de ${craftPhrase}.\n\n✦ 0 MOQ (Sin pedido mínimo): Pruebe con 1 a 5 piezas exclusivas\n✦ Precios directos de artesano\n✦ Envío exprés vía DHL/FedEx a España\n✦ Garantía y certificado de origen hecho a mano\n\nCatálogo completo: https://sites.google.com/view/morkech/home\n\nSaludos cordiales,\nHassan Tiguidda\n📱 WhatsApp: +212 632 155 430 | ✉️ tiguidda76@gmail.com`
      };
    }
  } else {
    // English
    if (presetKey === 'wholesale') {
      return {
        subject: `Direct Workshop Wholesale Partnership — Marrakech Artisan Goods for ${lead.name}`,
        body: `Dear ${lead.name} Team,\n\nI'm reaching out directly from our master artisan atelier in Marrakech. We specialize in partnering with high-end retailers and interior designers across ${lead.city}.\n\n✦ Focus: ${craftPhrase}\n✦ Direct Workshop Pricing: 40-60% below conventional import distributor rates\n✦ Custom Specifications: Bespoke dimensions, colorways & private labeling\n✦ Air & Ocean Freight Support with full Certificate of Origin\n\nLet me know if we can forward our 2026 Wholesale Matrix and Digital Lookbook.\n\nBest regards,\nHassan Tiguidda — Export Director\nMARRAKECH CRAFT CONDUIT\n📱 WhatsApp: +212 632 155 430 | ✉️ tiguidda76@gmail.com`
      };
    } else if (presetKey === 'lookbook') {
      return {
        subject: `Spring 2026 Marrakech Artisan Lookbook — Curated for ${lead.name}`,
        body: `Dear ${lead.name} Team,\n\nGreetings from Marrakech! We are thrilled to share our latest 2026 Digital Lookbook featuring handcrafted ${craftPhrase}.\n\nExplore our online collection:\n🔗 https://sites.google.com/view/morkech/home\n\n✦ Zero Minimum Order (0 MOQ) for initial curated curation\n✦ Express Door-to-Door Delivery (3-5 business days to ${lead.city})\n✦ Full Moroccan Handmade Authenticity Guarantee\n\nLet's connect on WhatsApp to discuss a tailored sample selection for your space.\n\nWarmly,\nHassan Tiguidda | +212 632 155 430`
      };
    } else {
      return {
        subject: `Authentic Moroccan Collection — Zero Minimum Order (0 MOQ) for ${lead.name}`,
        body: `Dear ${lead.name} Team,\n\nI'm reaching out from our master artisan workshop in Marrakech because your aesthetic in ${lead.city} is a wonderful match for our authentic handcrafted ${craftPhrase}.\n\nWhy partner with us?\n✦ Zero Minimum Order (0 MOQ) — Test with 1 to 5 pieces with zero inventory risk\n✦ Workshop-Direct Pricing — Cut out distributor markups\n✦ Fast DHL/FedEx Express shipping to your door\n✦ Full Moroccan Handmade Authenticity certification\n\nView our portfolio: https://sites.google.com/view/morkech/home\n\nWarm regards,\nHassan Tiguidda — Master Artisan & Export Director\n📱 WhatsApp: +212 632 155 430 | ✉️ tiguidda76@gmail.com`
      };
    }
  }
}

// ═══════════════════════════════════════════════════════════
// MASS PITCH MODAL & DISPATCH SYSTEM
// ═══════════════════════════════════════════════════════════

function openMassPitchModal(mode = 'selected') {
  let targets = [];
  if (Array.isArray(mode)) {
    targets = mode;
  } else if (mode === 'selected') {
    targets = LEADS_DATA.filter(l => selectedLeadNames.has(l.name));
    if (targets.length === 0) {
      targets = currentFilteredLeads;
    }
  } else if (mode === 'filtered') {
    targets = currentFilteredLeads;
  } else {
    targets = LEADS_DATA;
  }

  if (targets.length === 0) {
    showToast('No buyers selected for mass pitch', 'warning');
    return;
  }

  currentCampaignPreset = 'sample';
  document.getElementById('modalTitle').textContent = `🚀 Multi-Agent Mass Pitch Dispatcher (${targets.length} Buyers)`;

  document.getElementById('modalBody').innerHTML = `
    <div class="mass-pitch-container">
      <div>
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--saffron-light); margin-bottom: 0.5rem;">
          1. Select Outreach Campaign Strategy
        </div>
        <div class="mass-campaign-presets">
          <div class="preset-card selected" id="preset-sample" onclick="selectCampaignPreset('sample')">
            <div class="preset-title">📦 0-MOQ Sample Pack Intro</div>
            <div class="preset-desc">Focus on low-risk 1-5 piece curated test discovery pack & workshop-direct pricing. Ideal for boutiques.</div>
          </div>
          <div class="preset-card" id="preset-wholesale" onclick="selectCampaignPreset('wholesale')">
            <div class="preset-title">🏢 Wholesale & Trade Tier</div>
            <div class="preset-desc">Bespoke sizing, private labeling, 40-60% margin structure, and ocean/air freight options.</div>
          </div>
          <div class="preset-card" id="preset-lookbook" onclick="selectCampaignPreset('lookbook')">
            <div class="preset-title">🎨 Spring 2026 Lookbook Dispatch</div>
            <div class="preset-desc">High-resolution artisan digital lookbook showcase featuring our full Marrakech collection.</div>
          </div>
        </div>
      </div>

      <div class="mass-options-grid">
        <label class="toggle-option">
          <input type="checkbox" id="massAutoLang" checked>
          <span>🌐 <strong>Auto-Localize Language</strong> (French for 🇫🇷, Spanish for 🇪🇸, English for others)</span>
        </label>
        <label class="toggle-option">
          <input type="checkbox" id="massAttachLookbook" checked>
          <span>📁 <strong>Attach Digital Lookbook Link</strong> (High-Res Portfolio)</span>
        </label>
        <label class="toggle-option">
          <input type="checkbox" id="massAttachCert" checked>
          <span>🛡️ <strong>Include Authenticity Guarantee</strong> (Artisan Certified)</span>
        </label>
        <label class="toggle-option">
          <input type="checkbox" id="massAttachWhatsApp" checked>
          <span>💬 <strong>Queue WhatsApp Follow-Up</strong> (+212 632 155 430 direct)</span>
        </label>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--slate-200);">
            2. Recipient Queue & AI Personalization Matrix (<span id="massQueueCount">${targets.length}</span>)
          </div>
          <span style="font-size: 0.7rem; color: var(--slate-400);">Agent: <strong>Outreach & Localization</strong></span>
        </div>

        <div class="mass-queue-list" id="massQueueList">
          ${targets.map(lead => `
            <div class="queue-item" id="queue-item-${sanitizeId(lead.name)}">
              <div class="queue-lead-info">
                <span class="flag">${lead.flag}</span>
                <div>
                  <div class="queue-lead-name">${lead.name}</div>
                  <div class="queue-lead-meta">${lead.city} • <span style="color: var(--saffron-light);">${lead.craftName}</span> • ${lead.typeName}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span class="queue-status-tag queue-status-queued" id="queue-status-${sanitizeId(lead.name)}">⏳ Queued</span>
                <button class="btn btn-sm btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.68rem;" onclick="previewPersonalizedLeadPitch('${lead.name}')">👁️ Preview</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Live Dispatch Progress Area -->
      <div class="dispatch-progress-wrap" id="dispatchProgressWrap">
        <div class="dispatch-progress-header">
          <span id="dispatchProgressStatus">⚡ Orchestrator initializing batch sequence...</span>
          <strong id="dispatchProgressPct">0%</strong>
        </div>
        <div class="progress-track">
          <div class="progress-bar-fill" id="dispatchProgressBar"></div>
        </div>
        <div class="dispatch-live-agent-msg" id="dispatchLiveMsg">
          <span>🤖</span> <span id="dispatchMsgText">Connecting to LangGraph agent router...</span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    <button class="btn btn-mass-pitch" id="startMassDispatchBtn" onclick="startMassDispatchSequence(${JSON.stringify(targets.map(l => l.name)).replace(/"/g, '&quot;')})">✨ Launch Mass Outreach Sequence (${targets.length})</button>
  `;

  openModal();
}

function selectCampaignPreset(presetKey) {
  currentCampaignPreset = presetKey;
  ['sample', 'wholesale', 'lookbook'].forEach(p => {
    const el = document.getElementById(`preset-${p}`);
    if (el) {
      if (p === presetKey) el.classList.add('selected');
      else el.classList.remove('selected');
    }
  });
}

function previewPersonalizedLeadPitch(leadName) {
  const lead = LEADS_DATA.find(l => l.name === leadName);
  if (!lead) return;
  const autoLang = document.getElementById('massAutoLang') ? document.getElementById('massAutoLang').checked : true;
  const pitch = getPersonalizedPitchForLead(lead, currentCampaignPreset, autoLang);

  alert(`📨 AI PERSONALIZED PITCH PREVIEW\nRecipient: ${lead.name} (${lead.flag} ${lead.city})\nCraft: ${lead.craftName}\n\nSubject: ${pitch.subject}\n\n${pitch.body}`);
}

async function startMassDispatchSequence(leadNames) {
  const dispatchBtn = document.getElementById('startMassDispatchBtn');
  if (dispatchBtn) {
    dispatchBtn.disabled = true;
    dispatchBtn.textContent = '🚀 Dispatching In Progress...';
  }

  const progressWrap = document.getElementById('dispatchProgressWrap');
  const progressBar = document.getElementById('dispatchProgressBar');
  const progressPct = document.getElementById('dispatchProgressPct');
  const progressStatus = document.getElementById('dispatchProgressStatus');
  const msgText = document.getElementById('dispatchMsgText');

  if (progressWrap) progressWrap.classList.add('active');

  const autoLang = document.getElementById('massAutoLang') ? document.getElementById('massAutoLang').checked : true;
  const total = leadNames.length;

  for (let i = 0; i < total; i++) {
    const name = leadNames[i];
    const lead = LEADS_DATA.find(l => l.name === name);
    const sanitized = sanitizeId(name);
    const statusTag = document.getElementById(`queue-status-${sanitized}`);

    if (statusTag) {
      statusTag.className = 'queue-status-tag queue-status-running';
      statusTag.textContent = '🤖 Personalizing...';
    }

    if (msgText) msgText.textContent = `Generating tailored ${lead ? lead.craftName : 'artisan'} pitch for "${name}" (${lead ? lead.city : ''})...`;
    if (progressStatus) progressStatus.textContent = `⚡ Processing ${i + 1} of ${total}: ${name}`;

    const pct = Math.round(((i + 0.5) / total) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressPct) progressPct.textContent = `${pct}%`;

    // Wait a brief realistic delay
    await new Promise(r => setTimeout(r, 450));

    if (statusTag) {
      statusTag.textContent = '🛡️ Brand Audited';
    }

    await new Promise(r => setTimeout(r, 250));

    if (statusTag) {
      statusTag.className = 'queue-status-tag queue-status-done';
      statusTag.textContent = '✓ Dispatched';
    }

    // Append to live Orchestration log in Tab 2
    const now = new Date();
    const time = now.toTimeString().substring(0, 8);
    const logEl = document.getElementById('orchLog');
    if (logEl && lead) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      const langName = (lead.country === 'FR' ? 'French' : lead.country === 'ES' ? 'Spanish' : 'English');
      entry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-arrow"> → </span>
        <span class="log-agent">[Outreach Agent]</span>
        <span class="log-action"> Mass pitch dispatched to "${lead.name}" (${lead.city}) in ${langName} [${lead.craftName}]</span>
        <span class="log-status-ok"> ✓</span>
      `;
      logEl.insertBefore(entry, logEl.firstChild);
    }

    // Increment tokens and tasks
    const tokensEl = document.getElementById('tokensProcessed');
    if (tokensEl) {
      const current = parseInt(tokensEl.textContent.replace(/,/g, '')) || 847293;
      tokensEl.textContent = (current + 1820).toLocaleString();
    }
    const tasksEl = document.getElementById('tasksCompleted');
    if (tasksEl) {
      const current = parseInt(tasksEl.textContent.replace(/,/g, '')) || 1247;
      tasksEl.textContent = (current + 1).toLocaleString();
    }

    const finalPct = Math.round(((i + 1) / total) * 100);
    if (progressBar) progressBar.style.width = `${finalPct}%`;
    if (progressPct) progressPct.textContent = `${finalPct}%`;
  }

  if (progressStatus) progressStatus.textContent = `🎉 Campaign Completed: ${total} of ${total} Pitches Dispatched`;
  if (msgText) msgText.textContent = `All ${total} buyers contacted via SMTP + WhatsApp queue with full authenticity certificates.`;

  showToast(`🎉 Mass Outreach Complete: ${total} personalized pitches dispatched!`, 'success');

  // Update modal footer
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()">Close</button>
    <button class="btn btn-success" onclick="openWhatsAppBatchModal(${JSON.stringify(leadNames).replace(/"/g, '&quot;')})">💬 Open WhatsApp Web Blast</button>
    <button class="btn btn-gold" onclick="copyMassReport(${JSON.stringify(leadNames).replace(/"/g, '&quot;')})">📋 Copy Dispatch Report</button>
  `;
}

function copyMassReport(leadNames) {
  const leads = LEADS_DATA.filter(l => leadNames.includes(l.name));
  const text = `MARRAKECH CRAFT CONDUIT — B2B MASS PITCH REPORT\nDate: ${new Date().toLocaleDateString()}\nTotal Dispatched: ${leads.length}\n\n` +
    leads.map(l => `• ${l.flag} ${l.name} (${l.city}) — ${l.craftName} | ${l.volume} | Channel: ${l.channel}`).join('\n') +
    `\n\nOutreach Agent: Autonomous Multi-Agent Hierarchy\nMaster Artisan: Hassan Tiguidda (+212 632 155 430)`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('Batch campaign report copied to clipboard', 'success');
  }).catch(() => {
    showToast('Report ready', 'info');
  });
}

function launchSegmentCampaign(segment) {
  let targets = [];
  if (segment === 'all') {
    targets = LEADS_DATA;
  } else {
    targets = LEADS_DATA.filter(l => l.country === segment);
  }
  openMassPitchModal(targets);
}

function openSinglePitchModal(leadName) {
  const lead = LEADS_DATA.find(l => l.name === leadName);
  if (!lead) return;
  openMassPitchModal([lead]);
}

function openSingleWhatsApp(leadName) {
  const lead = LEADS_DATA.find(l => l.name === leadName);
  if (!lead) return;
  const pitch = getPersonalizedPitchForLead(lead, 'sample', true);
  const text = encodeURIComponent(`Salam from Marrakech! ✨\n${pitch.subject}\n\n${pitch.body.substring(0, 300)}...\n\nPortfolio: https://sites.google.com/view/morkech/home`);
  const url = `https://wa.me/212632155430?text=${text}`;
  window.open(url, '_blank');
  showToast(`WhatsApp draft opened for ${lead.name}`, 'success');
}

function openWhatsAppBatchModal(leadNames) {
  let leads;
  if (Array.isArray(leadNames)) {
    leads = LEADS_DATA.filter(l => leadNames.includes(l.name));
  } else if (selectedLeadNames.size > 0) {
    leads = LEADS_DATA.filter(l => selectedLeadNames.has(l.name));
  } else {
    leads = currentFilteredLeads.slice(0, 6);
  }

  document.getElementById('modalTitle').textContent = `💬 WhatsApp Direct Dispatch Console (${leads.length} Buyers)`;
  document.getElementById('modalBody').innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="padding: 0.8rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md);">
        <h4 style="color: var(--success); font-size: 0.82rem; margin-bottom: 0.3rem;">📱 Official WhatsApp Conduit: +212 632 155 430</h4>
        <p style="font-size: 0.72rem; color: var(--slate-300);">Click below to open direct pre-formatted WhatsApp chat sequences for each selected buyer.</p>
      </div>
      <div class="mass-queue-list">
        ${leads.map(l => `
          <div class="queue-item">
            <div class="queue-lead-info">
              <span class="flag">${l.flag}</span>
              <div>
                <div class="queue-lead-name">${l.name}</div>
                <div class="queue-lead-meta">${l.city} • ${l.craftName}</div>
              </div>
            </div>
            <button class="btn btn-sm btn-success" onclick="openSingleWhatsApp('${l.name}')">💬 Launch Chat</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()">Close</button>
  `;

  openModal();
}

function showStoreAudit(name) {
  const lead = LEADS_DATA.find(l => l.name === name);
  if (!lead) return;
  document.getElementById('modalTitle').textContent = `🔍 Deep Store Audit — ${lead.name}`;
  document.getElementById('modalBody').innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div class="info-row"><div class="info-label">Business Name</div><div class="info-value"><strong>${lead.name}</strong></div></div>
      <div class="info-row"><div class="info-label">Location</div><div class="info-value">${lead.flag} ${lead.city}</div></div>
      <div class="info-row"><div class="info-label">Business Type</div><div class="info-value"><span class="pill pill-blue">${lead.typeName}</span></div></div>
      <div class="info-row"><div class="info-label">Craft Specialization</div><div class="info-value"><span class="pill pill-gold">${lead.craftName}</span></div></div>
      <div class="info-row"><div class="info-label">Sourcing Channel</div><div class="info-value">${lead.channel}</div></div>
      <div class="info-row"><div class="info-label">Est. Annual Volume</div><div class="info-value" style="color: var(--success); font-weight: 700;">${lead.volume}</div></div>
      <div class="info-row"><div class="info-label">0 MOQ Compatible</div><div class="info-value">${lead.moq ? '<span class="moq-badge moq-yes">✓ YES</span>' : '<span class="moq-badge moq-no">✗ Requires MOQ</span>'}</div></div>
      <div style="padding: 1rem; background: rgba(30,58,138,0.1); border: 1px solid rgba(30,58,138,0.2); border-radius: var(--radius-md);">
        <h4 style="font-size: 0.78rem; color: var(--majorelle-light); margin-bottom: 0.5rem;">🤖 AI Market Intelligence</h4>
        <p style="font-size: 0.72rem; color: var(--slate-400); line-height: 1.6;">
          Analysis indicates <strong style="color: var(--slate-300);">${lead.name}</strong> has shown consistent growth in ${lead.craftName.toLowerCase()} sourcing over the past 18 months.
          Their ${lead.channel.toLowerCase()} channel presence suggests ${lead.moq ? 'an ideal 0-MOQ sample introduction strategy' : 'a bulk wholesale partnership opportunity'}.
          Recommended approach: ${lead.moq ? 'Send curated 3-5 piece sample pack with personalized lookbook.' : 'Propose container-level partnership with custom branding options.'}
        </p>
      </div>
    </div>
  `;
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()">Close</button>
    <button class="btn btn-mass-pitch" onclick="closeModal(); openSinglePitchModal('${lead.name}')">📦 Launch Pitch</button>
    <button class="btn btn-primary" onclick="closeModal(); showToast('Outreach sequence initiated for ${lead.name}', 'success')">🚀 Initiate Outreach</button>
  `;
  openModal();
}
// ═══════════════════════════════════════════════════════════
// TAB 2: AI AGENT WORKSPACE & WAR ROOM ("Slack for Artisans")
// ═══════════════════════════════════════════════════════════

const SLACK_AGENTS = {
  'Manager-Hassan-Bot': {
    name: 'Manager-Hassan-Bot',
    role: 'Master Orchestrator',
    avatar: '👑',
    color: '#D97706',
    bg: 'linear-gradient(135deg, #1E3A8A, #D97706)',
    desc: 'CrewAI + LangGraph Supervisor coordinating 5 specialized sub-agents and HITL signoffs.',
    model: 'Gemini 1.5 Pro / LangGraph Swarm',
    status: 'online'
  },
  'Leads-Scraper': {
    name: 'Leads-Scraper',
    role: 'Prospecting Specialist',
    avatar: '🔍',
    color: '#3B82F6',
    bg: 'rgba(30, 58, 138, 0.5)',
    desc: 'Scrapes Google Places, Faire, Ankorstore, and Etsy across FR, UK, ES, USA, AU.',
    model: 'Playwright + Regex Intelligence',
    status: 'online'
  },
  'Multilingual-Pitcher': {
    name: 'Multilingual-Pitcher',
    role: 'FR/EN/ES Copywriter',
    avatar: '✍️',
    color: '#F59E0B',
    bg: 'rgba(217, 119, 6, 0.5)',
    desc: 'Drafts bespoke 0-MOQ introductions and wholesale lookbooks tailored to local buyer personas.',
    model: 'Claude 3.5 Sonnet / Multi-Lingual Prompt Matrix',
    status: 'online'
  },
  'QC-Approver': {
    name: 'QC-Approver',
    role: 'Brand Voice & Accuracy',
    avatar: '🛡️',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.5)',
    desc: 'Audits pricing margins, authenticity tags, and Moroccan artisan heritage compliance.',
    model: 'LLM Evaluator + Margin Constraint Rules',
    status: 'online'
  },
  'Legal-Billing': {
    name: 'Legal-Billing',
    role: 'Auto-Entrepreneur & Tax',
    avatar: '⚖️',
    color: '#EA580C',
    bg: 'rgba(194, 65, 12, 0.5)',
    desc: 'Generates official Pro Forma invoices with Moroccan ICE/RIB, tax exonerations, and Incoterms.',
    model: 'Deterministic Tax Engine + PDF Generator',
    status: 'online'
  },
  'Freight-Logistics': {
    name: 'Freight-Logistics',
    role: 'DHL & Maritime Freight',
    avatar: '🚢',
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.5)',
    desc: 'Calculates real-time volumetric freight rates, customs duties, and door-to-door transit times.',
    model: 'DHL Express API + Casablanca/Tanger Port Rates',
    status: 'online'
  }
};

const SLACK_CHANNELS = {
  'all-hands-strategy': {
    name: 'all-hands-strategy',
    icon: '#',
    pill: 'Coordination Hub',
    desc: 'Manager status board & cross-agent synchronization across all export pipelines'
  },
  'leads-radar': {
    name: 'leads-radar',
    icon: '#',
    pill: 'Prospecting Feed',
    desc: 'Live scraping telemetry & enriched buyer leads across FR, UK, ES, USA, AU'
  },
  'email-outreach-studio': {
    name: 'email-outreach-studio',
    icon: '#',
    pill: 'Outreach & Cold Email',
    desc: 'Cold email dispatch logs, personalized previews & live open/reply telemetry'
  },
  'approvals-queue': {
    name: 'approvals-queue',
    icon: '#',
    pill: 'HITL Signoff Queue',
    desc: 'Human-in-the-Loop approval cards for custom pitches, discounts, and high-value orders'
  },
  'invoicing-export-desk': {
    name: 'invoicing-export-desk',
    icon: '#',
    pill: 'Facturation & Finance',
    desc: 'Pro Forma generation, Moroccan Auto-entrepreneur compliance & RIB/SWIFT tracking'
  }
};

let currentSlackTarget = { type: 'channel', id: 'all-hands-strategy' };

// HITL Pending Queue
let HITL_ITEMS = [
  {
    id: 'hitl-1',
    buyer: 'Maison Bohème',
    city: 'Le Marais, Paris',
    flag: '🇫🇷',
    craft: 'Rugs & Kilims',
    type: 'French 0-MOQ Discovery Pitch',
    summary: 'Personalized French pitch offering 0-MOQ sample pack (2 Beni Ourain + 2 Azilal) with workshop direct pricing.',
    status: 'pending',
    agent: 'Multilingual-Pitcher',
    qcScore: '99.4%',
    date: 'Today 18:24'
  },
  {
    id: 'hitl-2',
    buyer: 'Casa Étnica Madrid',
    city: 'Gràcia, Barcelona',
    flag: '🇪🇸',
    craft: 'Tamegroute Ceramics',
    type: '15% Volume Discount Authorization',
    summary: 'Buyer requested 15% discount for 20 handcrafted green Tamegroute pottery pieces. Net margin remains at 46%.',
    status: 'pending',
    agent: 'Legal-Billing',
    qcScore: '98.8%',
    date: 'Today 18:15'
  }
];

// Initial Messages Store
let SLACK_MESSAGES = {
  'all-hands-strategy': [
    {
      id: 'msg-s1',
      sender: 'Manager-Hassan-Bot',
      time: '18:10',
      text: 'Salam Team! 🌟 Autonomous Sprint 12 is underway. Our objective: Expand 0-MOQ sample pack adoption across French & UK concept stores while preparing wholesale quotes for Spanish retail partners.',
      handoff: null,
      actionCard: null
    },
    {
      id: 'msg-s2',
      sender: 'Leads-Scraper',
      time: '18:12',
      text: '📡 Prospecting update: Discovered 18 qualified boutique buyers across Paris (Marais), London (Shoreditch), Madrid, and Byron Bay. All profiles are enriched with craft focus, estimated volume, and MOQ compatibility.',
      handoff: null,
      actionCard: null
    },
    {
      id: 'msg-s3',
      sender: 'Manager-Hassan-Bot',
      time: '18:15',
      text: '@Multilingual-Pitcher, please take the Paris leads and generate localized French 0-MOQ discovery introductions. Pass drafts to @QC-Approver before human signoff.',
      handoff: {
        title: '⚡ Autonomous Agent-to-Agent Handoff Chain: Paris Concept Store Flow',
        steps: [
          { agent: 'Leads-Scraper', badge: '1. Discovery', text: 'Identified "Maison Bohème" (Paris) — High fit for Beni Ourain rugs.', status: 'done' },
          { agent: 'Multilingual-Pitcher', badge: '2. Localization', text: 'Drafted tailored French intro highlighting 0 MOQ & DHL Express.', status: 'done' },
          { agent: 'QC-Approver', badge: '3. Brand Audit', text: 'Audited copy & artisan heritage compliance. Score: 99.4/100.', status: 'done' },
          { agent: 'Manager-Hassan-Bot', badge: '4. HITL Request', text: 'Queued card in #approvals-queue for Hassan Tiguidda signoff.', status: 'active' }
        ]
      },
      actionCard: null
    }
  ],

  'leads-radar': [
    {
      id: 'msg-l1',
      sender: 'Leads-Scraper',
      time: '18:05',
      text: '🎯 Live Prospecting Stream — 5 Global Markets:\n• 🇫🇷 France: 3 verified buyers (Maison Bohème, Côté Sud, L\'Atelier du Maroc)\n• 🇬🇧 UK: 3 verified buyers (East London Artisan, Bohemia Home, The Souk Garden)\n• 🇪🇸 Spain: 3 verified buyers (Casa Étnica, Rincón Bereber, Deco Mediterráneo)\n• 🇺🇸 USA: 4 verified buyers (Brooklyn Artisan, Soho Interiors, Desert Modern, Faire Hub)\n• 🇦🇺 Australia: 3 verified buyers (Byron Bay Living, Coastal Nomad, Melbourne Hub)',
      handoff: null,
      actionCard: {
        id: 'card-scrape-1',
        title: '📊 Scraped Target: Maison Bohème (Paris)',
        chips: ['🇫🇷 France', 'Concept Store', 'Rugs & Kilims', 'Vol: €45K/yr', '0 MOQ: YES'],
        summary: 'Specializes in bohemian Moroccan aesthetics. Currently sourcing through intermediaries at high markup.',
        actionType: 'scrapeAction'
      }
    }
  ],

  'email-outreach-studio': [
    {
      id: 'msg-e1',
      sender: 'Multilingual-Pitcher',
      time: '18:18',
      text: '✉️ Cold Email Dispatch Log — Active Campaign: "Spring 2026 Direct Atelier Intro"\n• Total Sequences Active: 342\n• Average Open Rate: 68.4% (Industry Avg: 21.5%)\n• Direct Reply / Sample Request Rate: 14.2%\n• Languages Generated: Français (38%), English (42%), Español (20%)',
      handoff: null,
      actionCard: null
    }
  ],

  'approvals-queue': [
    {
      id: 'msg-a1',
      sender: 'QC-Approver',
      time: '18:20',
      text: '🛡️ @Hassan Tiguidda — 2 Human-in-the-Loop approval requests require your review before dispatch. Please verify pricing terms and customer discounts below:',
      handoff: null,
      actionCard: {
        id: 'hitl-1',
        title: '🇫🇷 French 0-MOQ Pitch — Maison Bohème (Paris)',
        chips: ['French Localization', '0 MOQ Sample Pack', 'Beni Ourain Rugs', 'QC Score: 99.4%'],
        summary: 'Subject: Collection Artisanale Marrakech — 0 Minimum de Commande pour Maison Bohème\nPricing: Direct Workshop rates with 3-5 day DHL door delivery.',
        isApproval: true,
        recipient: 'Maison Bohème'
      }
    },
    {
      id: 'msg-a2',
      sender: 'Legal-Billing',
      time: '18:22',
      text: '⚖️ Facturation notice: Discount authorization request for Spanish partner.',
      handoff: null,
      actionCard: {
        id: 'hitl-2',
        title: '🇪🇸 Volume Discount Authorization — Casa Étnica Madrid',
        chips: ['Spain', '20 Tamegroute Vases', 'Requested Discount: 15%', 'Net Margin: 46%'],
        summary: 'Buyer requested volume incentive on wholesale ceramics. Auto-entrepreneur tax exoneration compliant.',
        isApproval: true,
        recipient: 'Casa Étnica Madrid'
      }
    }
  ],

  'invoicing-export-desk': [
    {
      id: 'msg-i1',
      sender: 'Legal-Billing',
      time: '18:25',
      text: '📑 Moroccan Auto-Entrepreneur Export Facturation Desk:\n• Auto-Entrepreneur Identifier (ICE): 003489120000084\n• Tax Exoneration: Article 6-I-A-1° of General Tax Code (0% VAT Export)\n• Direct Bank Wire (RIB): 011 780 0000 123456789012 45 (BMCE Bank of Africa)\n• SWIFT / BIC: BMCEMAMC\n• Payment Gateway: Stripe Checkout (Multi-currency USD, EUR, GBP, AUD)',
      handoff: null,
      actionCard: {
        id: 'card-proforma-demo',
        title: '📄 Pro Forma Invoice #MCC-2026-089 — 10 Beni Ourain Rugs',
        chips: ['Madrid, Spain', '10 Units', 'Total: €3,200.00', 'Incoterm: DAP Madrid'],
        summary: 'Pro Forma prepared for Casa Étnica Madrid. Includes Certificate of Origin & DHL Express tracking.',
        actionType: 'proFormaDemo'
      }
    }
  ],

  // Direct Messages
  'Manager-Hassan-Bot': [
    {
      id: 'dm-m1',
      sender: 'Manager-Hassan-Bot',
      time: '18:00',
      text: 'Salam Hassan! I am your AI Master Orchestrator. I coordinate the prospecting, copywriting, quality control, facturation, and logistics agents. What would you like to run today? You can ask me to coordinate a new market campaign or check pipeline health.',
      handoff: null,
      actionCard: null
    }
  ],

  'Leads-Scraper': [
    {
      id: 'dm-ls1',
      sender: 'Leads-Scraper',
      time: '18:02',
      text: '🔍 Prospecting Specialist ready. I can scan Google Maps, Faire wholesale, and boutique directories across Paris, London, Madrid, NYC, and Australia. Type a prompt like "@Leads-Scraper scan Paris stores" to trigger live scraping.',
      handoff: null,
      actionCard: null
    }
  ],

  'Multilingual-Pitcher': [
    {
      id: 'dm-mp1',
      sender: 'Multilingual-Pitcher',
      time: '18:04',
      text: '✍️ Bonjour / Hello / ¡Hola! I craft tailored cold outreach messages in native French, English, or Spanish, highlighting our zero-minimum-order (0 MOQ) flexibility and master artisan provenance.',
      handoff: null,
      actionCard: null
    }
  ],

  'QC-Approver': [
    {
      id: 'dm-qc1',
      sender: 'QC-Approver',
      time: '18:06',
      text: '🛡️ Quality Control & Brand Voice Agent online. I audit every pitch for pricing accuracy, tone elegance, Moroccan cultural authenticity, and margin safety before routing to your approval.',
      handoff: null,
      actionCard: null
    }
  ],

  'Legal-Billing': [
    {
      id: 'dm-lb1',
      sender: 'Legal-Billing',
      time: '18:08',
      text: '⚖️ Facturation & Export Compliance Agent ready. I can generate compliant Pro Forma invoices, calculate export duty exemptions (0% VAT Export), and manage RIB / SWIFT payment tracking.',
      handoff: null,
      actionCard: null
    }
  ],

  'Freight-Logistics': [
    {
      id: 'dm-fl1',
      sender: 'Freight-Logistics',
      time: '18:09',
      text: '🚢 DHL Express & Maritime Freight Calculator ready. I calculate real-time volumetric weight, express air freight (3-5 days), ocean LCL/FCL via Casablanca & Tanger Med, and estimated landed costs.',
      handoff: null,
      actionCard: null
    }
  ]
};

// ── SLACK WAR ROOM INITIALIZER & RENDERERS ──

function initSlackWarRoom() {
  renderSlackSidebar();
  renderSlackFeed();
  renderHitlDrawer();
}

function renderSlackSidebar() {
  // Update approvals badge
  const pendingCount = HITL_ITEMS.filter(item => item.status === 'pending').length;
  const approvalsBadge = document.getElementById('approvalsBadge');
  if (approvalsBadge) {
    approvalsBadge.textContent = pendingCount;
    if (pendingCount === 0) {
      approvalsBadge.style.display = 'none';
    } else {
      approvalsBadge.style.display = 'inline-block';
    }
  }

  const warRoomBadge = document.getElementById('warRoomBadge');
  if (warRoomBadge) {
    warRoomBadge.textContent = pendingCount;
  }

  const drawerPendingCount = document.getElementById('drawerPendingCount');
  if (drawerPendingCount) {
    drawerPendingCount.textContent = `${pendingCount} Pending Review`;
    drawerPendingCount.style.color = pendingCount > 0 ? 'var(--warning)' : 'var(--success)';
  }
}

function switchSlackTarget(type, id) {
  currentSlackTarget = { type, id };

  // Update active state in sidebar
  document.querySelectorAll('.slack-nav-item').forEach(btn => {
    if (btn.dataset.target === id) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update header
  const iconEl = document.getElementById('chatTargetIcon');
  const nameEl = document.getElementById('chatTargetName');
  const pillEl = document.getElementById('chatTargetPill');
  const descEl = document.getElementById('chatTargetDesc');
  const inputEl = document.getElementById('slackInputBox');

  if (type === 'channel') {
    const chan = SLACK_CHANNELS[id] || { name: id, icon: '#', pill: 'Channel', desc: '' };
    if (iconEl) iconEl.textContent = '#';
    if (nameEl) nameEl.textContent = chan.name;
    if (pillEl) pillEl.textContent = chan.pill;
    if (descEl) descEl.textContent = chan.desc;
    if (inputEl) inputEl.placeholder = `Message #${chan.name} or type @ to mention an agent...`;
  } else {
    const agent = SLACK_AGENTS[id] || { name: id, avatar: '🤖', role: 'Agent', desc: '' };
    if (iconEl) iconEl.textContent = agent.avatar;
    if (nameEl) nameEl.textContent = `@${agent.name}`;
    if (pillEl) pillEl.textContent = agent.role;
    if (descEl) descEl.textContent = `${agent.desc} (Model: ${agent.model})`;
    if (inputEl) inputEl.placeholder = `Direct message @${agent.name}...`;
  }

  renderSlackFeed();
}

function renderSlackFeed() {
  const wrap = document.getElementById('slackMessagesWrap');
  if (!wrap) return;

  const messages = SLACK_MESSAGES[currentSlackTarget.id] || [];

  if (messages.length === 0) {
    wrap.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--slate-500);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">💬</div>
        <div style="font-size: 0.85rem; font-weight: 600; color: var(--slate-300);">This is the start of #${currentSlackTarget.id}</div>
        <p style="font-size: 0.72rem; margin-top: 0.25rem;">Type a message below or use @ to prompt any AI agent.</p>
      </div>
    `;
    return;
  }

  wrap.innerHTML = messages.map(msg => {
    const agent = SLACK_AGENTS[msg.sender] || {
      name: msg.sender,
      avatar: msg.sender === 'Hassan Tiguidda (You)' ? '👤' : '🤖',
      role: msg.sender === 'Hassan Tiguidda (You)' ? 'Artisan Director' : 'Agent',
      color: '#3B82F6',
      bg: 'rgba(30, 58, 138, 0.4)'
    };

    // Format text with highlights on mentions
    let formattedText = msg.text.replace(/(@[a-zA-Z0-9\-_]+)/g, '<span class="agent-mention">$1</span>');

    // Handoff Block
    let handoffHtml = '';
    if (msg.handoff) {
      handoffHtml = `
        <div class="slack-handoff-thread">
          <div class="handoff-header">
            <span>${msg.handoff.title}</span>
            <span class="pill pill-gold" style="font-size: 0.6rem;">Autonomous DAG</span>
          </div>
          <div class="handoff-chain-steps">
            ${msg.handoff.steps.map(s => {
              const stepAgent = SLACK_AGENTS[s.agent] || { avatar: '🤖' };
              return `
                <div class="handoff-step">
                  <span class="handoff-step-badge ${s.status === 'done' ? 'pill-green' : s.status === 'active' ? 'pill-gold' : 'pill-slate'}">
                    ${stepAgent.avatar} ${s.badge}
                  </span>
                  <div style="flex: 1; color: var(--slate-300);">
                    <strong>@${s.agent}</strong>: ${s.text}
                  </div>
                  <span>${s.status === 'done' ? '✅' : '⏳'}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Action Card Block
    let cardHtml = '';
    if (msg.actionCard) {
      const card = msg.actionCard;
      const isApproved = card.isApproval && HITL_ITEMS.find(h => h.id === card.id && h.status === 'approved');

      cardHtml = `
        <div class="slack-action-card ${isApproved ? 'card-approved' : ''}" id="feed-card-${card.id}">
          <div class="card-top-row">
            <div class="card-title-text">
              <span>${card.title}</span>
              ${isApproved ? '<span class="pill pill-green" style="font-size: 0.6rem;">✓ APPROVED & DISPATCHED</span>' : ''}
            </div>
          </div>
          <div class="card-meta-chips">
            ${card.chips.map(chip => `<span class="meta-chip">${chip}</span>`).join('')}
          </div>
          <p style="font-size: 0.72rem; color: var(--slate-400); margin: 0.4rem 0; line-height: 1.5;">${card.summary}</p>
          <div class="card-action-bar">
            ${card.isApproval ? (
              isApproved ? `
                <button class="btn-card-action btn-action-secondary" disabled>✓ Approved by Hassan Tiguidda</button>
                <button class="btn-card-action btn-action-freight" onclick="calculateLandedCost('${card.recipient}', 'Rugs', 4)">📦 Calculate Landed Cost</button>
              ` : `
                <button class="btn-card-action btn-action-approve" onclick="approvePitch('${card.id}', '${card.recipient}')">✅ Approve Pitch</button>
                <button class="btn-card-action btn-action-proforma" onclick="generateProFormaPdf('${card.id}')">📄 Generate Pro Forma PDF</button>
                <button class="btn-card-action btn-action-freight" onclick="calculateLandedCost('${card.recipient}', 'Rugs', 4)">📦 Calculate Landed Cost</button>
              `
            ) : card.actionType === 'proFormaDemo' ? `
              <button class="btn-card-action btn-action-proforma" onclick="generateProFormaPdf('demo')">📄 Generate Pro Forma PDF</button>
              <button class="btn-card-action btn-action-freight" onclick="calculateLandedCost('Madrid', 'Rugs', 10)">📦 Calculate Landed Cost</button>
              <button class="btn-card-action btn-action-secondary" onclick="copyMoroccanRib()">💳 Copy Moroccan RIB / SWIFT</button>
            ` : `
              <button class="btn-card-action btn-action-approve" onclick="openSinglePitchModal('Maison Bohème')">📦 Launch Pitch</button>
              <button class="btn-card-action btn-action-freight" onclick="calculateLandedCost('Paris', 'Rugs', 4)">📦 Landed Cost</button>
            `}
          </div>
        </div>
      `;
    }

    return `
      <div class="slack-msg" id="${msg.id}">
        <div class="slack-msg-avatar" style="background: ${agent.bg};">
          ${agent.avatar}
        </div>
        <div class="slack-msg-body">
          <div class="slack-msg-header">
            <span class="slack-author-name">${agent.name}</span>
            <span class="slack-role-tag pill pill-blue" style="font-size: 0.6rem;">${agent.role}</span>
            <span class="slack-msg-time">${msg.time}</span>
          </div>
          <div class="slack-msg-text">${formattedText}</div>
          ${handoffHtml}
          ${cardHtml}
        </div>
      </div>
    `;
  }).join('');

  // Scroll to bottom
  const scrollEl = document.getElementById('slackFeedScroll');
  if (scrollEl) {
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }
}

function renderHitlDrawer() {
  const container = document.getElementById('hitlQueueItems');
  if (!container) return;

  container.innerHTML = HITL_ITEMS.map(item => {
    const isApproved = item.status === 'approved';
    return `
      <div class="hitl-card ${isApproved ? 'approved' : ''}" id="hitl-drawer-${item.id}">
        <div class="hitl-card-title">
          <span>${item.flag} ${item.buyer}</span>
          <span class="pill ${isApproved ? 'pill-green' : 'pill-gold'}" style="font-size: 0.58rem;">
            ${isApproved ? 'APPROVED' : 'PENDING'}
          </span>
        </div>
        <div class="hitl-card-desc">
          ${item.type} • <span style="color: var(--saffron-light);">${item.craft}</span>
        </div>
        <p style="font-size: 0.68rem; color: var(--slate-400); margin: 0.2rem 0;">${item.summary}</p>
        <div class="hitl-btn-row">
          ${isApproved ? `
            <span style="font-size: 0.68rem; color: var(--success); font-weight: 600;">✓ Dispatched via SMTP</span>
          ` : `
            <button class="btn btn-sm btn-success" style="padding: 0.2rem 0.5rem; font-size: 0.68rem;" onclick="approvePitch('${item.id}', '${item.buyer}')">✅ Approve</button>
            <button class="btn btn-sm btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.68rem;" onclick="generateProFormaPdf('${item.id}')">📄 Pro Forma</button>
          `}
        </div>
      </div>
    `;
  }).join('');

  renderSlackSidebar();
}

// ── ACTION HANDLERS: APPROVE, PRO FORMA, LANDED COST ──

function approvePitch(hitlId, recipient) {
  const item = HITL_ITEMS.find(h => h.id === hitlId);
  if (item) {
    item.status = 'approved';
  }

  // Update LangGraph node state
  const hitlNode = document.getElementById('node-hitl');
  if (hitlNode) {
    hitlNode.className = 'langgraph-node completed';
    hitlNode.innerHTML = `<span class="node-icon">👤</span><span class="node-name">4. HITL Signoff</span><span class="node-check">✓</span>`;
  }
  const dispatchNode = document.getElementById('node-dispatch');
  if (dispatchNode) {
    dispatchNode.className = 'langgraph-node active-pulse';
    dispatchNode.innerHTML = `<span class="node-icon">🚀</span><span class="node-name">5. Export & Billing</span><span class="node-status-chip">DISPATCHING</span>`;
  }

  // Post confirmation message from QC-Approver in the current channel
  const now = new Date();
  const time = now.toTimeString().substring(0, 5);
  
  if (!SLACK_MESSAGES[currentSlackTarget.id]) {
    SLACK_MESSAGES[currentSlackTarget.id] = [];
  }

  SLACK_MESSAGES[currentSlackTarget.id].push({
    id: `msg-${Date.now()}`,
    sender: 'QC-Approver',
    time: time,
    text: `✅ HITL Signoff Confirmed: Pitch for "${recipient}" approved by Hassan Tiguidda. Automated SMTP dispatch sequence executed. Status updated across LangGraph swarm.`,
    handoff: null,
    actionCard: null
  });

  renderHitlDrawer();
  renderSlackFeed();
  showToast(`✅ Pitch approved & dispatched to ${recipient}!`, 'success');
}

function generateProFormaPdf(quoteId) {
  document.getElementById('modalTitle').textContent = `📄 Official Pro Forma Export Invoice — MARRAKECH CRAFT CONDUIT`;
  document.getElementById('modalBody').innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.1rem; font-family: var(--font-body);">
      <!-- Invoice Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 1rem; border-bottom: 1px solid var(--border-subtle);">
        <div>
          <h3 style="font-family: var(--font-display); color: var(--saffron-light); font-size: 1.1rem;">MARRAKECH CRAFT CONDUIT</h3>
          <p style="font-size: 0.72rem; color: var(--slate-400);">Artisan Atelier & Export Engine — Marrakech Medina, Morocco</p>
          <p style="font-size: 0.7rem; color: var(--slate-500); margin-top: 0.2rem;">
            <strong>ICE:</strong> 003489120000084 | <strong>Tax Code:</strong> Auto-Entrepreneur Export Direct (0% VAT Export)
          </p>
        </div>
        <div style="text-align: right;">
          <div class="pill pill-gold" style="font-size: 0.72rem; font-weight: 700;">PRO FORMA #MCC-2026-089</div>
          <div style="font-size: 0.7rem; color: var(--slate-400); margin-top: 0.3rem;">Date: ${new Date().toLocaleDateString()}</div>
          <div style="font-size: 0.7rem; color: var(--slate-400);">Validity: 30 Days | Incoterm: DAP</div>
        </div>
      </div>

      <!-- Buyer & Artisan Details -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 0.8rem; background: rgba(15, 23, 42, 0.7); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <div>
          <span style="font-size: 0.65rem; color: var(--slate-500); font-weight: 700; text-transform: uppercase;">EXPORTER / ATELIER</span>
          <div style="font-size: 0.78rem; font-weight: 700; color: #fff; margin-top: 0.2rem;">Hassan Tiguidda</div>
          <div style="font-size: 0.72rem; color: var(--slate-300);">Derb Dabachi, Medina, Marrakech, Morocco</div>
          <div style="font-size: 0.72rem; color: var(--slate-300);">WhatsApp: +212 632 155 430 | Email: tiguidda76@gmail.com</div>
        </div>
        <div>
          <span style="font-size: 0.65rem; color: var(--slate-500); font-weight: 700; text-transform: uppercase;">BILL TO / CONSIGNEE</span>
          <div style="font-size: 0.78rem; font-weight: 700; color: #fff; margin-top: 0.2rem;">Casa Étnica Madrid / Concept Store</div>
          <div style="font-size: 0.72rem; color: var(--slate-300);">Calle de Gràcia 42, Madrid / Barcelona, Spain</div>
          <div style="font-size: 0.72rem; color: var(--slate-300);">VAT / CIF: ES-B88491203</div>
        </div>
      </div>

      <!-- Line Items Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--slate-400); text-align: left;">
            <th style="padding: 0.5rem 0.3rem;">Item Description</th>
            <th style="padding: 0.5rem 0.3rem; text-align: center;">HS Code</th>
            <th style="padding: 0.5rem 0.3rem; text-align: center;">Qty</th>
            <th style="padding: 0.5rem 0.3rem; text-align: right;">Unit (EUR)</th>
            <th style="padding: 0.5rem 0.3rem; text-align: right;">Total (EUR)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(51, 65, 85, 0.3);">
            <td style="padding: 0.6rem 0.3rem;">
              <strong>Handmade Beni Ourain Wool Rug</strong><br>
              <small style="color: var(--slate-400);">100% High Atlas Virgin Wool (200 × 300 cm), Ivory & Charcoal</small>
            </td>
            <td style="text-align: center; font-family: var(--font-mono); color: var(--slate-400);">5701.10</td>
            <td style="text-align: center;">6</td>
            <td style="text-align: right; font-family: var(--font-mono);">€320.00</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 700;">€1,920.00</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(51, 65, 85, 0.3);">
            <td style="padding: 0.6rem 0.3rem;">
              <strong>Tamegroute Green Glazed Pottery Vases</strong><br>
              <small style="color: var(--slate-400);">Hand-thrown terracotta with manganese/copper oxide glaze (H: 35cm)</small>
            </td>
            <td style="text-align: center; font-family: var(--font-mono); color: var(--slate-400);">6912.00</td>
            <td style="text-align: center;">20</td>
            <td style="text-align: right; font-family: var(--font-mono);">€38.00</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 700;">€760.00</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(51, 65, 85, 0.3);">
            <td style="padding: 0.6rem 0.3rem;">
              <strong>DHL Express Door-to-Door Air Freight</strong><br>
              <small style="color: var(--slate-400);">Marrakech RAK → Madrid MAD (3-5 business days) with full tracking</small>
            </td>
            <td style="text-align: center; font-family: var(--font-mono); color: var(--slate-400);">-</td>
            <td style="text-align: center;">1</td>
            <td style="text-align: right; font-family: var(--font-mono);">€240.00</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 700;">€240.00</td>
          </tr>
        </tbody>
      </table>

      <!-- Total & Payment Details -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 0.8rem; background: rgba(30, 58, 138, 0.15); border: 1px solid rgba(30, 58, 138, 0.3); border-radius: var(--radius-sm);">
        <div style="font-size: 0.72rem; color: var(--slate-300); line-height: 1.6;">
          <strong style="color: var(--saffron-light);">Bank Settlement Details (Moroccan RIB):</strong><br>
          Bank: BMCE Bank of Africa (Marrakech Gueliz Branch)<br>
          RIB: <code>011 780 0000 123456789012 45</code> | SWIFT: <code>BMCEMAMC</code><br>
          Payment Terms: 50% Advance on order, 50% upon DHL tracking dispatch.
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.72rem; color: var(--slate-400);">Subtotal: €2,680.00</div>
          <div style="font-size: 0.72rem; color: var(--slate-400);">Shipping & Customs Doc: €240.00</div>
          <div style="font-size: 0.72rem; color: var(--success);">VAT Export (Art. 6-I-A-1°): €0.00 (Exonerated)</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--saffron-light); margin-top: 0.4rem;">
            Total: €2,920.00 EUR
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()">Close</button>
    <button class="btn btn-gold" onclick="showToast('Pro Forma PDF downloaded', 'success'); closeModal();">💾 Download PDF</button>
    <button class="btn btn-primary" onclick="showToast('Pro Forma dispatched to buyer email & WhatsApp', 'success'); closeModal();">🚀 Dispatch to Client</button>
  `;

  openModal();
}

function calculateLandedCost(destination, craft, quantity = 4) {
  const destName = destination || 'Paris / London / Madrid';
  const craftName = craft || 'Beni Ourain Rugs';
  const qty = parseInt(quantity) || 4;

  const basePricePerUnit = 280; // USD / EUR
  const totalBase = basePricePerUnit * qty;
  const dhlAirCost = 180 + (qty * 15);
  const customsDuty = totalBase * 0.045; // 4.5% EU craft tariff
  const insurance = totalBase * 0.015;
  const totalLanded = totalBase + dhlAirCost + customsDuty + insurance;
  const landedPerUnit = (totalLanded / qty).toFixed(2);

  document.getElementById('modalTitle').textContent = `📦 Landed Cost & Freight Optimizer — ${destName}`;
  document.getElementById('modalBody').innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="padding: 0.9rem; background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: var(--radius-md);">
        <h4 style="color: #22D3EE; font-size: 0.82rem; margin-bottom: 0.3rem;">🚢 Freight Agent Calculation: Marrakech ➔ ${destName}</h4>
        <p style="font-size: 0.72rem; color: var(--slate-300);">
          Simulation based on <strong>${qty} units</strong> of handcrafted <strong>${craftName}</strong> via Express Air vs Maritime Consolidation.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <!-- Option 1: DHL Express -->
        <div style="padding: 0.9rem; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-glow); border-radius: var(--radius-md);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong style="color: var(--saffron-light); font-size: 0.8rem;">✈️ DHL Express Door-to-Door</strong>
            <span class="pill pill-gold" style="font-size: 0.6rem;">Recommended for 0-MOQ</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--slate-300); line-height: 1.7;">
            • Transit Time: <strong>3 to 5 business days</strong><br>
            • Freight Charge: <strong>€${dhlAirCost} EUR</strong><br>
            • EU/US Customs Duty (4.5%): <strong>€${customsDuty.toFixed(2)}</strong><br>
            • Marine Cargo Insurance: <strong>€${insurance.toFixed(2)}</strong><br>
            • Total Landed Cost: <strong style="color: var(--success); font-size: 0.85rem;">€${totalLanded.toFixed(2)}</strong><br>
            • Effective Landed Unit Cost: <strong style="color: var(--saffron-light);">€${landedPerUnit} / unit</strong>
          </div>
        </div>

        <!-- Option 2: Sea Freight LCL -->
        <div style="padding: 0.9rem; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong style="color: #fff; font-size: 0.8rem;">🚢 LCL Sea Freight (Tanger Med)</strong>
            <span class="pill pill-blue" style="font-size: 0.6rem;">Best for > 20 Units</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--slate-300); line-height: 1.7;">
            • Transit Time: <strong>12 to 16 business days</strong><br>
            • Ocean Freight Base: <strong>€95 EUR (Consolidated)</strong><br>
            • Port Handling & Clearance: <strong>€65 EUR</strong><br>
            • Total Landed Cost: <strong style="color: var(--success); font-size: 0.85rem;">€${(totalBase + 160 + customsDuty).toFixed(2)}</strong><br>
            • Effective Landed Unit Cost: <strong style="color: var(--saffron-light);">€${((totalBase + 160 + customsDuty) / qty).toFixed(2)} / unit</strong>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()">Close</button>
    <button class="btn btn-gold" onclick="showToast('Freight calculation copied to clipboard', 'success'); closeModal();">📋 Copy Landed Matrix</button>
  `;

  openModal();
}

function copyMoroccanRib() {
  const text = `MARRAKECH CRAFT CONDUIT — OFFICIAL SETTLEMENT DETAILS\nBeneficiary: Hassan Tiguidda\nBank: BMCE Bank of Africa\nRIB: 011 780 0000 123456789012 45\nSWIFT / BIC: BMCEMAMC\nICE: 003489120000084 (0% VAT Export Direct)\nWhatsApp: +212 632 155 430`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('💳 Official Moroccan RIB & SWIFT copied to clipboard', 'success');
  }).catch(() => {
    showToast('RIB details ready', 'info');
  });
}

// ── AUTONOMOUS HANDOFF DEMO ENGINE ──

async function triggerAutonomousHandoffDemo() {
  switchSlackTarget('channel', 'all-hands-strategy');
  showToast('⚡ Autonomous Agent-to-Agent Handoff sequence started...', 'info');

  const typingEl = document.getElementById('slackTypingIndicator');
  const typingText = document.getElementById('slackTypingText');

  // Step 1: Leads-Scraper finds a lead
  if (typingEl) {
    typingEl.style.display = 'flex';
    if (typingText) typingText.textContent = 'Leads-Scraper is searching Paris Marais boutique directory...';
  }

  await new Promise(r => setTimeout(r, 1200));

  const time1 = new Date().toTimeString().substring(0, 5);
  SLACK_MESSAGES['all-hands-strategy'].push({
    id: `demo-${Date.now()}-1`,
    sender: 'Leads-Scraper',
    time: time1,
    text: '🔍 [Step 1/4] Discovered high-affinity prospect: **"L\'Appartement Bohème" (Rue Saint-Honoré, Paris 🇫🇷)**. Curates luxury artisan homewares, 0-MOQ compatible. Sourcing potential: €38,000/yr. Tagging @Multilingual-Pitcher for French personalization.',
    handoff: null,
    actionCard: null
  });
  renderSlackFeed();

  // Step 2: Multilingual-Pitcher crafts copy
  if (typingEl) {
    typingEl.style.display = 'flex';
    if (typingText) typingText.textContent = 'Multilingual-Pitcher is drafting tailored French copy...';
  }

  await new Promise(r => setTimeout(r, 1400));

  const time2 = new Date().toTimeString().substring(0, 5);
  SLACK_MESSAGES['all-hands-strategy'].push({
    id: `demo-${Date.now()}-2`,
    sender: 'Multilingual-Pitcher',
    time: time2,
    text: '✍️ [Step 2/4] Generated bespoke French 0-MOQ discovery pack copy for L\'Appartement Bohème:\n"Bonjour, nous accompagnons les boutiques de prestige à Paris avec nos collections directes d\'atelier à Marrakech (0 MOQ, expédition DHL 3 jours, certificat d\'authenticité marocain)." Tagging @QC-Approver for brand audit.',
    handoff: null,
    actionCard: null
  });
  renderSlackFeed();

  // Step 3: QC-Approver audits
  if (typingEl) {
    typingEl.style.display = 'flex';
    if (typingText) typingText.textContent = 'QC-Approver is verifying margin safety & artisan voice...';
  }

  await new Promise(r => setTimeout(r, 1200));

  const time3 = new Date().toTimeString().substring(0, 5);
  SLACK_MESSAGES['all-hands-strategy'].push({
    id: `demo-${Date.now()}-3`,
    sender: 'QC-Approver',
    time: time3,
    text: '🛡️ [Step 3/4] Quality Control Audit Complete:\n• Tone & Elegance: 99.8%\n• Margin Compliance (Gross 52%): PASS\n• Origin Guarantee Attached: YES\nRouting to @Hassan Tiguidda for final 1-click HITL approval card below:',
    handoff: null,
    actionCard: {
      id: `hitl-demo-${Date.now()}`,
      title: '🇫🇷 French 0-MOQ Intro — L\'Appartement Bohème (Paris)',
      chips: ['Paris, France', 'Rue Saint-Honoré', 'Rugs & Brass', 'QC: 99.8% PASS'],
      summary: 'Curated 4-piece sample pack (2 Azilal rugs + 2 hammered brass lamps). Direct workshop pricing.',
      isApproval: true,
      recipient: 'L\'Appartement Bohème'
    }
  });

  if (typingEl) typingEl.style.display = 'none';

  // Increment tokens
  const tokenEl = document.getElementById('slackTokensCount');
  if (tokenEl) {
    const current = parseInt(tokenEl.textContent.replace(/,/g, '')) || 849120;
    tokenEl.textContent = (current + 2450).toLocaleString();
  }

  renderSlackFeed();
  showToast('🎉 Autonomous Handoff Complete! Approval card is ready for signoff.', 'success');
}

// ── USER INPUT & INTERACTIVE CHAT ENGINE ──

function handleSlackInputKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendSlackUserMessage();
  }
}

function handleSlackInputText(textarea) {
  const val = textarea.value;
  const popup = document.getElementById('slackMentionPopup');
  if (!popup) return;

  const cursor = textarea.selectionStart;
  const lastAt = val.lastIndexOf('@', cursor - 1);

  if (lastAt !== -1 && cursor - lastAt <= 20) {
    popup.style.display = 'block';
  } else {
    popup.style.display = 'none';
  }
}

function toggleMentionPopup() {
  const popup = document.getElementById('slackMentionPopup');
  if (!popup) return;
  popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
}

function insertMention(agentTag) {
  const input = document.getElementById('slackInputBox');
  const popup = document.getElementById('slackMentionPopup');
  if (!input) return;

  input.value += `${agentTag} `;
  input.focus();
  if (popup) popup.style.display = 'none';
}

function insertPromptQuick(text) {
  const input = document.getElementById('slackInputBox');
  if (!input) return;
  input.value = text;
  input.focus();
}

function insertEmoji(emoji) {
  const input = document.getElementById('slackInputBox');
  if (!input) return;
  input.value += emoji;
  input.focus();
}

async function sendSlackUserMessage() {
  const input = document.getElementById('slackInputBox');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const time = now.toTimeString().substring(0, 5);

  if (!SLACK_MESSAGES[currentSlackTarget.id]) {
    SLACK_MESSAGES[currentSlackTarget.id] = [];
  }

  // Add user message
  SLACK_MESSAGES[currentSlackTarget.id].push({
    id: `user-${Date.now()}`,
    sender: 'Hassan Tiguidda (You)',
    time: time,
    text: text,
    handoff: null,
    actionCard: null
  });

  input.value = '';
  const popup = document.getElementById('slackMentionPopup');
  if (popup) popup.style.display = 'none';

  renderSlackFeed();

  // Trigger automated AI agent response
  await processAgentResponseToUser(text);
}

async function processAgentResponseToUser(userText) {
  const typingEl = document.getElementById('slackTypingIndicator');
  const typingText = document.getElementById('slackTypingText');
  const lower = userText.toLowerCase();

  let targetAgent = 'Manager-Hassan-Bot';
  if (lower.includes('@legal-billing') || lower.includes('quote') || lower.includes('invoice') || lower.includes('pro forma') || lower.includes('rib') || lower.includes('tax')) {
    targetAgent = 'Legal-Billing';
  } else if (lower.includes('@freight-logistics') || lower.includes('freight') || lower.includes('dhl') || lower.includes('sea') || lower.includes('shipping') || lower.includes('cost')) {
    targetAgent = 'Freight-Logistics';
  } else if (lower.includes('@leads-scraper') || lower.includes('scrape') || lower.includes('prospect') || lower.includes('stores') || lower.includes('find')) {
    targetAgent = 'Leads-Scraper';
  } else if (lower.includes('@multilingual-pitcher') || lower.includes('pitch') || lower.includes('french') || lower.includes('spanish') || lower.includes('email')) {
    targetAgent = 'Multilingual-Pitcher';
  } else if (lower.includes('@qc-approver') || lower.includes('audit') || lower.includes('qc') || lower.includes('check')) {
    targetAgent = 'QC-Approver';
  } else if (currentSlackTarget.type === 'dm') {
    targetAgent = currentSlackTarget.id;
  }

  const agentObj = SLACK_AGENTS[targetAgent] || SLACK_AGENTS['Manager-Hassan-Bot'];

  if (typingEl) {
    typingEl.style.display = 'flex';
    if (typingText) typingText.textContent = `${agentObj.name} is formulating response...`;
  }

  await new Promise(r => setTimeout(r, 1100));

  const time = new Date().toTimeString().substring(0, 5);
  let responseText = '';
  let actionCard = null;

  if (targetAgent === 'Legal-Billing') {
    responseText = `⚖️ Official Quote Generated for 10 Handcrafted Beni Ourain Rugs (Morocco ➔ Madrid, Spain):\n• Workshop Base (10 units): €2,400.00 EUR\n• Packaging & Certificate of Origin: €60.00 EUR\n• DHL Express Door-to-Door: €280.00 EUR\n• Total Export Amount: **€2,740.00 EUR** (0% VAT Export Exonerated).`;
    actionCard = {
      id: `quote-${Date.now()}`,
      title: '📄 Generated Quote: 10 Beni Ourain Rugs to Madrid',
      chips: ['Madrid, Spain', '10 Rugs', '€2,740.00 Total', '0% VAT Export'],
      summary: 'Prepared under Auto-entrepreneur ICE: 003489120000084 with BMCE Bank wire RIB instructions.',
      actionType: 'proFormaDemo'
    };
  } else if (targetAgent === 'Freight-Logistics') {
    responseText = `🚢 Landed cost analysis for London shipment:\n• **DHL Express Air**: €185 EUR (3-5 days delivery)\n• **LCL Sea Freight via Tanger Med**: €85 EUR (14 days)\n• UK Import Duty (HS 6912.00): 4% (£32.00)\nRecommendation: For 0-MOQ test orders under 15kg, DHL Express guarantees customer satisfaction.`;
    actionCard = {
      id: `freight-${Date.now()}`,
      title: '📦 Freight Matrix: Marrakech ➔ London',
      chips: ['London, UK', 'Express vs Sea', 'HS 6912.00', '3-5 Days Air'],
      summary: 'Landed cost per unit is optimized with express air freight for sample batches.',
      actionType: 'scrapeAction'
    };
  } else if (targetAgent === 'Leads-Scraper') {
    responseText = `🔍 Scrape complete: Scanned 14 independent homeware boutiques in Paris Marais & Saint-Germain. Identified 3 top tier targets with 0-MOQ compatibility. Enriched with verified Instagram handles and wholesale emails.`;
  } else if (targetAgent === 'Multilingual-Pitcher') {
    responseText = `✍️ Pitch drafted: Tailored French introduction emphasizing master artisan weaving in the High Atlas, 0 minimum order flexibility, and 3-day express air delivery.`;
  } else {
    responseText = `👑 Master Orchestrator: Order noted. I have updated the LangGraph state machine and alerted the respective agents. Pipeline is running at 99.2% accuracy.`;
  }

  if (typingEl) typingEl.style.display = 'none';

  SLACK_MESSAGES[currentSlackTarget.id].push({
    id: `agent-reply-${Date.now()}`,
    sender: targetAgent,
    time: time,
    text: responseText,
    handoff: null,
    actionCard: actionCard
  });

  renderSlackFeed();
}

function clearCurrentChatFeed() {
  if (confirm(`Clear message history in #${currentSlackTarget.id}?`)) {
    SLACK_MESSAGES[currentSlackTarget.id] = [];
    renderSlackFeed();
    showToast('Feed cleared', 'info');
  }
}

function filterSlackSidebar(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.slack-nav-item').forEach(el => {
    const text = el.textContent.toLowerCase();
    if (!q || text.includes(q)) {
      el.style.display = 'flex';
    } else {
      el.style.display = 'none';
    }
  });
}

function executeQuickAction(action) {
  if (action === 'calcFreight') {
    calculateLandedCost('Paris, France', 'Beni Ourain Rugs', 4);
  } else if (action === 'generateProForma') {
    generateProFormaPdf('quick');
  } else if (action === 'triggerScrape') {
    switchSlackTarget('channel', 'leads-radar');
    showToast('🌐 5-Market live scraper triggered across FR, UK, ES, US, AU', 'success');
  }
}

setInterval(simulateLogEntry, 5000);

// ═══════════════════════════════════════════════════════════
// TAB 3: OUTREACH & LOOKBOOK
// ═══════════════════════════════════════════════════════════

const PITCHES = {
  en: {
    marais: {
      subject: 'Authentic Moroccan Artisan Collection — Direct Workshop Pricing, Zero Minimum Order',
      body: `Dear Maison Bohème Team,

I'm reaching out from our <span class="highlight">master artisan workshop in Marrakech</span>, where we've been handcrafting authentic Moroccan home décor for discerning European concept stores.

We specialize in <span class="emphasis">Beni Ourain rugs, hand-hammered brass lighting, Tamegroute pottery, and leather goods</span> — all crafted by skilled artisans in our Marrakech atelier.

<strong>Why partner with us?</strong>

✦ <span class="highlight">Zero Minimum Order (0 MOQ)</span> — Perfect for curating your Le Marais boutique without inventory risk
✦ <span class="emphasis">Direct artisan prices</span> — No middlemen, no import agencies, workshop-direct
✦ <span class="highlight">Custom sizing & designs</span> — Bespoke colorways, dimensions, and private labeling available
✦ Fast express shipping via DHL/FedEx (3-5 days to Paris)
✦ Full <span class="emphasis">Moroccan Handmade Authenticity certification</span> with every piece

We'd love to send you a <span class="highlight">complimentary sample selection</span> and our digital lookbook showcasing our latest collection.

<strong>View our portfolio:</strong> https://sites.google.com/view/morkech/home

Warm regards,
<strong>Hassan Tiguidda</strong>
Master Artisan & Export Director
MARRAKECH CRAFT CONDUIT
📱 +212 632 155 430 (WhatsApp)
✉️ tiguidda76@gmail.com`
    },
    coastal: {
      subject: 'Handcrafted Moroccan Home Décor — Perfect for Coastal Living Aesthetics',
      body: `Hi Byron Bay Living Team,

Greetings from Marrakech! I'm reaching out because your stunning <span class="highlight">coastal bohemian aesthetic</span> is a perfect match for our authentic Moroccan artisan collection.

Our workshop specializes in pieces that blend seamlessly with <span class="emphasis">Australian coastal and boho-luxe interiors</span>:

✦ <span class="highlight">Handwoven palm wicker baskets</span> — organic, textural, perfect for coastal styling
✦ <span class="emphasis">Natural wool Beni Ourain rugs</span> — warm ivory tones that complement coastal palettes
✦ <span class="highlight">Tamegroute glazed pottery</span> — earthy green tones, handmade in the Draa Valley

<strong>Key advantages for Australian boutiques:</strong>

• <span class="highlight">Zero minimum order</span> — Test with 1-5 pieces, scale when ready
• Direct workshop pricing — <span class="emphasis">40-60% below European retail</span>
• Express DHL shipping to Australia (4-6 business days)
• Full ethical sourcing documentation & authenticity certificates

I'd love to curate a <span class="highlight">complimentary discovery box</span> tailored to your Byron Bay aesthetic.

<strong>Browse our collection:</strong> https://sites.google.com/view/morkech/home

Cheers,
<strong>Hassan Tiguidda</strong>
Marrakech Artisan Workshop
📱 +212 632 155 430 | ✉️ tiguidda76@gmail.com`
    },
    soho: {
      subject: 'Moroccan Artisan Collection — Curated for NYC Interior Design Projects',
      body: `Dear Soho Interiors Team,

I specialize in sourcing <span class="highlight">authentic Moroccan artisan pieces</span> directly from our workshop in Marrakech for high-end interior design projects across New York.

Our collection has been featured in projects spanning <span class="emphasis">SoHo lofts, Brooklyn brownstones, and Hamptons residences</span>. Key offerings:

✦ <span class="highlight">Custom-sized Beni Ourain & Azilal rugs</span> — Any dimension, custom colorways
✦ <span class="emphasis">Hand-hammered brass pendant lights</span> — Perforated star patterns, oversized designs
✦ <span class="highlight">Zellige tile collections</span> — Authentic hand-cut tiles for feature walls & kitchens
✦ <span class="emphasis">Leather poufs & cushions</span> — Unstuffed for flat-rate shipping, embossed options

<strong>Designer advantages:</strong>

• <span class="highlight">Trade pricing</span> — Direct from Marrakech workshop, no markup chain
• Bespoke production — Custom specs from your architectural blueprints
• <span class="emphasis">0 MOQ</span> — Source single statement pieces or full container loads
• Professional packaging for direct-to-client delivery

Let's schedule a <span class="highlight">virtual workshop tour</span> to discuss your upcoming projects.

Best,
<strong>Hassan Tiguidda</strong>
MARRAKECH CRAFT CONDUIT
📱 +212 632 155 430 | ✉️ tiguidda76@gmail.com`
    },
    madrid: {
      subject: 'Artesanía Marroquí Auténtica — Colección Directa del Taller de Marrakech',
      body: `Estimado equipo de Casa Étnica,

Les contacto desde nuestro <span class="highlight">taller artesano en Marrakech</span>, donde creamos piezas únicas de decoración marroquí para tiendas selectas europeas.

Nuestra colección es perfecta para el <span class="emphasis">estilo bohemio mediterráneo</span> que define su boutique en Barcelona:

✦ <span class="highlight">Alfombras Beni Ourain y kilims</span> — Tejidas a mano con lana virgen del Atlas
✦ <span class="emphasis">Cerámica Tamegroute</span> — Esmalte verde único, hecha en el Valle del Draa
✦ <span class="highlight">Lámparas de latón perforado</span> — Diseños geométricos artesanales
✦ <span class="emphasis">Artículos de cuero marroquí</span> — Poufs, bolsos, con curtido natural

<strong>Ventajas para tiendas españolas:</strong>

• <span class="highlight">Sin pedido mínimo (0 MOQ)</span> — Perfecto para empezar
• Precios directos de taller — <span class="emphasis">Sin intermediarios</span>
• Envío express DHL a España (2-3 días laborables)
• Certificación de autenticidad artesanal marroquí

Visiten nuestro portfolio: https://sites.google.com/view/morkech/home

Un cordial saludo,
<strong>Hassan Tiguidda</strong>
📱 +212 632 155 430 | ✉️ tiguidda76@gmail.com`
    },
    shoreditch: {
      subject: 'Ethical Moroccan Artisan Homeware — Direct from Marrakech Workshop',
      body: `Hi East London Artisan Team,

I'm Hassan, a master artisan based in Marrakech. I've been following your incredible work curating <span class="highlight">ethically-sourced homeware</span> for Shoreditch's conscious consumers.

Our workshop aligns perfectly with your values — <span class="emphasis">fair trade, transparent supply chain, zero middlemen</span>:

✦ <span class="highlight">Every piece handmade</span> by skilled Moroccan artisans in our Marrakech workshop
✦ <span class="emphasis">Full traceability</span> — We document every artisan and technique
✦ <span class="highlight">Eco-conscious packaging</span> — Recycled kraft paper, zero plastic
✦ <span class="emphasis">Living wages</span> — Direct workshop employment, no exploitative practices

<strong>Our bestsellers for ethical UK boutiques:</strong>

• Hand-hammered brass tea lights & pendants
• Naturally-dyed wool rugs (Beni Ourain, Azilal)
• Tamegroute glazed pottery bowls & vases
• Vegetable-tanned leather accessories

<span class="highlight">0 MOQ available</span> — Start with a small curated selection, no risk.

<strong>Explore:</strong> https://sites.google.com/view/morkech/home

Best wishes,
<strong>Hassan Tiguidda</strong>
📱 +212 632 155 430 | ✉️ tiguidda76@gmail.com`
    }
  },
  fr: {
    marais: {
      subject: 'Collection Artisanale Marocaine — Prix Atelier Direct, Aucun Minimum de Commande',
      body: `Cher(e) responsable de Maison Bohème,

Je me permets de vous contacter depuis notre <span class="highlight">atelier artisanal à Marrakech</span>, où nous créons des pièces uniques de décoration marocaine pour les concept stores les plus exigeants d'Europe.

Notre atelier est spécialisé dans les <span class="emphasis">tapis Beni Ourain, les luminaires en laiton martelé, la poterie de Tamegroute et la maroquinerie</span>.

<strong>Pourquoi nous choisir ?</strong>

✦ <span class="highlight">Aucun minimum de commande (0 MOQ)</span> — Idéal pour constituer votre sélection
✦ <span class="emphasis">Prix atelier direct</span> — Sans intermédiaire, sans marge de revendeur
✦ <span class="highlight">Personnalisation sur mesure</span> — Dimensions, coloris et étiquetage privé
✦ Livraison express DHL/FedEx (2-3 jours vers Paris)
✦ <span class="emphasis">Certification d'authenticité artisanale marocaine</span> incluse

Nous serions ravis de vous envoyer une <span class="highlight">sélection d'échantillons gratuite</span> et notre lookbook digital.

<strong>Notre portfolio :</strong> https://sites.google.com/view/morkech/home

Cordialement,
<strong>Hassan Tiguidda</strong>
Maître Artisan & Directeur Export
📱 +212 632 155 430 (WhatsApp)
✉️ tiguidda76@gmail.com`
    }
  },
  es: {
    marais: {
      subject: 'Colección Artesanal Marroquí — Precios de Taller Directo, Sin Mínimo de Pedido',
      body: `Estimado/a equipo,

Me pongo en contacto desde nuestro <span class="highlight">taller artesano en Marrakech</span>, donde creamos piezas únicas de decoración marroquí para las tiendas más selectas de Europa.

<strong>Nuestras especialidades:</strong>

✦ <span class="highlight">Alfombras Beni Ourain</span> — Tejidas a mano con lana virgen del Alto Atlas
✦ <span class="emphasis">Cerámica Tamegroute y Safi</span> — Esmaltes únicos, técnicas ancestrales
✦ <span class="highlight">Lámparas de latón</span> — Diseños geométricos perforados a mano
✦ <span class="emphasis">Cuero marroquí</span> — Poufs, bolsos, curtido vegetal natural

<strong>Ventajas exclusivas:</strong>

• <span class="highlight">Sin pedido mínimo (0 MOQ)</span>
• <span class="emphasis">Precios directos de taller</span> — Sin intermediarios
• Envío express a España (2-3 días)
• Certificación de autenticidad

Portfolio: https://sites.google.com/view/morkech/home

Atentamente,
<strong>Hassan Tiguidda</strong>
📱 +212 632 155 430 | ✉️ tiguidda76@gmail.com`
    }
  }
};

function generatePitch() {
  const lang = document.getElementById('pitchLang').value;
  const persona = document.getElementById('buyerPersona').value;

  // Find the best matching pitch
  let pitch;
  if (PITCHES[lang] && PITCHES[lang][persona]) {
    pitch = PITCHES[lang][persona];
  } else if (PITCHES[lang] && PITCHES[lang]['marais']) {
    pitch = PITCHES[lang]['marais'];
  } else {
    pitch = PITCHES['en'][persona] || PITCHES['en']['marais'];
  }

  const body = document.getElementById('pitchBody');
  body.innerHTML = `
    <div style="margin-bottom: 1rem; padding-bottom: 0.8rem; border-bottom: 1px solid var(--border-subtle);">
      <div style="font-size: 0.68rem; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.3rem;">Subject Line</div>
      <div style="font-weight: 700; color: var(--saffron-light); font-size: 0.88rem;">${pitch.subject}</div>
    </div>
    <div style="white-space: pre-line;">${pitch.body}</div>
  `;
}

function copyPitch() {
  const body = document.getElementById('pitchBody');
  const text = body.innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Pitch copied to clipboard', 'success');
  }).catch(() => {
    showToast('Failed to copy — use manual selection', 'warning');
  });
}

// Lookbook Items
const LOOKBOOK_ITEMS = [
  { icon: '🧶', title: 'Beni Ourain Rug', desc: 'Handwoven, Atlas Mountains', color: 'rgba(194,65,12,0.15)' },
  { icon: '🏺', title: 'Tamegroute Pottery', desc: 'Green glaze, Draa Valley', color: 'rgba(16,185,129,0.15)' },
  { icon: '🪔', title: 'Brass Pendant Light', desc: 'Perforated star pattern', color: 'rgba(217,119,6,0.15)' },
  { icon: '👝', title: 'Leather Pouf', desc: 'Natural tan, unstuffed', color: 'rgba(194,65,12,0.15)' },
  { icon: '🧺', title: 'Palm Wicker Basket', desc: 'Handwoven, natural fiber', color: 'rgba(139,92,246,0.15)' },
  { icon: '🪵', title: 'Cedar Carved Box', desc: 'Essaouira thuya wood', color: 'rgba(30,58,138,0.15)' },
  { icon: '🎨', title: 'Zellige Tile Set', desc: '10×10cm, hand-cut Fez', color: 'rgba(59,130,246,0.15)' },
  { icon: '🧣', title: 'Handloom Textile', desc: 'Berber weave, silk blend', color: 'rgba(236,72,153,0.15)' },
];

function renderLookbook() {
  const grid = document.getElementById('lookbookGrid');
  grid.innerHTML = LOOKBOOK_ITEMS.map(item => `
    <div class="lookbook-item" style="background: linear-gradient(135deg, ${item.color}, rgba(15,23,42,0.5));">
      <div class="lookbook-placeholder">
        <div class="lookbook-placeholder-icon">${item.icon}</div>
        <div class="lookbook-placeholder-text">${item.title}</div>
      </div>
      <div class="lookbook-overlay">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════════
// TAB 4: PRODUCT CATALOG & PRICING
// ═══════════════════════════════════════════════════════════

const CATALOG_PRODUCTS = {
  rugs: [
    { name: 'Beni Ourain Rug (150×200cm)', base: 320 },
    { name: 'Beni Ourain Rug (250×300cm)', base: 580 },
    { name: 'Azilal Colorful Rug (140×200cm)', base: 280 },
    { name: 'Kilim Flat-weave Runner (80×250cm)', base: 145 },
    { name: 'Boucherouite Rag Rug (130×180cm)', base: 195 },
  ],
  ceramics: [
    { name: 'Tamegroute Bowl Set (6 pcs)', base: 85 },
    { name: 'Tamegroute Vase (Large)', base: 45 },
    { name: 'Safi Painted Plate Set (4 pcs)', base: 68 },
    { name: 'Glazed Tagine (Decorative)', base: 38 },
    { name: 'Hand-painted Mosaic Tile (per m²)', base: 120 },
  ],
  brass: [
    { name: 'Perforated Star Pendant (Ø40cm)', base: 165 },
    { name: 'Table Lamp with Brass Shade', base: 125 },
    { name: 'Moroccan Tea Set (Tray + 6 Glasses)', base: 78 },
    { name: 'Wall Sconce Pair', base: 95 },
    { name: 'Oversized Floor Lantern (Ø60cm)', base: 245 },
  ],
  leather: [
    { name: 'Leather Pouf (Unstuffed)', base: 55 },
    { name: 'Leather Satchel Bag', base: 65 },
    { name: 'Embossed Leather Cushion Cover', base: 35 },
    { name: 'Babouche Slippers (per pair)', base: 22 },
    { name: 'Leather Ottoman (Large)', base: 120 },
  ],
  wicker: [
    { name: 'Palm Belly Basket (Large)', base: 28 },
    { name: 'Wicker Storage Set (3 pcs)', base: 55 },
    { name: 'Rattan Mirror Frame (Ø60cm)', base: 42 },
    { name: 'Woven Laundry Hamper', base: 38 },
    { name: 'Palm Leaf Placemat Set (6 pcs)', base: 18 },
  ],
  wood: [
    { name: 'Thuya Wood Box (Carved)', base: 45 },
    { name: 'Cedar Carved Panel (60×40cm)', base: 185 },
    { name: 'Inlaid Chess Set', base: 95 },
    { name: 'Aromatic Cedar Diffuser Block', base: 15 },
    { name: 'Hand-turned Wooden Bowls (Set of 3)', base: 52 },
  ]
};

let currentCategory = 'rugs';

function switchCategory(btn) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  currentCategory = btn.dataset.cat;
  renderSimulator();
  updateTierPrices();
}

function updateTierPrices() {
  const products = CATALOG_PRODUCTS[currentCategory];
  if (!products || products.length === 0) return;
  const avg = products.reduce((s, p) => s + p.base, 0) / products.length;
  document.getElementById('tierPrice1').innerHTML = `$${Math.round(avg)} <span class="tier-price-unit">/ piece avg</span>`;
  document.getElementById('tierPrice2').innerHTML = `$${Math.round(avg * 0.85)} <span class="tier-price-unit">/ piece avg</span>`;
  document.getElementById('tierPrice3').innerHTML = `$${Math.round(avg * 0.65)} <span class="tier-price-unit">/ piece avg</span>`;
}

function renderSimulator() {
  const container = document.getElementById('simRows');
  const products = CATALOG_PRODUCTS[currentCategory];

  container.innerHTML = products.map((p, i) => `
    <div class="sim-row">
      <div class="sim-product">${p.name}</div>
      <div style="color: var(--slate-400); font-family: var(--font-mono);">$${p.base.toFixed(2)}</div>
      <div>
        <input type="number" class="sim-input" id="simQty${i}" value="0" min="0" max="999" data-base="${p.base}" onchange="calcSimulator()" oninput="calcSimulator()">
      </div>
      <div class="sim-total" id="simSub${i}">$0.00</div>
    </div>
  `).join('');
}

function calcSimulator() {
  const products = CATALOG_PRODUCTS[currentCategory];
  let grandTotal = 0;
  let totalQty = 0;

  products.forEach((p, i) => {
    const qtyInput = document.getElementById(`simQty${i}`);
    const subEl = document.getElementById(`simSub${i}`);
    if (!qtyInput || !subEl) return;

    const qty = parseInt(qtyInput.value) || 0;
    let unitPrice = p.base;

    // Apply tier discounts
    if (qty >= 50) unitPrice = p.base * 0.65;
    else if (qty >= 6) unitPrice = p.base * 0.85;

    const subtotal = unitPrice * qty;
    subEl.textContent = `$${subtotal.toFixed(2)}`;
    grandTotal += subtotal;
    totalQty += qty;
  });

  document.getElementById('simTotal').textContent = `$${grandTotal.toFixed(2)}`;
  document.getElementById('simTotalQty').textContent = totalQty;
}

function resetSimulator() {
  const products = CATALOG_PRODUCTS[currentCategory];
  products.forEach((_, i) => {
    const input = document.getElementById(`simQty${i}`);
    if (input) input.value = 0;
  });
  calcSimulator();
  showToast('Simulator reset', 'info');
}

// ═══════════════════════════════════════════════════════════
// TAB 5: INVOICE BUILDER
// ═══════════════════════════════════════════════════════════

let invoiceLines = [
  { name: 'Beni Ourain Rug 250×300cm', desc: 'Handwoven, ivory/charcoal diamond', priceUSD: 580, qty: 2 },
  { name: 'Tamegroute Bowl Set (6 pcs)', desc: 'Green glaze, Draa Valley artisan', priceUSD: 85, qty: 5 },
  { name: 'Perforated Brass Pendant (Ø40cm)', desc: 'Hand-hammered, star pattern', priceUSD: 165, qty: 3 },
  { name: 'Leather Pouf (Unstuffed)', desc: 'Natural tan, embossed medallion', priceUSD: 55, qty: 8 },
  { name: 'Palm Wicker Belly Basket (Large)', desc: 'Handwoven palm fiber, natural', priceUSD: 28, qty: 10 },
];

function renderInvoice() {
  const tbody = document.getElementById('invoiceBody');
  const sym = CURRENCY_SYMBOLS[currentCurrency];
  const rate = EXCHANGE_RATES[currentCurrency];

  tbody.innerHTML = invoiceLines.map((line, i) => {
    const convertedPrice = (line.priceUSD * rate).toFixed(2);
    const lineTotal = (line.priceUSD * rate * line.qty).toFixed(2);
    return `
      <tr>
        <td>
          <div class="item-name">${line.name}</div>
          <div class="item-desc">${line.desc}</div>
        </td>
        <td><span class="cell-secondary">${line.desc.substring(0, 25)}...</span></td>
        <td style="font-family: var(--font-mono); color: var(--slate-300);">${sym}${convertedPrice}</td>
        <td>
          <input type="number" class="qty-input" value="${line.qty}" min="1" max="999"
            onchange="updateInvoiceQty(${i}, this.value)"
            oninput="updateInvoiceQty(${i}, this.value)">
        </td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--saffron-light);">${sym}${lineTotal}</td>
      </tr>
    `;
  }).join('');

  updateInvoiceSummary();
}

function updateInvoiceQty(index, qty) {
  invoiceLines[index].qty = parseInt(qty) || 1;
  renderInvoice();
}

function updateInvoiceSummary() {
  const sym = CURRENCY_SYMBOLS[currentCurrency];
  const rate = EXCHANGE_RATES[currentCurrency];

  const subtotal = invoiceLines.reduce((sum, line) => sum + (line.priceUSD * rate * line.qty), 0);
  const packaging = subtotal * 0.03; // 3% packaging
  const shipping = 0; // EXW default
  const total = subtotal + packaging + shipping;

  document.getElementById('invoiceSummary').innerHTML = `
    <div class="summary-row">
      <span class="summary-label">Subtotal</span>
      <span class="summary-val">${sym}${subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Export Packaging (3%)</span>
      <span class="summary-val">${sym}${packaging.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Shipping (EXW — Buyer Arranged)</span>
      <span class="summary-val">${sym}0.00</span>
    </div>
    <div class="summary-row">
      <span class="summary-label" style="font-size: 0.68rem;">TVA / VAT</span>
      <span class="summary-val" style="color: var(--success);">Exonéré (Art 91)</span>
    </div>
    <div class="summary-row total">
      <span>TOTAL DUE</span>
      <span class="summary-val">${sym}${total.toFixed(2)}</span>
    </div>
    <div style="margin-top: 0.6rem; font-size: 0.65rem; color: var(--slate-600);">
      ${currentCurrency !== 'USD' ? `Exchange rate: 1 USD = ${rate} ${currentCurrency} | ` : ''}
      Payment: 50% advance via Stripe/Wire, 50% before shipment
    </div>
  `;
}

function switchCurrency(curr) {
  currentCurrency = curr;
  document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.curr === curr);
  });
  renderInvoice();
}

function addInvoiceLine() {
  const products = [
    { name: 'Azilal Colorful Rug (140×200cm)', desc: 'Multi-color Berber weave', priceUSD: 280 },
    { name: 'Safi Painted Plate Set (4 pcs)', desc: 'Blue/white traditional pattern', priceUSD: 68 },
    { name: 'Cedar Carved Box (Large)', desc: 'Essaouira thuya burl wood', priceUSD: 45 },
    { name: 'Wall Sconce Pair (Brass)', desc: 'Perforated crescent design', priceUSD: 95 },
    { name: 'Handloom Blanket', desc: 'Berber stripe, cotton/wool blend', priceUSD: 65 },
  ];

  const product = products[Math.floor(Math.random() * products.length)];
  invoiceLines.push({ ...product, qty: 1 });
  renderInvoice();
  showToast(`Added "${product.name}" to invoice`, 'success');
}

function exportInvoicePDF() {
  document.getElementById('modalTitle').textContent = '📄 Pro Forma Invoice — PDF Export';

  const sym = CURRENCY_SYMBOLS[currentCurrency];
  const rate = EXCHANGE_RATES[currentCurrency];
  const subtotal = invoiceLines.reduce((sum, line) => sum + (line.priceUSD * rate * line.qty), 0);
  const packaging = subtotal * 0.03;
  const total = subtotal + packaging;
  const invoiceNum = 'INV-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000 + 1000));
  const today = new Date().toISOString().split('T')[0];

  document.getElementById('modalBody').innerHTML = `
    <div style="background: white; color: #1a1a1a; padding: 2rem; border-radius: var(--radius-md); font-family: var(--font-body); font-size: 0.82rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #C2410C;">
        <div>
          <h2 style="font-family: var(--font-display); font-size: 1.2rem; color: #1E3A8A; margin-bottom: 0.3rem;">MARRAKECH CRAFT CONDUIT</h2>
          <p style="font-size: 0.72rem; color: #666;">AUTO-ENTREPRENEUR HASSAN TIGUIDDA</p>
          <p style="font-size: 0.68rem; color: #888;">Les portes de Marrakech Zone 16 imm 118 app 03</p>
          <p style="font-size: 0.68rem; color: #888;">ICE: 1161674000043</p>
        </div>
        <div style="text-align: right;">
          <h3 style="font-size: 1.1rem; color: #C2410C; margin-bottom: 0.3rem;">PRO FORMA INVOICE</h3>
          <p style="font-size: 0.75rem;"><strong>${invoiceNum}</strong></p>
          <p style="font-size: 0.68rem; color: #888;">Date: ${today}</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 0.5rem; text-align: left; font-size: 0.7rem; border-bottom: 1px solid #ddd;">Item</th>
            <th style="padding: 0.5rem; text-align: right; font-size: 0.7rem; border-bottom: 1px solid #ddd;">Unit Price</th>
            <th style="padding: 0.5rem; text-align: center; font-size: 0.7rem; border-bottom: 1px solid #ddd;">Qty</th>
            <th style="padding: 0.5rem; text-align: right; font-size: 0.7rem; border-bottom: 1px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceLines.map(line => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 0.5rem;">
                <strong>${line.name}</strong><br>
                <span style="font-size: 0.68rem; color: #888;">${line.desc}</span>
              </td>
              <td style="padding: 0.5rem; text-align: right; font-family: var(--font-mono);">${sym}${(line.priceUSD * rate).toFixed(2)}</td>
              <td style="padding: 0.5rem; text-align: center;">${line.qty}</td>
              <td style="padding: 0.5rem; text-align: right; font-family: var(--font-mono); font-weight: 600;">${sym}${(line.priceUSD * rate * line.qty).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end;">
        <div style="width: 250px;">
          <div style="display: flex; justify-content: space-between; padding: 0.3rem 0; font-size: 0.78rem;">
            <span>Subtotal</span><span>${sym}${subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.3rem 0; font-size: 0.78rem;">
            <span>Packaging (3%)</span><span>${sym}${packaging.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.3rem 0; font-size: 0.78rem; color: green;">
            <span>TVA</span><span>Exonéré</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; margin-top: 0.3rem; border-top: 2px solid #C2410C; font-size: 1rem; font-weight: 800;">
            <span>TOTAL</span><span style="color: #C2410C;">${sym}${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.68rem; color: #888;">
        <p><strong>Payment:</strong> RIB: 007450001399370030009822 | SWIFT: BCMAMAMC</p>
        <p><strong>Terms:</strong> 50% advance, 50% before shipment | Incoterm: EXW Marrakech</p>
        <p style="font-style: italic; margin-top: 0.5rem;">"Montant en dirhams exonéré de la TVA (Art 91 - II - 1° du Code Général des Impôts)"</p>
      </div>
    </div>
  `;

  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()">Close</button>
    <button class="btn btn-gold" onclick="printInvoice()">🖨️ Print / Save PDF</button>
  `;
  openModal();
}

function printInvoice() {
  window.print();
  showToast('Invoice sent to printer / PDF', 'success');
}

// ═══════════════════════════════════════════════════════════
// MODAL MANAGEMENT
// ═══════════════════════════════════════════════════════════

function openModal() {
  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ═══════════════════════════════════════════════════════════
// SECURITY & AUTHENTICATION GATE SYSTEM
// ═══════════════════════════════════════════════════════════

const DEFAULT_AUTH_PASSWORD = 'Marrakech2026';
const BACKUP_AUTH_PASSWORD = 'hassan2026';

function getActivePassword() {
  return localStorage.getItem('mcc_custom_password') || DEFAULT_AUTH_PASSWORD;
}

function checkAuthStatus() {
  const isRemembered = localStorage.getItem('mcc_auth_remember') === 'true';
  const hasSession = sessionStorage.getItem('mcc_auth_session') === 'true';
  const authGate = document.getElementById('authGate');

  if (authGate) {
    if (isRemembered || hasSession) {
      authGate.classList.add('unlocked');
    } else {
      authGate.classList.remove('unlocked');
      const input = document.getElementById('authPasswordInput');
      if (input) setTimeout(() => input.focus(), 200);
    }
  }
}

function handleAuthSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('authPasswordInput');
  const errorMsg = document.getElementById('authErrorMsg');
  const authCard = document.getElementById('authCard');
  const rememberCheckbox = document.getElementById('authRememberMe');
  const authGate = document.getElementById('authGate');

  if (!input) return;
  const entered = input.value.trim();
  const currentPassword = getActivePassword();

  // Validate against current custom password, default password, or backup password
  if (entered === currentPassword || entered === DEFAULT_AUTH_PASSWORD || entered.toLowerCase() === BACKUP_AUTH_PASSWORD || entered.toLowerCase() === 'marrakech2026') {
    if (errorMsg) errorMsg.textContent = '';
    
    // Save session
    sessionStorage.setItem('mcc_auth_session', 'true');
    if (rememberCheckbox && rememberCheckbox.checked) {
      localStorage.setItem('mcc_auth_remember', 'true');
    } else {
      localStorage.removeItem('mcc_auth_remember');
    }

    // Unlock animation
    if (authGate) authGate.classList.add('unlocked');
    input.value = '';
    showToast('✦ Access Granted: Welcome Hassan Tiguidda ✦', 'success');
  } else {
    // Error state
    if (errorMsg) errorMsg.textContent = '❌ Invalid Password. Please try again.';
    if (authCard) {
      authCard.classList.remove('shake');
      void authCard.offsetWidth; // Trigger reflow
      authCard.classList.add('shake');
    }
    input.select();
  }
}

function toggleAuthPasswordVisibility() {
  const input = document.getElementById('authPasswordInput');
  const btn = document.getElementById('authToggleEye');
  if (!input || !btn) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🔒';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

function lockDashboard() {
  sessionStorage.removeItem('mcc_auth_session');
  localStorage.removeItem('mcc_auth_remember');
  const authGate = document.getElementById('authGate');
  const input = document.getElementById('authPasswordInput');
  const errorMsg = document.getElementById('authErrorMsg');

  if (errorMsg) errorMsg.textContent = '';
  if (authGate) authGate.classList.remove('unlocked');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 300);
  }
  showToast('🔒 Dashboard Locked', 'info');
}

function showAuthHint() {
  const currentPass = getActivePassword();
  const isCustom = localStorage.getItem('mcc_custom_password') !== null;
  
  if (!isCustom) {
    showToast('Default Master Key: Marrakech2026', 'info');
  } else {
    showToast('Custom password is active. Backup default: Marrakech2026', 'info');
  }
}

function openChangePasswordModal() {
  document.getElementById('modalTitle').textContent = '🔑 Security Settings — Change Dashboard Password';
  document.getElementById('modalBody').innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.2rem;">
      <div style="padding: 1rem; background: rgba(30,58,138,0.12); border: 1px solid rgba(30,58,138,0.25); border-radius: var(--radius-md);">
        <p style="font-size: 0.76rem; color: var(--slate-300); line-height: 1.6;">
          Protect your <strong>MARRAKECH CRAFT CONDUIT</strong> intelligence radar, buyer directories, and quotation system by updating your master access password.
        </p>
      </div>

      <div class="control-group" style="background: transparent; border: none; padding: 0;">
        <label class="control-label" style="margin-bottom: 0.3rem;">Current Password</label>
        <input type="password" class="auth-input" id="currentPwdInput" placeholder="Enter current password..." style="padding: 0.6rem 0.8rem; font-size: 0.85rem;">
      </div>

      <div class="control-group" style="background: transparent; border: none; padding: 0;">
        <label class="control-label" style="margin-bottom: 0.3rem;">New Custom Password</label>
        <input type="password" class="auth-input" id="newPwdInput" placeholder="Enter new password (min 6 chars)..." style="padding: 0.6rem 0.8rem; font-size: 0.85rem;">
      </div>

      <div class="control-group" style="background: transparent; border: none; padding: 0;">
        <label class="control-label" style="margin-bottom: 0.3rem;">Confirm New Password</label>
        <input type="password" class="auth-input" id="confirmPwdInput" placeholder="Confirm new password..." style="padding: 0.6rem 0.8rem; font-size: 0.85rem;">
      </div>

      <div id="pwdModalMsg" style="font-size: 0.72rem; min-height: 1rem; font-weight: 600;"></div>
    </div>
  `;

  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
    <button class="btn btn-gold" onclick="saveNewPassword()">💾 Save New Password</button>
  `;

  openModal();
}

function saveNewPassword() {
  const currentInput = document.getElementById('currentPwdInput');
  const newInput = document.getElementById('newPwdInput');
  const confirmInput = document.getElementById('confirmPwdInput');
  const msg = document.getElementById('pwdModalMsg');

  const current = currentInput ? currentInput.value.trim() : '';
  const newPwd = newInput ? newInput.value.trim() : '';
  const confirmPwd = confirmInput ? confirmInput.value.trim() : '';
  const activePassword = getActivePassword();

  if (current !== activePassword && current !== DEFAULT_AUTH_PASSWORD && current !== BACKUP_AUTH_PASSWORD) {
    if (msg) {
      msg.style.color = 'var(--danger)';
      msg.textContent = '❌ Current password is incorrect.';
    }
    return;
  }

  if (newPwd.length < 4) {
    if (msg) {
      msg.style.color = 'var(--danger)';
      msg.textContent = '❌ New password must be at least 4 characters long.';
    }
    return;
  }

  if (newPwd !== confirmPwd) {
    if (msg) {
      msg.style.color = 'var(--danger)';
      msg.textContent = '❌ New passwords do not match.';
    }
    return;
  }

  // Save new password
  localStorage.setItem('mcc_custom_password', newPwd);
  closeModal();
  showToast('✅ Password updated successfully!', 'success');
}

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Security gate check
  checkAuthStatus();

  // Tab 1
  renderLeads(LEADS_DATA);

  // Tab 2
  initSlackWarRoom();

  // Tab 3
  generatePitch();
  renderLookbook();

  // Tab 4
  renderSimulator();
  updateTierPrices();

  // Tab 5
  renderInvoice();

  // Welcome toast (if unlocked)
  setTimeout(() => {
    if (sessionStorage.getItem('mcc_auth_session') === 'true' || localStorage.getItem('mcc_auth_remember') === 'true') {
      showToast('MARRAKECH CRAFT CONDUIT — All systems secured & operational', 'success');
    }
  }, 1000);
});

