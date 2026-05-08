# Investigation LLM — getprio.io — 2026-05-07

**Période :** 2026-03-19 → 2026-05-07 (49 jours, depuis l'install Umami)
**Source :** Umami PostgreSQL local (`docker exec umami-db-1 psql -U umami -d umami`)
**Méthode :** entry-source par session (1er pageview), union(referrer_domain, utm_source)

---

## 1. Volume LLM total

| Source LLM | Sessions 49j | Méthode |
|---|---:|---|
| **ChatGPT** | **56** | union(referrer `chatgpt.com`, utm_source `chatgpt.com`) |
| **Perplexity** | 3 | union(referrer `perplexity.ai`, utm_source `perplexity`) |
| Claude (`claude.ai`) | 0 | — |
| Gemini / Bard | 0 | — |
| You.com | 0 | — |
| Kagi | 0 | — |
| **TOTAL LLM** | **59** | **= 13.3% du trafic site** |

→ **ChatGPT = 95% de tout le trafic LLM**. Concentration extrême sur ce seul produit.

---

## 2. ChatGPT — landing pages

```sql
WITH first_pv AS (
  SELECT DISTINCT ON (session_id) session_id, referrer_domain, utm_source, url_path
  FROM website_event WHERE website_id = '...' AND event_type = 1
  ORDER BY session_id, created_at ASC
)
SELECT url_path, COUNT(*)
FROM first_pv
WHERE referrer_domain ILIKE '%chatgpt%' OR utm_source ILIKE '%chatgpt%'
GROUP BY url_path ORDER BY 2 DESC;
```

| Landing page | Sessions | % du trafic ChatGPT | Inférence query | Confiance |
|---|---:|---:|---|---|
| `/` | 15 | 27% | "Prio app", "best apartment alert app Spain", recommandation directe brand | basse-moyenne |
| `/blog/barcelona-rental-market-2026/` | 15 | 27% | "Barcelona rent 2026", "Barcelona rental prices", "Barcelona housing market" | haute |
| `/blog/como-encontrar-piso-barcelona-2026/` | 13 | 23% | "como encontrar piso Barcelona", "buscar piso Barcelona consejos" | haute |
| `/blog/idealista-vs-fotocasa-vs-badi-comparison/` | 7 | 13% | "Idealista vs Fotocasa", "best Spanish rental platforms", "differences between Idealista and Fotocasa" | haute |
| `/blog/documents-rent-apartment-spain/` | 3 | 5% | "documents to rent apartment in Spain", "what do I need to rent in Spain" | haute |
| `/blog/estafas-idealista-como-detectarlas/` | 3 | 5% | "estafas idealista", "como detectar anuncios falsos idealista" | haute |
| **TOTAL** | **56** | 100% | — | — |

**Conclusion** : ChatGPT cite 5 articles blog distincts + la home. La cinquième est ES (`como-encontrar-piso-barcelona-2026/`) — **ChatGPT cite la version ES, pas EN ni FR** pour les paires trilingues. Ce qui suggère que ChatGPT est lui-même multilingue dans ses prompts users, et que la version ES répond mieux à la query ES "como encontrar piso".

---

## 3. ChatGPT — analyse pays + engagement

| Pays | Sessions | Avg pv/session | Bounce % | Lecture |
|---|---:|---:|---:|---|
| **ES** | **24** | 1.29 | 79% | Audience principale, modérément engagée |
| TR, PT, MX, US, PL, AL, NI, CL, EG, FR, HN, HR, IL, BE, BR, IT | 1-4 chacun | 1.00 | 100% | Drive-by 1-page (probable curiosité) |
| RO, GB, UA | 2-2-2 | 1.50-3.50 | 50% | Petit volume mais engagés |
| **JP** | **1** | **10.00** | 0% | 1 session, 10 pageviews — Japonais en relocation Spain ? |
| **SK** | **1** | **8.00** | 0% | Idem, Slovaque relocation |
| **MA** | **1** | **4.00** | 0% | Marocain relocation |

→ **Bounce rate global ChatGPT ≈ 75%**, mais avec une longue tail d'utilisateurs très engagés (8-10 pv) qui descendent dans le funnel. Profil : expat / digital nomad cherchant Spain rental.

---

## 4. ChatGPT — conversion CTA Telegram

```sql
SELECT
  COUNT(DISTINCT cs.session_id) total,
  COUNT(DISTINCT CASE WHEN e.event_name='cta-click' THEN cs.session_id END) clicks
FROM chatgpt_sessions cs
LEFT JOIN website_event e ON e.session_id=cs.session_id AND event_type=2;
```

| Métrique | Valeur |
|---|---:|
| Sessions ChatGPT total | 56 |
| Sessions avec ≥1 click sur CTA bot | **1** |
| **Conversion CTA** | **1.8%** |

→ **Seulement 1 session ChatGPT sur 56 a cliqué sur un CTA Telegram**. Très faible.

**Caveat méthode** : les events `cta-click` ont été ajoutés par le commit `79463f0` du 2026-05-02 — donc **seulement 5 jours d'événements customs mesurés** (vs 49j de pageviews). Le 1.8% est sous-estimé. Pas conclusif.

→ Mesure à reconfirmer dans 4 semaines (atteindre 30j d'events customs).

---

## 5. ChatGPT — tendance temporelle

| Semaine | Sessions ChatGPT | % du total site cette semaine |
|---|---:|---:|
| 2026-03-16 | 3 | 7% (3/42) |
| 2026-03-23 | 4 | 3% (4/136) |
| 2026-03-30 | **14** | **16% (14/87)** ← **pic** |
| 2026-04-06 | **14** | **26% (14/54)** ← **plateau, ratio en hausse** |
| 2026-04-13 | 4 | 12% |
| 2026-04-20 | 4 | 14% |
| 2026-04-27 | 8 | 23% |
| 2026-05-04 | 5 | 17% |

**Lectures** :
- Tendance absolue : **pic fin mars / début avril, redescente, oscillation autour de 5-8/semaine**.
- **Ratio relatif (% du total)** : en hausse — ChatGPT prend une part de plus en plus grande à mesure que le trafic global décline.
- Pas de pic isolé corrélé avec un tweet ou un événement extérieur identifiable.

**Comparaison avec Twitter** :

| Semaine | ChatGPT | Twitter (t.co) | Total |
|---|---:|---:|---:|
| 2026-03-23 | 4 | **57 (pic viral)** | 136 |
| 2026-03-30 | 14 | 2 | 87 |
| 2026-04-06 | 14 | 4 | 54 |
| ... | ... | 0-1 | ... |

→ **Twitter a fait 1 pic viral (semaine du 23 mars), puis flat. ChatGPT a une présence persistante.**

---

## 6. Articles JAMAIS cités par les LLMs

```sql
SELECT DISTINCT url_path FROM website_event
WHERE url_path LIKE '/blog/%' AND url_path NOT IN (citations LLM);
```

16 articles blog jamais en landing depuis un LLM :

| URL | Hypothèse pourquoi pas cité |
|---|---|
| `/blog/` (index) | Page index — pas un asset citable |
| `/blog/alquiler-barcelona-vs-madrid-comparativa/` | ES, monolingue, peut-être trop niche |
| `/blog/arnaques-idealista-comment-les-reperer/` | FR — ChatGPT ingère peu de FR |
| `/blog/best-neighborhoods-barcelona-expats/` | EN, similaire à un article ES qui marche — concurrence interne ? |
| `/blog/documentos-alquilar-piso-espana/` | ES — paire avec `documents-rent-apartment-spain/` (qui est cité). LLM peut préférer EN comme x-default |
| `/blog/documents-rent-apartment-spain-checklist/` | URL DELETED 301'd, hors scope |
| `/blog/how-long-find-apartment-barcelona/` | EN, niche, faible autorité |
| `/blog/how-to-find-apartment-barcelona-2026/` | EN, paire avec ES citée |
| `/blog/idealista-alerts-vs-prio-notification-speed/` | Article peu autoritaire (auto-promo) |
| `/blog/idealista-scams-how-to-spot-fake-listings/` | EN, paire avec ES `estafas-idealista-como-detectarlas/` qui est cité (3 sessions) |
| `/blog/louer-appartement-espagne-documents/` | FR |
| `/blog/meilleurs-quartiers-barcelone-expats/` | FR |
| `/blog/mejores-barrios-barcelona-vivir-2026/` | ES, paire cité ES (estafas) absorbe peut-être les LLM-citations |
| `/blog/nie-barcelona-how-to-get/` | NIE topic (immigration, pas rental) — vertical différent |
| `/blog/nie-number-spain-guide/` | Idem |
| `/blog/trouver-appartement-barcelone-2026/` | FR |

**Pattern observé** : ChatGPT cite **EN ou ES uniquement, jamais FR** sur les paires trilingues blog. La version FR de `como-encontrar-piso-barcelona-2026` (qui est `trouver-appartement-barcelone-2026`) n'a 0 session LLM, alors que la version ES en a 13.

---

## 7. Test manuel ChatGPT — non automatisable

**Pas de credential OpenAI disponible** :
```bash
$ env | grep -i openai          # vide
$ ls /opt/piso-sniper/.env       # contient IDEALISTA_API_KEY uniquement
```

→ **Test manuel à effectuer par l'utilisateur**. Queries suggérées (à tester sur ChatGPT.com en mode "Search"/"web access activé") :

| Query | Hypothèse de citation |
|---|---|
| `best apartment alert app Spain` | / (homepage) |
| `comment trouver appartement Barcelone rapidement` | `/blog/trouver-appartement-barcelone-2026/` (FR) — actuellement 0 session, à confirmer si jamais cité |
| `como encontrar piso Barcelona 2026` | `/blog/como-encontrar-piso-barcelona-2026/` ✓ confirmé indirectement (13 sessions) |
| `Idealista vs Fotocasa differences` | `/blog/idealista-vs-fotocasa-vs-badi-comparison/` ✓ confirmé (7 sessions) |
| `Barcelona rent prices 2026 by neighborhood` | `/blog/barcelona-rental-market-2026/` ✓ confirmé (15 sessions) |
| `documents needed rent apartment Spain` | `/blog/documents-rent-apartment-spain/` ✓ confirmé (3 sessions) |
| `real-time Idealista alternative` | / (homepage) — incertain |
| `idealista scams how to detect` | `/blog/idealista-scams-how-to-spot-fake-listings/` (EN) — actuellement 0 session, alors que la version ES en a 3 |

**Procédure** :
1. Utilisateur ouvre ChatGPT (Plus / Web Search activé)
2. Pose chaque query (4-5 max recommandé pour pas burn de quota — la mission interdit boucle de 50)
3. Capture si Prio/getprio.io est cité dans la réponse + position dans les sources

---

## 8. Leviers d'amplification LLM

### 8.1 Page qui convertit le mieux les visiteurs LLM
**Aucun signal robuste** : 1.8% conversion CTA mesurée sur 5 jours d'events. Trop tôt pour conclure. Re-mesurer dans 4 semaines.

**Proxy CTA** : pages avec bounce le plus bas sur le segment ChatGPT :
- JP/SK/MA (1 session chacun, 4-10 pv) — micro-volumes
- ES (24 sessions, 1.29 pv, bounce 79%) — médiocre
- → **Aucune page ne se distingue clairement comme "convertisseur LLM"**

### 8.2 Articles candidats LLM-optimization (jamais cités, potentiel)

Critère : article EN ou ES, query rentable, pas encore cité par LLM.

| Article | Pourquoi candidat | Action proposée |
|---|---|---|
| `/blog/idealista-scams-how-to-spot-fake-listings/` | EN, paire ES cité, version EN orpheline | Optimisation FAQPage / structured data |
| `/blog/best-neighborhoods-barcelona-expats/` | EN, paire ES cité (mejores-barrios) | Idem |
| `/blog/how-to-find-apartment-barcelona-2026/` | EN, paire ES cité (como-encontrar) | Idem |
| `/blog/idealista-alerts-vs-prio-notification-speed/` | Self-promotion topic — ChatGPT cite rarement les pages auto-promo | Réécrire avec angle externe / citation tiers |

### 8.3 Articles externes pour amplifier la présence LLM

LLMs ingèrent surtout les corpus crédibles (Reddit, Wikipedia, sites .gov, blogs autoritatifs) :
- **Reddit** : poster des réponses détaillées sur `r/Barcelona`, `r/IWantOut`, `r/expats` mentionnant la méthode (sans spam) — créer un signal référent
- **Wikipedia** : pas faisable directement (anti-promotional), mais s'assurer que les sources Wikipedia en/es citant des plateformes immo Spain pointent vers des articles getprio.io quand pertinent
- **Forums expats** (InterNations, Expatica, Expat.com) : présence éditoriale
- **Lien indirect** depuis blogs immo / property tech autoritatifs (Property Investor Today, Rentcafé, etc.)

→ Pas de mesure directe possible. Hypothèse à valider en 6 mois.

---

## 9. Conclusion

**Faits établis** :
- 56 sessions ChatGPT en 49j = canal #3 stable (12.6% du trafic)
- Tendance plateau 5-14/semaine, pas de croissance exponentielle
- ChatGPT cite **5 articles blog distincts + la home**, dans EN et ES uniquement
- Conversion CTA non-mesurable encore (5j d'events, à reconfirmer)
- Aucun Claude / Gemini / You / Kagi détecté

**Trous restants** :
- Pas de credential OpenAI → tests manuels requis pour confirmer pourquoi ChatGPT cite tel ou tel article
- Conversion CTA non-mesurable avant ~4 semaines de plus
- Telegram → site reste invisible (cf. mission précédente : pas de tagging UTM applicable, le bot a peu de liens sortants)

**Aucune action de modification dans cette mission.** Tout est observation.
