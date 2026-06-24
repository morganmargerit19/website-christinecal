# État de la session — reprise ultérieure

_Dernière mise à jour : 2026-06-24. Branche de travail : `claude/merkaba-modification-ideas-e42d03`. PR **#3** (ouverte, prête à merger)._

## Comment ça marche (rappel technique)
- **Source** : `v3-src/` (Astro). **Build** : `cd v3-src && npm run build` → génère le site dans **`../v3/`** (committé).
- **Vercel** sert le repo **en statique depuis la racine**, base **`/v3`** → aperçu : `https://website-christinecal.vercel.app/v3/...`. (OVH final : base `/`, via `DEPLOY_TARGET=ovh`.)
- **Contenu éditable** : fiches Markdown `v3-src/src/content/fiches/*.md` (FR à la racine ; EN/ES/PL/IT dans sous-dossiers). Schéma : `v3-src/src/content.config.ts`. Layout : `v3-src/src/layouts/Fiche.astro`.
- Pages « Qui suis-je » et « Mission » = TypeScript (`v3-src/src/i18n/pages/about.ts`, `v3-src/src/components/mission/Mission.astro`), pas encore en Markdown.
- Toujours rebuild après édition de `v3-src`, puis commit `v3/` + `v3-src/`.

## ✅ Fait & poussé
1. **Merkaba (image du vaisseau)** : tore toroïdal animé à 2 lobes, être au centre + fleur de vie + chakras. Aperçu : `/v3/merkaba-apercu.html`. SVG : `v3/images/geometrie/merkaba-activation.svg` (générateur : `sources/merkaba/gen-merkaba.js`). En place sur « Construire son vaisseau ». En attente de la validation finale de Christine.
2. **10 pages** alignées sur ses mails « PAGE DÉFINITIVE » + « RECAP SITE » (audit 6 sous-agents + 2 passes de vérif) : Qui suis-je, Mission, Construire le vaisseau + 3 stages (inversion N.1/N.3 corrigée), Team galactique, Bugarach, Consultation, Sortir de la matrice, Éveil à/au Soi, Mémoire galactique.
3. **Mission** : spirale du temps → **cadran de montre doré animé** (`v3-src/public/images/geometrie/spirale-temps.svg`).
4. **Qui suis-je** : titres de sections en MAJUSCULES ; portrait = **`ccal-portrait-2.jpg`** (ancienne photo choisie par Christophe).
5. **Retrouver sa mémoire galactique** : refonte complète (mail « PAGE DÉFINITIVE ») — image ADN, 2 colonnes « Fin time line 1 / New time line 2 », Retour du futur, Témoignage de vie, Mes expériences, 20 ans d'expérience.
6. **Mont Shasta** : **réécrit à la 1re personne** (« je ») + tout le contenu restitué (AGARTHA, Big Foot, lenticulaires, Aurelia Louise Jones, Dianne Robbins, Fondation Telos Mondial, livres, Sage de Telos, nouveau Telos) + **galerie d'images** (nouveau champ `gallery`) + 2 interviews radio Bob Bellanca. Stages enfants ajustés (Maryse seul sur Rayons ; photo « mains » sur Semaine ; « pas de voyage astral » sur Voyages-expansion).
7. **CMS Sveltia** (`/admin`) : `v3-src/public/admin/{index.html,config.yml}`. Config **complète (33 champs = tout le schéma)** → édition sûre. Relais OAuth **serverless sur Vercel** : `api/auth.js` + `api/callback.js`. Guide : `CMS-CHRISTINE.md`.

## ⏳ Reste à faire
### Par Morgan (exige son login — non automatisable) — voir `CMS-CHRISTINE.md`
- [ ] Créer **OAuth App GitHub** (callback `https://website-christinecal.vercel.app/api/callback`).
- [ ] Définir **`CMS_GITHUB_CLIENT_ID`** + **`CMS_GITHUB_CLIENT_SECRET`** dans Vercel, puis *Redeploy*.
- [ ] Inviter **Christine** en collaboratrice du dépôt (accès écriture).
- [ ] **Merger la PR #3** dans `main` (le CMS lit `branch: main`) — publie en prod.
- [ ] Vérifier `base_url` dans `admin/config.yml` si le domaine Vercel de prod diffère.

### Médias à fournir par Christine
- [ ] **Photo de la vallée** (stage Team galactique → `rencontres-galactiques-au-sol`) — actuellement aucune image d'en-tête.
- [ ] (Optionnel) **Vidéo « montre » Shutterstock** (Mission) — le SVG animé sert de version définitive.

### Décisions/validations
- [ ] **« Conférence »** : Christine a écrit « ôter Conférence ??? » sur la page Bugarach (`les-extras-du-bugarach.md`, champ `kicker`) — à trancher.
- [ ] **Validation finale** de l'image merkaba + relecture générale de Christine.

### Plus tard
- [ ] **Traductions EN/PL/ES/IT** à resynchroniser après validation FR (sinon contenu obsolète).
- [ ] (Option) Migrer « Qui suis-je » et « Mission » de TS vers fiches de données pour les rendre aussi éditables au CMS.
- [ ] Détails de présentation non bloquants (placement fin des images « à côté du texte », interlignage) — faisables par Christine au CMS.

## Boîte mail (contexte)
Échanges via Gmail MCP (compte morgan.margerit19@gmail.com). Mails clés de Christine (cc.christinecal@gmail.com) : sujets « PAGE DÉFINITIVE … », « RECAP SITE », « PAGE DÉFINITIVE RETROUVER SA MEMOIRE » (réécriture mémoire galactique), et le mail Mont Shasta (« simplifier + Claude a oublié… ») demandant la 1re personne.
