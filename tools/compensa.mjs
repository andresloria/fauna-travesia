// ============================================================
// compensa.mjs — ¿cuánta energía extra necesita el que RESPONDE para que
// abrir el combate deje de ser una ventaja?
//
// Se mide en ESPEJO PERFECTO: el mismo equipo de los dos lados. Así lo único
// que cambia entre los dos jugadores es quién mueve primero — cualquier
// desvío del 50% es ventaja de turno pura, no de kits.
//
//   node tools/compensa.mjs [combates por valor]
// ============================================================
import * as A from '../src/arena.js';
import { SP } from '../src/fauna_roster.js';

const N = Number(process.argv[2] || 6000);
const keys = Object.keys(SP).filter(k => !SP[k].folk);

function medir(compensa) {
  let s = 99;                                   // misma semilla para todos los valores:
  const rng = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const trio = () => Array.from({ length: 3 }, () => ({ key: keys[Math.floor(rng() * keys.length)] }));
  let abreGana = 0, turnos = 0, caeDelQueAbre = 0, conCaida = 0;
  for (let i = 0; i < N; i++) {
    const eq = trio();
    const st = A.combateAuto(eq.map(x => ({ ...x })), eq.map(x => ({ ...x })),
                             { abre: 'A', compensa });
    if (st.fin === 'A') abreGana++;
    turnos += st.turno;
    const cae = st.log.find(e => e.t === 'cae');
    if (cae) { conCaida++; if (cae.uid[0] === 'A') caeDelQueAbre++; }
  }
  return {
    wr: abreGana / N * 100,
    turnos: turnos / N,
    primeraCaidaDelQueAbre: conCaida ? caeDelQueAbre / conCaida * 100 : 0,
  };
}

console.log(`\n⚖  VENTAJA DE ABRIR — espejo perfecto, ${N} combates por valor\n`);
console.log('  compensa │ gana el que abre │ 1ª caída es suya │ turnos');
console.log('  ─────────┼──────────────────┼──────────────────┼───────');
let mejor = null;
for (const c of [0, 1, 2, 3]) {
  const r = medir(c);
  const desvio = Math.abs(r.wr - 50);
  if (!mejor || desvio < mejor.desvio) mejor = { c, desvio, ...r };
  const marca = desvio < 2 ? '  ✅' : desvio < 4 ? '  ~' : '  ❌';
  console.log(`     +${c}     │      ${r.wr.toFixed(1)}%      │      ${r.primeraCaidaDelQueAbre.toFixed(1)}%      │ ${r.turnos.toFixed(1)}${marca}`);
}
console.log(`\n  → el más parejo es +${mejor.c} (se desvía ${mejor.desvio.toFixed(1)} puntos del 50%)`);
console.log('  (50% = justo · "1ª caída suya" también debería rondar el 50%)');
