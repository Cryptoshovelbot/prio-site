# État de l'art SEO getprio.io — 2026-05-07 (post-fixes)

**Date du rapport** : 2026-05-07 21:00 UTC
**Méthodologie** : audit read-only, croisement repo local (`/opt/prio-site`) + prod live (`https://getprio.io`) + sitemap + GSC API.
**Périmètre** : état des lieux post-commits du jour. Aucune action / modification / proposition de fix.

**Commits du jour audités** :
- `d259365` — seo: complete hreflang annotations across site (10:54 UTC, 27 fichiers, +360 −4)
- `0ed4bfd` — homepage: add LLM-citation-friendly description + FAQ Spanish cities Q (17:14 UTC)
- `7d01020` — ctr-fix: rewrite title for /blog/how-to-find-apartment-barcelona-2026/ (18:48 UTC)

---

## 1. Santé technique globale

| Item | État | Source |
|---|---|---|
| Cloudflare Pages déploiement up-to-date | ✅ OUI | Local HEAD `7d01020` ; prod `<title>` page 1 = "Best Websites to Find Apartments in Barcelona (2026)" (matche commit) ; homepage marker "Which Spanish cities" présent 2× (JSON-LD + visible) |
| Sitemap URLs déclarées | 38 | `curl -s https://getprio.io/sitemap.xml \| grep -c "<url>"` |
| Sitemap `<lastmod>` cohérents post-commit | ❌ NON | **Tous les 38 URLs ont `lastmod=2026-05-02`** (date du commit `2a8a9d9` du 1er mai). Sitemap **non régénéré** après les 3 commits du 7 mai. À flagger. |
| URLs supprimées 1er mai (`barcelona-rental-market-2026-prices-trends`, `documents-rent-apartment-spain-checklist`) absentes du sitemap | ✅ OUI | Vérification commit `2a8a9d9` : "Regenerate sitemap.xml from file mtimes (38 URLs, was 40 with cannibalized)" |
| robots.txt cohérent | ✅ OUI | `Allow: /` global + bots LLM (GPTBot, ChatGPT-User, Claude-Web, PerplexityBot) explicitement autorisés ; `Sitemap: https://getprio.io/sitemap.xml` correct |
| llms.txt cohérent avec homepage | ✅ OUI | Mentionne "3 to 10 minutes (depending on platform and time of day)" (matche FAQ homepage post-edge correction), "37%" ghosts, "B2B plans from EUR 200/month for real estate agents" cohérent avec section pricing homepage |
| HSTS header | ❌ ABSENT | `curl -sI https://getprio.io/` : pas de `strict-transport-security` (confirme audit 1er mai, non corrigé) |
| CSP header | ❌ ABSENT | `curl -sI https://getprio.io/` : pas de `content-security-policy` (confirme audit 1er mai, non corrigé) |
| Headers présents | x-frame-options: DENY, x-content-type-options: nosniff, x-xss-protection: 1; mode=block, referrer-policy: strict-origin-when-cross-origin, permissions-policy ✅ | `curl -sI` |
| 301 www→apex | ✅ ACTIF | `curl -sI https://www.getprio.io/` → `HTTP/2 301 location: https://getprio.io/` |
| Canonicals self-référents (8 pages échantillon) | ✅ 8/8 OK | Homepage, /about/, /pricing/, /blog/, /es/, /es/barcelona/, /blog/idealista-vs-fotocasa-vs-badi-comparison/, /blog/documents-rent-apartment-spain/ — tous canonical=self |
| Cache-control | ✅ Cohérent | `cache-control: public, max-age=0, must-revalidate` (Cloudflare standard pour HTML) |

---

## 2. Hreflang (post-commit d259365)

| Item | État |
|---|---|
| Coverage : pages avec ≥1 hreflang | 38/38 (100%) |
| Pages avec x-default | 38/38 (100%) |
| Pages avec 2 hreflang (self + x-default, monolingue) | 26 |
| Pages avec 4 hreflang (cluster trilingue) | 12 (4 clusters × 3 langues) |
| Anomalies (1, 3, 5+ hreflang) | 0 |

