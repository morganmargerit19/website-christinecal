# Reprise — Retours de Christine (22/06/2026)

État de la branche `claude/christine-site-feedback-qah97x` · PR **#2** (draft) · build OK · preview Vercel OK.
Périmètre : **FR uniquement** (EN/PL/ES/IT = lot séparé).

## ✅ Fait (6 mails implémentés)

| Page | Fichiers | Résumé |
|------|----------|--------|
| Qui suis-je | `src/i18n/pages/about.ts`, `src/components/about/About.astro` | lede retiré · titre galactique italique+bleu · textes photo MAJ · parcours 6 puces compact · accordéon conférences · sections Spécificités & À venir · vidéos descendues · fin sur clientèle · Presse & DVD retiré |
| Mission | `src/components/mission/Mission.astro` | lede retouché · section « L'Espace-Temps » en 2 colonnes (vidéo gauche / texte droite) |
| Éveil à Soi | `src/components/hub/HubIndex.astro` | bloc intro sous bannière · 2 vidéos · cartes 2+1 (Consultation+Sortir, puis Construire le vaisseau plus grand) |
| Consultation | `src/content/fiches/consultation-mediumnique.md`, `src/layouts/Fiche.astro` | titre « Mission de Vie » en avant · sous-titre/intro/4 puces · 2e vidéo BOB · infos pratiques + petite image en bas |
| Sortir de la matrice | `src/content/fiches/sortir-de-sa-matrice.md`, `src/layouts/Fiche.astro` | gabarit sur-mesure (image sous titre · accroche · texte/image · infos stage · énnéagramme + objectifs · vidéo en bas) |

Infra ajoutée au schéma (`src/content.config.ts`) : `cardLede`, `hideHeaderImage`,
`hideHeaderMeta`, `practicalFooter`, `richLayout`, `pendingVideos`.

## ⏸️ Assets à intégrer (placeholders propres déjà en place)

1. Nouvelle photo « Qui suis-je » → `About.astro` (`/images/christine-portrait.jpg`).
2. Vidéo Shutterstock #1062052936 (spirale dorée) → `Mission.astro` (`.mission-spacetime__placeholder`).
3. 2 IDs YouTube « La transition planétaire » / « Le défi de l'Humanité » → `HubIndex.astro` (bloc `eveil-videos`, remplacer les placeholders par `<VideoEmbed>`).
4. ID YouTube interview « Être Médium – BOB Bellanca » → `consultation-mediumnique.md` : déplacer l'entrée de `pendingVideos` vers `videos` avec l'`id`.
5. Images `old-life-new-life.jpg` + `chat-miroir.jpg` (Sortir) → déposer dans `public/images/wp/`, puis remplacer les `.img-placeholder` du gabarit `sortir-matrice` dans `Fiche.astro` par de vraies `<img src={base + '/images/wp/...'}>`. (Hotlink WordPress = 403, à obtenir de Christine.)

## ⚠️ À confirmer avec Christine
- Consultation : témoignages **conservés** (non mentionnés) ; image du bas = `mediumnite.jpg` (est-ce bien « l'image de la tête » ?).
- Teinte de bleu du titre galactique (actuel : `--indigo-500`).
- Libellé exact du lede Mission (gardé : « … » Expérience de vie d'une galactique au sol).

## Commandes utiles
```bash
cd v3-src && npm install && npm run build   # build (sortie dans ../v3)
```

## Prochaines étapes possibles
- Intégrer les assets ci-dessus.
- Répercuter le FR sur EN/PL/ES/IT.
- Passer la PR #2 de draft à « ready » quand validé.
