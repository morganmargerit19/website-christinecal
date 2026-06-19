# Brief — Carte de visite « Christine CAL »

> Document de référence versionné. C'est la source de vérité du projet carte de visite.
> Tu (Claude design) es connecté au repo GitHub : tu as accès à tous les fichiers cités.

Tu es directeur artistique print, spécialiste de l'identité de marque et du
prêt-à-imprimer. Ta mission : concevoir la **carte de visite professionnelle** de
Christine CAL, recto-verso, qui prolonge EXACTEMENT l'univers de son site — pas une
carte générique de coach.

## 0. Avant de dessiner — imprègne-toi du repo (tu y as accès)

Ne te lance pas tout de suite. Explore d'abord pour absorber l'âme de la marque :
- `v3-src/src/styles/global.css` → DA exacte (couleurs, typo, ombres, rayons).
- `v3-src/src/components/home/Home.astro` → le PORTAIL : médaillon « CC », tagline
  « Une galactique venue du futur », ambiance Terre/cosmos. C'est le cœur visuel.
- `v3-src/src/components/about/About.astro` + `v3-src/src/i18n/pages/about.ts` →
  la VOIX de Christine (son « Qui suis-je », validé par elle). Imprègne-toi du ton :
  c'est lui qui doit transparaître dans la carte, pas un ton de coach générique.
- `v3-src/public/images/geometrie/*.svg` → les 3 géométries sacrées prêtes à l'emploi.
- `sources/wp-v2/DESIRS-CHRISTINE.md` (s'il existe) → ses désirs explicites sur la DA.
- Optionnel : lance le site (`cd v3-src && npm install && npm run build`, puis sers
  `v3/` et ouvre `/v3/`) pour voir l'univers en mouvement avant de concevoir.

Puis seulement : propose tes 2-3 directions de recto.

## 1. Qui est Christine (l'âme à respecter)

Christine CAL est **coach médium**, « Coach d'Éveil à la Multidimensionnalité de
l'Être ». Son univers : **cosmique, 5D, géométrie sacrée, lumière** — chaleureux
mais exigeant, jamais nunuche, jamais ésotérique-cliché (pas de boules de cristal,
pas de violet bave de fée, pas de typo « mystique » à fioritures). Sa signature de
marque, qu'elle adore : **« Une galactique venue du futur ».** Sa baseline :
**« Éveil à sa multidimensionnalité ».**

**Boussole absolue** : tout doit *sonner juste pour Christine*. Si un choix fait
« stock photo / template Canva / coach lambda », il est faux. On vise l'élégance
sobre, l'intemporel, le raffiné — une carte qu'on garde parce qu'elle est belle.

## 2. Le repo & la direction artistique à RÉUTILISER (ne pas réinventer)

La carte doit être l'extension physique du site. Source de vérité :

- **Tokens couleur & typo** : `v3-src/src/styles/global.css` (`:root`). Les clés :
  - Indigo nuit : `--indigo-950 #07061a` → `--indigo-900 #100d2e` (fond cosmos)
  - Or : `--gold #c9a961` / `--gold-soft #e6d49a` (accents, filets, médaillon)
  - Papier : `--paper #f8f7f4` / `--ink #161433` (verso clair lisible)
- **Polices** (mêmes que le site, via Google Fonts) :
  - Serif titres : **Cormorant Garamond** (300/400/500, italique pour les accents)
  - Sans corps/coordonnées : **Inter** (400/500/600)
- **Médaillon « CC »** : cercle filet or sur indigo, lettres serif or — voir
  `.portal-emblem` dans `src/components/home/Home.astro`. C'est l'emblème de marque.
- **Géométrie sacrée** (assets prêts) : `public/images/geometrie/spirale-fibonacci.svg`,
  `fleur-de-vie.svg`, `lemniscate.svg`. À utiliser en filigrane discret / motif d'angle.
- **Étoiles** : champ d'étoiles fines sur l'indigo (cf. `Starfield`), à évoquer en
  semis subtil — discret, pas un ciel chargé.

Charge ces fichiers et aligne-toi sur leurs valeurs exactes (couleurs hex, graisses).

## 3. Contenu de la carte (texte exact)

**Identité**
- Nom : **Christine CAL**
- Titre : **Coach d'Éveil à la Multidimensionnalité de l'Être**
- Signature : *Une galactique venue du futur* (à placer avec finesse, pas en gros)

**Coordonnées**
- Tél : **06 80 42 85 91**
- E-mail : **cc.christinecal@gmail.com**
- Site : **christinecal.com**
- YouTube : **@christinecal8701** (chaîne youtube.com/@christinecal8701)

**Optionnel — à proposer, Morgan validera** (ne pas charger inutilement) :
- Adresse pro : 254 Chemin de la Terre Pointue, Castelgirou, 24580 PLAZAC
  ⚠️ c'est son domicile — vie privée : à confirmer avant de l'imprimer sur une carte.
- Mention EURL / SIRET 393 691 993 00033
- Évocation des deux chemins : *Éveil à Soi (École 5D)* / *Éveil au Soi (Galactique)*
- **QR code** vers christinecal.com (recommandé : passerelle élégante vers son univers)

## 4. Direction artistique attendue

- **Recto = le cosmos** : fond indigo nuit, médaillon « CC », nom en Cormorant, titre
  + signature. Une seule géométrie sacrée en filigrane/angle (or très discret).
  Hiérarchie claire, beaucoup de respiration, semis d'étoiles ténu. Ambiance
  « portail » du site.
- **Verso = la lisibilité** : coordonnées impeccablement hiérarchisées. Proposer fond
  indigo (continuité) OU papier `--paper` (contraste, lecture facile) — montrer les
  deux pistes. Or réservé aux filets/picto, jamais sur du petit texte.
- **L'or** est un accent précieux (filets fins, médaillon, géométrie), pas un aplat.
- **Idée premium à explorer** : géométrie sacrée ou médaillon en **dorure à chaud
  (gold foil)** et/ou **gaufrage**, vernis sélectif sur les étoiles. Indiquer ce qui
  serait foil / deboss / vernis dans une version « finitions ».

## 5. Specs techniques prêt-à-imprimer (impératif)

- Format **carte EU 85 × 55 mm**, orientation paysage.
- **Fond perdu (bleed) 3 mm** sur les 4 côtés → zone de travail **91 × 61 mm**.
- **Marge de sécurité 4 mm** : aucun texte/logo hors de cette zone.
- **300 DPI**. Couleurs pensées **CMJN-safe** : pas de RGB néon ; l'indigo profond
  doit rester dense et propre à l'impression (signaler si un Pantone est conseillé
  pour l'or et l'indigo).
