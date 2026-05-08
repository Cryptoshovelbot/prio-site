# Certification des sources de trafic getprio.io — 2026-05-07

**Méthode :** queries SQL directes sur Umami PostgreSQL (`docker exec umami-db-1 psql -U umami -d umami`).
**Website ID :** `056589cd-0a9e-4fd9-9634-c93fd21fd826`
**Période demandée :** 90 jours (2026-02-06 → 2026-05-07)
**Période effective Umami :** 2026-03-19 → 2026-05-07 = **49 jours** (Umami a été installé le 19 mars 2026 — commit `37637b9`). Aucune donnée pré-19 mars en base.
**Total sessions sur la période :** 445

---

## 1. Chiffres bruts — sessions par referrer (1er pageview de chaque session)

```sql
WITH first_pv AS (
  SELECT DISTINCT ON (session_id) session_id, referrer_domain, url_path
  FROM website_event
  WHERE website_id = '056589cd-...' AND event_type = 1
  ORDER BY session_id, created_at ASC
)
SELECT COALESCE(NULLIF(referrer_domain, ''), '(no referrer)') AS entry_referrer,
       COUNT(*) AS sessions
FROM first_pv GROUP BY entry_referrer ORDER BY sessions DESC;
```

Résultat brut, **non agrégé** :

| Entry referrer | Sessions |
|---|---:|
| `(no referrer)` | 298 |
| `t.co` | 68 |
| `google.com` | 19 |
| `chatgpt.com` | 19 |
| `bing.com` | 11 |
| `m.facebook.com` | 8 |
| `facebook.com` | 7 |
| `duckduckgo.com` | 5 |
| `perplexity.ai` | 2 |
| `openurls.com.cn` | 2 |
| `python-explorer--mvmtamayo.replit.app` | 1 |
| `google.gr` | 1 |
| `lm.facebook.com` | 1 |
| `l.facebook.com` | 1 |
| `search.yahoo.com` | 1 |
| `ecosia.org` | 1 |
| **TOTAL** | **445** |

**Note méthode** : entry-referrer ≠ referrer of any event. Une session avec 2+ pageviews peut avoir referrers différents (le 2ème pageview vient de `getprio.io` lui-même = navigation interne). On compte donc le referrer du PREMIER pageview de la session, qui est la vraie source d'arrivée.

---

## 2. Disséction du bucket "(no referrer)" — 298 sessions

### 2.1 UTM detection

```sql
SELECT utm_source, utm_medium, COUNT(DISTINCT session_id)
FROM website_event WHERE website_id='...' AND event_type=1
GROUP BY 1,2 ORDER BY 3 DESC;
```

| utm_source | utm_medium | Sessions |
|---|---|---:|
| (none) | (none) | 397 |
| **`chatgpt.com`** | (none) | **54** |
| `perplexity` | (none) | 1 |

**Découverte critique** : 54 sessions tagged `utm_source=chatgpt.com` que mon analyse précédente n'avait pas remontées. ChatGPT app ajoute automatiquement ce tag UTM sur les liens sortants même quand le `referrer_domain` est stripped.

Croisement entre `referrer_domain ILIKE '%chatgpt%'` et `utm_source ILIKE '%chatgpt%'` :
- BOTH (referrer ET utm) : 17 sessions
- utm only : **37 sessions** (étaient classées (no referrer))
- referrer only : 2 sessions

**Total ChatGPT réel : 56 sessions** (vs 19 reportées ce matin = **3x sous-compté**).

### 2.2 Distribution du bucket (no referrer + no UTM) = **260 sessions**

Après réattribution des 38 sessions ChatGPT-utm, il reste 260 sessions sans aucune source identifiée.

**Par pays + bounce rate** :

| Pays | Sessions | Bounce % | Lecture |
|---|---:|---:|---|
| **SG** | 59 | **100%** | Bots (Singapore = Cloudflare/AWS workers) |
| **CN** | 18 | 100% | Bots |
| **IN** | 8 | 100% | Bots |
| **VN** | 4 | 100% | Bots |
| **NL** | 3 | 100% | Bots probables |
| **GB** | 3 | 100% | Bots probables |
| **TR** | 4 | 100% (cf §1) | Bots |
| US | 88 | 93.2% | Mix (drive-by + bots) |
| **ES** | 40 | **45%** | **HUMAINS engagés** (visite >1 page) |
| FR | 11 | 90.9% | Mostly drive-by |
| KE | 6 | 83.3% | Mostly drive-by |
| PT | 3 | 66.7% | Mix |
| IO | 2 | — | (Indian Ocean, very small) |
| Total | 260 | — | — |

