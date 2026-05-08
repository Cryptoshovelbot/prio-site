# Page 2 CTR fix — variantes préparées 2026-05-07 (NON APPLIQUÉ)

**Page cible** : `/blog/documents-rent-apartment-spain/`
**Source rapport** : `ctr-titles-candidates-2026-05-07.md` §2.1, page **P2**
**Risque LLM** : MODÉRÉ — 3 sessions ChatGPT confirmées sur 49j (`llm-investigation-2026-05-07.md`)

---

## État actuel (au 2026-05-07)

| Champ | Valeur | Length |
|---|---|---|
| `<title>` | `Documents to Rent in Spain (2026): Madrid & Barcelona Guide` | 60 chars |
| `<meta name="description">` | `NIE, payslips, work contract, bank statements and 4 more docs Spanish landlords require. The 1-PDF strategy that beats 90% of applicants.` | 138 chars |
| `<h1>` (ligne 111) | `Documents to Rent an Apartment in Spain (2026) — Madrid, Barcelona & Beyond` | — |
| `og:title` | identique au `<title>` | — |
| `og:description` | identique à la meta description | — |
| `twitter:title` | identique au `<title>` | — |
| `twitter:description` | identique à la meta description | — |

## Stats GSC 90j

- Position : **7.3**
- Impressions : **709** (top des candidates)
- Clicks : **1** → CTR **0.14%** (~30× sous-performance vs CTR attendu pos 7.3)
- Top query : `documents required to rent an apartment in madrid`

## Diagnostic

- Title couvre la query mais "Madrid" est en sous-titre, pas en début → SERP relevance affaiblie
- "1-PDF strategy" en meta description suggère contenu non-list → intent mismatch (user veut une liste)
- SERP US-EU dominée par sites institutionnels (Idealista guide, Spanish.gov, expat.com)

## Risque LLM à protéger

- 3 sessions ChatGPT identifient cette page sur queries type "what documents do I need to rent in Spain"
- Termes ancrants (probablement extraits par les LLMs) : `Documents to Rent`, `Spain`, `Madrid`, `NIE`, `payslips`, `work contract`
- **Tout rewrite doit conserver au moins** : `Documents` + (`Rent` ou `Rental`) + (`Spain` ou `Madrid`) en début de title

---

## 3 Variantes préparées

### Variante A — exact match top query, focus Madrid

```
Title  : Documents Required to Rent an Apartment in Madrid (2026)
Length : 56 chars
Meta   : Full checklist of documents required to rent an apartment in Madrid in 2026: NIE, payslips, work contract, bank statements and more. Beat 90% of applicants.
Meta L : 158 chars
```

- **Match query** : QUASI-EXACT
- **Risque LLM** : FAIBLE
- **Trade-off** : drop "Spain" et "Barcelona" du title (couverts par hreflang + H1 + contenu)

### Variante B — hybrid cities + apartment (recommandée par défaut)

```
Title  : Documents to Rent an Apartment in Madrid & Barcelona (2026)
Length : 59 chars
Meta   : Documents Spanish landlords require to rent in Madrid & Barcelona (2026): NIE, payslips, work contract, bank statements. The 1-PDF checklist strategy.
Meta L : 152 chars
```

- **Match query** : FORT (ajoute "an Apartment")
- **Risque LLM** : TRÈS FAIBLE (structure quasi-identique à l'actuel)
- **Trade-off** : drop "Spain" du title

### Variante C — aggressive checklist hook (NIE/Payslips en title)

```
Title  : Spain Rental Documents 2026: NIE, Payslips, Madrid Checklist
Length : 60 chars
Meta   : Spain rental documents checklist 2026: NIE, payslips, work contract, bank statements and 4 more docs Madrid & Barcelona landlords require.
Meta L : 137 chars
```

- **Match query** : MOYEN (sémantique OK, manque "rent" littéral)
- **Risque LLM** : MODÉRÉ (réorganise structure)
- **Hook CTR** : FORT (checklist + termes en title = signal SERP + LLM extraction)

## Recommandation par défaut

**Variante B** — compromis le plus sûr étant donné le risque LLM modéré.

## Décision utilisateur (2026-05-07)

✅ **Variante B VALIDÉE** pour application demain (2026-05-08). Mission dédiée, règle 1 page/jour respectée.

---

## Procédure d'application (à exécuter DEMAIN — 2026-05-08)

1. Re-vérifier que le rapport `ctr-titles-candidates-2026-05-07.md` reste applicable (rien n'a changé en GSC depuis aujourd'hui)
2. Confirmer choix variante avec utilisateur
3. Modifier dans `/opt/prio-site/blog/documents-rent-apartment-spain/index.html` :
   - ligne 6 : `<title>`
   - ligne 7 : `<meta name="description">`
   - ligne 14 : `<meta property="og:title">`
   - ligne 15 : `<meta property="og:description">`
   - ligne 22 : `<meta name="twitter:title">`
   - ligne 23 : `<meta name="twitter:description">`
   - **PAS de touche au H1** (ligne 111), ni au contenu, ni au JSON-LD
4. Commit message : `ctr-fix: rewrite title for /blog/documents-rent-apartment-spain/`
5. Logger cooldown : `cooldown_until=2026-06-05` (28 jours après application)
6. Vérif prod (poll until propagation) avec les 6 fields servis par Cloudflare

## Cooldown post-application

À partir du commit demain : **28 jours intouchable** (jusqu'à approximativement 2026-06-05).
