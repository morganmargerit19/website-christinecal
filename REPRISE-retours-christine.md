# Reprise locale (VSCode) — Retours de Christine sur le site

Branche : **`claude/christine-site-feedback-qah97x`** · PR **#2** (draft) · build OK · Vercel preview OK.
Périmètre traité : **FR uniquement** (EN/PL/ES/IT = à faire après).

## 1. Démarrer en local
```bash
git checkout claude/christine-site-feedback-qah97x
git pull
cd v3-src
npm install
npm run dev      # http://localhost:4321/v3/
# build de contrôle : npm run build  (sortie dans ../v3)
```
Node 22 · Astro 5. Le site vit dans **`v3-src/`** (`v3/` = build généré, ne pas éditer).

## 2. Où éditer quoi
- **Textes des pages principales** : `v3-src/src/i18n/pages/about.ts` (Qui suis-je),
  `v3-src/src/components/mission/Mission.astro` (Mission),
  `v3-src/src/components/hub/HubIndex.astro` (Éveil à Soi / Éveil au Soi).
- **Fiches (stages, consultation…)** : `v3-src/src/content/fiches/*.md`
  (1 fichier = 1 page ; le frontmatter pilote image/vidéos/infos, le corps = texte).
- **Gabarit des fiches** : `v3-src/src/layouts/Fiche.astro`.
- **Schéma des fiches** (champs autorisés) : `v3-src/src/content.config.ts`.
- **Images** : `v3-src/public/images/wp/`.
- **Source de référence du contenu** : `sources/wp-v2/pages/*.md` (extract WordPress
  de Christophe). ⚠️ Le WordPress en ligne est inaccessible (403) — utiliser cet extract.

## 3. Ce qui est FAIT (11 mails de Christine)
| Page | Fichier principal |
|------|-------------------|
| Qui suis-je | `i18n/pages/about.ts` + `components/about/About.astro` |
| Mission | `components/mission/Mission.astro` |
| Éveil à Soi | `components/hub/HubIndex.astro` (+ fiches consultation / sortir-de-sa-matrice / construire-son-vaisseau) |
| Éveil au Soi | `components/hub/HubIndex.astro` (+ fiches retrouver-sa-memoire-galactique / les-intra-telos-mont-shasta / les-extras-du-bugarach) |
| Consultation | `content/fiches/consultation-mediumnique.md` |

Détail par mail dans l'historique git (un commit par vague). Mail 7 = annulé par le 9.

## 4. Reste à faire
### Assets à fournir (placeholders/fallbacks en place)
- [ ] `merkaba.mp4` — vidéo « qui s'active » en tête de *Construire son vaisseau*.
- [ ] Nouvelle photo « Qui suis-je » (plus actuelle) → `public/images/christine-portrait.jpg`.
- [ ] Vidéo Shutterstock #1062052936 (spirale dorée, *Mission*) → remplacer le placeholder dans `Mission.astro`.
- [ ] IDs YouTube des « vidéos interview radio » du Mont Shasta (absents de l'extract).

### À valider / ajuster
- [ ] *Consultation* : le « BOB Bellanca » a été traité comme l'**interview audio** déjà présente (l'extract WP confirme : MP3, pas une vidéo). Confirmer.
- [ ] Images **ADN** (*Construire*) et **astrologue** (*Retrouver mémoire*) : affichées en figure centrée (`bodyImage`). Repasser en 2 colonnes image/texte si voulu.
- [ ] Teinte de bleu du titre « Une galactique venue d'un futur » (*Qui suis-je*) — actuel : `--indigo-500`.

### Lot séparé
- [ ] Traductions EN / PL / ES / IT (seul le FR est à jour).
- [ ] Quand validé : passer la PR #2 de *draft* à *ready*.

## 5. Composants/champs ajoutés cette session (utiles à connaître)
- `components/Slideshow.astro` — diaporama (utilisé sur Mont Shasta).
- Champs de frontmatter fiche : `cardLede`, `hideHeaderImage`, `hideHeaderMeta`,
  `practicalFooter`, `richLayout`, `pendingVideos`, `videosHeading`, `testimonials`,
  `bodyImage`, `slideshow`.
</content>
