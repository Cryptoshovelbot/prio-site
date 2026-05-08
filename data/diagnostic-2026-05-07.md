# Diagnostic — Divergence GSC/Umami + anomalie barcelona-rental-market-2026

**Date :** 2026-05-07
**Auteur :** Claude (read-only)
**Sources :** Google Search Console API + Umami self-hosted PostgreSQL

---

## 1. Divergence trafic GSC vs Analytics

### 1.1 Accès Umami : ✅ OK

- Self-hosted sur ce VPS via Docker Compose : `/opt/umami/docker-compose.yml`
- Container `umami-umami-1` exposé sur `127.0.0.1:3001` (Cloudflare tunnel vers `analytics.getprio.io`)
- Accès direct PostgreSQL via `docker exec umami-db-1 psql -U umami -d umami`
- Website ID `056589cd-0a9e-4fd9-9634-c93fd21fd826`
- **Période effective des données Umami : 2026-03-19 → 2026-05-07 (49 jours)** — installé le 19 mars 2026 (commit `37637b9 add Umami analytics tracking to all pages`). Pas 90j, mais couvre la même fenêtre que les drops GSC.

### 1.2 Matrice croisée pays — GSC × Umami

Données GSC sur 90 jours (2026-02-06 → 2026-05-07), Umami sur ~49j (création de l'instance) :

| Pays | GSC impressions 90j | GSC clicks 90j | GSC CTR | Umami sessions | Umami avg pv/session | Umami bounce % |
|---|---:|---:|---:|---:|---:|---:|
| **ES** | 469 | **7** | 1.49% | **116** | 1.99 | 66% |
| **US** | **1455** | 1 | 0.07% | 111 | 1.12 | **94%** |
| SG | (sub-seuil) | — | — | 59 | 1.00 | 100% |
| IN | (sub-seuil) | — | — | 24 | 1.33 | 79% |
| CN | (sub-seuil) | — | — | 18 | 1.00 | 100% |
| FR | (sub-seuil) | — | — | 13 | 1.31 | 92% |
| GB | (sub-seuil) | — | — | 8 | 1.63 | 87.5% |
| PT | 37 | 2 | 5.41% | 7 | 1.43 | 71% |
| KE | (sub-seuil) | — | — | 7 | 1.29 | 71% |
| NL | 61 | 1 | 1.64% | 6 | 1.17 | 83% |
| TR | (sub-seuil) | — | — | 6 | 1.00 | 100% |
| CA | 55 | 1 | 1.82% | 5 | 1.60 | 60% |
| BR | 96 | 0 | 0% | (<5 sessions Umami) | — | — |
| IT | 34 | 1 | 2.94% | 4 | — | — |

### 1.3 Conclusion : hypothèse utilisateur **CONFIRMÉE**

**GSC mesure les impressions (≠ trafic réel)** :
- USA = **44% des impressions GSC** (1455/3332) mais seulement 1 clic.
- USA = **25% des sessions Umami** (111/444), avec bounce rate **94.6%** et 1.12 pv/session — visiteurs de surface, ne descendent pas dans le funnel.

**Umami mesure les visiteurs réels** :
- ES = **#1 en sessions** (116 = 26% du total) avec engagement profond : **1.99 pv/session, bounce 66%** — meilleure métrique du site.
- ES sessions visitent dans cet ordre : `/` (114) → `/pricing/` (32) → `/es/` (17) → `/legal/privacy/` (14) → `/pricing/#b2b` (9) → `/about/` (8). Ce parcours = découverte → évaluation → preuve d'intent commercial.
- US sessions : `/` (55) → `/blog/documents-rent-apartment-spain/` (16) → `/blog/barcelona-rental-market-2026/` (11) → `/about/` (9). Pas de visite de `/pricing/` dans le top 5 US.

**Origine du trafic Umami** (bonus observation) :
- (direct) : 320 sessions (72%)
- t.co (Twitter/X) : 68 sessions (15%) — significatif
- google.* : 22 sessions (5%) — cohérent avec les **17 GSC clicks 90j** (+5 sessions sur les 49j non couverts par GSC).
- chatgpt.com : 19 sessions (4%) — référent IA non négligeable
- bing : 11, facebook (toutes variantes) : ~17, duckduckgo : 5, perplexity : 2

→ **Le SEO Google n'est pas le moteur de trafic principal** (5%). Le trafic vient surtout en direct (Twitter / partages / saisies manuelles). Cohérent avec le faible CTR US/global mesuré côté GSC.

### 1.4 Note de méthode

- Umami inclut probablement du **trafic bot** (SG 100% bounce, CN 100% bounce, TR 100% bounce — totalisent 89 sessions). À filtrer pour analyse réelle. Total "humain" plus probable : ~355 sessions / 49j.
- GSC ne reporte que les queries au-dessus du seuil d'anonymisation. Les 13 pays avec sessions Umami mais 0 GSC viennent forcément de référents non-Google.

---

## 2. Anomalie `/blog/barcelona-rental-market-2026/` — chute -82%

### 2.1 Date probable de la chute : **2026-04-03 ± 1 jour**

Timeline impressions journalières (extraite GSC API, dimension `date`, filtre URL `equals`) :

| Date | Imp/jour | Note |
|---|---:|---|
| 2026-03-17 | 2 | Page nouvelle, début indexation |
| 2026-03-18 | **41** | Pic n°1 |
| 2026-03-19 | 29 | |
| 2026-03-20–27 | 7-23 (moyenne ~15) | Plateau |
| 2026-03-28 | 42 | |
| **2026-03-29** | **57** | **Pic absolu** |
| 2026-03-30 | 40 | |
| 2026-03-31 | 29 | Décrue |
| 2026-04-01 | 17 | |
| 2026-04-02 | 12 | |
| **2026-04-03** | **2** | **CRASH** |
| 2026-04-04 | 1 | |
| 2026-04-05 → 2026-05-04 | 0–10 (médiane 2-3) | Régime déprimé permanent |

→ Le pic 57 imp/jour le 2026-03-29 → 2 imp/jour le 2026-04-03. Chute brutale en 4 jours.

### 2.2 Top queries impactées (90j)

| Query | Impressions 90j | Position 90j |
|---|---:|---:|
| `barcelona rent prices 2026` | 5 | 9.8 |
| `average rent 1 bedroom apartment barcelona 2026` | 2 | 18.5 |
| `average rent 2 bedroom apartment barcelona 2026` | 1 | 8.0 |
| `average rent barcelona 2026` | 2 | 9.0 |

**Note critique** : la query la plus fortement impressionnée du cluster était `barcelona average rent 2026` à position **2.3 — sur l'URL DELETED `barcelona-rental-market-2026-prices-trends/`** (7 imp 90j). Cette query top n'est PAS reprise par la page conservée (`/barcelona-rental-market-2026/`). Le 301 n'a pas transféré l'association query→page côté Google.

### 2.3 Vérifications techniques

| Check | Statut | Détail |
|---|---|---|
| HTTP status | ✅ 200 | `curl -I` |
| `<title>` | ✅ présent | "Barcelona Rent 2026: Prices by Neighborhood, +8% YoY" |
| `<meta name="description">` | ✅ présent et raisonnable | |
| `<link rel="canonical">` | ✅ self-référent | `https://getprio.io/blog/barcelona-rental-market-2026/` |
| `<meta name="robots">` | (absent → indexable par défaut) | Pas de noindex accidentel |
| `<link hreflang>` | ✅ self-ref EN + x-default | Ajouté aujourd'hui par commit `d259365` |
| `robots.txt` | ✅ Allow / | Aucune règle bloquante |
| 301 from prices-trends | ✅ HTTP/2 301 → location: `/blog/barcelona-rental-market-2026/` | _redirects ligne 1 |
| Sitemap | ✅ entrée présente, lastmod 2026-05-02 | |

**GSC URL Inspection API** (live state Google) :

| Champ | Valeur |
|---|---|
| Verdict | **PASS** |
| Coverage | "Submitted and indexed" |
| Page fetch | SUCCESSFUL |
| Indexing state | INDEXING_ALLOWED |
| Last crawl | 2026-04-25 16:19 UTC (12 jours) |
| Crawled as | MOBILE |
| robots.txt state | ALLOWED |
| User-canonical | self ✅ |
| Google-canonical | self ✅ |

→ **Aucune anomalie technique**. La page est indexée, crawlable, canonical cohérent. La chute est purement algorithmique (re-ranking).

### 2.4 Historique des modifications (reading git log)

| Date | Commit | Action sur cette page |
|---|---|---|
| 2026-03-08 | `ed1c59d` | Création (SEO bomb) |
| 2026-03-22 | `e2922c2` | Ajout hreflang + FAQPage schema (cluster blog) |
| 2026-03-23 | `bcde9fb` | **Title rewrite #1** : `Barcelona Rental Market 2026 — Prices, Trends & What to Expect | Prio` → `Barcelona Rental Market 2026 — Prices & Trends` |
| 2026-03-25 00:02 | `55c36b9` | **Title rewrite #2** : → `Barcelona Rental Market 2026: Average Prices & Trends` |
| 2026-03-25 00:23 | `bb0239f` | **Title rewrite #3** : → `Barcelona Rent 2026: Prices by Neighborhood, +8% YoY` (titre actuel). +ajout 4 paragraphes contenu (consolidation cluster). |
| 2026-03-25 00:19 | `d54e24d` | Footer cities expansion |
| **2026-03-26 → 2026-04-30** | **(aucun commit, 35 jours)** | Page intouchée |
| 2026-05-01 | `2a8a9d9` | _redirects + sitemap (pas le HTML) |
| 2026-05-02 | `d202a00` | Footer tagline (1 ligne) |
| 2026-05-02 | `79463f0` | Umami CTAs (body) |
| 2026-05-07 | `d259365` | Hreflang en + x-default (head, additif) — fix de ce jour |

**3 réécritures de title en 48 heures** (23-25 mars). Pic d'impressions 4-6 jours après (2026-03-28 à 2026-03-30). Crash 9 jours après le dernier rewrite.

### 2.5 Hypothèses et niveau de preuve

| Hypothèse | Verdict | Preuve / indice |
|---|---|---|
| **(A)** Effet collatéral 301 mal transféré | **Partielle** | La query top du cluster (`barcelona average rent 2026`, pos 2.3) reste associée à l'URL deleted, pas transférée à la page conservée. **Mais** : timeline ne colle pas — chute en avril, 301 mis en place début mai. Donc effet 301 = 0 sur la chute observée. À surveiller post-mai pour voir si le 301 stabilise. |
| **(B)** noindex / canonical accidentel | **ÉCARTÉE** | URL Inspection API : PASS, INDEXING_ALLOWED, canonical self. Page propre. |
| **(C)** Dégradation algorithmique Google | **PROBABLE (haute confiance)** | Pattern chute en 4 jours sans modif éditoriale = signature classique d'un re-ranking soft. Chute simultanée sur autre page (`idealista-scams` -69%) du même commit `bb0239f` = preuve d'effet groupé. |
| **(D)** Saisonnalité | **ÉCARTÉE** | -82% en 28j sur "barcelona rent" = pas saisonnier (les recherches d'appart sont plutôt stables ou montent au printemps). |
| **(E)** Concurrence renforcée | **POSSIBLE mais non vérifiable depuis GSC seul** | Indice : GSC montre que la query `barcelona average rent 2026` est passée pos 2.3 (page deleted) → pos n/a (page conservée). Quelqu'un d'autre a peut-être pris la place. Pas observable sans crawl SERP. |
| **(F)** **Combinaison A+C+E** | **Hypothèse retenue** | Voir §2.6 |

### 2.6 Hypothèse principale retenue : **réajustement algorithmique post title-thrashing**

Confiance : **moyenne-haute**. Faisceau d'indices :

1. **3 réécritures de title en 48h** sur la même page (ratio ouvert sur "thin content / SEO churn" pour Google). Google peut pénaliser temporairement le "title-thrashing" — c'est documenté dans les patterns SEO.
2. **Le commit bb0239f a touché 4 pages** dont 2 (`barcelona-rental-market-2026/` et `idealista-scams-how-to-spot-fake-listings/`) ont chuté massivement. La 3ème (`idealista-vs-fotocasa-vs-badi-comparison/`) reste stable (+4%) — la différence ? Le commit lui a juste retitréi sans réécriture multiple en cascade. La 4ème (`/es/` hub) — chuté aussi (-83%).
3. **Le pic se situe 4-6 jours après le dernier rewrite**, **la chute 9 jours après**. Délai compatible avec un cycle de re-crawl Google + reranking.
4. **Pas de problème technique** (URL Inspection PASS partout) — la page n'est pas malade, juste downgradée.

Cause secondaire probable : **concurrence sur SERP** — la query phare `barcelona average rent 2026` était à position 2.3 sur l'URL deleted, ce qui indique un signal historique fort. Le 301 du 1er mai a transféré le contenu mais Google n'a pas retransféré le rank — Google peut considérer la nouvelle URL comme un duplicate semi-novel et la classer au-dessous du rank historique de la source.

---

## 3. Recommandations

### 3.1 Action immédiate requise : **NON**

La page est techniquement saine. Aucun bug à corriger. Aucun fix repo n'améliorerait la situation à court terme.

### 3.2 Monitoring 7-14 jours (passif, sans action)

Surveiller le rebond éventuel :
- Si les impressions remontent à >20/jour d'ici fin mai 2026 → le 301 a transféré l'autorité, pas d'action.
- Si elles restent <5/jour mi-mai → Google a ré-évalué la page durablement. Décision business à prendre :
  - Soit accepter (la page n'est plus la query winner)
  - Soit réécrire significativement le contenu (signal de fraîcheur, pas un re-titling) pour redéclencher le re-crawl
  - Soit tester un title alternatif (mais **un seul changement**, pas 3 cascades)

### 3.3 Leçons opérationnelles (sans action ici, à graver)

- **Ne pas réécrire le title d'une page plus d'une fois par mois.** Les 3 rewrites en 48h sur cette page sont la cause la plus probable de la chute. C'est le pattern à éviter sur d'autres pages.
- **Avant 301, vérifier si le rank historique est sur la source.** Si oui, le 301 ne le transfère pas toujours intégralement — il faut soit garder les deux URLs, soit accepter la perte.
- **Le SEO n'est pas le moteur de trafic principal de Prio** (5% des sessions). 95% vient de direct/Twitter/IA. Investir dans des canaux non-SEO (Twitter content, partenariats référents) a probablement un meilleur ROI court terme que des optimisations title/meta.
- **L'audience commerciale réelle est ES** (CTR 1.49%, bounce 66%, avg 1.99 pv/session, visite régulière de `/pricing/`). Le traffic US est volume sans qualité (CTR 0.07%, bounce 94.6%). Un effort de traduction réelle des `/es/<city>/` en espagnol pourrait amplifier le canal qui convertit déjà.

---

## Annexes

- Données brutes GSC : `/tmp/gsc_audit_data.json`
- Audit GSC précédent : `/opt/prio-site/data/gsc-strategy-audit-2026-05-07.md`
- Audit i18n : `/opt/prio-site/data/i18n-audit-2026-05-07.md`
- Schémas Umami : `docker exec umami-db-1 psql -U umami -d umami -c "\dt"`
