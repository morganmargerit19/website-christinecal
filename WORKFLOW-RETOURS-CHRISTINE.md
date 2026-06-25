# Workflow — Intégration des retours de Christine (« agence de finition »)

Procédure reproductible pour traiter proprement, sans rien inventer, les retours
de Christine (par email) + les remarques de Morgan, jusqu'à un site validé.
À relancer à la demande (« applique le workflow retours Christine »).

> Principe directeur : **tout doit sonner juste pour Christine** (médium, univers
> cosmique/5D). On ne coupe jamais une phrase qu'elle juge importante ; on cite
> ses mots à la lettre ; on ne « remplit » pas. En cas de doute réel → on signale,
> on ne devine pas. Cf. mémoire `feedback_aligner_sur_christine`.

## Phase 0 — Synchronisation (toujours en premier)
- `git fetch --all --prune` puis `git merge --ff-only origin/main`.
  **Le travail peut avoir avancé en cloud** (branches `claude/*`, PR mergées).
- Lire `ÉTAT-REPRISE.md` (handoff cloud) + la mémoire `project_christinecal_reprise`.

## Phase 1 — Collecte (lire, ne pas interpréter encore)
- Gmail MCP : `search_threads` (from:cc.christinecal@gmail.com newer_than:Xd),
  puis `get_thread` (FULL_CONTENT) pour CHAQUE mail non traité.
- Lire l'**objet** (souvent l'instruction principale : « ôter X », « PAGE DÉFINITIVE Y »)
  PUIS le corps. Un objet « claude s'entête / oubli de claude » = correctif d'un point raté.
- Ajouter les remarques de Morgan (notes directes).
- Sortie : une ligne par item actionnable, taggée par page.

## Phase 2 — Cadrage (plan clair avant toute édition)
- Mapper chaque item → fichier + emplacement précis :
  - Contenu → `v3-src/src/content/fiches/*.md` (FR à la racine).
  - Pages TS → `i18n/pages/about.ts`, `components/mission/Mission.astro`.
  - Présentation transverse → `layouts/Fiche.astro` + `styles/global.css`.
- Classer : **contenu** | **CSS/layout** | **asset manquant** (à demander à Christine).
- Chercher la **cause racine** d'un bug visuel (souvent 1 fix CSS couvre N pages).
- Repérage assets : `ls v3-src/public/images/wp` + `sources/wp-v2/`, `sources/wp-extract/`.

## Phase 3 — Exécution (FR d'abord, fidèle au mot près)
- Éditer le FR source. Coller au texte de Christine (ponctuation incluse : elle
  refuse les tirets `—` mis à la place de `;` ou `:`).
- Grouper par page. Les fixes CSS/layout sont **multilingues d'office**.

## Phase 4 — Build + vérification visuelle (boucle agence)
- `cd v3-src && npm run build` (doit garder ~140 pages, 0 erreur).
- Servir : `python -m http.server` à la racine du repo (pour que `/v3/...` résolve).
- Captures Edge headless : `msedge --headless=new --force-prefers-reduced-motion=reduce --window-size=W,H --screenshot=out.png <url>`.
- **Analyse multi-agent** : 1 sous-agent par page touchée lit sa capture et vérifie
  lisibilité + mise en page vs la demande. Boucler jusqu'à « propre ».
- Nettoyer les PNG temporaires avant commit.

## Phase 5 — Traductions EN/PL/ES/IT
- Resynchroniser SEULEMENT les fiches dont le **contenu** a changé (les fixes CSS
  n'ont pas besoin de traduction).
- 1 sous-agent par fichier ; **ne jamais paralléliser 2 agents sur le même fichier**.

## Phase 6 — Clôture
- `npm run build`, commit FR descriptif (+ ligne Co-Authored-By), push (= auto-deploy Vercel).
- Mettre à jour la mémoire (`project_christinecal_reprise`) : ce qui est fait / reste.
- Brouillon Gmail à Christine : récap des changements + **assets à fournir**.

## Garde-fous appris
- Apostrophe ASCII dans un attribut SVG entre quotes simples casse le XML.
- Edge headless n'avance pas GSAP de façon fiable → `--force-prefers-reduced-motion=reduce`
  fige l'état final ; pour un `<details>`, ajouter `open` temporairement.
- Encres `--ink*` = pour `.paper-section` (papier clair) UNIQUEMENT. Sur fond indigo,
  utiliser `--indigo-100/200/250/300` (sinon texte invisible).