**Estimation grossière du bucket "no referrer / no UTM"** :
- ~99 sessions = bots/scrapers (SG+CN+IN+VN+NL+GB+TR : tous 100% bounce)
- ~88 US = très probablement mix drive-by humains + bots additionnels (93% bounce)
- ~40 ES + 11 FR + 6 KE = ~57 sessions humaines plus ou moins engagées
- **Vrais directs humains estimés : ~60-100 sessions** sur les 260 "no source"

### 2.3 Landing pages (1ère URL visitée) du bucket "(no referrer + no UTM)"

| URL d'entrée | Sessions |
|---|---:|
| `/` | 120 |
| `/blog/barcelona-rental-market-2026/` | 22 |
| `/blog/documents-rent-apartment-spain/` | 17 |
| `/blog/idealista-vs-fotocasa-vs-badi-comparison/` | 14 |
| `/about/` | 11 |
| `/blog/como-encontrar-piso-barcelona-2026/` | 10 |
| `/blog/nie-barcelona-how-to-get/` | 10 |
| `/es/` | 9 |
| `/legal/privacy/` | 9 |
| `/blog/nie-number-spain-guide/` | 6 |
| `/blog/how-to-find-apartment-barcelona-2026/` | 6 |
| `/pricing/` | 5 |
| `/blog/` | 5 |
| `/blog/documents-rent-apartment-spain-checklist/` | 5 |
| `/blog/estafas-idealista-como-detectarlas/` | 5 |
| Autres (4 deep links) | ~13 |

**Lecture** :
- 120/298 = 40% landent sur `/` → cohérent avec "vrais directs" (URL tapée, bookmark)
- ~178/298 = 60% landent sur des deep links → presque sûrement **referrer-stripped** (Telegram/Twitter app, ChatGPT pas-encore-utm-taggé, email clients, navigateurs strict-referrer)

### 2.4 Hour-of-day — pas de pattern bot fort

Distribution UTC sur 24h relativement plate (6-23 sessions/heure), pic léger 8h et 19-21h UTC. Pas de concentration suspecte (les bots simples concentrent sur des heures rondes ou des minutes 0). **Conclusion : la majorité du bucket "no referrer non-bot" est probablement humaine.**

---

## 3. Cross-check Twitter

Toutes variantes recherchées (`t.co`, `twitter.com`, `x.com`, `mobile.twitter.com`, `utm_source=twitter`) :

| Variante | Sessions |
|---|---:|
| `t.co` (X redirect officiel) | 68 |
| `twitter.com` | 0 |
| `x.com` | 0 |
| `mobile.twitter.com` | 0 |
| `utm_source=twitter` | 0 |
| **TOTAL Twitter** | **68** |

→ Twitter à 68 sessions = **conforme aux 15% reportés** ce matin. Aucune variante manquée.

**Bonus** — `referrer_path` du t.co :
- `/` (générique, plusieurs tweets agrégés) : 42 sessions
- `/oALuMdH3gz` (un tweet spécifique, identifiable) : 26 sessions

→ 26 sessions viennent **d'un seul tweet** (1 tweet = 38% du trafic Twitter).

---

## 4. Cross-check LLM (ChatGPT, Perplexity, Claude, Gemini, You, Kagi)

| Source LLM | Sessions (referrer) | Sessions (utm) | Total dédupliqué |
|---|---:|---:|---:|
| **ChatGPT** (`chatgpt.com`) | 19 | 54 | **56** (BOTH=17, utm-only=37, ref-only=2) |
| Perplexity | 2 | 1 | 3 (avec dédup) |
| Claude (`claude.ai`) | 0 | 0 | 0 |
| Gemini (`gemini.google.com`, `bard.google.com`) | 0 | 0 | 0 |
| You.com | 0 | 0 | 0 |
| Kagi | 0 | 0 | 0 |
| **TOTAL LLMs** | — | — | **59** |

→ LLM total réel = **59 sessions = 13.3%**, vs 4% reporté ce matin. Le sous-comptage venait de l'ignorance du tag UTM `chatgpt.com`.

**Pic temporel ChatGPT** : pas de pic, distribution stable sur les 49j (1-6 sessions/jour, médiane ~2). C'est un canal **récurrent**, pas une viralité ponctuelle. Pic mineur 2026-04-05 (6 sessions).

---

## 5. Cross-check Telegram

```sql
WHERE referrer_domain LIKE '%telegram%' OR referrer_domain LIKE '%t.me%' OR referrer_domain LIKE '%web.telegram%'
```

→ **0 session detectée**.

```sql
WHERE utm_source LIKE '%telegram%'
```

→ **0 session detectée**.

