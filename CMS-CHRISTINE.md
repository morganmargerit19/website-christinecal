# CMS — Christine édite le site elle-même

Le site utilise **Sveltia CMS** (interface d'édition dans le navigateur, compatible
Decap CMS). Christine se connecte sur **`https://www.christinecal.com/admin/`**, modifie
les fiches (stages, ateliers, consultations…), et **enregistre** : ça crée un commit
GitHub, qui relance automatiquement le build et le déploiement OVH. Aucune ligne de code.

Fichiers : `v3-src/public/admin/index.html` + `v3-src/public/admin/config.yml`.

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

> Note OVH : l'hébergement statique OVH ne peut pas exécuter `/api`. Le relais OAuth reste
> donc servi par Vercel (garde le projet Vercel actif) ; `base_url` pointe vers Vercel même
> quand le site public est sur OVH. Alternative : héberger le même `/api` sur la plateforme
> finale si elle gère des fonctions serverless.

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
