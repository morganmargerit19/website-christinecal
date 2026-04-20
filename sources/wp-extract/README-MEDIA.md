# Médias WordPress — À rapatrier

## Contexte

Les 2 XML WordPress référencent **261 images uniques**, hébergées sur :

| Host | Nombre d'images |
|---|---|
| `coach.christkal5d.com` | 150 |
| `www.christinecal-coach-quantique.com` | 111 |

Ces hôtes sont **bloqués par le sandbox d'exécution** de Claude Code (`host_not_allowed`), donc le téléchargement automatique depuis cet environnement est impossible.

## Liste complète

Voir `image-urls.txt` (une URL par ligne, triée).

Mapping `attachment_id → URL` dans `image-mapping.json` (permet de résoudre les shortcodes `[vc_single_image image="..."]`).

## Procédure de téléchargement (à faire en local ou sur un runner sans filtrage)

```bash
mkdir -p assets/images/wp
cd assets/images/wp
while IFS= read -r url; do
    # Garde la structure /YYYY/MM/filename.jpg
    rel_path=$(echo "$url" | sed -E 's|^https?://[^/]+/wp-content/uploads/||')
    dir=$(dirname "$rel_path")
    mkdir -p "$dir"
    curl -sS --max-time 30 -o "$rel_path" "$url" || echo "FAIL: $url"
done < ../../../sources/wp-extract/image-urls.txt
```

## Après téléchargement

Une fois les images dans `assets/images/wp/YYYY/MM/...`, on pourra :

1. Remplacer les références textuelles dans les pages HTML par des balises `<img>` locales.
2. Optimiser en WebP (via `cwebp` ou `squoosh-cli`).
3. Supprimer les références mortes (images d'en-têtes de WPBakery, logos footer…).

## Images prioritaires (à valider)

Pour chaque page enrichie, voici les candidats image :

- **qui-suis-je.html** — portrait Christine
- **mont-shasta-telos.html** — `entete-Shasta-2019.jpg`, `Shasta1-300x201.jpg`, `20170726_163740-300x169.jpg`, `IMG_2082-300x225.jpg`, `IMG_4235-150x150.jpg`, `IMG-20160814-WA0000.jpg`
- **retour-du-futur.html** — `nouvelle-ere-def-2.jpg`, `IMG_1526-150x150.jpg`
- **consultations.html** — `medium1.jpg`
- **corps-lumiere-vortex.html** — `P3.jpg`, `luminessence-e1494264457842.png`, `653329811.gif`
- **temoignages** — N/A (texte seul)
