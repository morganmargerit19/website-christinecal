# ⏯️ Reprise — état au soir du 30/06 (à lire en premier demain matin)

## TL;DR
Tout le gros œuvre est **fait et fusionné dans `main`** (PR #5 et #6). L'éditeur
**TinaCMS `/admin` charge déjà** et le Client ID est bon. Il restait **un seul
blocage** : Tina Cloud n'avait pas de `tina/tina-lock.json` à indexer sur `main`
→ erreur « Branch 'main' not found ». **Ce fichier vient d'être généré et
committé** (ce commit). Demain, il ne reste qu'**un clic** : ré-indexer dans Tina.

## 👉 Étapes demain matin (dans l'ordre)
1. **Tina Cloud** : <https://app.tina.io> → ton projet → onglet **Configuration**
   → bouton **Reindex** sur la branche `main`. (Le push du `tina-lock.json`
   a peut-être déjà lancé l'indexation ; le Reindex la force proprement.)
   - Vérifie aussi *Settings → Path to Tina folder* = **`v3-src`** (impératif).
2. **Recharge** `https://website-christinecal.vercel.app/admin/` → *Login GitHub*.
   → L'éditeur doit afficher la liste des **Cartes** + **Pages**. 🎉
3. **Teste une modif** : ouvre une carte, change un mot, **Save** → un commit
   apparaît sur `main`, la preview se reconstruit.

## Si l'erreur persiste
- Re-vérifie *Path to Tina folder = `v3-src`* (cause n°1 d'échec de schéma).
- Force la ré-indexation : une modif d'espace dans `v3-src/tina/tina-lock.json`
  + commit/push (méthode documentée par Tina).
- *Site URLs* (origines) du projet Tina doivent inclure
  `https://website-christinecal.vercel.app`.

## Identifiants Tina Cloud
- **Client ID** (public, déjà dans le code via env) : `178fab4e-3591-4325-9777-a698e33d328a`
- **Token** : il est dans **Vercel** (variable `TINA_TOKEN`) et dans notre chat —
  **ne jamais le committer**.
- Variables Vercel à avoir (déjà ajoutées par Morgan, Production+Preview) :
  `NEXT_PUBLIC_TINA_CLIENT_ID` et `TINA_TOKEN`.

---

## Ce qui est FAIT (sur `main`)
- ✅ Retours Christine du 30/06 : titres `text-wrap: pretty`, bloc cassé de
  *Retrouver sa mémoire* réparé, photos Telos réagencées (portrait près de la
  vidéo, 3 photos dé-recadrées, 2 livres côte à côte), Bugarach (photo + coquille).
- ✅ Photo n°2 du diaporama Telos renvoyée à Christine (chat).
- ✅ **Migration Sveltia → TinaCMS** : schéma complet (0 champ effacé), corps en
  textarea (HTML préservé), build découplé (le site se build sans Tina), Sveltia
  + relais OAuth `/api` supprimés.
- ✅ **Bascule OVH préparée** : `v3-src/public/.htaccess` (anti-boucle HTTPS via
  X-Forwarded-Proto + bloc redirections SEO à compléter), page `/404`.
- ✅ **Redirections SEO** des 2 anciens domaines (`coach-medium.com` → /eveil-a-soi/,
  `coach-quantique.com` → /eveil-au-soi/) : voir `redirects/`.
- ✅ Fix `NEXT_PUBLIC_TINA_CLIENT_ID` (le préfixe `PUBLIC_` Astro était ignoré par Tina).
- ✅ `tina/tina-lock.json` généré + committé (ce commit) → Tina Cloud peut indexer.

## Ce qui RESTE après que `/admin` marche
1. **Validation de Christine** sur la preview (corrections + édition Tina).
2. **Bascule OVH** = mettre le site en ligne sur christinecal.com. Tout est dans
   **`GO-LIVE.md`** (Phase 3) : OVH (domaine+SSL+FTP), secrets GitHub
   (`OVH_FTP_*` + `NEXT_PUBLIC_TINA_CLIENT_ID` + `TINA_TOKEN`), variables
   `OVH_FTP_DIR` + `OVH_DEPLOY=true`, puis *Run workflow*.
3. **Redirections SEO** : déposer les `.htaccess` de `redirects/` sur les 2 anciens
   domaines (OVH), et compléter le bloc WP→V3 du `.htaccess` principal depuis
   la Search Console de christinecal.com.
4. **Facture** (rappel mail Christine) : à dater de **juillet**, au nom
   **EURL Christine CAL Coach Consultant**, mention « TVA non applicable, art. 293 B du CGI ».

## Docs de référence dans le dépôt
- `GO-LIVE.md` — runbook complet (Tina + OVH), pas-à-pas.
- `DEPLOY-CMS-TINA.md` — détail TinaCMS / accès / RGPD.
- `DEPLOY-OVH.md` — détail hébergement OVH.
- `redirects/` — redirections 301 des anciens domaines + mode d'emploi.

## Repères techniques
- Branche de travail : `claude/christine-site-deployment-ovh-nq04xb` (PR #5/#6 mergées ;
  toute nouvelle PR repart de `main`).
- Site = Astro statique dans `v3-src/`. Prod Vercel = branche `main` (preview privée,
  `noindex`). OVH ne déploie que si la variable `OVH_DEPLOY=true`.
- CMS : `v3-src/tina/config.ts`. `tina/tina-lock.json` DOIT rester committé
  (régénéré par `npx tinacms dev` si le schéma change). `tina/__generated__/` reste ignoré.
