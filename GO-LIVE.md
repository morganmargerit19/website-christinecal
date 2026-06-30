# 🚀 GO-LIVE — Activer TinaCMS + basculer sur christinecal.com (OVH)

Guide pas à pas pour Morgan. Trois phases, dans l'ordre. Coche au fur et à mesure.
Détails de fond : `DEPLOY-CMS-TINA.md` (CMS) et `DEPLOY-OVH.md` (hébergement).

> **Repère mental :**
> - `main` (GitHub) → reconstruit la **preview Vercel** (privée, `noindex`).
> - `main` → déploie sur **OVH** *uniquement si* la variable `OVH_DEPLOY = true`.
> - Le **site public** sera servi par **OVH** ; l'**éditeur `/admin`** marche sur
>   les deux. Le build du site **ne casse jamais** si Tina n'est pas (encore) configuré.

---

## PHASE 1 — Activer l'éditeur TinaCMS (`/admin`)

> But : que toi (puis Christine) puissiez éditer le contenu. Indépendant d'OVH.

- [ ] **1.1** Va sur <https://app.tina.io> → connecte-toi **avec GitHub**.
- [ ] **1.2** *Create project* → choisis **« connect an existing repo / import »** →
      autorise la **GitHub App Tina** → sélectionne `morganmargerit19/website-christinecal`.
- [ ] **1.3** Règle la **branche du projet sur `main`**.
- [ ] **1.4** Onglet **Overview** → copie le **Client ID**.
      Onglet **Tokens** → *Create token* → type **Content (read-only)** → copie le **token**.
- [ ] **1.5** Onglet **Site URLs** (origines autorisées / CORS) → ajoute :
      - l'URL de prod Vercel,
      - le glob des previews : `https://website-christinecal-*-morganmargerit19s-projects.vercel.app`,
      - (plus tard) `https://www.christinecal.com` et `https://christinecal.com`.
- [ ] **1.6** **Vercel** → projet `website-christinecal` → *Settings → Environment Variables* →
      ajoute (Production **et** Preview) :
      - `NEXT_PUBLIC_TINA_CLIENT_ID` = le Client ID
      - `TINA_TOKEN` = le token
      Puis *Deployments → … → Redeploy* le dernier déploiement.
- [ ] **1.7** **Test** : ouvre `https://<ton-url-vercel>/admin/` → connecte-toi →
      modifie une carte → *Save*. Un **commit** doit apparaître sur GitHub et la
      preview se reconstruire. ✅ Tina fonctionne.

> **Accès Christine** : tant que tu ne l'ajoutes pas dans *Collaborators* du projet
> Tina (offre gratuite = 2 sièges), **elle ne peut pas éditer** → l'ancien problème
> est bloqué. Invite-la quand tu voudras qu'elle réédite.

---

## PHASE 2 — Validation finale par Christine (recommandé avant la bascule)

- [ ] **2.1** Envoie-lui l'URL de preview (ou son `/admin`) pour qu'elle valide les
      dernières corrections (titres, Telos, Bugarach) **avant** de couper le WordPress.
- [ ] **2.2** Récupère sa **liste d'anciennes URLs WordPress** (via sa *Google Search
      Console* → *Pages*, ou sa sitemap) pour préparer les redirections SEO (phase 3.6).

---

## PHASE 3 — Bascule sur christinecal.com (OVH)

> But : remplacer le WordPress actuel par le nouveau site. **Réversible** (voir Rollback).

### 3a. Côté OVH (espace client)
- [ ] **3.1** *Web Cloud → Hébergements → Multisite* → **Ajouter le domaine**
      `christinecal.com`, **dossier racine = `www`**, coche « domaine principal ».
- [ ] **3.2** **Active le SSL** (Let's Encrypt, gratuit) sur le domaine (compter ≤ 1 h).
- [ ] **3.3** *FTP-SSH → Ajouter un utilisateur* → note **serveur FTP**
      (ex. `ftp.clusterXXX.hosting.ovh.net`), **login**, **mot de passe**, **chemin**
      (souvent `./www/`).

### 3b. Côté GitHub (Settings → Secrets and variables → Actions)
- [ ] **3.4** **Secrets** : `OVH_FTP_HOST`, `OVH_FTP_USER`, `OVH_FTP_PASSWORD`,
      et (pour que `/admin` soit aussi sur OVH) `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`.
- [ ] **3.5** **Variables** : `OVH_FTP_DIR` = `./www/` (ton chemin), et — **en dernier** —
      `OVH_DEPLOY` = `true`.

### 3c. (Optionnel mais recommandé) Redirections SEO
- [ ] **3.6** Dans `v3-src/public/.htaccess`, complète le bloc balisé
      « ancien WordPress → V3 » avec les URLs de l'étape 2.2, ex. :
      `RewriteRule ^le-mont-shasta/?$ /eveil-au-soi/les-intra-telos-mont-shasta/ [L,R=301]`.
      Commit + push. (Sans ça, les vieux liens Google tomberont en 404.)

### 3d. Déclencher la mise en ligne
- [ ] **3.7** **Fusionne la PR #5 dans `main`** (bouton *Merge* sur GitHub).
      → la preview Vercel se met à jour (rien sur OVH encore si `OVH_DEPLOY` ≠ `true`).
- [ ] **3.8** Vérifie que `OVH_DEPLOY = true` (étape 3.5), puis : onglet **Actions** →
      workflow **« Déploiement OVH »** → **Run workflow** (sur `main`).
- [ ] **3.9** **Vérifie** `https://www.christinecal.com` :
      - HTTPS actif (cadenas), `http://` et `christinecal.com` (sans www) redirigent vers `https://www.…`
      - les pages, images et le formulaire de contact (lien `mailto:`) fonctionnent
      - `https://www.christinecal.com/admin/` ouvre l'éditeur Tina
- [ ] **3.10** **SEO** : dans Google Search Console, soumets
      `https://www.christinecal.com/sitemap-index.xml`.

---

## ✅ Après la bascule
- Nettoyage : supprime de Vercel les anciennes variables `CMS_GITHUB_CLIENT_ID/SECRET`
  (relais Sveltia, plus utilisées) ; l'OAuth App GitHub « CMS Christine CAL » peut être supprimée.
- Édition : chaque *Save* dans `/admin` recommite sur `main` → le workflow OVH
  redéploie automatiquement (push sur `main`).

## ↩️ Rollback (si problème)
- Remets `OVH_DEPLOY = false` (stoppe les déploiements OVH), **ou**
- Repointe le `christinecal.com` (DNS / Multisite OVH) vers l'ancien dossier WordPress.
  Le code reste intact ; rien n'est détruit côté WordPress tant que tu ne supprimes
  pas son dossier.
