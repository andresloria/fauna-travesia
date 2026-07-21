// ============================================================
// que_gana.mjs — ¿QUÉ rasgo de un kit predice de verdad ganar?
//
// Antes de seguir subiendo números a ojo hay que saber qué mover. Esto mide
// la CORRELACIÓN entre el % de victorias real de cada especie y cada rasgo de
// su kit. Un rasgo con correlación alta es una palanca; uno con correlación
// baja es decoración, y subirlo no cambia nada.
//
//   node tools/que_gana.mjs [combates por especie]
// ============================================================
import * as A from '../src/arena.js';
import { SP } from '../src/fauna_roster.js';
import { habsDe } from '../src/habilidades.js';

const N = Number(process.argv[2] || 300);
const keys = Object.keys(SP).filter(k => !SP[k].folk);
let s = 3;
const rng = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
const az = () => keys[Math.floor(rng() * keys.length)];

const rasgos = (key) => {
  const habs = habsDe(key).habs;
  let dano = 0, area = 0, perfora = 0, control = 0, cura = 0, defensa = 0,
      costo = 0, baratas = 0, recargaMedia = 0, dot = 0;
  for (const h of habs) {
    const c = (h.costo || []).length;
    costo += c;
    if (c <= 1) baratas++;
    recargaMedia += h.recarga || 0;
    for (const f of (h.efectos || [])) {
      if (f.t === 'dano') { dano += f.v * (f.obj === 'todos' ? 3 : 1); if (f.obj === 'todos') area++; }
      if (f.t === 'danoTurnos') { dano += f.v * (f.turnos || 1); dot++; }
      if (f.t === 'curar' || f.t === 'curarTurnos') cura += f.v;
      if (['defensa', 'reducir', 'invulnerable', 'contraataque'].includes(f.t)) defensa++;
      if (['aturdir', 'exponer'].includes(f.t)) control++;
      if (f.ignoraDefensa || f.ignoraInvulnerable || f.toxina) perfora++;
    }
  }
  recargaMedia /= habs.length || 1;
  return { dano, danoPorEnergia: dano / (costo || 1), area, perfora, control,
           cura, defensa, costo, baratas, recargaMedia, dot };
};

const filas = [];
for (const key of keys) {
  let w = 0;
  for (let i = 0; i < N; i++) {
    const st = A.combateAuto([{ key }, { key: az() }, { key: az() }],
                             [{ key: az() }, { key: az() }, { key: az() }]);
    if (st.fin === 'A') w++;
  }
  filas.push({ key, wr: w / N * 100, ...rasgos(key) });
}

// correlación de Pearson entre un rasgo y el % de victorias
function corr(campo) {
  const x = filas.map(f => f[campo]), y = filas.map(f => f.wr);
  const mx = x.reduce((a, b) => a + b, 0) / x.length;
  const my = y.reduce((a, b) => a + b, 0) / y.length;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < x.length; i++) {
    num += (x[i] - mx) * (y[i] - my);
    dx += (x[i] - mx) ** 2; dy += (y[i] - my) ** 2;
  }
  return num / (Math.sqrt(dx * dy) || 1);
}

const campos = ['danoPorEnergia', 'dano', 'perfora', 'area', 'baratas', 'costo',
                'control', 'cura', 'defensa', 'recargaMedia', 'dot'];
const res = campos.map(c => ({ c, r: corr(c) })).sort((a, b) => Math.abs(b.r) - Math.abs(a.r));

console.log(`\n📈 QUÉ PREDICE GANAR — ${keys.length} especies × ${N} combates\n`);
console.log('  rasgo              correlación   lectura');
console.log('  ─────────────────────────────────────────────────────');
for (const { c, r } of res) {
  const fuerza = Math.abs(r) > 0.6 ? 'PALANCA FUERTE' : Math.abs(r) > 0.35 ? 'influye'
               : Math.abs(r) > 0.15 ? 'poco' : 'no mueve la aguja';
  const signo = r > 0 ? '+' : '−';
  console.log(`  ${c.padEnd(18)} ${signo}${Math.abs(r).toFixed(2)}        ${fuerza}`);
}
console.log('\n  (+ = tenerlo hace GANAR · − = tenerlo hace PERDER)');
console.log('  correlación 1.00 = predice perfecto · 0.00 = da igual\n');
