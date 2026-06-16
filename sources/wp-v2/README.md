# sources/wp-v2/ — contenu WordPress de la refonte (V2)

Dépose ici le contenu récupéré du WordPress refait par Christophe, dès qu'il est « fini »
(prévu : bouclage le mercredi 17/06/2026 à 14h ; lien envoyé par Christophe dans la foulée).

## Ce qu'on attend ici (par ordre de préférence)

1. **Export WordPress natif (WXR `.xml`)** — le mieux.
   WP admin → *Outils → Exporter → Tout le contenu* → fichier `.xml`.
   Nos scripts (`../scripts/`) savent déjà parser ce format (c'est ce qu'on a fait en V1).
   Accès admin déjà fournis à Morgan le 12/06 (`christinecal.com/wp-admin/`), donc Morgan
   peut faire l'export lui-même sans dépendre de Christophe.
2. **Le dossier `wp-content/uploads/` en zip** — toutes les images originales.
3. **À défaut : juste l'URL du site en ligne** — Claude crawle et extrait tout.
4. **Bonus** : tout nouveau texte/photo écrit par Christine (Word, mail, peu importe).

## Une fois le contenu déposé

Ouvrir une session Claude Code et dire :
> « Le contenu WordPress est dans `sources/wp-v2/`. Lis `REFONTE-V2.md` et lance la production de la V2. »

Le plan de production complet est dans `REFONTE-V2.md` (étape 3).

## ⚠️ Rappel

On a **déjà tout le contenu V1** dans `../wp-extract/` (52 extraits MD, 209 images).
Si le nouveau WordPress reprend les mêmes textes, seuls les contenus **nouveaux** nous
intéressent → la première étape sera un diff V1 ↔ nouveau contenu.

## Points spécifiques remontés par Christine (mail du 16/06)

- **RGPD multilingue** : à produire FR/EN/PL (mentions légales + politique de confidentialité
  + politique cookies + bandeau de consentement). Pas besoin du plugin payant évoqué par
  Christophe — on génère tout en statique dans la V2, en repartant des textes CNIL déjà
  rédigés pour la V1 (`../../mentions-legales.html`, `../../politique-confidentialite.html`).
- **Images symboliques à conserver** : Christine veut garder certaines images qui ont du sens
  pour elle. À lister avec elle (déjà dans le repo : image-portail mains+cercles, portrait Sony).
- **Home page** : livrée non terminée par Christophe → on la refait entièrement dans la V2.
- **Vidéos** : déclenchement depuis le site + sous-titrage/traduction (voire voix off) — à cadrer.
