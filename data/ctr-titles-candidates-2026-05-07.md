# Pages candidates au fix CTR titles — 2026-05-07

**Source :** GSC API 90 jours (audit `/opt/prio-site/data/gsc-strategy-audit-2026-05-07.md`)
**Critère :** impressions ≥ 50 ET CTR < 1% ET position < 10
**Cross-référencé avec :** Umami LLM landing pages (`/opt/prio-site/data/llm-investigation-2026-05-07.md`)

> ⚠️ **AUCUNE MODIFICATION EFFECTUÉE.** Ce rapport est un diagnostic préparatoire. Les actions seront prises dans une mission ultérieure, séquencée 1 page/jour.

---

## 1. Pages candidates strict (filtres GSC)

7 pages remontées par le filtre. Détail brut :

| URL | Imp 90j | Clk | CTR | Pos | Top query déclencheuse | Title actuel | H1 actuel |
|---|---:|---:|---:|---:|---|---|---|
| `/blog/documents-rent-apartment-spain/` | 709 | 1 | 0.14% | 7.3 | `documents required to rent an apartment in madrid` | "Documents to Rent in Spain (2026): Madrid & Barcelona Guide" | "Documents to Rent an Apartment in Spain (2026) — Madrid, Barcelona & Beyond" |
| `/blog/idealista-vs-fotocasa-vs-badi-comparison/` | 558 | 1 | 0.18% | 6.7 | `idealista vs fotocasa` | "Idealista vs Fotocasa vs Badi 2026: Which Should You Use?" | "Idealista vs Fotocasa vs Badi — Which Platform Should You Use in Spain?" |
| `/blog/barcelona-rental-market-2026/` | 482 | 0 | 0% | 7.5 | `barcelona rent prices 2026` | "Barcelona Rent 2026: Prices by Neighborhood, +8% YoY" | "Barcelona Rental Market 2026 — Prices, Trends & What to Expect" |
| `/blog/barcelona-rental-market-2026-prices-trends/` | 314 | 0 | 0% | 6.9 | `barcelona average rent 2026` | URL **DELETED** + 301'd → exclure | — |
| `/blog/idealista-scams-how-to-spot-fake-listings/` | 313 | 0 | 0% | 7.3 | `is idealista legit` | "Idealista Scams 2026: 37% of Listings Are Fake" | "Idealista Scams in 2026 — How to Spot Fake Listings (With Real Data)" |
| `/legal/privacy/` | 134 | 0 | 0% | 4.5 | `prio security` | "Privacy Policy — Prio" | "Privacy Policy" |
| `/blog/how-to-find-apartment-barcelona-2026/` | 119 | 0 | 0% | 9.6 | `best websites to find apartments for rent in barcelona 2026` | "How to Find an Apartment in Barcelona (2026)" | "How to Find an Apartment in Barcelona in 2026 — The Complete Expat Guide" |

---

## 2. Diagnostic per-page

### 2.1 `/blog/documents-rent-apartment-spain/` — imp 709, CTR 0.14%

- **Top query** : "documents required to rent an apartment in madrid"
- **Title actuel** mentionne Madrid + Barcelona + Spain + Documents → couvre la query.
- **Anomalie** : pos 7.3 → CTR attendu ~3-5%. Mesuré 0.14%. **30× sous-performance**.
- **Hypothèse principale** : SERP US dominée par sites institutionnels (Idealista guide, Spanish.gov, expat.com) qui proposent des listes ; Prio met en avant "1-PDF strategy" → intent mismatch.
- **Diagnostic** : (D) **Title couvre la query mais l'intent est mal calibré**. User cherche une liste, page survend une stratégie.
- **Risque LLM** : 3 sessions ChatGPT confirmées (cf llm-investigation §2). **Risque modéré** — page citée, ne pas casser le signal.

### 2.2 `/blog/idealista-vs-fotocasa-vs-badi-comparison/` — imp 558, CTR 0.18%

- **Top query** : "idealista vs fotocasa"
- **Title actuel** match exactement la query. Hook "Which Should You Use?" est un appel net.
- **Anomalie** : pos 6.7 → CTR attendu ~5-8%. Mesuré 0.18%. **40× sous-performance**.
- **Hypothèse** : SERP dominée par 1-3 résultats "comparator" (Spain expat blogs, Reddit threads avec score), title de Prio rivalisé.
- **Diagnostic** : (D) **Title déjà optimal, problème = SERP concurrence dure** + autorité de domaine faible.
- **Risque LLM** : **7 sessions ChatGPT + 1 Perplexity = page LLM-citée la plus active**. **NE PAS TOUCHER** — risque de casser le signal qui marche déjà côté AI search.