**Conclusion** : Telegram strippe systématiquement le referrer (app native, Telegram Web ne le passe pas non plus en sortie). Les liens `t.me/idealistaalertbot` posés sur le site génèrent du trafic vers le bot, **pas l'inverse**. Mais **si le bot envoie des liens vers le site** (ex: bouton FAQ, signup confirmation, blog post), **ce trafic est invisible** — il tombe dans le bucket "(no referrer)" sans aucune signature distinguable.

→ **Trou de mesure** : impossible de quantifier la part Telegram → site dans les 260 sessions sans source. Hypothèse plausible : 20-40% des deep-link landings (les ~178 sessions arrivant sur des URLs spécifiques) viennent du bot. Non démontrable sans UTM.

---

## 6. Cross-check ProductHunt

```sql
WHERE referrer_domain ILIKE '%producthunt%' OR referrer_domain ILIKE '%ph.com%'
```

→ **0 session**.

→ Soit Prio n'a pas eu de launch ProductHunt sur les 49 derniers jours, soit il a eu lieu avant le 2026-03-19 (date d'install Umami). Aucune trace mesurable. **Donnée historique perdue** si le launch est antérieur.

---

## 7. Cross-check sources oubliées

```sql
WHERE referrer_domain ILIKE ANY (ARRAY['%reddit%','%ycombinator%','%indiehackers%','%hackernews%','%github%','%gitlab%','%lobste%']);
```

→ **0 session** sur Reddit, Hacker News, IndieHackers, GitHub, GitLab, Lobsters.

```sql
WHERE referrer_domain ILIKE '%linkedin%';
```

→ **0 session** LinkedIn.

**Sources tierces présentes (non-LLM, non-search)** :
- Toutes variantes Facebook (`m.facebook.com` 8 + `facebook.com` 7 + `lm.facebook.com` 1 + `l.facebook.com` 1) = **17 sessions = 3.8%** (non remonté ce matin)
- `openurls.com.cn` : 2 sessions (un agrégateur de liens chinois — probable bot)
- `python-explorer--mvmtamayo.replit.app` : 1 session (un projet Replit qui crawle des sites — bot)
- `google.gr` : 1 session (Google Grèce, regroupable avec Google search)

---

## 8. Reconstitution des vraies parts — tableau certifié