- Polices **vectorisées ou embarquées** dans le livrable final.

## 6. Livrables

Travaille dans ce dossier `carte-de-visite/` :
1. **Maquette HTML/CSS** (recto + verso) réutilisant les tokens du site, pour
   prévisualiser au navigateur aux dimensions exactes avec bleed + traits de coupe.
2. **PDF prêt-à-imprimer** (ou SVG vectoriel exact) recto-verso, 91 × 61 mm, repères
   de coupe, polices intégrées.
3. Un court **README** : couleurs hex utilisées, polices, ce qui est foil/deboss/vernis,
   et la liste des points laissés à la validation de Morgan.

## 7. Garde-fous (à ne PAS faire)

- Pas de banque d'images, pas de dégradé arc-en-ciel, pas de violet « voyance ».
- Pas de typo décorative fantaisie : on reste sur Cormorant + Inter.
- Pas de surcharge : une carte de visite, c'est du vide maîtrisé.
- Ne pas inventer de coordonnées ni de logo : utiliser ceux ci-dessus uniquement.

## 8. Méthode

Commence par lire `global.css`, `Home.astro` (médaillon) et les 3 SVG de géométrie.
Propose **2 ou 3 directions de recto** (ASCII/maquette rapide) AVANT de finaliser,
puis itère avec Morgan. Surligne chaque décision où tu as fait un choix par défaut.