### 2.3 `/blog/barcelona-rental-market-2026/` — imp 482, CTR 0%

- **Top query** : "barcelona rent prices 2026"
- **Title actuel** : "Barcelona Rent 2026: Prices by Neighborhood, +8% YoY" — chargé de hooks (Rent, Neighborhood, +8% YoY).
- **Anomalie** : pos 7.5, 0 click sur 482 imp.
- **Contexte critique** : cette page a été **réécrite 3× en 48 heures** entre 2026-03-22 et 2026-03-25 (commits `bcde9fb`, `55c36b9`, `bb0239f`). **Crash de visibilité observé le 2026-04-03** (cf. `/opt/prio-site/data/diagnostic-2026-05-07.md` §2). C'est le pattern title-thrashing identifié hier.
- **Diagnostic** : (E) **Title techniquement OK, mais en pleine dégradation algorithmique post-thrashing**. Réécrire maintenant aggraverait — le compteur "title changes" de Google est en mode hostile.
- **Risque LLM** : **15 sessions ChatGPT (top landing LLM, ex-aequo avec /)**. Double risque : algo reranking + LLM signal.
- **Verdict** : **NE PAS TOUCHER avant 4-6 semaines de stabilisation post-thrashing**.

### 2.4 `/blog/idealista-scams-how-to-spot-fake-listings/` — imp 313, CTR 0%

- **Top query** : "is idealista legit"
- **Title actuel** : "Idealista Scams 2026: 37% of Listings Are Fake" — accrocheur avec stat.
- **Anomalie** : pos 7.3, 0 click sur 313 imp. Audit GSC §9.2 : -69% imp 28d vs prev28d.
- **Contexte** : commit `bb0239f` du 2026-03-25 a réécrit son title (cf. message commit "lead with '37% of listings are fake' stat"). **Pas 3 fois comme barcelona-rental-market**, mais 2 fois (cluster bb0239f + 55c36b9). Donc semi-thrashing.
- **Diagnostic** : (E) **Page en dégradation post-thrashing, titre actuel correct, attendre stabilisation**.
- **Risque LLM** : **NON cité** par ChatGPT (la version ES `estafas-idealista-como-detectarlas` est citée à la place avec 3 sessions).
- **Verdict** : **NE PAS TOUCHER avant 4-6 semaines**. Mais sans risque LLM, c'est récupérable.

### 2.5 `/legal/privacy/` — imp 134, CTR 0%

- **Top query** : "prio security"
- **Title actuel** : "Privacy Policy — Prio" — minimaliste.
- **Pos** : 4.5 (page 1 SERP), 0 click.
- **Contexte** : c'est une **page legal**. CTR 0% sur "prio security" est attendu — la query a un intent informationnel, pas commercial. La page s'appelle "Privacy Policy", pas "Security" — léger mismatch query/title, mais optimiser une privacy policy pour CTR n'a pas de sens.
- **Diagnostic** : (X) **Pas un candidat de fix CTR**. Page conforme à son rôle legal.
- **Verdict** : **EXCLURE de la liste de fix**.

### 2.6 `/blog/how-to-find-apartment-barcelona-2026/` — imp 119, CTR 0%

- **Top query** : "best websites to find apartments for rent in barcelona 2026"
- **Title actuel** : "How to Find an Apartment in Barcelona (2026)" — 36 chars, concis, sans hook.
- **Anomalie** : pos 9.6 (limite top 10 / page 2), 0 click.
- **Mismatch query/title clair** : la query parle de "best **websites**" (intent = outils/listes), le title parle de "**how to**" (intent = guide step-by-step). User cherchant la query ne reconnaît pas son intent dans le title.
- **Diagnostic** : (D) **Title focalisé "how to" alors que la top query déclencheuse cherche "best websites"**. Un titre couvrant les deux intents (guide + listes plateformes) augmenterait le CTR.
- **Risque LLM** : **NON** — pas dans les pages LLM-citées. Aucun risque à toucher.
- **Verdict** : **CANDIDAT PRIORITÉ 1**.

### 2.7 `/blog/barcelona-rental-market-2026-prices-trends/` — DELETED

- **Status** : URL supprimée + 301'd vers `/blog/barcelona-rental-market-2026/` (commit `2a8a9d9` du 2026-05-01).
- **Verdict** : **EXCLURE**. La page n'existe plus, le 301 fait son travail (deindexation gradual en cours).

---

## 3. Synthèse priorisée

