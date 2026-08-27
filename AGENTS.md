# AGENTS.md — Marrakech Craft Conduit Engineering Standards & Architecture

> **Plateforme :** MARRAKECH CRAFT CONDUIT — Autonomous B2B Artisan Export Engine  
> **Auteur & Dirigeant :** Hassan Tiguidda (Auto-Entrepreneur)  
> **Version du Système :** 2.0.0 (Enterprise Suite & AI Copilot 360°)

---

## 1. Vision & Architecture Globale

Marrakech Craft Conduit est une infrastructure B2B haut de gamme dédiée à l'exportation directe de l'artisanat marocain d'excellence depuis les ateliers de la Médina de Marrakech vers les concept stores, studios d'architecture d'intérieur et importateurs d'Europe, d'Amérique et du monde.

L'application repose sur un écosystème en 3 couches :
1. **Directives (SOPs)** : Procédures opérationnelles standardisées documentées dans `directives/`.
2. **Orchestration & Copilot 360°** : Moteur d'intelligence contextuelle et déterministe (`craftBrainService.ts` / `app.js`) assurant la coordination en temps réel du catalogue, des stocks, des ateliers et des flux de prospection.
3. **Exécution Déterministe** : Scripts Python (`execution/` & `services/`) et interfaces riches pour le scraping, la qualification multi-agents, la génération de devis/lookbooks WeasyPrint et l'expédition automatisée via Resend API.

---

## 2. Architecture de Composants Atomiques

Tous les composants de l'interface doivent respecter une structure atomique stricte, garantissant composabilité, modularité et isolation des états.

### Composants Clés :
```
┌─────────────────────────────────────────────────────────────┐
│                       <AppShell>                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ <AppHeader> [Brand | Live Status | Copilot Trigger | Auth]│ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ <TabNav> [Leads | Engine | Copilot AI | Outreach | ...] │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ <MainContent>                                           │ │
│ │  ├── <MetricCardGrid> -> [<MetricCard>, <MetricCard>...]│ │
│ │  ├── <FilterBar> [CategoryChips, StatusFilter, Search]  │ │
│ │  ├── <CraftGrid> / <DataTable>                          │ │
│ │  └── <OrderDrawer> / <InvoicePanel>                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ <CopilotModal> [Floating 🪟 | Drawer 📑 | Fullscreen 🖥️] │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ <CopilotFloatingTrigger> (Bottom-Right Widget)          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

1. **`<MetricCard>`** :
   - Affiche un KPI clé (Volume, Prospects, Stock, Commandes).
   - Inclut : Icône de contexte, valeur typographiée en grand format, badge d'évolution (+12%, Live, 100% Réel) et libellé descriptif.
2. **`<CraftGrid>`** :
   - Grille responsive présentant les fiches produits, ateliers et Maâlems avec badges de statut (Disponibilité, MOQ, Délai).
3. **`<FilterBar>`** :
   - Barre de filtrage combinée : puces de catégories artisanales (Tapis, Céramique, Laiton, Cuir, Vannerie, Bois), sélecteur de statut de commande/prospect, et champ de recherche instantané.
4. **`<OrderDrawer>` & `<InvoicePanel>`** :
   - Tiroir d'édition de devis / facture pro forma avec calcul automatique de TVA exonérée (Art 91-II-1° CGI), remises de volume dégressives (1-5 pcs 0 MOQ, 6-50 pcs -15%, 50+ pcs -35%), et export PDF.
5. **`<CopilotModal>`** :
   - Assistant 360° omniprésent accessible partout via `Ctrl + K`, bouton de header, ou widget flottant. Supporte 3 modes dynamiques (Flottant, Volet latéral, Plein écran).

---

## 3. Règle Stricte des 3 États (Loading, Empty, Error)

Chaque vue de données asynchrone ou dynamique **DOIT** implémenter rigoureusement ces 3 états :

### A. État de Chargement (Loading Skeleton Shimmer)
- Utilisation de skeletons animés (`.skeleton-shimmer`) reproduisant la disposition réelle plutôt qu'un simple spinner.
- Transition douce en fondu (`fade-in 300ms`) lors de l'arrivée des données.

### B. État Vide (Empty State Explicite avec Action)
- Jamais de conteneur vide ou tableau blanc sans explication.
- Structure obligatoire :
  - Icône illustrative grand format (`🏺`, `⚡`, `📋`).
  - Titre clair de l'état (ex: *"Aucun prospect dans cette catégorie"*).
  - Texte explicatif contextualisé.
  - Bouton d'action principal CTA (ex: `+ Ajouter un Prospect`, `🚀 Lancer le Sourcing Automatique`).

### C. État d'Erreur (Error Fallback & Graceful Recovery)
- Capture locale des erreurs sans crash global.
- Message explicite avec bouton de nouvelle tentative (`↻ Réessayer`).
- Fallback déterministe automatique pour les requêtes IA et données locales si une API tierce est inaccessible.

---

## 4. Charte Graphique "Moroccan Craft Luxury"

L'interface arbore une identité visuelle luxueuse, chaleureuse et moderne, inspirée des matières nobles de l'artisanat marocain et du patrimoine de Marrakech.

| Élément | Couleur / Token | Valeur Hex / CSS | Usage |
| :--- | :--- | :--- | :--- |
| **Fond Principal** | `bg-slate-950` | `#020617` | Arrière-plan sombre profond |
| **Fond Cartes** | `bg-card` | `rgba(15, 23, 42, 0.75)` | Glassmorphism avec `backdrop-blur(16px)` |
| **Terracotta Médina** | `terracotta` | `#C2410C` / `#EA580C` | Boutons chauds, accents poterie & cuir |
| **Bleu Majorelle** | `majorelle` | `#1E3A8A` / `#2563EB` | Accents royaux, badges vérifiés, liens |
| **Ambre Doré / Safran**| `saffron-gold` | `#D97706` / `#F59E0B` | Étoiles, métriques clés, boutons d'action IA |
| **Bordures Subtiles** | `border-subtle` | `rgba(255, 255, 255, 0.08)` | Délimitation nette des cartes et tiroirs |
| **Typographie Titres** | `font-display` | `'Outfit', 'Cinzel', sans-serif` | Richesse et élégance |
| **Typographie Corps** | `font-body` | `'Inter', system-ui, sans-serif` | Lisibilité maximale des chiffres et données |

---

## 5. Mentions Administratives & Bancaires Officielles

Pour toute génération de devis, facture pro forma, certificat d'origine ou accord commercial, les mentions suivantes font foi :

- **Raison Sociale :** AUTO-ENTREPRENEUR HASSAN TIGUIDDA
- **Marque Commerciale :** MARRAKECH CRAFT CONDUIT
- **Siège d'Exploitation :** Les portes de Marrakech Zone 16 imm 118 app 03, Marrakech, Maroc
- **Identifiant Commun de l'Entreprise (ICE) :** `1161674000043`
- **Banque Partenaire :** BMCE Bank (Bank of Africa)
- **Relevé d'Identité Bancaire (RIB) :** `007450001399370030009822`
- **Code SWIFT / BIC :** `BCMAMAMC`
- **Téléphone & WhatsApp Officiel :** `+212 632 155 430`
- **Email Commercial :** `tiguidda76@gmail.com`
- **Portfolio & Lookbook Officiel :** `https://sites.google.com/view/morkech/home`
- **Régime Fiscal Export :** *« Montant en dirhams exonéré de la TVA (Art 91 - II - 1° du Code Général des Impôts) »*
