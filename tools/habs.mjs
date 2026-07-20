// Balance de HABILIDADES: mismo cuerpo, solo cambia el efecto. Todos contra todos.
const E = await import('../src/engine.js');
const ABS = ['—','poison','shield','heal','first','rage','thorns'];
const N = 1200;

// combatiente neutro: stats idénticos, solo cambia la habilidad
const luchador = (ab, uid) => ({ uid, n:ab, atk:10, hp:30, spd:5, hab:2, def:3, level:8,
                                 ab: ab==='—'?null:ab, abs:undefined });

console.log('=== 1 vs 1 · mismo cuerpo (⚔10 ❤30 💨5 🛡3), solo cambia la habilidad ===');
console.log('(% de victoria de la FILA contra la COLUMNA)\n');
const head = '            ' + ABS.map(a=>a.slice(0,7).padStart(8)).join('');
console.log(head);
const totales = {};
for(const a of ABS){
  let fila = a.padEnd(12);
  let suma=0, cuenta=0;
  for(const b of ABS){
    let w=0;
    for(let i=0;i<N;i++){
      const A=luchador(a,1), B=luchador(b,2);
      if(E.fight([A],[B]).result==='W') w++;
    }
    const p = w/N*100;
    if(a!==b){ suma+=p; cuenta++; }
    fila += (p.toFixed(0)+'%').padStart(8);
  }
  totales[a]=suma/cuenta;
  console.log(fila);
}
console.log('\n=== Promedio de victoria de cada habilidad (contra todas las demás) ===');
Object.entries(totales).sort((x,y)=>y[1]-x[1]).forEach(([k,v])=>
  console.log('  '+k.padEnd(9)+ v.toFixed(1)+'%'));

// ---- efecto de las estadísticas ----
console.log('\n=== Cuánto vale cada punto de estadística (1v1, base ⚔10 ❤30 💨5 🛡3) ===');
const base = ()=>({uid:1,atk:10,hp:30,spd:5,hab:2,def:3,level:8,ab:null});
const prueba = (mod, etiqueta)=>{
  let w=0;
  for(let i=0;i<N;i++){
    const A=Object.assign(base(),{uid:1},mod), B=Object.assign(base(),{uid:2});
    if(E.fight([A],[B]).result==='W') w++;
  }
  console.log('  '+etiqueta.padEnd(14)+(w/N*100).toFixed(1)+'%');
};
prueba({}, 'sin cambios');
prueba({atk:12}, '+2 ataque');
prueba({hp:36}, '+6 vida');
prueba({def:5}, '+2 defensa');
prueba({spd:9}, '+4 velocidad');
prueba({hab:6}, '+4 habilidad');
prueba({level:10,atk:12,hp:34}, '+2 niveles');

// ---- ¿escala bien la dificultad? ----
console.log('\n=== ¿El enemigo escala parejo? equipo de 5 vs jefe de cada provincia ===');
const {COUNTRIES} = E;
for(let d=0; d<7; d++){
  const c = COUNTRIES[d % COUNTRIES.length];
  let w=0; const M=300;
  for(let i=0;i<M;i++){
    // equipo "razonable": 5 animales al nivel esperado según la curva del juego
    const nivel = 3 + d*2;
    const team = [0,1,2,3,4].map(()=>{ const a=E.mkAnimal(E.pick(c.pool)); E.setLevel(a,nivel); a.uid=Math.random(); return a; });
    const jefe = E.genEnemy(c, E.bossSize(d), E.enemyLevel(d,true), 0.4);
    if(E.fight(team,jefe).result==='W') w++;
  }
  console.log(`  provincia ${d+1}: equipo Nv${3+d*2} gana ${(w/M*100).toFixed(0)}% al cabecilla (Nv${E.enemyLevel(d,true)}, ${E.bossSize(d)} rivales)`);
}
