// Merkaba v10 — d'après le retour de Christine :
// fleur de vie (gardée) + MERKABA 3D ajoutée (statique) + CHAMP orbital agrandi autour de l'homme
const fs = require('fs');
const OUT = process.argv[2] || 'c:/Users/Morgan/MyApps/website-christinecal/v3-src/public/images/geometrie/merkaba-activation.svg';
const cx = 300, cyC = 300;
const f = (n) => Number(n.toFixed(2));
const FC = [300, 286];   // centre figure / champ / merkaba

// ---------- silhouette HUMAIN assis en lotus ----------
const BODY = '#0b0826';
function bodyParts(){
  const legs = `<path d='M204,358 C210,334 250,322 300,326 C350,322 390,334 396,358 C398,382 360,394 300,394 C240,394 202,382 204,358 Z' fill='${BODY}'/>`;
  const armR = `<path d='M334,214 C362,238 380,294 384,344' fill='none' stroke='${BODY}' stroke-width='19' stroke-linecap='round'/>`;
  const armL = `<path d='M266,214 C238,238 220,294 216,344' fill='none' stroke='${BODY}' stroke-width='19' stroke-linecap='round'/>`;
  const hands = `<circle cx='384' cy='346' r='12' fill='${BODY}'/><circle cx='216' cy='346' r='12' fill='${BODY}'/>`;
  const torso = `<path d='M258,212 C252,250 268,304 282,338 L318,338 C332,304 348,250 342,212 C330,196 270,196 258,212 Z' fill='${BODY}'/>`;
  const neck = `<path d='M288,196 L312,196 L314,214 L286,214 Z' fill='${BODY}'/>`;
  const head = `<ellipse cx='300' cy='168' rx='22.5' ry='25.5' fill='${BODY}'/>`;
  return legs + armR + armL + hands + torso + neck + head;
}

// ---------- MERKABA 3D (2 tétraèdres / hexagramme + hexagone interne) ----------
function merkaba(){
  const C=FC, R=168, rin=R/Math.sqrt(3);
  const P=(deg,r)=>[f(C[0]+r*Math.cos(deg*Math.PI/180)), f(C[1]+r*Math.sin(deg*Math.PI/180))];
  const up=[P(-90,R),P(30,R),P(150,R)];
  const dn=[P(90,R),P(210,R),P(330,R)];
  const tri=(p,stroke,w,op)=>`<path d='M${p[0]} L${p[1]} L${p[2]} Z' fill='none' stroke='${stroke}' stroke-width='${w}' stroke-opacity='${op}' stroke-linejoin='round'/>`;
  // hexagone interne (donne le relief 3D)
  let hex='M'; for(let k=0;k<6;k++){const v=P(k*60,rin); hex+=`${v[0]},${v[1]} ${k<5?'L':''}`;} hex+='Z';
  const inner=`<path d='${hex}' fill='none' stroke='#d8c483' stroke-width='1' stroke-opacity='.5'/>`;
  // axe vertical + reliage sommets pour le volume
  const axis=`<line x1='${P(-90,R)[0]}' y1='${P(-90,R)[1]}' x2='${P(90,R)[0]}' y2='${P(90,R)[1]}' stroke='#d8c483' stroke-width='.7' stroke-opacity='.35'/>`;
  // sommets lumineux
  let dots=''; for(const a of [-90,30,150,90,210,330]){const v=P(a,R); dots+=`<circle cx='${v[0]}' cy='${v[1]}' r='3' fill='#fff4d2'/>`;}
  return tri(up,'#f0e0a8',1.7,.95)+tri(dn,'#d8c07a',1.7,.85)+inner+axis+dots;
}

