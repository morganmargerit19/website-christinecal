# CMS — Christine édite le site elle-même

Le site utilise **Sveltia CMS** (interface d'édition dans le navigateur, compatible
Decap CMS). Christine modifie les fiches (stages, ateliers, consultations…) et
**enregistre** : ça crée un commit GitHub qui relance le build et le déploiement.
Aucune ligne de code.

Fichiers : `v3-src/public/admin/index.html` + `v3-src/public/admin/config.yml`.

**Deux phases :**
- **Maintenant (preview Vercel)** — le site n'est pas figé, on reste sur Vercel.
  Le CMS est sur `https://website-christinecal.vercel.app/v3/admin/` et le relais OAuth
  est servi par Vercel (`/api`). C'est la **config active** (ci-dessous).
- **Plus tard (production OVH `christinecal.com`)** — une fois le site figé : on bascule
  sur OVH. Le relais OAuth PHP est **déjà prêt** (`/oauth`), il suffira d'1 changement de
  config (voir « Phase 2 » en bas).

---

## Mise en place (une seule fois, ~3 min)

Le **relais OAuth est déjà fourni** : dossier `/api` du dépôt (`auth.js` + `callback.js`),
déployé automatiquement par **Vercel** en fonctions serverless. **Pas besoin de Cloudflare.**
Il ne reste que 3 choses, qui exigent TON compte (impossible à faire à ta place) :

1. **Créer une OAuth App GitHub** (2 min)
   GitHub → *Settings* → *Developer settings* → *OAuth Apps* → *New OAuth App*.
   - Application name : `CMS Christine CAL`
   - Homepage URL : `https://website-christinecal.vercel.app`
   - **Authorization callback URL** : `https://website-christinecal.vercel.app/api/callback`
     (remplace par ton vrai domaine Vercel de prod si différent)
   - Crée l'app, puis **Generate a new client secret**. Note le **Client ID** et le **Client Secret**.

2. **Ajouter 2 variables d'environnement dans Vercel** (1 min)
   Vercel → projet `website-christinecal` → *Settings* → *Environment Variables* :
   - `CMS_GITHUB_CLIENT_ID` = le Client ID
   - `CMS_GITHUB_CLIENT_SECRET` = le Client Secret
   Puis *Redeploy* (pour que les fonctions `/api` prennent les variables).

3. **Vérifier `base_url`** dans `v3-src/public/admin/config.yml`
   Il pointe sur `https://website-christinecal.vercel.app`. Si ton domaine de prod diffère,
   ajuste-le (il doit servir `/api/auth` et `/api/callback`).

4. **Donner l'accès à Christine**
   L'inviter comme collaboratrice du dépôt GitHub (*Settings → Collaborators*, accès écriture).
   Elle se connecte sur `/admin/` avec son propre compte GitHub.

> Note : `/api` (Node) ne tourne que sur Vercel. C'est parfait pour la phase preview.
> Pour OVH (PHP, pas de Node serverless), le relais équivalent en PHP est déjà prêt — voir Phase 2.

---

## Utilisation (Christine)

1. Aller sur `https://www.christinecal.com/admin/` et se connecter avec GitHub.
2. Choisir une fiche (ou « New Fiche »), modifier le texte, les dates, les images…
3. Cliquer **Publish / Enregistrer**.
4. Le site se met à jour tout seul en quelques minutes.

## Portée actuelle

- ✅ Éditable au CMS : toutes les **fiches** françaises (stages, ateliers, consultations,
  conférences, parcours) — titre, résumé, dates, tarif, images, vidéos, contenu.
- ➕ À ajouter ensuite si besoin : les mêmes collections pour EN/ES/PL/IT (identiques,
  `folder: .../fiches/<langue>`), et la migration des textes de pages (accueil, mission,
  « Qui suis-je ») actuellement en fichiers TypeScript vers des fichiers de données
  éditables (petite étape technique).

---

## Phase 2 — bascule sur OVH (christinecal.com), quand le site est figé

Tout est **déjà prêt**, il n'y a presque rien à coder :

- **Auto-déploiement** : le workflow `.github/workflows/deploy-ovh.yml` build en cible OVH
  (`DEPLOY_TARGET=ovh`) et envoie le site en FTPS. Il est **dormant** tant que la variable
  de dépôt `OVH_DEPLOY` ≠ `true`.
- **Relais OAuth PHP** : `v3-src/public/oauth/{auth.php,callback.php}` (OVH exécute PHP).
  Sa clé `oauth/config.php` est **générée au build** depuis les secrets GitHub (jamais committée).

### Étapes de bascule
1. **OAuth App GitHub** : passer (ou créer) le **callback** sur
   `https://www.christinecal.com/oauth/callback.php` et la Homepage sur `https://www.christinecal.com`.
2. **Secrets GitHub du dépôt** (*Settings → Secrets and variables → Actions*) :
   - Secrets : `CMS_GITHUB_CLIENT_ID`, `CMS_GITHUB_CLIENT_SECRET`,
     `OVH_FTP_HOST`, `OVH_FTP_USER`, `OVH_FTP_PASSWORD`
   - Variables : `OVH_DEPLOY = true`, `OVH_FTP_DIR = ./www/` (selon ton hébergement OVH)
3. **Config du CMS** (`v3-src/public/admin/config.yml`) — un seul bloc à changer :
   ```yaml
   base_url: https://www.christinecal.com
   auth_endpoint: /oauth/auth.php
   ```
   (à la place de l'URL Vercel + `/api/auth`).
4. Pousser sur `main` → le workflow build + déploie OVH automatiquement. Le CMS `/admin/`
   de `christinecal.com` est opérationnel ; chaque enregistrement de Christine redéploie le site.
