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

function renderLeads(data) {
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

  tbody.innerHTML = data.map(lead => `
    <tr>
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
          <button class="btn btn-sm btn-primary" onclick="showToast('Sample pack pitch sent to ${lead.name}', 'success')">📦 Pitch</button>
          <button class="btn btn-sm btn-success" onclick="showToast('WhatsApp message dispatched', 'success')">💬</button>
        </div>
      </td>
    </tr>
  `).join('');
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
    <button class="btn btn-primary" onclick="closeModal(); showToast('Outreach sequence initiated for ${lead.name}', 'success')">🚀 Initiate Outreach</button>
  `;
  openModal();
}

// ═══════════════════════════════════════════════════════════
// TAB 2: AGENT ORCHESTRATION
// ═══════════════════════════════════════════════════════════

const AGENTS = [
  {
    icon: '🔍',
    name: 'Prospecting & Market Intelligence',
    desc: 'Discovers targeted home decor boutiques, concept stores, Etsy top sellers, and B2B buyers on Faire/Ankorstore across FR, UK, ES, USA & AU.',
    status: 'active',
    statusText: 'Scanning',
    tasks: 847,
    accuracy: '94.2%',
    tokens: '124K',
    bg: 'rgba(30, 58, 138, 0.15)'
  },
  {
    icon: '✉️',
    name: 'Outreach & Cold Email Dispatcher',
    desc: 'Crafts personalized multilingual cold emails and sequences (FR, EN, ES) highlighting 0 MOQ flexibility and direct workshop pricing.',
    status: 'active',
    statusText: 'Dispatching',
    tasks: 342,
    accuracy: '97.8%',
    tokens: '98K',
    bg: 'rgba(217, 119, 6, 0.15)'
  },
  {
    icon: '✅',
    name: 'Quality Control & HITL Approver',
    desc: 'Audits generated pitches, pricing calculations, and client comms against artisan brand voice before dispatch.',
    status: 'processing',
    statusText: 'Reviewing',
    tasks: 156,
    accuracy: '99.1%',
    tokens: '45K',
    bg: 'rgba(16, 185, 129, 0.15)'
  },
  {
    icon: '📐',
    name: 'Custom Specs & Production Coordinator',
    desc: 'Translates bespoke buyer blueprints, dimensions, and custom colorways into clear workshop manufacturing guidelines.',
    status: 'idle',
    statusText: 'Standby',
    tasks: 89,
    accuracy: '96.5%',
    tokens: '32K',
    bg: 'rgba(139, 92, 246, 0.15)'
  },
  {
    icon: '⚖️',
    name: 'Legal & Export Compliance',
    desc: 'Manages export certifications, Origin Documentation, customs declarations, and Incoterms compliance (EXW, FOB, DAP, DDP).',
    status: 'active',
    statusText: 'Processing',
    tasks: 67,
    accuracy: '99.7%',
    tokens: '28K',
    bg: 'rgba(194, 65, 12, 0.15)'
  },
  {
    icon: '💳',
    name: 'Billing, Pro Forma & Finance',
    desc: 'Generates multi-currency pro forma invoices, tracks payment milestones (Stripe / Bank Wire RIB / SWIFT), ensures tax compliance.',
    status: 'active',
    statusText: 'Invoicing',
    tasks: 134,
    accuracy: '99.9%',
    tokens: '56K',
    bg: 'rgba(245, 158, 11, 0.15)'
  },
  {
    icon: '🚢',
    name: 'Logistics & Freight Optimizer',
    desc: 'Calculates real-time landed costs for DHL/FedEx express air and LCL/FCL sea freight via Casablanca & Tanger Med ports.',
    status: 'processing',
    statusText: 'Calculating',
    tasks: 203,
    accuracy: '95.3%',
    tokens: '67K',
    bg: 'rgba(6, 182, 212, 0.15)'
  }
];

function renderAgents() {
  const grid = document.getElementById('agentGrid');
  grid.innerHTML = AGENTS.map((agent, i) => `
    <div class="agent-card" style="animation-delay: ${i * 0.08}s;">
      <div class="agent-header">
        <div class="agent-icon" style="background: ${agent.bg};">${agent.icon}</div>
        <div>
          <div class="agent-name">${agent.name}</div>
          <div class="agent-status">
            <div class="agent-status-dot ${agent.status}"></div>
            <span style="color: ${agent.status === 'active' ? 'var(--success)' : agent.status === 'processing' ? 'var(--saffron-gold)' : 'var(--slate-600)'};">${agent.statusText}</span>
          </div>
        </div>
      </div>
      <div class="agent-desc">${agent.desc}</div>
      <div class="agent-stats">
        <div class="agent-stat">
          <div class="agent-stat-val">${agent.tasks}</div>
          <div class="agent-stat-lbl">Tasks Done</div>
        </div>
        <div class="agent-stat">
          <div class="agent-stat-val">${agent.accuracy}</div>
          <div class="agent-stat-lbl">Accuracy</div>
        </div>
        <div class="agent-stat">
          <div class="agent-stat-val">${agent.tokens}</div>
          <div class="agent-stat-lbl">Tokens</div>
        </div>
      </div>
      <div class="progress-wrap" style="margin-top: 0.6rem;">
        <div class="progress-bar ${['progress-blue','progress-gold','progress-green','progress-terra'][i % 4]}" style="width: ${60 + Math.random() * 35}%;"></div>
      </div>
    </div>
  `).join('');
}

// Orchestration Log
const LOG_ENTRIES = [
  { time: '18:32:14', agent: 'Prospector', action: 'Discovered 12 new boutiques on Faire marketplace (France segment)', status: 'ok' },
  { time: '18:32:08', agent: 'Outreach', action: 'Dispatched personalized pitch to "Maison Bohème" (Le Marais, Paris) in French', status: 'ok' },
  { time: '18:31:55', agent: 'QC Approver', action: 'Approved pricing quote #MCC-2026-0847 — Brand voice: PASS, Accuracy: PASS', status: 'ok' },
  { time: '18:31:42', agent: 'Logistics', action: 'Calculated DHL Express landed cost: Marrakech → Byron Bay — $127.50 (3-5 days)', status: 'ok' },
  { time: '18:31:30', agent: 'Legal', action: 'Generated Certificate of Origin for shipment #SH-2026-0123 (EXW Marrakech)', status: 'ok' },
  { time: '18:31:18', agent: 'Finance', action: 'Pro Forma INV-2026-0392 generated: €4,250.00 — Payment: 50% advance, 50% before ship', status: 'ok' },
  { time: '18:31:05', agent: 'Specs', action: 'Custom Beni Ourain rug spec translated: 250×300cm, ivory/charcoal, diamond pattern', status: 'ok' },
  { time: '18:30:52', agent: 'Master', action: 'Pipeline bottleneck resolved: Re-routed 3 QC tasks from backlog to express queue', status: 'warn' },
  { time: '18:30:41', agent: 'Prospector', action: 'Ankorstore UK segment scan complete — 89 potential wholesale accounts identified', status: 'ok' },
  { time: '18:30:28', agent: 'Outreach', action: 'Follow-up sequence #3 sent to "Brooklyn Artisan Collective" — Open rate: 67%', status: 'ok' },
  { time: '18:30:15', agent: 'Logistics', action: 'FCL container quote received: Tanger Med → Melbourne — $3,850 (LCL: $1,240)', status: 'ok' },
  { time: '18:30:02', agent: 'QC Approver', action: 'HITL checkpoint: Awaiting human review on custom zellige tile spec (#SPEC-0045)', status: 'warn' },
];

function renderOrchLog() {
  const log = document.getElementById('orchLog');
  log.innerHTML = LOG_ENTRIES.map(entry => `
    <div class="log-entry">
      <span class="log-time">[${entry.time}]</span>
      <span class="log-arrow"> → </span>
      <span class="log-agent">[${entry.agent}]</span>
      <span class="log-action"> ${entry.action}</span>
      <span class="${entry.status === 'ok' ? 'log-status-ok' : 'log-status-warn'}"> ${entry.status === 'ok' ? '✓' : '⚠'}</span>
    </div>
  `).join('');
}

// Live log simulation
function simulateLogEntry() {
  const agents = ['Prospector', 'Outreach', 'QC Approver', 'Specs', 'Legal', 'Finance', 'Logistics', 'Master'];
  const actions = [
    'New buyer lead identified via Etsy scraping module',
    'Cold email personalization complete — awaiting QC approval',
    'Payment milestone confirmed via Stripe webhook ($2,400 USD)',
    'Freight quote updated: DHL Express Paris → Marrakech revised to €89',
    'Export documentation package generated for customs clearance',
    'Custom brass pendant specs validated — forwarding to workshop',
    'Outreach sequence performance: 42% open rate, 12% reply rate',
    'Task queue optimized: 3 priority tasks escalated to fast-track',
  ];
  const now = new Date();
  const time = now.toTimeString().substring(0, 8);
  const agent = agents[Math.floor(Math.random() * agents.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const status = Math.random() > 0.15 ? 'ok' : 'warn';

  const logEl = document.getElementById('orchLog');
  if (logEl) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
      <span class="log-time">[${time}]</span>
      <span class="log-arrow"> → </span>
      <span class="log-agent">[${agent}]</span>
      <span class="log-action"> ${action}</span>
      <span class="${status === 'ok' ? 'log-status-ok' : 'log-status-warn'}"> ${status === 'ok' ? '✓' : '⚠'}</span>
    `;
    logEl.insertBefore(entry, logEl.firstChild);

    // Keep log at reasonable size
    while (logEl.children.length > 30) {
      logEl.removeChild(logEl.lastChild);
    }
  }

  // Update token counter
  const tokensEl = document.getElementById('tokensProcessed');
  if (tokensEl) {
    const current = parseInt(tokensEl.textContent.replace(/,/g, ''));
    tokensEl.textContent = (current + Math.floor(Math.random() * 500 + 100)).toLocaleString();
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
  renderAgents();
  renderOrchLog();

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

