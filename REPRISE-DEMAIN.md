# ⏯️ REPRISE — Handoff pour un NOUVEAU contexte Claude (à lire en premier)

> Ce document est **autonome** : le nouveau contexte n'a pas l'historique du chat.
> Tout ce qu'il faut savoir pour continuer est ici. Projet = refonte du site de
> **Christine CAL** (Astro statique dans `v3-src/`), à mettre en ligne sur
> **christinecal.com** (OVH), avec **TinaCMS** comme éditeur de contenu.

---

## 🔴 BLOCAGE ACTUEL — à régler en premier
**`/admin` renvoie 404** sur la prod Vercel (`https://website-christinecal.vercel.app/admin/`).

- **Cause confirmée** : le dernier build de `main` sur Vercel s'est fait **sans les
  variables d'environnement Tina** → `tinacms build` a échoué → repli `|| echo` du
  script de build → pas de dossier `/admin` généré → 404.
  Vérifié en local : la commande EXACTE de Vercel
  `tinacms build --skip-cloud-checks` **AVEC** les identifiants **génère bien
  `/admin`** (exit 0). **Le code est bon**, il ne manque que les variables au build.

- **FIX (action de Morgan, côté Vercel — Claude ne peut pas le faire)** :
  1. Vercel → projet `website-christinecal` → *Settings → Environment Variables* :
     `NEXT_PUBLIC_TINA_CLIENT_ID` **et** `TINA_TOKEN` doivent avoir **Production**
     coché (idéalement Production + Preview + Development). ← **cause la plus probable.**
  2. *Deployments* → dernier (Production) → **⋯** → **Redeploy** (décocher le cache).
  3. Recharger `…/admin/`.
  - Diagnostic via **Build Logs** du déploiement :
    - « Tina build complete » / « public/admin/index.html » = 🟢 admin généré.
    - « Tina admin non construit (identifiants Tina Cloud absents) » = 🟠 variables
      toujours pas prises au build → revoir le périmètre Production (étape 1).

- Une fois `/admin` en 200 : *Login with GitHub* → l'éditeur affiche **Cartes** +
  **Pages**. (Tina Cloud a déjà indexé `main` — voir plus bas.) Tester une modif → *Save*.

---

## ⚠️ Contexte technique pour le nouveau Claude (IMPORTANT)
- **Depuis le sandbox, on NE PEUT PAS atteindre `tina.io` ni le site Vercel**
  (le proxy renvoie 403). Donc **impossible de tester `/admin` ou Tina Cloud à
  distance** : **Morgan est les yeux** (il teste dans son navigateur et rapporte).
- **Identifiants Tina Cloud** :
  - Client ID (public, déjà lu via env dans le code) : `178fab4e-3591-4325-9777-a698e33d328a`
  - Token : **PAS dans le dépôt** (secret ; il est dans Vercel `TINA_TOKEN`). Ne jamais le committer.
