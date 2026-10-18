# Installer « Mon espace » (pour Morgan, environ 15 min)

« Mon espace » est l'espace de gestion de Christine, à l'adresse
`https://www.christinecal.com/mon-espace/`. Elle y ajoute et modifie ses
stages (dates, lieu, tarif, photo, texte, vidéos, témoignages) et ses petites
infos (téléphone, e-mail, annonce en haut du site, accroches des univers).

Chaque enregistrement devient un commit sur `main`. Le déploiement OVH
existant se lance tout seul, et le site est à jour 3 à 5 minutes plus tard.
Tout est annulable dans l'historique GitHub.

## Ce qui est dans le dépôt, et ce qui n'y est pas

- Dans le dépôt : `mon-espace/` (page, script, API PHP). Le workflow
  `deploy-ovh.yml` le copie dans le site publié.
- **Pas dans le dépôt** : `mon-espace-config.php`, qui contient le mot de passe
  et la clé GitHub. Ce fichier vit uniquement sur le serveur OVH, **hors du
  dossier public `www`**. Le déploiement (`mirror --delete`) ne touche qu'à
  `www` : ce fichier n'est donc jamais effacé ni exposé.

## Étapes

1. **Créer la clé GitHub** : GitHub › Settings › Developer settings ›
   Personal access tokens › *Fine-grained tokens* › Generate new token.
   - Repository access : *Only select repositories* › `website-christinecal`.
   - Permissions : **Contents : Read and write**, **Actions : Read-only**
     (Metadata : Read-only, ajouté d'office).
   - Expiration : un an (mets-toi un rappel pour la renouveler).
2. **Créer l'empreinte du mot de passe de Christine**, sur ton Mac, dans le
   Terminal (le mot de passe lui-même n'est jamais enregistré) :
   ```
   htpasswd -bnBC 12 "" 'LE-MOT-DE-PASSE' | tr -d ':\n'
   ```
   Copie le résultat, qui commence par `$2y$12$`.
3. **Ranger les 2 valeurs dans GitHub** : dépôt › Settings › Secrets and
   variables › Actions › *New repository secret*, deux fois :
   - `MON_ESPACE_PASSWORD_HASH` : l'empreinte (`$2y$12$…`) ;
   - `MON_ESPACE_GITHUB_TOKEN` : la clé (`github_pat_…`).
4. **C'est le déploiement qui crée le fichier de configuration** : il écrit
   `mon-espace-config.php` à partir de ces 2 secrets et le dépose dans le
   **dossier parent du site**, à côté de `www`. Pour changer le mot de passe
   ou renouveler la clé, il suffit de modifier le secret puis de relancer le
   workflow (Actions › Déploiement OVH › *Run workflow*).

   Méthode manuelle, sans les secrets : copie
   `mon-espace/mon-espace-config.example.php` sous le nom
   `mon-espace-config.php`, remplis-le, puis dépose-le en SFTP (mêmes
   identifiants que le déploiement) **à côté** de `www`, pas dedans :
   ```
   /home/<identifiant>/mon-espace-config.php   ← ici
   /home/<identifiant>/www/                    ← le site
   ```
   Si le site n'est pas publié dans `www` (variable `OVH_FTP_DIR`), le fichier
   va dans le dossier parent du dossier du site.
5. **Vérifier PHP** dans l'espace client OVH (Hébergement › Informations
   générales) : PHP 7.4 ou plus récent.
6. **Mettre en ligne** : fusionner la PR. Le déploiement copie `mon-espace/`.
   Ensuite, ouvre `https://www.christinecal.com/mon-espace/` et connecte-toi
   avec l'e-mail et le mot de passe de Christine.

## Sécurité

- Mot de passe stocké sous forme d'empreinte (bcrypt). Blocage pendant
  15 minutes après 5 essais ratés.
- Session en cookie sécurisé (HTTPS, HttpOnly, SameSite Strict) et jeton
  anti-falsification sur chaque action.
- La clé GitHub reste sur le serveur : le navigateur ne la voit jamais.
- Chemins modifiables limités aux fiches françaises, à 3 fichiers de données
  et au dossier des photos de stages. Le code du site ne peut pas être modifié
  depuis l'espace.
- Photos : JPEG, PNG ou WebP uniquement, 6 Mo au plus (elles sont réduites à
  1600 px dans le navigateur avant l'envoi).
- `.htaccess` : HTTPS forcé, seuls les fichiers de l'espace sont servis,
  politique de sécurité du contenu stricte, pas d'indexation.

## Bon à savoir

- Le site **actuel** et le **nouveau site** lisent les mêmes fiches : ce que
  Christine enregistre apparaît sur les deux. L'annonce et les coordonnées
  (Petites infos) ne s'affichent que sur le nouveau site.
- Les pages avec une mise en page particulière (colonnes, images placées dans
  le texte) gardent leur texte en lecture seule dans l'espace. Leurs autres
  champs restent modifiables.
- Pas de suppression possible : on décoche « Afficher ce stage sur le site ».
- Si GitHub refuse un enregistrement parce que la fiche a été modifiée
  ailleurs entre-temps, l'espace le dit, et il suffit de recharger la page.

## Tester en local (développeur)

```
MON_ESPACE_CONFIG=/chemin/vers/config-de-test.php php -S 127.0.0.1:8898 -t mon-espace
```
Avec `'api_base' => 'http://127.0.0.1:8899'` et `'secure_cookie' => false`
dans la configuration de test, et un faux serveur GitHub sur le port 8899.