| URL | Imp | CTR | Pos | Diag | Risque LLM | Priorité fix |
|---|---:|---:|---:|---|---|---|
| `/blog/how-to-find-apartment-barcelona-2026/` | 119 | 0% | 9.6 | (D) intent/title mismatch | **NON** | **🟢 P1 — fix recommandé** |
| `/blog/documents-rent-apartment-spain/` | 709 | 0.14% | 7.3 | (D) intent commercial vs informationnel | Modéré (3 sess ChatGPT) | **🟡 P2 — fix avec précaution** |
| `/blog/idealista-vs-fotocasa-vs-badi-comparison/` | 558 | 0.18% | 6.7 | (D) title OK, SERP concurrence | **HAUT (8 sess LLM)** | **🔴 NE PAS TOUCHER** |
| `/blog/barcelona-rental-market-2026/` | 482 | 0% | 7.5 | (E) post-thrashing en cours | **HAUT (15 sess ChatGPT)** | **🔴 NE PAS TOUCHER ≥ 4-6 sem.** |
| `/blog/idealista-scams-how-to-spot-fake-listings/` | 313 | 0% | 7.3 | (E) post-thrashing en cours | NON | **🟡 ATTENDRE 4-6 sem. puis fix** |
| `/legal/privacy/` | 134 | 0% | 4.5 | (X) page legal, hors scope | NON | **EXCLU** |
| `/blog/barcelona-rental-market-2026-prices-trends/` | (deleted) | — | — | URL supprimée | — | **EXCLU** |

→ **2 pages actionnables immédiatement** (P1 + P2 avec précaution)
→ **2 pages bloquées par cooldown post-thrashing** (à laisser 4-6 semaines)
→ **1 page bloquée par risque LLM** (à laisser tant que le signal LLM est positif)
→ **2 pages exclues** (legal + deleted)

---

## 4. Procédure recommandée pour la mission de fix (à venir)

**Lesson learned title-thrashing** : un title rewrite tous les 30 jours minimum par page. Pas de batch.

### Procédure pour chaque page actionnable

1. **Choisir UNE page** parmi P1 ou P2.
2. **Préparer 2-3 variantes de title** alignées avec la top query GSC + l'intent réel.
3. **Présenter les variantes à l'utilisateur**, choisir une.
4. **Appliquer le rewrite UNIQUEMENT sur le title + meta description** — pas le H1, pas le contenu.
5. **Commit + push isolé**, message explicite "title CTR fix on <page>".
6. **NE PLUS TOUCHER cette page pendant 4 semaines minimum**. Pas de rewrite, pas d'ajout JSON-LD, rien.
7. **Monitor** : à J+14, J+28, vérifier dans GSC :
   - Position : doit rester stable ou s'améliorer
   - Impressions : ne doit pas chuter de >20%
   - CTR : doit augmenter (target ≥ 1% pour les pages P1/P2)

### Pages débloquées progressivement

- **Mai 2026 (1 page/jour, 2 jours)** :
  - J1 : `/blog/how-to-find-apartment-barcelona-2026/` (P1)
  - J7+ : `/blog/documents-rent-apartment-spain/` (P2, attendre une semaine pour pas effet de batch)
- **Juin 2026 (après cooldown post-thrashing)** :
  - `/blog/idealista-scams-how-to-spot-fake-listings/` (uniquement si imp s'est stabilisée ≥ 4 sem.)
- **Quand signal LLM stabilise** (à mesurer dans 2-3 mois) :
  - `/blog/barcelona-rental-market-2026/` — uniquement si chute LLM observée OU si ChatGPT a basculé sur autre source
  - `/blog/idealista-vs-fotocasa-vs-badi-comparison/` — uniquement si chute LLM OU si CTR loss s'aggrave

### Variantes de title à préparer (suggestions, à valider en mission de fix)

Pour `/blog/how-to-find-apartment-barcelona-2026/` :
- Variante A (couvre les deux intents) : "Best Websites to Find an Apartment in Barcelona (2026 Guide)"
- Variante B : "How to Find a Barcelona Apartment in 2026 — Best Sites & Tips"
- Variante C : "Find a Barcelona Apartment 2026: Idealista, Fotocasa, Badi Compared"

Pour `/blog/documents-rent-apartment-spain/` :
- Variante A (réponse directe à query Madrid) : "Documents to Rent an Apartment in Madrid & Barcelona (2026 Checklist)"
- Variante B : "What Documents Do You Need to Rent in Spain? (2026)"
- Variante C : "Rent in Spain 2026: Required Documents Checklist (NIE, Payslips, More)"

→ **NE PAS APPLIQUER**. Variantes proposées pour préparation, à valider avec l'utilisateur en mission de fix séparée.
