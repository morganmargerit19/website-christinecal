# CMS — Christine édite le site elle-même

Le site utilise **Sveltia CMS** (interface d'édition dans le navigateur, compatible
Decap CMS). Christine se connecte sur **`https://www.christinecal.com/admin/`**, modifie
les fiches (stages, ateliers, consultations…), et **enregistre** : ça crée un commit
GitHub, qui relance automatiquement le build et le déploiement OVH. Aucune ligne de code.

Fichiers : `v3-src/public/admin/index.html` + `v3-src/public/admin/config.yml`.

---

## Mise en place (une seule fois)

Sveltia/Decap a besoin d'un **relais OAuth** pour la connexion GitHub (l'hébergement OVH
ne fournit pas d'authentification). Le plus simple, gratuit : un **Cloudflare Worker**.

1. **Créer une OAuth App GitHub**
   GitHub → *Settings* → *Developer settings* → *OAuth Apps* → *New OAuth App*.
   - Homepage URL : `https://www.christinecal.com`
   - Authorization callback URL : l'URL du Worker (étape 2) + `/callback`
   - Noter le **Client ID** et le **Client Secret**.

2. **Déployer le relais OAuth** (Cloudflare Worker)
   Utiliser le projet **`sveltia-cms-auth`** (open source) :
   https://github.com/sveltia/sveltia-cms-auth — « Deploy to Cloudflare ».
   Renseigner `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` dans les variables du Worker.
   Récupérer l'URL publique du Worker.

3. **Brancher le relais dans la config**
   Dans `v3-src/public/admin/config.yml`, sous `backend:`, décommenter et renseigner :
   ```yaml
   base_url: https://VOTRE-WORKER.workers.dev
   ```
   Committer → le `/admin` est opérationnel.

4. **Donner l'accès à Christine**
   L'inviter comme collaboratrice du dépôt GitHub (*Settings → Collaborators*), avec
   un accès en écriture. Elle se connecte avec son propre compte GitHub.

> Astuce : à la bascule d'indépendance (dépôt transféré sur le GitHub de Christine),
> il suffit de mettre à jour `repo:` dans `config.yml` et de recréer l'OAuth App.

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
