# Mise en ligne sur OVH — christinecal.com

Le site est **statique** (HTML/CSS/JS ; seul Mon espace utilise PHP) et se pose sur
l'hébergement mutualisé OVH. Le déploiement est **automatique** via GitHub
Actions (`.github/workflows/deploy-ovh.yml`) : à chaque `push` sur `main`, le site
est reconstruit (cible racine) et envoyé en **SFTP** dans le dossier **`www-v3`** d'OVH.

## État de l'infrastructure OVH (vérifié le 26/11/2026)

> Référence à jour après le ménage du compte OVH de Christine (26/11/2026).
> Côté hébergement, SFTP et dossier `www-v3`, **rien n'a changé** : le
> déploiement fonctionne comme avant.

### Hébergement

- Hébergement mutualisé OVH, offre **Pro** (250 Go, ~6,8 Go utilisés),
  **cluster106** (`ftp.cluster106.hosting.ovh.net`, SFTP port 22).
- Nom du service chez OVH : **« christkal5d.com »** (nom historique, créé en 2012).
- Échéance **01/11/2027**, renouvellement automatique, 119,88 € HT/an.
- ⚠️ **L'offre Pro est nécessaire** : accès SSH/SFTP pour le déploiement, et
  3 bases de données. Ne pas descendre en offre Perso sans revoir tout cela.

**Multisite (domaine → dossier) :**

| Domaine | Dossier | Rôle |
|---|---|---|
| christinecal.com, www.christinecal.com | `www-v3` (SSL actif) | **Le site en production** |
| christinecal-coach-medium.com (+ www) | `coach-redir` (SSL) | Redirections 301 SEO, jusqu'au 07/09/2027 |
| christinecal-coach-quantique.com (+ www) | `coach-quantique-redir` (SSL) | Redirections 301 SEO, jusqu'au 07/09/2027 |
| coach.christkal5d.com | `coach` | Redirige vers christinecal.com |
| christkal5d.com, www.christkal5d.com, 5d.christkal5d.com | anciens dossiers (`coach-quantique`, `www`) | Non utilisés |

- `mon-espace-config.php` (mot de passe et clé GitHub de Mon espace) est dans le
  dossier parent de `www-v3`, hors déploiement. Inchangé.
- **3 bases MySQL** conservées, dont celle de l'ancien WordPress, gardée
  volontairement comme sauvegarde. Aucune n'a été touchée.
- Déploiement : GitHub Actions → SFTP vers `www-v3` (voir plus bas). Inchangé.

### Domaines

| Domaine | Rôle | Échéance | Statut |
|---|---|---|---|
| christinecal.com | Site + Mon espace | 19/11/2027 | Renouvellement auto : **à garder** |
| christkal5d.com | Domaine technique de l'hébergement (gratuit avec l'offre Pro) | 15/02/2027 | Renouvellement auto : **à garder** |
| christinecal-coach-medium.com | Redirection 301 SEO → christinecal.com/eveil-a-soi/ | 07/09/2027 | **Résilié à l'échéance** (décidé le 26/11/2026) |
| christinecal-coach-quantique.com | Redirection 301 SEO → christinecal.com/eveil-au-soi/ | 07/09/2027 | **Résilié à l'échéance** (décidé le 26/11/2026) |

Conséquences :
- Les deux anciens domaines et leurs redirections fonctionnent jusqu'au
  **7 septembre 2027**, puis disparaissent.
- Les dossiers `coach-redir` et `coach-quantique-redir` deviendront inutiles après
  cette date. **Ne pas les supprimer avant.** Après le 7 septembre 2027, on pourra
  retirer l'étape « Déploiement SFTP des redirections (anciens domaines) » de
  `deploy-ovh.yml`, les fichiers `redirects/*.htaccess` et ces deux dossiers.
- Leurs zones DNS (gratuites) restent volontairement en renouvellement automatique :
  elles arrivent à échéance avant les domaines (1er et 2 septembre), et les résilier
  couperait les redirections trop tôt.

### E-mails

- Christine utilise uniquement **cc.christinecal@gmail.com** (l'adresse affichée sur
  `/contact/`).
- **contact@christinecal.com** est une simple redirection OVH (pas de boîte).
  Modifiée le 26/11/2026 : elle pointait vers une ancienne adresse Fastmail (morte),
  elle pointe maintenant vers **cc.christinecal@gmail.com**.
- Aucune autre boîte OVH n'est utilisée (`postmaster@christkal5d.com` : vide,
  inutilisée depuis 2019, incluse gratuitement).
- MX de christinecal.com : OVH (`mx3.mail.ovh.net`, `mx4.mail.ovh.net`). **Ne pas
  les changer**, sinon contact@christinecal.com ne fonctionne plus.

### Budget OVH

- Avant le ménage : **192,42 € TTC/an** (hébergement Pro + 3 domaines payants).
  L'accès Internet xDSL est déjà arrêté depuis le 01/05/2026.
- À partir de septembre 2027 : **~160 € TTC/an**.

### Points connus, non corrigés (DNS non touché)

- christinecal-coach-medium.com : `www` a à la fois un enregistrement A et un CNAME
  (incohérent, sans effet visible).
- www.christkal5d.com pointe vers une ancienne IP OVH (erreur). Sans importance.

---


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

L'édition de contenu (CMS) est traitée séparément — voir **`DEPLOY-CMS-TINA.md`**
(TinaCMS sur `/admin`, commits GitHub via Tina Cloud). Le build du site est
**indépendant** du CMS : il réussit même sans les identifiants Tina.
