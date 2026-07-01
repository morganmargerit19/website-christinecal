# ⏯️ REPRISE — Handoff pour un NOUVEAU contexte Claude (à lire en premier)

> Document **autonome** : le nouveau contexte n'a pas l'historique du chat.
> Projet = refonte du site de **Christine CAL** (coach médium), site **Astro statique**
> dans `v3-src/`, 5 langues, à mettre en ligne sur **christinecal.com** (OVH).
> CMS = **TinaCMS** (page `/admin`). Prod actuelle = **preview Vercel privée** (`noindex`),
> reconstruite à chaque push sur `main`.

---

## 🟢 CE QUI EST FAIT (tout est sur `main`, poussé)

1. **`/admin` (TinaCMS) fonctionne.** L'ancien blocage « `/admin` 404 » est **résolu** :
   la variable Vercel s'appelait `PUBLIC_TINA_CLIENT_ID` au lieu de
   **`NEXT_PUBLIC_TINA_CLIENT_ID`** (corrigé par Morgan → redeploy → OK).

2. **ÉDITEUR EN BLOCS — migration TOTALE faite et déployée** (commit `e7409902`).
   Le corps des fiches est passé d'une zone de texte (HTML brut) à un **éditeur
   riche + blocs** pour que Christine formate elle-même (gras, tailles, centrage,
   images placées dans le texte). Concrètement :
   - `@astrojs/mdx` ajouté ; les **95 fiches (19 slugs × 5 langues) sont en `.mdx`**,
     toutes éditables au CMS.
   - **10 composants de blocs** dans `v3-src/src/components/blocks/` : `FloatImage`,
     `CenteredText`, `TwoColumns`+`Column`, `MediaDuo`, `VideoBlock`,
     `SlideshowBlock`, `GalleryBlock`, `Lead`, `Note`.
   - `tina/config.ts` : corps = `rich-text` + `bodyTemplates` (miroir des composants),
     collection `format: 'mdx'`. `tina-lock.json` régénéré.
   - `Fiche.astro` centralise `render()` + mappe les blocs ; **le décor frontmatter
     (hero, méta, vidéos, témoignages, stages, contact) est inchangé** ; les anciens
     champs `sideImages`/`inlineMedia` **fonctionnent toujours** (rendus + éditables
     via leurs champs), donc conservés pour les fiches qui les utilisent.
   - `sortir-de-sa-matrice` : l'ancien gabarit codé en dur (`richLayout`) est retiré →
     son vrai corps (déjà traduit par langue) s'affiche → fiche redevenue éditable.
     ⚠️ Le champ `richLayout` (tina + Fiche.astro) est désormais **code mort inoffensif**.
   - **Build 141 pages vert**, rendus **vérifiés par captures** (2-colonnes, images
     flottantes, MediaDuo Telos, sortir…).
   - **Retour de Morgan** : éditeur « pas hyper pratique » (pas d'aperçu en direct —
     Christine voit le rendu en sauvegardant puis en rafraîchissant la page) mais
     **« à court terme ça ira »** → **ne pas re-investir dessus**, priorité = mise en ligne.

3. **Bascule OVH préparée côté code** : `deploy-ovh.yml` **vérifié sain** (build cible
   ovh + `/admin` avec secrets Tina + FTPS vers `OVH_FTP_DIR`, **dormant** tant que la
   variable `OVH_DEPLOY` ≠ `true`) ; `v3-src/public/.htaccess` (HTTPS + bloc SEO WP→V3
   à compléter) ; page `/404` ; `redirects/` (redirections des anciens domaines).

---

## ✅ FAIT LE 01/07 — SITE EN LIGNE SUR christinecal.com

