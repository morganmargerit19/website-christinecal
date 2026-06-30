# CMS — TinaCMS (remplace Sveltia)

Le site est éditable via **TinaCMS** sur la page **`/admin`**. Chaque
enregistrement crée un commit GitHub (via la **GitHub App de Tina Cloud**) → le
site se reconstruit et se redéploie. Plus aucune ligne de code à toucher.

> **Pourquoi on a quitté Sveltia ?** Sa mise en page était trop pénible pour
> Christine, **et** sa config ne déclarait pas tous les champs (`sideImages`,
> `inlineMedia`, `wideBody`, `audioCover`, `bodyImageBelow`) : à chaque
> sauvegarde, ces champs de mise en page étaient **silencieusement effacés** —
> d'où des fiches (Telos, Bugarach…) qui « cassaient ». La config Tina
> (`v3-src/tina/config.ts`) déclare **tous** les champs : plus d'effacement.

---

## Architecture (important)

- L'éditeur **formulaire** `/admin` est une appli statique : elle fonctionne
  **aussi bien sur l'hébergement statique OVH que sur Vercel**. Elle parle à
  l'API de **Tina Cloud**, qui commite sur GitHub.
- L'édition **visuelle** (aperçu live « cliquer pour modifier ») nécessite un
  serveur Node (SSR) : elle **ne marche pas** sur OVH statique. Pour Christine,
  l'éditeur formulaire suffit. (On pourra l'activer plus tard côté Vercel si
  besoin — option, non requis.)
- **Le build du site ne dépend PAS de Tina** : si les identifiants Tina Cloud
  sont absents ou invalides, le site se construit quand même (sans `/admin`).
  On peut donc déployer sans risque avant d'avoir fini l'inscription Tina.

## Mise en place (une seule fois — TON compte, ~10 min)

1. **Créer le projet Tina Cloud** : aller sur <https://app.tina.io>, se
   connecter avec GitHub.
2. **Connecter le dépôt existant** (flux « Import your site » / connect repo),
   approuver la **GitHub App Tina**, sélectionner
   `morganmargerit19/website-christinecal`.
3. **Branche du projet = `main`** (doit correspondre à la branche déployée).
4. **Récupérer les identifiants** : onglet *Overview* → copier le **Client ID** ;
   onglet *Tokens* → créer un **Content token (lecture seule)**.
5. **Renseigner ces 2 valeurs à 3 endroits** (mêmes valeurs partout) :
   - **Vercel** → projet `website-christinecal` → *Settings → Environment Variables* :
     `NEXT_PUBLIC_TINA_CLIENT_ID` et `TINA_TOKEN`.
   - **GitHub Actions** (déploiement OVH) → dépôt → *Settings → Secrets and
     variables → Actions → Secrets* : `NEXT_PUBLIC_TINA_CLIENT_ID` et `TINA_TOKEN`.
   - **En local** (facultatif) : copier `v3-src/.env.example` en `v3-src/.env`.
6. **CORS / origines autorisées** : dans le projet Tina Cloud (*Site URLs* /
   allowed origins), ajouter l'URL Vercel de prod, le glob des previews Vercel
   (`https://website-christinecal-*-morganmargerit19s-projects.vercel.app`) et,
   après bascule, `https://www.christinecal.com` + `https://christinecal.com`.
   (Une origine manquante = erreur « failed to load » dans l'éditeur.)
7. **Redéployer** Vercel pour que `/admin` se construise avec les identifiants.

## Accès / « stopper l'édition »

- **Christine ne peut PAS éditer tant qu'elle n'a pas de siège Tina Cloud.**
  Tant que tu ne l'invites pas dans *Collaborators* du projet Tina, l'ancien
  problème (elle casse des mises en page) est **mécaniquement bloqué**.
- L'offre **gratuite = 2 utilisateurs** : garde **toi seul** pour l'instant ;
  invite Christine comme 2ᵉ siège **quand tu voudras** qu'elle réédite.
- **Ancien accès Sveltia retiré** : l'éditeur `/admin` Sveltia et son relais
  OAuth (`/api`) ont été supprimés. Tu peux aussi, si tu veux la couper
  complètement de GitHub : *Settings → Collaborators* du dépôt → retirer son
  accès (à ta main — non fait automatiquement). Et l'**OAuth App GitHub**
  « CMS Christine CAL » + les variables Vercel `CMS_GITHUB_CLIENT_ID/SECRET`
  ne servent plus : supprimables.

## Ce que les éditeurs peuvent gérer

- **Cartes** (`fiches`) : stages, ateliers, consultations, voyages — tous les
  champs (textes, images, diaporama, vidéos, photos latérales/insérées, etc.).
  Le **corps** est un éditeur texte (markdown + HTML autorisé) : le HTML de mise
  en page est conservé tel quel.
- **Pages** : Qui suis-je, Ma mission, Éveil à Soi, Éveil au Soi.

## RGPD

Tina Cloud est un sous-traitant US/AWS (éditeur SSW). Demander le DPA/SCC à
`security@tina.io` avant d'ajouter le compte personnel de Christine. Le contenu
reste sur GitHub (markdown/JSON) ; la donnée personnelle se limite aux comptes
des 2 éditeurs.
