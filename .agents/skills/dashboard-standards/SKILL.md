---
name: dashboard-standards
description: Standards stricts d'ingénierie et de conception type-safe pour les widgets, tables et écrans de Marrakech Craft Conduit.
---

# Marrakech Craft Conduit — Dashboard Standards Skill

Ce skill fournit les directives opérationnelles pour créer, étendre ou maintenir les composants d'interface, widgets analytiques, calculateurs de fret et modules IA de la plateforme Marrakech Craft Conduit.

## 1. Principes de Développement

1. **Typage Stricte TypeScript (`craftBrainService.ts`) :**
   - Toutes les entités métier (Artisans, Ateliers, Devises, Invoices, Leads, Messages) doivent posséder une interface TypeScript explicite.
   - Toujours exécuter `npm run typecheck` (`tsc --noEmit`) pour valider la non-régression.

2. **Règle des 3 États (Loading, Empty, Error) :**
   - **Loading :** Afficher un squelette shimmer `.skeleton-shimmer` adapté à la grille ou table.
   - **Empty :** Afficher `.empty-state-wrap` avec icône expressive, titre descriptif et CTA d'action directe.
   - **Error :** Alerte `.toast-danger` ou encart de récupération avec bouton de retry.

3. **Charte Graphique "Moroccan Craft Luxury" :**
   - Palette : Fond Sombre (`#020617`), Verre acrylique (`rgba(15, 23, 42, 0.75)` + `backdrop-filter: blur(16px)`), Terracotta Médina (`#C2410C`), Bleu Majorelle (`#1E3A8A`), Or Safran (`#D97706`).
   - Micro-animations : Hover d'élévation `transform: translateY(-2px)`, lueurs douces `box-shadow: 0 4px 20px rgba(...)`.

4. **Intégration Copilot Omniprésent :**
   - Tout composant générant des données actionnables (ateliers, commandes, leads) doit pouvoir être relié au Copilot via des triggers interactifs `[🔍 Fiche Atelier]`, `[💬 WhatsApp Direct]`, `[💼 Devis Pro Forma]`, `[📦 Vérifier Stock]`.

## 2. Modèle de Widget Conforme

```javascript
// Exemple de composant standard respectant l'architecture atomique
function renderCraftMetricWidget(containerId, metricData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (metricData.isLoading) {
    container.innerHTML = `<div class="skeleton-shimmer" style="height: 120px; border-radius: var(--radius-md);"></div>`;
    return;
  }

  if (!metricData.items || metricData.items.length === 0) {
    container.innerHTML = `
      <div class="empty-state-wrap">
        <div class="empty-state-icon">📦</div>
        <div class="empty-state-title">Aucune donnée disponible</div>
        <p class="empty-state-desc">Initialisez un scan ou importez vos données.</p>
        <button class="btn btn-gold btn-sm" onclick="triggerDataSync()">↻ Synchroniser</button>
      </div>
    `;
    return;
  }

  // Rendu de la carte métrique
  container.innerHTML = `
    <div class="kpi-card">
      <div class="kpi-header">
        <div class="kpi-icon">${metricData.icon}</div>
        <div class="kpi-change up">${metricData.badge}</div>
      </div>
      <div class="kpi-value">${metricData.value}</div>
      <div class="kpi-label">${metricData.label}</div>
    </div>
  `;
}
```

## 3. Checklist de Validation Avant Déploiement

- [ ] `tsc --noEmit` exécuté sans aucune erreur TypeScript.
- [ ] Raccourci global `Ctrl + K` opérationnel sur toutes les pages.
- [ ] 3 modes du Copilot (Flottant, Tiroir Latéral, Plein Écran) fonctionnels et fluides.
- [ ] Cartes d'action interactives testées (WhatsApp, Devis, Stock, Fiche Atelier).
- [ ] Audio : Reconnaissance vocale et Synthèse vocale actives.
- [ ] Mentions légales officielles (Hassan Tiguidda, ICE 1161674000043, BMCE Bank) préservées.
