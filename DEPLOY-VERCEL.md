# Déploiement preview Vercel — notice rapide

> Pour obtenir une URL `https://<nom>.vercel.app` à envoyer à Christine, en remplacement de la preview Netlify (limite atteinte).

## 3 clics de setup initial

1. Va sur **https://vercel.com**, connecte-toi avec ton compte GitHub.
2. Bouton **"Add New…"** → **"Project"** → sélectionne le repo `morganmargerit19/website-christinecal` (clique "Import").
3. Configuration du déploiement :
   - **Framework Preset** : `Other` (site statique pur, pas de build)
   - **Root Directory** : `./` (racine — laisser par défaut)
   - **Build Command** : laisser vide (override désactivé)
   - **Output Directory** : laisser vide (Vercel sert les fichiers tels quels)
   - **Install Command** : laisser vide
4. Clic **"Deploy"** → attendre ~30 secondes.

Vercel te donne une URL style `https://website-christinecal-xyz.vercel.app`. C'est cette URL que tu envoies à Christine.

## Choisir la bonne branche à déployer

Par défaut, Vercel déploie la branche définie comme "Production Branch" (souvent `main`). Pour que la preview suive la branche de travail :

- Soit tu vas dans **Project Settings → Git → Production Branch** et tu mets `claude/continue-session-state-a0X9q` (ou la branche de dev en cours).
- Soit tu laisses `main` en prod et tu utilises les **Preview Deployments** : chaque push sur une branche non-main crée automatiquement une URL preview unique style `https://website-christinecal-git-claude-continue-xyz.vercel.app`. Pratique pour partager des versions intermédiaires.

## Ce qui est déjà configuré côté repo

- `vercel.json` à la racine :
  - `X-Robots-Tag: noindex, nofollow` → Google n'indexera pas la preview
  - `X-Content-Type-Options`, `Referrer-Policy` (sécurité de base)
  - Cache long sur `/assets/`, cache zéro sur les `.html`
  - 11 redirections 301 des anciennes URLs WordPress (`/portfolio/…`, `/le-mont-shasta/…`) vers les nouvelles pages
- `404.html` à la racine → Vercel l'utilise automatiquement pour les routes introuvables
- `netlify.toml` est conservé au cas où on revienne sur Netlify (Vercel l'ignore).

## Limites connues de cette preview Vercel

- **Formulaire de contact KO** : `contact.html` est câblé pour Netlify Forms (`data-netlify="true"`). Sur Vercel, l'envoi du form ne fait rien (l'utilisateur sera redirigé vers `/merci.html` mais aucun message n'arrivera). C'est temporaire pour la preview — Christine peut indiquer son téléphone (06 80 42 85 91) et son email (cc.christinecal@gmail.com) sur la page contact en attendant. Quand on choisira l'hébergeur final, on branchera une vraie solution (Formspree, Web3Forms, fonction serverless, etc.).
- Pas de protection par mot de passe sur le plan gratuit Vercel (l'URL `noindex` est obscure ; ça suffit pour une preview).

## Limites du plan gratuit Vercel (Hobby)

Pour info, à surveiller :
- **100 GB/mois de bande passante** (largement suffisant pour une preview interne)
- **6 000 minutes de build/mois** (on n'utilise pas — site statique sans build)
- Déploiements illimités

## Après la relecture de Christine

Quand le site est validé et qu'on choisit l'hébergeur final (pas forcément Vercel) :

1. Retirer le bloc `X-Robots-Tag: noindex` dans `vercel.json` (ou la config de l'hébergeur final) pour autoriser l'indexation Google.
2. Brancher une vraie solution de formulaire à la place de Netlify Forms.
3. Ajouter le domaine custom `christinecal.com` et basculer le DNS.
