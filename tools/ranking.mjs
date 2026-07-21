// ============================================================
// ranking.mjs — ¿QUIÉNES son los animales que siempre ganan, y por qué?
//
// Método: cada especie juega N combates con 2 compañeros AL AZAR contra 3
// rivales al azar. Así se aísla el aporte del animal: los compañeros y los
// rivales se promedian, lo único constante es él.
//
// (Un trío de 3 clones del mismo animal exagera: amplifica su debilidad si
// depende de un solo bioma, y su fuerza si se potencia consigo mismo.)
//
//   node tools/ranking.mjs [combates por animal]
// ============================================================
import * as A from '../src/arena.js';
import { SP } from '../src/fauna_roster.js';
import { habsDe } from '../src/habilidades.js';

const N = Number(process.argv[2] || 600);
const keys = Object.keys(SP).filter(k => !SP[k].folk);
let s = 7;
const rng = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
const alAzar = () => keys[Math.floor(rng() * keys.length)];

// qué hace fuerte a un kit, en números
function perfil(key) {
  const habs = habsDe(key).habs;
  let dmg = 0, cura = 0, control = 0, defensa = 0, costo = 0, area = 0, perfora = 0, gratis = 0;
  for (const h of habs) {
    const c = (h.costo || []).length;
    costo += c;
    if (c <= 1) gratis++;
    for (const f of (h.efectos || [])) {
      if (f.t === 'dano') { dmg += f.v * (f.obj === 'todos' ? 3 : 1); if (f.obj === 'todos') area++; }
      if (f.t === 'danoTurnos') dmg += f.v * (f.turnos || 1);
      if (f.t === 'curar' || f.t === 'curarTurnos') cura += f.v;
      if (['aturdir', 'exponer'].includes(f.t)) control++;
      if (['defensa', 'reducir', 'invulnerable', 'contraataque'].includes(f.t)) defensa++;
      if (f.ignoraDefensa || f.ignoraInvulnerable || f.toxina) perfora++;
    }
  }
  return { dmg, cura, control, defensa, costo, area, perfora, gratis, habs };
}

const filas = [];
for (const key of keys) {
  let w = 0;
  for (let i = 0; i < N; i++) {
    const mio = [{ key }, { key: alAzar() }, { key: alAzar() }];
    const suyo = [{ key: alAzar() }, { key: alAzar() }, { key: alAzar() }];
    const st = A.combateAuto(mio, suyo);
    if (st.fin === 'A') w++;
  }
  filas.push({ key, n: SP[key].n, wr: w / N * 100, ...perfil(key) });
}
filas.sort((a, b) => b.wr - a.wr);

const linea = (f, i) => {
  const etq = [];
  if (f.area) etq.push('ÁREA');
  if (f.perfora) etq.push('perfora');
  if (f.control >= 2) etq.push('control');
  if (f.cura >= 25) etq.push('cura');
  if (f.gratis >= 2) etq.push(`${f.gratis} baratas`);
  return `  ${String(i + 1).padStart(2)}. ${f.wr.toFixed(1)}%  ${f.n.padEnd(26).slice(0, 26)}`
       + ` dmg:${String(f.dmg).padStart(4)} costo:${String(f.costo).padStart(2)}  ${etq.join(' · ')}`;
};

console.log(`\n🏆 LOS QUE SIEMPRE GANAN — ${N} combates por especie, compañeros y rivales al azar\n`);
filas.slice(0, 12).forEach((f, i) => console.log(linea(f, i)));
console.log(`\n💀 LOS QUE SIEMPRE PIERDEN\n`);
filas.slice(-12).forEach((f, i) => console.log(linea(f, filas.length - 12 + i)));

const media = filas.reduce((s2, f) => s2 + f.wr, 0) / filas.length;
const top = filas.slice(0, 12), bot = filas.slice(-12);
const prom = (a, campo) => a.reduce((s2, f) => s2 + f[campo], 0) / a.length;
console.log(`\n=== QUÉ TIENEN LOS DE ARRIBA QUE NO TIENEN LOS DE ABAJO ===`);
console.log(`                   TOP-12   FONDO-12`);
for (const [etq, campo] of [['daño total  ', 'dmg'], ['costo total ', 'costo'],
                            ['habs baratas', 'gratis'], ['control     ', 'control'],
                            ['perforantes ', 'perfora'], ['de área     ', 'area']]) {
  console.log(`  ${etq}  ${prom(top, campo).toFixed(1).padStart(6)}   ${prom(bot, campo).toFixed(1).padStart(6)}`);
}
console.log(`\n  daño por energía:  ${(prom(top, 'dmg') / prom(top, 'costo')).toFixed(1)}   vs   ${(prom(bot, 'dmg') / prom(bot, 'costo')).toFixed(1)}`);
console.log(`\n  media del roster: ${media.toFixed(1)}%  ·  brecha: ${(filas[0].wr - filas.at(-1).wr).toFixed(1)} puntos`);
