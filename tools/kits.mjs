// Calidad de KIT aislada: cada animal a Nv8, trío del mismo animal,
// contra un equipo de referencia fijo. Sin confusión de nivel ni de uso.
import * as A from '../src/arena.js';
import { SP } from '../src/fauna_roster.js';
import { habsDe } from '../src/habilidades.js';

const REF = [{ key: 'iguana' }, { key: 'tucan' }, { key: 'boa' }];
const SOCIOS = [{ key: 'pizote' }, { key: 'garza' }];   // bosque + agua, fijos
const N = 120;
const filas = [];
for (const key of Object.keys(SP)) {
  if (SP[key].folk) continue;
  let w = 0;
  for (let i = 0; i < N; i++) {
    const s = A.combateAuto([{ key }, ...SOCIOS], REF);
    if (s.fin === 'A') w++;
  }
  const kit = habsDe(key);
  const gratis = kit.habs.filter(h => !(h.costo || []).length).length;
  filas.push({ key, n: SP[key].n, wr: w / N, rol: SP[key].ab, bio: SP[key].bio,
               nHabs: kit.habs.length, gratis });
}
filas.sort((a, b) => b.wr - a.wr);
const p = (f) => `  ${(f.wr * 100).toFixed(0).padStart(3)}%  ${f.n.padEnd(26).slice(0, 26)} ${f.rol.padEnd(7)} ${f.bio.padEnd(8)} gratis:${f.gratis}`;
console.log('\n=== KITS (el animal + 2 socios fijos, contra equipo de referencia) ===');
console.log('\n🏆 TOP 12');   filas.slice(0, 12).forEach(f => console.log(p(f)));
console.log('\n💀 BOTTOM 12'); filas.slice(-12).forEach(f => console.log(p(f)));

// por rol
const porRol = {};
for (const f of filas) (porRol[f.rol] = porRol[f.rol] || []).push(f.wr);
console.log('\n=== POR ROL ===');
for (const [r, v] of Object.entries(porRol).sort((a, b) =>
  b[1].reduce((s, x) => s + x, 0) / b[1].length - a[1].reduce((s, x) => s + x, 0) / a[1].length))
  console.log(`  ${r.padEnd(8)} ${(v.reduce((s, x) => s + x, 0) / v.length * 100).toFixed(1)}%  (${v.length} animales)`);

const wrs = filas.map(f => f.wr);
console.log(`\n  brecha de KIT: ${((Math.max(...wrs) - Math.min(...wrs)) * 100).toFixed(1)} puntos`);
console.log(`  mediana: ${(wrs.sort((a, b) => a - b)[Math.floor(wrs.length / 2)] * 100).toFixed(1)}%`);