**Le site V3 est EN LIGNE sur christinecal.com** (plus seulement la preview Vercel).
Bascule OVH réalisée et vérifiée de bout en bout :
- **Infos OVH** : christinecal.com + www → Dossier racine `www` (= l'ancien WordPress) ;
  SSL actif ; compte OVH user `christka`, home `/home/christka`, hôte
  `ftp.cluster106.hosting.ovh.net` (SFTP port 22).
- **GitHub** : secrets `OVH_FTP_HOST/USER/PASSWORD` + `NEXT_PUBLIC_TINA_CLIENT_ID` +
  `TINA_TOKEN` ; variables `OVH_FTP_DIR=./www-v3/` + `OVH_DEPLOY=true`.
- ⚠️ **OVH refuse le FTPS explicite** (`500 This security scheme is not implemented`)
  → le workflow `deploy-ovh.yml` déploie en **SFTP via `lftp`** (port 22).
- V3 déployée dans **`www-v3`** puis docroot repointé `www`→`www-v3` (WP intact = rollback).
- **Auto-deploy armé** : tout push sur `main` touchant `v3-src/**` redéploie OVH (+ Vercel).
  ⚠️ Christine pousse des `TinaCMS content update` en // → **`git pull --rebase --autostash`
  avant chaque push**.
- **Vérifié en live** (curl) : accueil 200, http→https, non-www→www, `/admin` 200 sur OVH
  (Tina tourne sur OVH → **Vercel devenu optionnel**, supprimable), sitemap 200,
  robots.txt indexable (le `noindex` était un en-tête Vercel, ne suit pas sur OVH).
- **Redirections SEO christinecal.com FAITES** : 17 règles 301 dans `v3-src/public/.htaccess`
  (anciennes URLs WP racine → fiches sous leur hub ; URLs relevées dans `sources/wp-v2`),
  destinations en URL absolue, testées OK en live.
- **Retouches Christine (mail 01/07)** déployées : retrouver-sa-memoire = corps pleine
  largeur ; bugarach = 2 retours à la ligne.

---

## ⏭️ RESTE À FAIRE
1. **Accès CMS de Christine** : `/admin` marche sur OVH ; confirmer qu'ELLE peut se
   connecter (login GitHub `christinecal24` → si bloquée, l'inviter dans
   **app.tina.io → Collaborators** + ajouter christinecal.com aux *Allowed/Site URLs*
   de Tina Cloud). **Brouillon Gmail « site en ligne + mode d'emploi » prêt** (à envoyer
   par Morgan une fois l'accès validé).
2. **Redirections des 2 autres domaines** (coach-medium → /eveil-a-soi/, coach-quantique
   → /eveil-au-soi/) : fichiers `redirects/*.htaccess` prêts ET **déposés auto sur OVH**
   par le workflow dans `coach-redir` / `coach-quantique-redir`. Il reste à **repointer
   ces 2 domaines** (+ www) sur ces dossiers dans Multisite (WP conservé = rollback).
3. **Facture** juillet : **EURL Christine CAL Coach Consultant**, mention
   **« TVA non applicable, art. 293 B du CGI »**.
4. Soumettre `https://www.christinecal.com/sitemap-index.xml` à la Search Console.
5. (Optionnel) supprimer le projet Vercel ; nettoyer le code mort `richLayout`.

---

## 🧠 Repères techniques
- **Site** = Astro statique `v3-src/`. **Prod Vercel = `main`** (preview privée `noindex`).
  **OVH** ne déploie que si la variable GitHub `OVH_DEPLOY=true` (workflow
  `.github/workflows/deploy-ovh.yml`, FTPS vers `OVH_FTP_DIR`).
- **Build local** : `cd v3-src && npm run build:site-only` (= `astro build`, sortie `../v3/`).
  ⚠️ **`v3/` est un dossier de sortie committé (legacy)** : après un build local, NE PAS
  committer ses régénérations → `git restore v3/ && git clean -fd v3/ && rm -rf v3/admin`.
- **`tina-lock.json`** se régénère **depuis le sandbox** via `npm run dev` (= `tinacms dev`,
  **sans tina.io ni token** — la compilation du schéma est locale) : lancer en tâche de
  fond, attendre ~40 s (schéma + `tina/__generated__/` régénérés), tuer le serveur
  (ports 4001/4321), committer `tina/tina-lock.json` (`__generated__/` reste ignoré).
- **Tina Cloud** : branche `main`, *Path to Tina folder* = `v3-src`. Client ID (public) =
  `178fab4e-3591-4325-9777-a698e33d328a` ; `TINA_TOKEN` = secret (Vercel + GitHub), jamais committé.
- ⚠️ **Push direct sur `main` = bloqué par le classifier auto-mode** (branche de prod,
  auto-deploy) SAUF autorisation explicite de Morgan (« oui pousse sur main »). Pour la
  bascule OVH ce n'est pas nécessaire (Morgan lance le workflow lui-même).
- **Depuis le sandbox : pas d'accès à `tina.io` ni au site Vercel** (proxy) → **Morgan est
  les yeux** pour tester `/admin` et la prod. Gmail dispo via MCP (mails Christine sur
  `cc.christinecal@gmail.com`).
- Docs de référence : `GO-LIVE.md` (runbook OVH pas-à-pas), `DEPLOY-OVH.md`,
  `DEPLOY-CMS-TINA.md`, `redirects/README.md`.