// ---------- CHAMP orbital (grand, autour de l'homme) ----------
function fieldRings(){
  const rx=172, ry=66;
  const r=(rot,dur,delay)=>`<g class='orb' style='animation-duration:${dur}s;animation-delay:${delay}s'><ellipse cx='${FC[0]}' cy='${FC[1]}' rx='${rx}' ry='${ry}' fill='none' stroke='#e6d49a' stroke-width='1' stroke-opacity='.42' transform='rotate(${rot} ${FC[0]} ${FC[1]})'/></g>`;
  return r(0,26,0)+r(60,32,-4)+r(120,38,-8);
}
function fieldElectrons(){
  const rx=172, ry=66;
  const e=(rot,dur,delay)=>`<g class='orb' style='animation-duration:${dur}s;animation-delay:${delay}s'><circle cx='${FC[0]+rx}' cy='${FC[1]}' r='3.2' fill='#fff4d2' transform='rotate(${rot} ${FC[0]} ${FC[1]})'/></g>`;
  return e(0,26,0)+e(60,32,-4)+e(120,38,-8);
}

// ---------- fleur de vie (gardée — Christine adore) ----------
function flowerOfLife(r){
  const pts=[[0,0]];
  for(let k=0;k<6;k++){const a=k*60*Math.PI/180;pts.push([r*Math.cos(a),r*Math.sin(a)]);}
  for(let k=0;k<6;k++){const a=(30+k*60)*Math.PI/180;pts.push([r*Math.sqrt(3)*Math.cos(a),r*Math.sqrt(3)*Math.sin(a)]);}
  for(let k=0;k<6;k++){const a=k*60*Math.PI/180;pts.push([2*r*Math.cos(a),2*r*Math.sin(a)]);}
  return pts.map(([dx,dy])=>`<circle cx='${f(cx+dx)}' cy='${f(cyC+dy)}' r='${r}'/>`).join('');
}

// ---------- chakras ----------
// y alignés sur l'anatomie (précision de Christine) : coccyx, bas-ventre, nombril, cœur, gorge, front, sommet
const chakras=[[378,'#e0455a'],[342,'#ee8a3c'],[308,'#f0cb52'],[262,'#5ccb8c'],[206,'#48a6df'],[160,'#5b5fcf'],[147,'#a473d0']];
function chakraDefs(){return chakras.map((c,i)=>`<radialGradient id='ck${i}' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='${c[1]}' stop-opacity='1'/><stop offset='100%' stop-color='${c[1]}' stop-opacity='0'/></radialGradient>`).join('');}
function chakraEls(){return chakras.map((c,i)=>`<g class='chk' style='animation-delay:${(i*0.3).toFixed(2)}s'><circle cx='300' cy='${c[0]}' r='12' fill='url(#ck${i})'/><circle cx='300' cy='${c[0]}' r='3.4' fill='${c[1]}'/><circle cx='300' cy='${c[0]}' r='1.4' fill='#fff8e6'/></g>`).join('');}

// ---------- étoiles ----------
const stars=[[60,80],[120,50],[200,90],[300,40],[400,70],[480,55],[540,110],[70,200],[520,200],[40,330],[560,320],[90,470],[200,520],[330,540],[470,500],[540,450],[150,140],[450,140],[260,30],[360,60],[510,380],[80,400],[520,540],[30,250],[570,250]];
function starEls(){return stars.map((s,i)=>{const r=(i%4===0?1.6:1.0);return `<circle cx='${s[0]}' cy='${s[1]}' r='${r}' fill='#cfe0ff' class='star' style='animation-delay:${(i%5*0.5).toFixed(1)}s'/>`;}).join('');}