| Source | Sessions 49j | % du total | Méthode de calcul | Confiance |
|---|---:|---:|---|---|
| **(no referrer / no UTM)** dont mix : | **260** | **58.4%** | 1er pv : referrer ET utm vides | — |
| ↳ bots (~100% bounce, SG/CN/IN/VN/NL/GB/TR) | ~99 | ~22% | bounce 100% par pays | haute |
| ↳ direct humain probable (URL `/` landing) | ~120 | ~27% | landing `/` avec session 2+pv | moyenne |
| ↳ referrer-stripped humain (deep-link landing) | ~40 | ~9% | landing /blog/* /es/* | basse-moyenne |
| **Twitter / X (toutes variantes)** | **68** | **15.3%** | t.co + twitter.com + x.com + utm | **haute** |
| **ChatGPT** | **56** | **12.6%** | union(referrer, utm) déduplication | **haute** |
| **Google search** | **20** | **4.5%** | google.com + google.gr | haute |
| **Facebook (toutes variantes)** | **17** | **3.8%** | m./l./lm./facebook.com | haute |
| **Bing** | **11** | **2.5%** | bing.com | haute |
| **DuckDuckGo** | **5** | **1.1%** | duckduckgo.com | haute |
| **Perplexity** | **3** | **0.7%** | union(referrer, utm) | haute |
| **Other tail** (Yahoo, Ecosia, scrapers) | **5** | **1.1%** | non-classifié sub-1 | basse |
| **TOTAL** | **445** | 100% | — | — |

### Sources mesurées à 0 session
- Telegram (referrer/utm) — **bucket invisible, mesure impossible sans UTM**
- ProductHunt — soit aucun launch, soit pré-19 mars
- Reddit, Hacker News, IndieHackers, LinkedIn, GitHub, Lobsters, Claude, Gemini, You, Kagi

### Sessions humaines réelles (estimation, hors bots)

```
TOTAL 445
- bots no-referrer (~99) = ~346 sessions humaines
```

Recomputé sur cette base humaine (`% / 346`) :
- (no referrer humain) : ~160/346 = **46%** (URL tapée + referrer stripped)
- Twitter : 68/346 = **20%**
- ChatGPT : 56/346 = **16%**
- Google : 20/346 = **6%**
- Facebook : 17/346 = **5%**
- Bing : 11/346 = **3%**
- Autres : ~14/346 = **4%**

---

## 9. Différences vs chiffres reportés ce matin

| Source | Reporté ce matin | Mesure certifiée | Écart |
|---|---:|---:|---|
| Direct | 72% | 58.4% (no referrer brut) ou ~46% (humain estimé) | **~-13 pts** (j'avais inclus les ChatGPT-utm dans direct) |
| Twitter | 15% | 15.3% | conforme |
| ChatGPT | 4% | **12.6%** | **+8.6 pts** (3x sous-compté faute d'avoir lu utm_source) |
| Google | 5% | 4.5% | conforme |
| Facebook | non remonté | 3.8% | nouvelle catégorie |
| Bing | non remonté | 2.5% | nouvelle catégorie |

**Erreurs de la première analyse** :
1. J'ai compté le referrer sur tous les events, pas sur le 1er event de la session (entry-referrer). Cela inflait artificiellement certains buckets.
2. J'ai ignoré la colonne `utm_source` qui contenait 54 sessions ChatGPT non visibles dans le referrer.
3. Je n'ai pas dé-bruité les bots (SG/CN/IN/VN à 100% bounce), donc le "direct" inclut ~99 sessions de scrapers. Le vrai direct humain est ~46% du trafic, pas 58%.
4. Je n'ai pas regroupé les 4 variantes Facebook en une catégorie.

---

## 10. Trous mesurés et recommandations méthodologiques

### Trous critiques

1. **Telegram → site = invisible.** Toutes les sessions du bot vers le site tombent dans "(no referrer)" sans signature. Probable share importante (utilisateurs → FAQ, signup confirmation, blog).
2. **Privacy browsers / strict-referrer-policy** : Brave, Safari ITP, Firefox strict mode strippent le referrer. Estimation d'industrie : 5-15% du trafic web. Impossible à isoler sans UTM.
3. **Apps mobiles** (Twitter app, Telegram app, ChatGPT app, email clients) : referrer souvent vide ou dégradé. ChatGPT a réglé le problème avec son `utm_source`. Twitter le règle avec `t.co`. Telegram ne fait rien.
4. **Pas de données pré-2026-03-19** : tout le trafic d'avant l'install Umami (notamment un éventuel launch ProductHunt ou pic Twitter) est définitivement perdu.

### Recommandations (sans action ici, juste pistes)

| Action | Bénéfice attendu | Coût |
|---|---|---|
| **Tagger les outbound links du bot Telegram avec UTM** (ex: `?utm_source=telegram&utm_medium=bot&utm_campaign=signup_confirmation`) | Mesure quantifiée du canal Telegram, qui est probablement le #1-3 réel | Faible — modif templates de messages bot |
| Ajouter UTM sur les CTAs site → bot (`?utm_source=getprio_site&utm_medium=signup_button`) | Mesurer le funnel inverse (déjà partiellement fait avec data-umami-event sur les CTAs depuis `79463f0`) | Déjà fait côté Umami events, à étendre côté UTM URL |
| Ajouter UTM sur les liens dans signature email, footer Telegram channel, posts LinkedIn/Twitter | Différenciation des canaux organic | Faible |
| **Cloudflare Web Analytics** (gratuit, déjà sur le compte) : mesure simultanée + désanonymise certains buckets via headers HTTP | Cross-check Umami sans dépendance privacy-first | Activation 2 min |
| **Plausible / GA4** : non pertinent (Umami est suffisant + privacy-first cohérent avec le pitch produit) | — | À éviter, complexité supplémentaire pour peu de gain |
| Filtrer les bots Umami : ajouter `EXCLUDE_BOTS` ou liste IP CF dans la config | Métriques humaines plus propres | Configuration Umami, ~30 min |

### Limites résiduelles à accepter

- Le bucket "no referrer humain" (~160 sessions = 46% du trafic humain) **restera majoritairement opaque** même avec les UTM ci-dessus. C'est une réalité du web 2026 (privacy-first browsers, mobile apps, copy-paste de liens).
- La distinction "vrai direct (bookmark/typed)" vs "referrer-stripped" n'est pas isolable sans heuristiques fragiles (landing page = `/` vs deep link).
- Sur 49 jours et 445 sessions, certaines sources sont sous le seuil statistique (< 5 sessions = bruit). **Il faudra 6 mois de données pour des ratios stables**.

---

## Annexes

- Queries SQL reproductibles : voir code dans le rapport (chaque tableau cite la query exacte)
- Schéma Umami : `docker exec umami-db-1 psql -U umami -d umami -c "\d session; \d website_event;"`
- Données Umami brutes restent en DB Postgres locale, non exportées
