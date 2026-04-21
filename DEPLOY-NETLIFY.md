# Déploiement preview Netlify — notice rapide

> Pour obtenir une URL `https://<nom-aleatoire>.netlify.app` à envoyer à Christine.

## 3 clics de setup initial

1. Va sur **https://app.netlify.com**, connecte-toi avec ton compte GitHub.
2. Bouton **"Add new site"** → **"Import an existing project"** → **"Deploy with GitHub"**.
3. Sélectionne le repo `morganmargerit19/website-christinecal`.
4. Configuration du déploiement :
   - **Branch to deploy** : `claude/continue-session-state-a0X9q` (pour que la preview suive la branche de travail)
     — ou bien `main` si tu préfères piloter la prod depuis main
   - **Build command** : laisser vide
   - **Publish directory** : `.` (racine du repo — déjà spécifié dans `netlify.toml`)
5. Clic **"Deploy site"** → attendre ~30 secondes.

Netlify te donne une URL style `https://dreamy-meadow-a1b2c3.netlify.app`. C'est cette URL que tu envoies à Christine.

## Ce qui est déjà configuré côté repo

- `netlify.toml` à la racine :
  - `X-Robots-Tag: noindex, nofollow` → Google n'indexera pas la preview
  - Cache long sur `/assets/`, cache zéro sur les HTML
  - 11 redirections 301 des anciennes URLs WordPress (`/portfolio/…`, `/le-mont-shasta/…`) vers les nouvelles pages
- `404.html` à la racine → Netlify l'utilise automatiquement
- Formulaire de contact **déjà câblé Netlify Forms** (`data-netlify="true"` dans `contact.html`). Les messages apparaîtront dans l'onglet "Forms" du dashboard Netlify.

## Protection par mot de passe (optionnel)

L'URL est obscure et `noindex`, mais si tu veux **vraiment** bloquer l'accès à tout inconnu :

- **Netlify Pro (19 $/mois)** : activer "Password protection" depuis le dashboard, un mot de passe unique pour tout le site.
- **Gratuit** : je peux ajouter du HTTP Basic Auth via une Netlify Edge Function — dis-le moi si tu veux, j'écris le code.

## Après la relecture de Christine

Quand elle valide :

1. Retirer le bloc `[[headers]] / "/*" / X-Robots-Tag = "noindex"` dans `netlify.toml` pour autoriser l'indexation Google.
2. Ajouter le **domaine custom** `christinecal.com` depuis le dashboard Netlify → Domain settings → Add custom domain.
3. Pointer le DNS (chez OVH, Gandi, etc.) :
   - Enregistrement `ALIAS/ANAME` sur `christinecal.com` → `apex-loadbalancer.netlify.com`
   - Enregistrement `CNAME` sur `www.christinecal.com` → `<ton-site>.netlify.app`
4. Netlify fera le HTTPS automatiquement (Let's Encrypt, 2–5 minutes).

## Installer Decap CMS pour que Christine édite elle-même

C'est une étape séparée, à faire après validation du site. Voir discussion précédente — on fera ça quand elle aura dit "OK je veux ça en prod".
