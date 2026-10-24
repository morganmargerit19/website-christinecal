# État du projet : reprise

_Mise à jour : 18 octobre 2026. Ce fichier fait référence. Les autres fichiers
`REPRISE-*.md`, `SESSION-STATE.md`, `REPRENONS.md` et `GO-LIVE.md` décrivent
des étapes passées._

## Où on en est

**On attend le retour de Christine sur la maquette du nouveau site.**

| Quoi | État | Où |
| --- | --- | --- |
| Site en ligne | Ancien design, inchangé | https://www.christinecal.com |
| Mon espace | En ligne, testé de bout en bout le 18/10 | https://www.christinecal.com/mon-espace/ |
| Nouveau site « Relier » | Prêt, hors ligne, avec les retours des mails du 11 et du 12/10 | https://website-christinecal.vercel.app/nouveau-site/ |
| Maquette partagée | Version 6 | https://claude.ai/artifact/4pmEyE1wedWGFWZ9rjD3DW |

## Mon espace (gestion par Christine)

- Elle s'y connecte avec cc.christinecal@gmail.com et le mot de passe choisi par
  Morgan. Le mot de passe n'est écrit nulle part : seule son empreinte est
  enregistrée.
- Chaque enregistrement devient un commit sur `main`, signé « Christine CAL
  (Mon espace) ». Le déploiement OVH suit, et le site est à jour en environ
  5 minutes.
- Les stages alimentent **les deux sites**. L'annonce et les coordonnées
  (Petites infos) ne s'affichent **que sur le nouveau site**.
- La configuration est créée par le déploiement à partir de 2 secrets du dépôt :
  `MON_ESPACE_PASSWORD_HASH` et `MON_ESPACE_GITHUB_TOKEN`. Pour changer le mot
  de passe, modifier le secret puis relancer le workflow (Actions › Déploiement
  OVH › *Run workflow*).
- **La clé GitHub expire vers le 18/10/2027** : la renouveler, puis mettre à
  jour le secret.
- Détails : `mon-espace/INSTALLATION.md`. Guide pour Christine :
  `GUIDE-MON-ESPACE.md`.

### À savoir

- OVH tourne en **PHP 7.4**. Ne pas utiliser de fonctions PHP 8 dans
  `mon-espace/api.php` (`str_contains`, `str_ends_with`, `match`…).
- Le mot de passe FTP n'est connu que de GitHub (secret `OVH_FTP_PASSWORD`).
  Ne pas le changer chez OVH sans mettre aussi le secret à jour, sinon le
  déploiement s'arrête.
- Ne pas monter la version de PHP chez OVH : l'ancien WordPress est conservé
  sur le même hébergement.

## Prochaines étapes, après le feu vert de Christine

1. Appliquer ses éventuels derniers retours. Lui demander quelle vidéo manque
   sur « Mémoire galactique ».
2. Versions **EN / ES / IT / PL** du nouveau site, en reprenant les traductions
   existantes de `src/`.
3. **Bascule** : faire construire `astro.nouveau-site.config.mjs` (sortie
   `dist/`) par `.github/workflows/deploy-ovh.yml`. Retour arrière : revenir à
   `astro.config.mjs`. Voir `NOUVEAU-SITE.md`.
4. Envoyer le mail à Christine (texte ci-dessous), avec le mot de passe **par
   SMS**.
5. Ensuite, éventuellement : retirer Tina, condenser les textes (étape 2).

### Mail à Christine (à envoyer après la bascule)

> **Objet :** Votre espace pour modifier votre site
>
> Bonjour Christine,
>
> Vous pouvez maintenant modifier votre site vous-même.
>
> 1. Allez sur : **www.christinecal.com/mon-espace**
> 2. Entrez votre e-mail (cc.christinecal@gmail.com) et votre mot de passe :
>    je vous l'envoie par SMS.
> 3. Cliquez sur un stage, changez ce que vous voulez, puis cliquez sur
>    **Enregistrer**.
>
> Votre site se met à jour tout seul en 5 minutes.
>
> Vous ne pouvez rien casser. Au moindre doute, appelez-moi.
>
> Morgan

## En attente ailleurs

- Doublage des vidéos : nouveaux liens WeTransfer de Christine, et autorisation
  écrite de Debowska.
- Reproduire Mon espace pour d'autres clients : après quelques semaines
  d'usage réel par Christine.

## Préférences de Morgan

- Mode TDAH : action d'abord, étapes numérotées, temps estimés.
- **Ne pas surveiller les PR** : pas d'abonnement, pas de rappels.
