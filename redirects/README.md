# Redirections SEO des anciens domaines → christinecal.com (V3)

L'ancienne présence de Christine était éclatée sur **3 domaines** ; la V3 les
unifie sous `christinecal.com` :

| Ancien domaine | Nouvelle destination |
|---|---|
| `christinecal.com` (portail WordPress) | nouveau site V3 (même domaine) |
| `www.christinecal-coach-medium.com` (Éveil à Soi) | `christinecal.com/eveil-a-soi/` |
| `www.christinecal-coach-quantique.com` (Éveil au Soi) | `christinecal.com/eveil-au-soi/` |

Pour **ne pas perdre le référencement Google**, chaque ancien domaine doit
renvoyer ses URLs en **301** vers la bonne page V3. Ce dossier contient un
`.htaccess` prêt à l'emploi par domaine (pages clés mappées + tout le reste vers
la section correspondante).

## Comment déployer (par domaine, sur OVH)

Pour `christinecal-coach-medium.com` et `christinecal-coach-quantique.com` :

1. Garder le domaine actif (ne pas le laisser expirer) — c'est lui qui porte le
   « jus » SEO à transférer.
2. Sur l'hébergement OVH, faire pointer le domaine (Multisite) vers un **dossier
   vide** dédié, contenant **uniquement** le fichier `.htaccess` correspondant
   (renommé en `.htaccess`), à la place de l'ancien WordPress.
   - `coach-medium.com.htaccess`   → racine de christinecal-coach-medium.com
   - `coach-quantique.com.htaccess` → racine de christinecal-coach-quantique.com
3. Garder le **SSL actif** sur ces domaines (les liens indexés peuvent être en https).

> ⚠️ Ces redirections pointent vers `https://www.christinecal.com/…` : elles ne
> prennent leur sens **qu'une fois la V3 en ligne** sur christinecal.com.

## Domaine principal `christinecal.com`

Ses propres anciennes URLs WordPress se gèrent dans le `.htaccess` du site V3
(`v3-src/public/.htaccess`, bloc balisé « ancien WordPress → V3 »). À compléter
avec les URLs relevées dans la Search Console de christinecal.com.

## Mapping retenu (rappel)

**coach-medium.com → /eveil-a-soi/** : `coaching-mediumnique-lecture-d-ame`→consultation-mediumnique,
`christine-cal-coach-medium`→qui-suis-je, `…/corps-de-lumiere`→corps-de-lumiere,
`…/merkaba`→merkaba, contact/mentions → idem, reste → hub Éveil à Soi.

**coach-quantique.com → /eveil-au-soi/** : `le-mont-shasta`/`reseau-telos-mondial`/`shasta-a-plazac`/`intra-terrestres`→les-intra-telos-mont-shasta,
`stage-telos-et-la-5d`→semaine-telosiens, `l-ere-des-revelations`→la-team-galactique,
voyages→voyages-expansion-conscience, `qui-est-christine…`→qui-suis-je, reste → hub Éveil au Soi.
