// ============================================================
// doc_vs_gen.mjs — ¿los kits del DOCUMENTO están al nivel de los de plantilla?
// Enfrenta tríos de animales con kit oficial (movesets_doc.js) contra tríos
// con kit generado, y también documento-contra-documento (que es como va a
// quedar el juego cuando estén los 136).
//   node tools/doc_vs_gen.mjs [combates]
// ============================================================
import * as A from '../src/arena.js';
import { SP } from '../src/fauna_roster.js';
import { MOVESETS_DOC } from '../src/movesets_doc.js';

const N = +(process.argv[2] || 3000);
const DOC = Object.keys(MOVESETS_DOC).filter(k => SP[k] && !SP[k].folk);
const GEN = Object.keys(SP).filter(k => !SP[k].folk && !MOVESETS_DOC[k]);

let s = 7;
const rng = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
const trio = (pool) => Array.from({ length: 3 }, () => ({ key: pool[Math.floor(rng() * pool.length)] }));

function duelo(poolA, poolB, n) {
  let ganA = 0, turnos = 0, colgados = 0;
  for (let i = 0; i < n; i++) {
    const st = A.combateAuto(trio(poolA), trio(poolB));
    if (st.fin === 'A') ganA++;
    turnos += st.turno;
    if (st.turno >= 200) colgados++;
  }
  return { wr: ganA / n, turnos: turnos / n, colgados };
}

console.log(`\nKits del documento: ${DOC.length} especies · de plantilla: ${GEN.length}\n`);
const a = duelo(DOC, GEN, N);
console.log(`DOCUMENTO vs PLANTILLA   el documento gana ${(a.wr * 100).toFixed(1)}%  ` +
            `· ${a.turnos.toFixed(1)} turnos · colgados ${a.colgados}`);
const b = duelo(DOC, DOC, N);
console.log(`DOCUMENTO vs DOCUMENTO   lado A gana ${(b.wr * 100).toFixed(1)}%  ` +
            `· ${b.turnos.toFixed(1)} turnos · colgados ${b.colgados}`);
const c = duelo(GEN, GEN, N);
console.log(`PLANTILLA vs PLANTILLA   lado A gana ${(c.wr * 100).toFixed(1)}%  ` +
            `· ${c.turnos.toFixed(1)} turnos · colgados ${c.colgados}`);

// win rate individual dentro del pool del documento (todos contra todos)
console.log('\n=== dentro del documento (cada especie, trío propio vs tríos al azar) ===');
const filas = [];
for (const key of DOC) {
  let w = 0, n = 400;
  for (let i = 0; i < n; i++) {
    const st = A.combateAuto([{ key }, { key }, { key }], trio(DOC));
    if (st.fin === 'A') w++;
  }
  filas.push({ key, n: SP[key].n, wr: w / n });
}
filas.sort((x, y) => y.wr - x.wr);
const linea = f => `  ${(f.wr * 100).toFixed(0).padStart(3)}%  ${f.n}`;
filas.slice(0, 8).forEach(f => console.log(linea(f)));
console.log('   ...');
filas.slice(-8).forEach(f => console.log(linea(f)));
const wrs = filas.map(f => f.wr).sort((x, y) => x - y);
console.log(`\n  mediana ${(wrs[Math.floor(wrs.length / 2)] * 100).toFixed(1)}%` +
            ` · brecha ${((wrs.at(-1) - wrs[0]) * 100).toFixed(1)} puntos`);