const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600' role='img' aria-label='Etre en meditation dans son champ vibratoire : merkaba, fleur de vie et chakras'>
<defs>
  <radialGradient id='mkBg' cx='50%' cy='48%' r='62%'><stop offset='0%' stop-color='#1a1547'/><stop offset='55%' stop-color='#0c0a26'/><stop offset='100%' stop-color='#050418'/></radialGradient>
  <radialGradient id='mkHeart' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='#fffaf0' stop-opacity='1'/><stop offset='35%' stop-color='#ffe9a8' stop-opacity='.85'/><stop offset='100%' stop-color='#e6c878' stop-opacity='0'/></radialGradient>
  <radialGradient id='mkCore' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='#fff3cf' stop-opacity='.7'/><stop offset='100%' stop-color='#e6d49a' stop-opacity='0'/></radialGradient>
  <radialGradient id='mkCrownG' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='#fff3cf' stop-opacity='.8'/><stop offset='100%' stop-color='#e6d49a' stop-opacity='0'/></radialGradient>
  <radialGradient id='mkRayFade' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='#fff' stop-opacity='.1'/><stop offset='32%' stop-color='#fff' stop-opacity='.7'/><stop offset='75%' stop-color='#fff' stop-opacity='.2'/><stop offset='100%' stop-color='#fff' stop-opacity='0'/></radialGradient>
  <mask id='mkRayMask'><rect width='600' height='600' fill='url(#mkRayFade)'/></mask>
  ${chakraDefs()}
  <filter id='mkGlow' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='2' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>
  <filter id='mkSoft' x='-90%' y='-90%' width='280%' height='280%'><feGaussianBlur stdDeviation='9'/></filter>
  <style>
    .orb{transform-origin:${FC[0]}px ${FC[1]}px;animation:spin linear infinite}
    .mk{transform-origin:${FC[0]}px ${FC[1]}px;animation:mkbreathe 6s ease-in-out infinite}
    .core{transform-origin:300px ${FC[1]}px;animation:breathe 6s ease-in-out infinite}
    .fol{transform-origin:300px 300px;animation:breathe 9s ease-in-out infinite}
    .chk{animation:pulse 3s ease-in-out infinite}
    .heart{transform-origin:300px 262px;animation:heartbeat 4s ease-in-out infinite}
    .crown{transform-origin:300px 150px;animation:breathe 4.5s ease-in-out infinite}
    .star{animation:twk 3.4s ease-in-out infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes mkbreathe{0%,100%{opacity:.78;transform:scale(.99)}50%{opacity:1;transform:scale(1.012)}}
    @keyframes breathe{0%,100%{transform:scale(.95);opacity:.45}50%{transform:scale(1.05);opacity:.85}}
    @keyframes heartbeat{0%,100%{transform:scale(.92);opacity:.8}50%{transform:scale(1.08);opacity:1}}
    @keyframes pulse{0%,100%{opacity:.45}50%{opacity:1}}
    @keyframes twk{0%,100%{opacity:.25}50%{opacity:.95}}
    @media (prefers-reduced-motion: reduce){.orb,.mk,.core,.fol,.chk,.heart,.crown,.star{animation:none}.core,.fol,.crown{opacity:.7}.mk{opacity:.92}.chk,.heart,.star{opacity:.95}}
  </style>
</defs>
<rect width='600' height='600' fill='url(#mkBg)'/>
<g class='star'>${starEls()}</g>
<g class='fol' fill='none' stroke='#c9a961' stroke-width='.8' stroke-opacity='.16'>${flowerOfLife(64)}</g>
<g class='burst' mask='url(#mkRayMask)' stroke='#ffe9a8' stroke-opacity='.4' stroke-width='.6'>${(function(){let s='';for(let k=0;k<72;k++){const a=k/72*2*Math.PI;s+=`<line x1='${f(cx+30*Math.cos(a))}' y1='${f(FC[1]+30*Math.sin(a))}' x2='${f(cx+300*Math.cos(a))}' y2='${f(FC[1]+300*Math.sin(a))}'/>`;}return s;})()}</g>
<ellipse class='core' cx='300' cy='${FC[1]}' rx='150' ry='150' fill='url(#mkCore)' filter='url(#mkSoft)'/>
<g class='mk' filter='url(#mkGlow)'>${merkaba()}</g>
<g filter='url(#mkGlow)'>${fieldRings()}</g>
${bodyParts()}
<circle class='heart' cx='300' cy='262' r='36' fill='url(#mkHeart)'/>
<circle class='crown' cx='300' cy='150' r='24' fill='url(#mkCrownG)'/>
<g filter='url(#mkGlow)'>${chakraEls()}</g>
<g filter='url(#mkGlow)'>${fieldElectrons()}</g>
</svg>`;
fs.writeFileSync(OUT, svg);
console.log('écrit ' + OUT + ' (' + svg.length + ' octets)');