- **Nom des variables** : `NEXT_PUBLIC_TINA_CLIENT_ID` (⚠️ préfixe **NEXT_PUBLIC_**,
  PAS `PUBLIC_` : Astro utilise `PUBLIC_` mais le bundler Tina n'expose au
  navigateur que `NEXT_PUBLIC_`/`TINA_PUBLIC_` — c'était un bug déjà corrigé) + `TINA_TOKEN`.
- **Tina Cloud** : projet créé, connecté au dépôt, branche = `main`,
  *Path to Tina folder* = `v3-src` (impératif). `main` a été **ré-indexé** (OK).

---

## ✅ FAIT (tout est sur `main` — PR #5, #6, #7 fusionnées)
- **Retours Christine du 30/06** : titres `text-wrap: pretty` (fin des lignes
  courtes empilées), bloc centré cassé de *Retrouver sa mémoire galactique* réparé,
  photos **Telos** réagencées (portrait près de la vidéo, 3 photos dé-recadrées —
  le phénomène 2017 redevient visible —, 2 livres côte à côte), **Bugarach** (photo
  plus basse + coquille « aux aux »). Photo n°2 du diaporama Telos renvoyée à Christine.
- **Migration Sveltia → TinaCMS** : `v3-src/tina/config.ts` déclare **TOUS** les
  champs (source = `v3-src/src/content.config.ts`) → fini le bug Sveltia qui effaçait
  `sideImages`/`inlineMedia`/`wideBody`/`audioCover`/`bodyImageBelow`. Corps en
  **textarea** (HTML de mise en page préservé, jamais rich-text). Sveltia + relais
  OAuth `/api` + `CMS-CHRISTINE.md` supprimés. `tina/tina-lock.json` committé
  (Tina Cloud en a besoin pour indexer).
- **Bascule OVH préparée** : `v3-src/public/.htaccess` (HTTPS via `X-Forwarded-Proto`
  pour éviter la boucle OVH + bloc « redirections SEO WP→V3 » à compléter), page `/404`.
- **Redirections SEO des anciens domaines** (Christine avait 3 sites : le portail
  `christinecal.com`, `christinecal-coach-medium.com` = Éveil à Soi,
  `christinecal-coach-quantique.com` = Éveil au Soi) : `.htaccess` prêts dans
  `redirects/` (à déposer sur l'hébergement de chaque ancien domaine à la bascule).

## ⏭️ À FAIRE (dans l'ordre, une fois `/admin` OK)
1. **Tester l'édition** dans `/admin` (modif → Save → commit sur `main` → rebuild).
2. **Validation de Christine** sur la preview (les corrections + l'édition Tina).
3. **Bascule OVH** = mise en ligne sur christinecal.com. **Suivre `GO-LIVE.md`
   Phase 3** : côté OVH (associer le domaine + SSL + créer FTP), côté GitHub
   (*Secrets* `OVH_FTP_HOST/USER/PASSWORD` + `NEXT_PUBLIC_TINA_CLIENT_ID` +
   `TINA_TOKEN` ; *Variables* `OVH_FTP_DIR` + `OVH_DEPLOY=true`), puis
   *Actions → Déploiement OVH → Run workflow*. **Réversible** (rollback dans GO-LIVE.md).
4. **Redirections SEO** : déposer les `redirects/*.htaccess` sur les 2 anciens
   domaines (OVH) + compléter le bloc WP→V3 du `.htaccess` principal depuis la
   Search Console de christinecal.com (le WP live bloque le crawl → 403).
5. **Facture** (rappel mail Christine du 30/06) : à dater de **juillet**, au nom
   **EURL Christine CAL Coach Consultant**, mention *« TVA non applicable, art. 293 B du CGI »*.

---

## 📁 Docs de référence dans le dépôt
- `GO-LIVE.md` — runbook complet pas-à-pas (Tina + OVH).
- `DEPLOY-CMS-TINA.md` — détail TinaCMS (mise en place, accès, RGPD).
- `DEPLOY-OVH.md` — détail hébergement OVH.
- `redirects/README.md` — comment déposer les redirections des anciens domaines.

## 🧠 Repères techniques
- **Site** = Astro statique dans `v3-src/`. **Prod Vercel = branche `main`** (preview
  privée, `noindex`). **OVH** ne déploie que si la variable GitHub `OVH_DEPLOY=true`
  (workflow `.github/workflows/deploy-ovh.yml`, FTP vers `www/`).
- **Build résilient** : `npm run build` = `(tinacms build --skip-cloud-checks || echo …) && astro build`
  → le **site public se build même sans Tina** (dans ce cas juste pas de `/admin`).
- **`tina/tina-lock.json` DOIT rester committé** (Tina Cloud l'indexe). Il n'est
  généré **que par `npx tinacms dev`** (jamais par `tinacms build`) : le régénérer
  ainsi si le schéma change. `tina/__generated__/` et `public/admin/` sont **ignorés**
  (régénérés à chaque build).
- **⚠️ `v3/` est un dossier de SORTIE de build committé (legacy)** : ne JAMAIS
  committer ses régénérations locales (Vercel le régénère). Après un build local :
  `git restore v3/ && git clean -fd v3/ && rm -rf v3/admin`.
- **Branche de travail** : `claude/christine-site-deployment-ovh-nq04xb`. Les PR
  #5/#6/#7 sont **mergées** → toute nouvelle PR **repart de `main`**
  (`git checkout -B <branche> origin/main`).
- **Accès outils** : GitHub via MCP `mcp__github__*` (pas de `gh`). Gmail dispo via
  MCP (les mails de Christine sont sur `cc.christinecal@gmail.com`).
