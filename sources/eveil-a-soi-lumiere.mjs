// Bandeau « Éveil à Soi » : création originale (rayonnement bleu, silhouette en méditation,
// cœur lumineux), dans l'esprit de l'image iStock aimée par Christine, sans la reprendre.
// Lancer depuis la racine du dépôt : node sources/eveil-a-soi-lumiere.mjs v3-src/public/images/wp/eveil-a-soi-lumiere.jpg 1800 600
import sharp from '../v3-src/node_modules/sharp/lib/index.js';
const [out, W = 1800, H = 600] = process.argv.slice(2).map((v, i) => (i ? +v : v));
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const cx = W / 2, cy = H * 0.52; // cœur

// Rayons : fins triangles depuis le cœur, plus ou moins lumineux
let rays = '';
for (let i = 0; i < 150; i++) {
  const a = rnd() * Math.PI * 2, w = 0.004 + rnd() * 0.02, L = W * (0.45 + rnd() * 0.5);
  const x1 = cx + Math.cos(a - w) * L, y1 = cy + Math.sin(a - w) * L;
  const x2 = cx + Math.cos(a + w) * L, y2 = cy + Math.sin(a + w) * L;
  rays += `<polygon points="${cx},${cy} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="url(#ray)" opacity="${(0.12 + rnd() * 0.5).toFixed(2)}"/>`;
}
// Poussière d'étoiles
let dust = '';
for (let i = 0; i < 900; i++) {
  const x = rnd() * W, y = rnd() * H, d = Math.hypot(x - cx, y - cy) / W;
  const r = rnd() < 0.96 ? 0.5 + rnd() * 1.1 : 1.6 + rnd() * 1.6;
  dust += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${rnd() < 0.5 ? '#bfe6ff' : '#ffffff'}" opacity="${Math.max(0.08, 0.85 - d * 1.2).toFixed(2)}"/>`;
}
// Silhouette assise en lotus, centrée, pieds hors cadre en bas
const s = H / 600, X = (v) => (cx + v * s).toFixed(1), Y = (v) => (H - (600 - v) * s).toFixed(1);
const body = `
  <ellipse cx="${X(0)}" cy="${Y(150)}" rx="${(31 * s).toFixed(1)}" ry="${(39 * s).toFixed(1)}"/>
  <path d="M${X(-14)} ${Y(180)} L${X(14)} ${Y(180)} L${X(17)} ${Y(206)} L${X(-17)} ${Y(206)} Z"/>
  <path d="M${X(-17)} ${Y(203)} C${X(-60)} ${Y(206)} ${X(-92)} ${Y(214)} ${X(-104)} ${Y(240)}
           C${X(-114)} ${Y(266)} ${X(-110)} ${Y(320)} ${X(-118)} ${Y(372)}
           C${X(-124)} ${Y(412)} ${X(-150)} ${Y(448)} ${X(-172)} ${Y(470)}
           C${X(-184)} ${Y(482)} ${X(-176)} ${Y(494)} ${X(-160)} ${Y(490)}
           C${X(-134)} ${Y(482)} ${X(-104)} ${Y(452)} ${X(-88)} ${Y(420)}
           C${X(-78)} ${Y(400)} ${X(-74)} ${Y(380)} ${X(-70)} ${Y(372)}
           C${X(-64)} ${Y(396)} ${X(-60)} ${Y(420)} ${X(-62)} ${Y(440)}
           L${X(62)} ${Y(440)} C${X(60)} ${Y(420)} ${X(64)} ${Y(396)} ${X(70)} ${Y(372)}
           C${X(74)} ${Y(380)} ${X(78)} ${Y(400)} ${X(88)} ${Y(420)}
           C${X(104)} ${Y(452)} ${X(134)} ${Y(482)} ${X(160)} ${Y(490)}
           C${X(176)} ${Y(494)} ${X(184)} ${Y(482)} ${X(172)} ${Y(470)}
           C${X(150)} ${Y(448)} ${X(124)} ${Y(412)} ${X(118)} ${Y(372)}
           C${X(110)} ${Y(320)} ${X(114)} ${Y(266)} ${X(104)} ${Y(240)}
           C${X(92)} ${Y(214)} ${X(60)} ${Y(206)} ${X(17)} ${Y(203)} Z"/>
  <path d="M${X(-62)} ${Y(430)} C${X(-150)} ${Y(440)} ${X(-232)} ${Y(470)} ${X(-262)} ${Y(512)}
           C${X(-282)} ${Y(540)} ${X(-262)} ${Y(600)} ${X(-200)} ${Y(610)}
           L${X(200)} ${Y(610)} C${X(262)} ${Y(600)} ${X(282)} ${Y(540)} ${X(262)} ${Y(512)}
           C${X(232)} ${Y(470)} ${X(150)} ${Y(440)} ${X(62)} ${Y(430)} Z"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="bg" cx="${cx}" cy="${cy}" r="${W * 0.62}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#2f7dff"/><stop offset=".18" stop-color="#1546c9"/>
    <stop offset=".5" stop-color="#0a1f7a"/><stop offset="1" stop-color="#030622"/>
  </radialGradient>
  <radialGradient id="ray" cx="${cx}" cy="${cy}" r="${W * 0.55}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#e8f6ff"/><stop offset=".35" stop-color="#7cc4ff" stop-opacity=".7"/><stop offset="1" stop-color="#2a5dff" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="heart" cx="${cx}" cy="${cy}" r="${H * 0.34}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".12" stop-color="#e6f7ff" stop-opacity=".95"/>
    <stop offset=".4" stop-color="#6fd0ff" stop-opacity=".45"/><stop offset="1" stop-color="#2f7dff" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040820"/><stop offset="1" stop-color="#02040f"/></linearGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(3 * W / 1800).toFixed(1)}"/></filter>
  <filter id="rim" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(7 * W / 1800).toFixed(1)}"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<g filter="url(#soft)" style="mix-blend-mode:screen">${rays}</g>
<g>${dust}</g>
<g fill="#9fdcff" opacity=".55" filter="url(#rim)">${body}</g>
<g fill="url(#skin)">${body}</g>
<circle cx="${cx}" cy="${cy}" r="${H * 0.34}" fill="url(#heart)" style="mix-blend-mode:screen"/>
</svg>`;
await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
console.log('ok', out);
