# Mise en ligne sur OVH — christinecal.com

Le site V3 est **statique** (HTML/CSS/JS) : il se pose sur l'hébergement mutualisé
OVH sans base de données ni PHP. Le déploiement est **automatique** via GitHub
Actions (`.github/workflows/deploy-ovh.yml`) : à chaque `push` sur `main`, le site
est rebuildé (cible racine) et envoyé en FTP dans le dossier `www/` d'OVH.

> Tant que la variable `OVH_DEPLOY` n'est pas à `true`, l'Action ne fait rien.
> On peut donc tout préparer sans risque, et basculer le jour J en un clic.

---

## 1. Côté OVH (espace client → Web Cloud → Hébergements)

1. **Associer le domaine** `christinecal.com` à l'hébergement
   (onglet *Multisite* → *Ajouter un domaine*).
   - Dossier racine (docroot) : **`www`** (ou un sous-dossier dédié, ex. `www/christinecal`).
   - Cocher « le domaine est-il le principal / sécuriser avec SSL ».
2. **Activer le SSL** (Let's Encrypt, gratuit) sur le domaine si pas déjà fait
   (onglet *Multisite* → cadenas, ou *SSL*). Comptez quelques minutes à ~1 h.
3. **Créer (ou récupérer) un accès FTP** (onglet *FTP - SSH* → *Ajouter un utilisateur*).
   Notez : **serveur FTP** (ex. `ftp.cluster0XX.hosting.ovh.net`), **login**, **mot de passe**,
   et le **chemin** du docroot (souvent `/www` ou `./www/`).

## 2. Côté GitHub (repo → Settings → Secrets and variables → Actions)

**Secrets** (onglet *Secrets*) :

| Nom | Valeur |
|-----|--------|
| `OVH_FTP_HOST` | le serveur FTP OVH (ex. `ftp.cluster0XX.hosting.ovh.net`) |
| `OVH_FTP_USER` | le login FTP |
| `OVH_FTP_PASSWORD` | le mot de passe FTP |

**Variables** (onglet *Variables*) :

| Nom | Valeur |
|-----|--------|
| `OVH_FTP_DIR` | le docroot, ex. `./www/` (chemin où servir le site) |
| `OVH_DEPLOY` | `true` (active le déploiement — à mettre **le jour de la bascule**) |

> ⚠️ Ne jamais coller ces identifiants ailleurs que dans les *Secrets* GitHub.

## 3. Bascule (jour J)

1. Mettre `OVH_DEPLOY = true`.
2. Lancer le déploiement : soit un `push` sur `main`, soit *Actions → Déploiement
   OVH → Run workflow*.
3. Vérifier `https://www.christinecal.com` : HTTPS actif, redirection `http`→`https`
   et `non-www`→`www`, les pages et images chargent.
4. (SEO) Le site devient **indexable** (plus de `noindex`) : `robots.txt` ouvert +
   `sitemap-index.xml` déjà générés. Soumettre le sitemap dans Google Search Console.

## 4. Après bascule

- Le `/v3/` sur Vercel peut rester comme préprod (toujours en `noindex`) ou être retiré.
- Vérifier les liens internes (tous relatifs, donc OK à la racine) et le formulaire
  de contact (lien `mailto:`).

---

## Indépendance (objectif à terme)

Pour que Christine ne dépende pas du GitHub de Morgan :
1. **Transférer le dépôt** vers un compte/organisation GitHub appartenant à Christine
   (Settings → *Transfer ownership*), ou en créer un nouveau et y pousser le code.
2. Re-créer les *secrets/variables* OVH sous ce nouveau dépôt (étape 2 ci-dessus).
3. Le workflow et la config fonctionnent à l'identique : seule l'appartenance change.

L'édition de contenu par Christine (CMS) est traitée séparément — voir la feuille
de route fournie (Decap/Sveltia CMS branché sur les fiches Markdown existantes).
