// ¿Por qué 'rage' rinde 5% y 'heal' 82%? Hipótesis: los básicos GRATIS.
import * as A from '../src/arena.js';
import { habsDe } from '../src/habilidades.js';

console.log('\n=== COSTO DEL BÁSICO (Nv1) POR ROL ===');
const ejemplos = { rage: 'jaguar_x', first: 'manigordo', heal: 'pizote', shield: 'armadillo',
                   poison: 'ranadardo', thorns: 'anolis' };
for (const [rol, key] of Object.entries(ejemplos)) {
  const k = habsDe(key);
  if (!k.habs.length) continue;
  const b = k.habs[0];
  console.log(`  ${rol.padEnd(7)} ${b.n.padEnd(22)} costo=[${(b.costo || []).join(',') || 'GRATIS'}] daño/efecto: ${b.desc.slice(0, 40)}`);
}

console.log('\n=== ¿CUÁNTAS VECES SE QUEDAN SIN JUGAR? ===');
// mide turnos en los que un equipo NO pudo encolar 3 habilidades
function idle(equipo, N = 200) {
  let turnosTotales = 0, accionesTotales = 0;
  for (let g = 0; g < N; g++) {
    const st = A.mkCombate(equipo, [{ key: 'iguana' }, { key: 'tucan' }, { key: 'boa' }], { abre: 'A' });
    let guard = 0;
    while (!st.fin && guard++ < 60) {
      if (st.lado === 'A') {
        const cola = A.colaAuto(st, 'A');
        const vivos = A.vivos(st, 'A').length;
        turnosTotales += vivos; accionesTotales += cola.length;
        A.ejecutarTurno(st, cola);
      } else A.ejecutarTurno(st, A.colaAuto(st, 'B'));
    }
  }
  return (accionesTotales / turnosTotales * 100).toFixed(1);
}
const trio = (k) => [{ key: k }, { key: k }, { key: k }];
for (const [rol, key] of Object.entries({ rage: 'caracara', first: 'geco', heal: 'pizote',
                                          shield: 'armadillo', thorns: 'anolis' })) {
  console.log(`  ${rol.padEnd(7)} trío de ${key.padEnd(10)} → actúa el ${idle(trio(key))}% de las veces que podría`);
}

console.log('\n=== MISMO ANIMAL, BÁSICO GRATIS vs CON COSTO (prueba directa) ===');
// tomamos un 'rage' y le hacemos el básico gratis a mano, para aislar la causa
import { MOVESETS_GEN } from '../src/movesets_gen.js';
const key = 'caracara';
const original = JSON.parse(JSON.stringify(MOVESETS_GEN[key].habs[0].costo));
const medir = () => {
  let w = 0; const N = 150;
  for (let i = 0; i < N; i++) {
    const s = A.combateAuto(trio(key), [{ key: 'iguana' }, { key: 'tucan' }, { key: 'boa' }]);
    if (s.fin === 'A') w++;
  }
  return (w / N * 100).toFixed(1);
};
console.log(`  con costo [${original.join(',')}]: ${medir()}%`);
MOVESETS_GEN[key].habs[0].costo = [];
console.log(`  con básico GRATIS:      ${medir()}%`);
MOVESETS_GEN[key].habs[0].costo = original;