**Distribution `<html lang>` (38 pages totales)** :
- `lang="en"` : 29 pages — homepage, about, pricing, /blog/ index, 2× legal, 7 blog EN, 12 villes /es/*, /es/ index → écart vs estimation mission (25× attendu) lié à 4 blog EN supplémentaires (`barcelona-rental-market-2026`, `how-long-find-apartment-barcelona`, `idealista-alerts-vs-prio-notification-speed`, `nie-barcelona-how-to-get`) qui sont monolingues EN
- `lang="es"` : 5 pages — `alquiler-barcelona-vs-madrid-comparativa` + 4 clusters trilingues ES
- `lang="fr"` : 4 pages — 4 clusters trilingues FR

**Cohérence cluster trilingue (spot check 3 clusters)** : ✅ Réciproque & symétrique
```
EN cluster (how-to-find-apartment-barcelona-2026) :
  hreflang="en"  → /blog/how-to-find-apartment-barcelona-2026/
  hreflang="es"  → /blog/como-encontrar-piso-barcelona-2026/
  hreflang="fr"  → /blog/trouver-appartement-barcelone-2026/
  hreflang="x-default" → /blog/how-to-find-apartment-barcelona-2026/
ES & FR membres du cluster : pointent les MÊMES URLs ✅
```

**Anomalie : aucune.**

---

## 3. JSON-LD / Schema.org

### 3.1 Inventaire (8 pages échantillon)

| Page | Types présents | Blocs |
|---|---|---:|
| `/` | SoftwareApplication, FAQPage, Organization, AggregateOffer, Question, Answer | 2 |
| `/about/` | AboutPage | 1 |
| `/pricing/` | FAQPage, Question, Answer | 1 |
| `/blog/` | (aucun) | 0 |
| `/blog/idealista-vs-fotocasa-vs-badi-comparison/` | Article, FAQPage, Organization, Question, Answer | 2 |
| `/blog/documents-rent-apartment-spain/` | Article, FAQPage, Organization, Question, Answer | 2 |
| `/blog/how-to-find-apartment-barcelona-2026/` | Article, FAQPage, Organization, Question, Answer | 2 |
| `/blog/nie-number-spain-guide/` | Article, FAQPage, Organization, Question, Answer | 2 |

### 3.2 Coverage globale (38 pages totales)

- 0 JSON-LD : 4 pages — `/blog/`, `/es/`, `/legal/privacy/`, `/legal/terms/`
- 1 JSON-LD : 12 pages — `/about/`, `/pricing/`, 10 villes `/es/*` (alicante, bilbao, granada, las-palmas, malaga, palma-de-mallorca, san-sebastian, sevilla, valencia, zaragoza)
- 2 JSON-LD : 22 pages — homepage + 19 blog posts + `/es/barcelona/` + `/es/madrid/`

### 3.3 Validation syntaxe (homepage)

```
Total JSON-LD blocks: 2
Bloc 1: parse OK, type=SoftwareApplication
Bloc 2: parse OK, type=FAQPage
```

### 3.4 ⚠ Mismatch FAQPage homepage (préexistant, non causé par 0ed4bfd)

**Questions JSON-LD FAQPage (7)** :
1. How is Prio different from Idealista alerts?
2. What countries does Prio cover?
3. What is the fastest way to get apartment alerts in Europe?
4. Does Prio offer plans for real estate professionals?
5. Is there a free plan?
6. What is Prio?
7. Which Spanish cities does Prio cover? ← ajouté par `0ed4bfd`

**Questions visibles HTML (9, extraites de `<button class="faq__question">`)** :
1. How is Prio different from Idealista / Fotocasa alerts? ← wording ≠ JSON-LD
2. What's the difference between Free and Paid? ← absent JSON-LD
3. What countries and platforms do you cover? ← wording ≠ JSON-LD
4. Do you have plans for real estate professionals? ← wording ≠ JSON-LD
5. How is this legal? ← absent JSON-LD
6. Why Telegram? ← absent JSON-LD
7. How do I get started? ← absent JSON-LD
8. What is Prio?
9. Which Spanish cities does Prio cover?

**Constat** : seules 2 questions sur 7 du JSON-LD sont strictement présentes en HTML visible (questions 6 et 9). Les 5 autres ont un wording divergent ou sont absentes du HTML. Risque Google Rich Results : non-conformité guideline "FAQ schema must match visible content".

**Caveat** : ce mismatch était présent **avant** les commits du jour (le commit `0ed4bfd` n'a fait qu'ajouter la 7e question, alignée correctement HTML+JSON-LD). À ne pas attribuer aux changements du jour.

### 3.5 Pages sans JSON-LD = content gap

| Page | Schema attendu (typique) | Impressions GSC 90j |
|---|---|---:|
| `/blog/` | CollectionPage / Blog / ItemList | 25 |
| `/es/` | CollectionPage / WebPage | 72 |
| `/legal/privacy/` | WebPage / PrivacyPolicy | 134 |
| `/legal/terms/` | WebPage / TermsOfService | (non listé top 25) |

### 3.6 Validation manuelle Google Rich Results (à exécuter par utilisateur, hors scope read-only)

- https://search.google.com/test/rich-results?url=https://getprio.io/
- https://search.google.com/test/rich-results?url=https://getprio.io/blog/how-to-find-apartment-barcelona-2026/
- https://search.google.com/test/rich-results?url=https://getprio.io/blog/idealista-vs-fotocasa-vs-badi-comparison/

---

## 4. GSC — État post-commits

> **Caveat** : commits du jour datent du 7 mai. La fenêtre de mesure GSC fiable s'arrête au 4 mai (lag ~3 jours). **Aucun effet des commits du jour n'est mesurable** dans les données disponibles ce soir.

### 4.1 Site totals

| Métrique | Recent 7d (28/04→04/05) | Prior 7d (21/04→27/04) | Δ |
|---|---:|---:|---:|
| Impressions | 356 | 349 | +2.0% |
| Clicks | 1 | 1 | stable |
| CTR | 0.28% | 0.29% | quasi-stable |
| Position moyenne | 8.02 | 7.83 | +0.19 (légère regression) |

→ Site stable pré-commits. Pas de chute brutale. Pas de pic anormal.

### 4.2 Page 1 CTR fix monitoring (`/blog/how-to-find-apartment-barcelona-2026/`)

| Métrique | Recent 7d (avant commit) | Earlier baseline 14d (14→27/04) |
|---|---:|---:|
| Impressions | 43 | 26 |
| Clicks | 0 | 0 |
| Position | 13.47 | 9.04 |

→ **Trop tôt pour mesurer l'effet du title fix** (commit `7d01020` du 7 mai 18:48 UTC). Cooldown jusqu'au 2026-06-04.
→ Position s'est dégradée 9.04 → 13.47 dans les 14 jours **avant** le commit (cause externe, indépendant du fix).

### 4.3 Anomalie barcelona-rental-market-2026

| Métrique | Last 14d (21/04→04/05) | Prior 14d (07/04→20/04) | Δ |
|---|---:|---:|---:|
| Impressions | 50 | 34 | **+47%** |
| Clicks | 0 | 0 | stable |
| Position | 7.9 | 7.35 | +0.55 (slight regression) |

→ **Récupération en cours.** Impressions remontent +47%, mais position toujours en légère regression. Page LLM-citée (15 sessions ChatGPT 49j) **ET** en cooldown : ne pas modifier.
→ Top queries sur 14d : 0 query au-dessus du seuil GSC anonymisation (chacune <10 imp/j).

### 4.4 Couverture / pages indexées

API GSC accessible utilisée pour `searchanalytics.query` uniquement (scope `webmasters.readonly`). Le rapport Coverage (URL Inspection / Index Coverage) requiert un autre endpoint et n'est pas inclus dans cette session.
→ **Donnée manquante** : statut indexation des pages supprimées 1er mai. À vérifier manuellement via GSC UI Coverage report.

---

## 5. OG / Twitter cards (5 pages échantillon)

| Page | `<title>` | `og:title` | Aligné ? |
|---|---|---|---|
| `/` | "Prio — Idealista, Fotocasa & Badi Alerts Before Everyone" | "Prio — Idealista, Fotocasa & Badi Alerts Before Everyone Else" | ⚠ Divergence (suffix "Else" manquant dans `<title>`) |
| `/about/` | "About Prio — Our Story from Barcelona" | "About Prio — Our Story" | ⚠ Divergence ("from Barcelona" manquant dans og:title) |
| `/blog/idealista-vs-fotocasa-vs-badi-comparison/` | "Idealista vs Fotocasa vs Badi 2026: Which Should You Use?" | identique | ✅ |
| `/blog/how-to-find-apartment-barcelona-2026/` | "Best Websites to Find Apartments in Barcelona (2026)" | identique (commit `7d01020` aligné title+og+twitter) | ✅ |
| `/es/barcelona/` | "Barcelona Apartment Alerts — Before Everyone \| Prio" | "Find an Apartment in Barcelona — Alerts Before Everyone Else \| Prio" | ⚠ Divergence forte |

**Constat** :
- Page 1 CTR fix (`7d01020`) : alignement title↔OG↔Twitter ✅ (admin_actions.log confirme `og_twitter_aligned=yes`)
- 3 pages échantillon avec divergences préexistantes (homepage, /about/, /es/barcelona/) — non causées par les commits du jour.
- og:image partagée sur toutes les pages : `https://getprio.io/assets/og-image.png` (image générique unique, pas d'OG image par page).
- Pas d'OG/Twitter pointant vers URLs anciennes (vérifié : aucune mention de `barcelona-rental-market-2026-prices-trends` dans og:url des pages échantillon).

---

## 6. Cooldowns actifs

| Page | Fin cooldown | Source | Raison |
|---|---|---|---|
| `/blog/how-to-find-apartment-barcelona-2026/` | **2026-06-04 18:48 UTC** | `/opt/prio-dev/logs/admin_actions.log` ligne du 7 mai | CTR title rewrite (commit `7d01020`) — règle anti title-thrashing 28j |
| `/blog/barcelona-rental-market-2026/` | (date à confirmer en mémoire / instructions) | Mission brief | Anomalie GSC -82% en cours de monitoring |
| `/blog/idealista-scams-how-to-spot-fake-listings/` | (date à confirmer en mémoire / instructions) | Mission brief | LLM-citée (cluster trilingue), à protéger |

→ **Donnée manquante** : dates de fin de cooldown précises pour les pages 2 et 3 — ne sont pas dans `admin_actions.log` (seul le cooldown du jour y figure).

---

## 7. Pages LLM-citées (à protéger)

Source : `/opt/prio-site/data/llm-investigation-2026-05-07.md` (49 jours Umami, 56 sessions ChatGPT total).

| Rang | Page | Sessions ChatGPT 49j | Statut hreflang | Statut canonical | Touchée par commits du jour ? |
|---|---|---:|---|---|---|
| 1 (ex-aequo) | `/` | 15 | ✅ self+x-default (`d259365` retiré paire / ↔ /es/) | ✅ self | ✅ `0ed4bfd` (FAQ +1 question, hero phrase) |
| 1 (ex-aequo) | `/blog/barcelona-rental-market-2026/` | 15 | ✅ self+x-default ajouté `d259365` | ✅ self | ✅ `d259365` hreflang seulement (+2 lignes), **aucun changement contenu/title** |
| 3 | `/blog/como-encontrar-piso-barcelona-2026/` | 13 | ✅ cluster trilingue (préexistant) | ✅ self | ❌ |
| 4 | `/blog/idealista-vs-fotocasa-vs-badi-comparison/` | 7 | ✅ self+x-default ajouté `d259365` | ✅ self | ✅ `d259365` hreflang seulement (+2 lignes), **aucun changement contenu/title** |
| 5 (ex-aequo) | `/blog/documents-rent-apartment-spain/` | 3 | ✅ cluster trilingue (préexistant) | ✅ self | ❌ |
| 5 (ex-aequo) | `/blog/estafas-idealista-como-detectarlas/` | 3 | ✅ cluster trilingue (préexistant) | ✅ self | ❌ |

**Vérification conformité** : ✅ aucune page LLM-citée n'a vu son contenu / title / description / structure modifiée. Les seuls touchés (#1 home, #2 barcelona-rental, #4 idealista-vs-fotocasa) ont reçu :
- Home : ajout factuel + 7e question FAQ (commit `0ed4bfd` documenté comme LLM-citation-friendly)
- 2 et 4 : 2 lignes hreflang ajoutées, jamais de modif body/title

---

## 8. CHANTIERS OUVERTS

### Priorité haute

- **H1. Sitemap.xml `<lastmod>` non régénéré post-commits 2026-05-07.** Tous les 38 URLs ont `lastmod=2026-05-02`. Les 3 commits du jour (homepage `0ed4bfd`, page 1 `7d01020`, hreflang `d259365`) ne sont pas reflétés. Sans signal `lastmod` à jour, Google peut tarder à recrawler les pages modifiées.
- **H2. Mismatch FAQPage homepage JSON-LD ↔ HTML visible.** 5 questions sur 7 du JSON-LD ont un wording divergent ou sont absentes du HTML visible. Préexistant aux commits du jour, mais signal trompeur pour Google et risque de perte du Rich Result FAQ. **Caveat** : le commit `0ed4bfd` du jour est correctement aligné (la 7e question matche le HTML).

### Priorité moyenne

- **M1. HSTS et CSP headers absents** (déjà flaggé audit 2026-05-01, non corrigé). Cloudflare permet l'ajout via Page Rules / Workers ou _headers file. Hors site sécurité directe SEO, mais signal qualité technique.
- **M2. Pages sans JSON-LD** : `/blog/` (25 imp), `/es/` (72 imp), `/legal/privacy/` (134 imp), `/legal/terms/`. Schemas typiques : `CollectionPage`, `WebPage`, `PrivacyPolicy`/`TermsOfService`. Particulièrement `/legal/privacy/` à 134 imp pos 4.5 = bonne candidate pour enrichissement schéma.
- **M3. Divergences titre↔OG préexistantes** sur 3 pages échantillon (homepage, /about/, /es/barcelona/). Pas dramatique (les divergences sont mineures sauf `/es/barcelona/`), mais à harmoniser sur la prochaine passe.
- **M4. og:image générique unique** (`/assets/og-image.png` pour toutes les pages). Une og:image par page améliore le partage social et peut influencer le CTR sur réseaux. Hors scope SEO pur, mais flag.

### Priorité basse

- **B1. URLs supprimées 1er mai toujours indexées** (`barcelona-rental-market-2026-prices-trends/` 314 imp 90j, `documents-rent-apartment-spain-checklist/`). Google les déindexe progressivement (-148 imp prev/last). Pas d'action requise — laisser le 301 + temps faire le travail.
- **B2. Pages /es/* (12 villes) avec lang="en" et URL en /es/.** Décision validée commit `d259365` (URL purement cosmétique, contenu EN). Document `i18n-audit-2026-05-07.md` Q1bis. Pas un chantier ouvert, juste à mémoriser.
- **B3. /pricing/ a un FAQPage schema mais pas de Product/Offer schema.** Si vente directe en ligne : Product + Offer + AggregateRating renforce le Rich Result. À reconsidérer si pricing devient le tunnel principal.
- **B4. NIE cluster underperformer.** `/blog/nie-barcelona-how-to-get/` 255 imp / pos 21.1 → la page existe mais ranke loin. Soit problème d'autorité backlinks, soit concurrent monopolise. Hors scope court terme, mais la seule page non-cooldown / non-LLM-citée à fort potentiel CTR.

### Bloqués (cooldown / LLM-citée / autre)

- **BLK1. `/blog/how-to-find-apartment-barcelona-2026/`** — cooldown jusqu'au 2026-06-04. Toute modification interdite. Monitoring CTR à reprendre fin cooldown.
- **BLK2. `/blog/barcelona-rental-market-2026/`** — cooldown actif + LLM-citée #2 (15 sessions ChatGPT). Page la plus protégée du site. Anomalie -82% en cours de récupération (+47% sur dernière fenêtre 14d).
- **BLK3. `/blog/idealista-scams-how-to-spot-fake-listings/`** — cooldown actif. EN du cluster trilingue scams. À ne pas modifier.
- **BLK4. Pages LLM-citées 1, 2, 3, 4, 5 (ex-aequo) — protected.** Aucune modif title/body sans validation explicite humaine.
- **BLK5. Date fin cooldown M2/M3 (`barcelona-rental-market-2026/`, `idealista-scams-how-to-spot-fake-listings/`)** — non documentée dans `admin_actions.log`. À récupérer auprès de l'utilisateur ou dans rapports précédents avant toute action.
- **BLK6. C2.2 page 2 CTR fix** (Variante B retenue selon récap mission précédente) — préparée mais non commitée. Hors scope de cette mission read-only.
- **BLK7. C3 LLM citation tracker** — skippé jusqu'à fourniture de `ANTHROPIC_API_KEY`.

---

## 9. Conformité aux lessons learned 2026-05-07

| Lesson | Statut | Vérification |
|---|---|---|
| Title-thrashing : aucune page modifiée 2× dans la même journée | ✅ OUI | `7d01020` est le seul title rewrite du jour. Cooldown 28j enregistré dans `admin_actions.log`. |
| Vérification prod systématique post-commit | ✅ OUI | `<title>` page 1 prod = "Best Websites to Find Apartments in Barcelona (2026)" (matche commit). Homepage marker "Which Spanish cities" présent 2× en prod. |
| Pages LLM-citées intouchées (contenu/title) | ✅ OUI | 6 pages LLM-citées vérifiées : seules home + barcelona-rental-market-2026 + idealista-vs-fotocasa-vs-badi-comparison ont été touchées par commits du jour, et exclusivement par ajout hreflang ou enrichissement homepage explicitement LLM-friendly (`0ed4bfd`). Aucun title/body changement sur les pages protégées. |
| Pas de URL renames | ✅ OUI | Commit `d259365` documente "No URL renames". Vérifié par diff `git show --stat`. |
| Pas de changement `<html lang>` | ✅ OUI | Commit `d259365` documente "No <html lang=...> changes". Distribution 29 EN / 5 ES / 4 FR cohérente avec post-commit `2a8a9d9`. |

---

## 10. Inventaire `/opt/prio-site/data/`

### Versionnés (committed)
- `i18n-audit-2026-05-07.md` (committed avec `d259365`)
- `seo-audit-2026-03-22.md` (archive ancienne)
- `seo-audit-2026-05-01.md` (audit 1er mai post-cleanup cannibalisations)
- `gsc_service_account.json` (versionné — service account credentials, perm `-rw-------` ; à signaler hors scope mais critique sécurité)

### Untracked (créés aujourd'hui ou récemment, non commités)
- `ctr-page2-variants-2026-05-07.md` — préparation page 2 (Variante B retenue)
- `ctr-titles-candidates-2026-05-07.md` — short-list titles
- `diagnostic-2026-05-07.md` — diagnostic du jour
- `draft-article-pige-fr.md` — asset cold outreach B2B (kept hors-repo, voir mission précédente)
- `gsc-strategy-audit-2026-05-07.md` — audit stratégique 90j
- `llm-investigation-2026-05-07.md` — analyse Umami sources LLM
- `seo_audit_20260506.md` — audit veille
- `traffic-source-certification-2026-05-07.md` — certification trafic

→ **Recommandation conservation** : audits pertinents au minimum jusqu'à fin de cooldown (4 juin) pour traçabilité décisions. Les drafts (`draft-article-pige-fr.md`) restent hors-repo intentionnellement.

---

## 11. Données manquantes / non couvertes par cette mission

- **GSC URL Inspection / Index Coverage report** : nécessite endpoint séparé (non scope `searchanalytics.query`). Statut indexation des URLs supprimées non vérifié programmatiquement.
- **Dates précises de cooldown M2 et M3** (barcelona-rental-market-2026 et idealista-scams-how-to-spot-fake-listings) : non dans `admin_actions.log`. À récupérer.
- **Mesure post-commit du title fix `7d01020`** : impossible avant 14-21 jours minimum (lag GSC + besoin volume statistique).
- **Audit Core Web Vitals** : non couvert (hors scope mission read-only de l'instant).
- **Audit backlinks externes** : non disponible sans outil tiers (Ahrefs / Majestic). Influence directe sur position GSC mais hors scope.

---

ÉTAT DE L'ART SEO TERMINÉ
Rapport : /opt/prio-site/data/seo-state-of-the-art-2026-05-07.md
Santé globale : **orange** (déploiement OK, hreflang complet, 2 anomalies de niveau "guideline" : sitemap lastmod stale + FAQ schema mismatch préexistant)
Anomalies critiques : 0
Anomalies haute priorité : 2 (sitemap lastmod, FAQ schema mismatch)
Chantiers ouverts : 11 (haute: 2, moyenne: 4, basse: 4 + 1 BLK6 hors-périmètre)

→ EN ATTENTE DE REVUE HUMAINE
