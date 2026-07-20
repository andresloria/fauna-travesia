// ============================================================
// sim.mjs — juega el juego COMPLETO muchas veces usando el motor real
// (engine.js) y replicando las reglas de game.js: recompensas, derrotas,
// debilitados, refugios, jefes y el final de Monteverde.
// Uso:  node sim.mjs [runs por perfil]
// ============================================================
const E = await import('../src/engine.js');
const D = await import('../src/data.js');
const { RULES, RARE_ITEMS, ITEMS, SECRET } = D;

const RUNS = parseInt(process.argv[2] || '1000', 10);
const rnd = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rnd(a.length)];

// ---------- estadísticas ----------
const mk = () => ({
  runs:0, wins:0, nightWins:0, muertes:{}, provAlMorir:[], provLimpias:[],
  encuentros:{}, derrotas:{}, rescatados:{}, rarezas:{}, liberados:[],
  rondas:[], nivelFinal:[], equipoAlMorir:[], errores:[], sinPeleadores:0,
  habEnEquipo:{}, habGanadoras:{}, turnosLargos:0, itemsUsados:0,
});
const bump = (o,k,n=1)=>{o[k]=(o[k]||0)+n;};

// ---------- un animal jugable ----------
function nuevoStarter(){ const a=E.mkAnimal(pick(['perro','gato','comemaiz'])); E.setLevel(a,RULES.STARTER_LEVEL); return a; }
const poder = (a)=> a.atk*2 + a.hp + (a.def||0)*2 + (a.spd||0);

// ---------- POLÍTICAS de juego (cómo decide el jugador) ----------
const POLIT = {
  // elige al azar: el que juega sin pensar
  novato: {
    nodo:(op)=>pick(op),
    wild:(w,team)=>rnd(w.length),
    cambiar:(team)=>rnd(team.length),
    trade:()=>Math.random()<0.5,
  },
  // criterio sensato: descansa si hay heridos, rescata, evita cazadores si viene flojo
  normal: {
    nodo:(op,st)=>{
      const heridos = st.team.some(a=>a.down);
      const orden = heridos ? ['descanso','bioma','tesoro','salvaje','sorpresa','intercambio','combate','cazador']
                            : (st.team.length<RULES.MAX_TEAM ? ['bioma','tesoro','descanso','salvaje','sorpresa','intercambio','combate','cazador']
                                                            : ['tesoro','bioma','combate','salvaje','descanso','sorpresa','intercambio','cazador']);
      for(const t of orden){ const c=op.filter(n=>n.type===t); if(c.length) return pick(c); }
      return pick(op);
    },
    wild:(w)=>{ let b=0; w.forEach((a,i)=>{ if(poder(a)>poder(w[b])) b=i; }); return b; },
    cambiar:(team)=>{ let w=0; team.forEach((a,i)=>{ if(poder(a)<poder(team[w])) w=i; }); return w; },
    trade:(of,team)=>{ const peor=team.reduce((m,a)=>poder(a)<poder(m)?a:m,team[0]); return poder(of)>poder(peor); },
  },
};
POLIT.experto = { ...POLIT.normal,
  // el experto además prioriza cazadores cuando va fuerte (doble subida + objeto raro)
  nodo:(op,st)=>{
    const heridos = st.team.some(a=>a.down);
    if(heridos){ const d=op.filter(n=>n.type==='descanso'); if(d.length) return d[0]; }
    const fuerte = st.team.length>=4 && st.team.reduce((s,a)=>s+a.level,0)/st.team.length >= 5+st.cleared*1.5;
    const orden = fuerte ? ['cazador','combate','bioma','tesoro','salvaje','sorpresa','intercambio','descanso']
                         : ['bioma','tesoro','descanso','salvaje','sorpresa','intercambio','combate','cazador'];
    for(const t of orden){ const c=op.filter(n=>n.type===t); if(c.length) return pick(c); }
    return pick(op);
  },
};

// ---------- una partida ----------
function jugar(P, S){
  const st = { team:[nuevoStarter()], hearts:RULES.MAX_HEARTS, cleared:0, bag:[], released:0,
               countryBag:[], lastIdx:null, muerte:null };
  st.team.forEach(a=>bump(S.rescatados, a.key));
  const fighters = ()=> st.team.filter(a=>!a.down);
  const maxLv = ()=> Math.max(1, ...st.team.map(a=>a.level));
  const avgLv = ()=> Math.round(st.team.reduce((m,a)=>m+a.level,0)/Math.max(1,st.team.length));

  // devuelve true si sobrevive
  function pelea(enemy, kind){
    bump(S.encuentros, kind);
    const f = fighters();
    if(!f.length && st.team.length){ // el mas entero se levanta (regla nueva)
      const a=st.team.reduce((m,x)=>x.hp>m.hp?x:m,st.team[0]); a.down=false; S.sinPeleadores++; }
    const f2=fighters();
    if(!f2.length){ st.muerte='equipo agotado ('+kind+')'; return false; }
    const r = E.fight(fighters(), enemy);
    S.rondas.push(r.steps.length);
    if(r.steps.length > 260) S.turnosLargos++;
    // los caídos quedan debilitados (modo normal)
    (r.fallenAUids||[]).forEach(uid=>{ const a=st.team.find(x=>x.uid===uid); if(a) a.down=true; });
    if(r.result!=='W'){ bump(S.derrotas, kind); st.hearts--;
      if(kind==='cazador' && st.team.length>1) st.team.splice(rnd(st.team.length),1);
      if(st.hearts<=0){ st.muerte=kind; return false; }
      return true;
    }
    // recompensas por victoria
    if(kind==='cazador'){ st.team.forEach(a=>{E.levelUp(a);E.levelUp(a);}); st.bag.push(pick(RARE_ITEMS)); st.released++; }
    else if(kind==='jefezona'){ const b=enemy[0]; b.items=[];
      if(st.team.length>=RULES.MAX_TEAM){ let wi=0; st.team.forEach((x,i)=>{ if(poder(x)<poder(st.team[wi])) wi=i; }); st.team[wi]=b; }
      else st.team.push(b);
      bump(S.rescatados,b.key); bump(S.rarezas,b.rarity);
    }
    else if(kind!=='jefe') st.team.forEach(a=>E.levelUp(a));
    return true;
  }

  // ---- 7 provincias + Monteverde ----
  for(let depth=0; depth<=RULES.RUN_LENGTH; depth++){
    const secreto = depth===RULES.RUN_LENGTH;
    const draw = secreto ? {country:SECRET, idx:null, bag:st.countryBag}
                         : E.drawCountry(st.countryBag, st.lastIdx);
    const country = draw.country; st.countryBag=draw.bag; st.lastIdx=draw.idx;
    const map = E.generateMap(country, st.cleared);
    let cur = map.rows[0][0];

    while(cur.children && cur.children.length){
      const n = P.nodo(cur.children, st);
      cur = n;
      const d = st.cleared;
      let vivo = true;
      switch(n.type){
        case 'bioma': {
          const w = E.genWildChoices(country, n.bio, maxLv(), 3);
          const i = P.wild(w, st.team); const a = w[i];
          bump(S.rarezas, a.rarity); bump(S.rescatados, a.key);
          const dup = st.team.find(x=>x.key===a.key);
          if(dup){ E.levelUp(dup);E.levelUp(dup);E.levelUp(dup); }
          else if(st.team.length>=RULES.MAX_TEAM){ st.team[P.cambiar(st.team)] = a; }
          else st.team.push(a);
          break; }
        case 'salvaje': {
          const f=fighters(), nf=f.length||1;
          const avg=Math.round(f.reduce((m,a)=>m+a.level,0)/nf)||1;
          vivo = pelea(E.genEnemy(country, Math.min(RULES.MAX_TEAM,nf), Math.max(1,avg-1)), 'salvaje'); break; }
        case 'combate': vivo = pelea(E.genEnemy(country,E.retSize(d),E.enemyLevel(d,false,avgLv()),0.12),'furtivo'); break;
        case 'cazador': vivo = pelea(E.genEnemy(country,E.poacherSize(d),E.enemyLevel(d,false,avgLv()),0.25),'cazador'); break;
        case 'tesoro': st.bag.push(pick(ITEMS)); break;
        case 'intercambio': {
          const of = E.genTrade(maxLv());
          if(P.trade(of, st.team)){ st.team[P.cambiar(st.team)] = of; bump(S.rescatados,of.key); }
          break; }
        case 'descanso': st.team.forEach(a=>a.down=false); break;
        case 'sorpresa': {
          const r=rnd(100), late=n.r>E.SAFE_ROWS;
          if(n.r>=2 && r<8) vivo = pelea(E.genZoneBoss(country,d),'jefezona');
          else if(r<40) st.bag.push(rnd(100)<22?pick(RARE_ITEMS):pick(ITEMS));
          else if(late && d>=3 && r<60) vivo = pelea(E.genEnemy(country,E.poacherSize(d),E.enemyLevel(d,false,avgLv()),0.25),'cazador');
          else if(late && r<74) vivo = pelea(E.genEnemy(country,E.retSize(d),E.enemyLevel(d,false,avgLv()),0.12),'furtivo');
          else { const f=fighters(),nf=f.length||1;
                 const avg=Math.round(f.reduce((m,a)=>m+a.level,0)/nf)||1;
                 vivo = pelea(E.genEnemy(country,Math.min(RULES.MAX_TEAM,nf),Math.max(1,avg)),'salvaje'); }
          break; }
        case 'airport': {
          vivo = pelea(E.genEnemy(country,E.bossSize(d),E.enemyLevel(d,true,avgLv()),0.4),'jefe');
          if(vivo){
            if(secreto){ S.wins++; st.muerte=null; S.provLimpias.push(st.cleared);
                         S.nivelFinal.push(Math.round(st.team.reduce((m,a)=>m+a.level,0)/st.team.length));
                         S.liberados.push(st.released); return 'GANO'; }
            st.cleared++; st.team.forEach(a=>E.levelUp(a));
            st.hearts=Math.min(RULES.MAX_HEARTS, st.hearts+1);
            st.team.forEach(a=>a.down=false); st.released+=2;
          }
          break; }
      }
      if(!vivo){ bump(S.muertes, st.muerte||n.type); S.provAlMorir.push(st.cleared);
                 S.equipoAlMorir.push(st.team.length);
                 S.nivelFinal.push(Math.round(st.team.reduce((m,a)=>m+a.level,0)/Math.max(1,st.team.length)));
                 S.liberados.push(st.released);
                 return 'MURIO'; }
    }
  }
  return 'FIN';
}

// ---------- correr ----------
const out = {};
for(const nombre of ['novato','normal','experto']){
  const S = mk(); const P = POLIT[nombre];
  for(let i=0;i<RUNS;i++){
    S.runs++;
    try{ jugar(P,S); }
    catch(err){ S.errores.push(err.message); }
  }
  out[nombre]=S;
}

// ---------- informe ----------
const pct=(a,b)=>((a/b)*100).toFixed(1)+'%';
const avg=(a)=>a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2):'—';
for(const [nom,S] of Object.entries(out)){
  console.log('\n=========== PERFIL: '+nom.toUpperCase()+'  ('+S.runs+' partidas) ===========');
  console.log('Victorias (Monteverde):', S.wins, pct(S.wins,S.runs));
  console.log('Provincias limpias al morir (prom):', avg(S.provAlMorir), ' de', RULES.RUN_LENGTH);
  console.log('Nivel promedio del equipo al terminar:', avg(S.nivelFinal));
  console.log('Liberados (conservación) promedio:', avg(S.liberados));
  console.log('Errores/excepciones:', S.errores.length, S.errores.slice(0,3));
  console.log('Peleas sin animales disponibles:', S.sinPeleadores);
  console.log('Combates de +260 pasos (posible empate):', S.turnosLargos);
  console.log('Rondas por combate (prom):', avg(S.rondas));
  console.log('\n  Encuentros y derrotas por tipo:');
  Object.keys(S.encuentros).sort().forEach(k=>{
    const t=S.encuentros[k], d=S.derrotas[k]||0;
    console.log('   ', k.padEnd(10), 'jugados', String(t).padStart(6), ' perdidos', String(d).padStart(5), ' ('+pct(d,t)+')');
  });
  console.log('\n  Dónde termina la partida:');
  Object.entries(S.muertes).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>
    console.log('   ', k.padEnd(22), String(v).padStart(6), pct(v,S.runs)));
  const totR=Object.values(S.rarezas).reduce((a,b)=>a+b,0);
  console.log('\n  Rareza de lo rescatado:');
  ['comun','raro','ultrararo','legendario','extinto'].forEach(r=>
    console.log('   ', r.padEnd(11), String(S.rarezas[r]||0).padStart(7), pct(S.rarezas[r]||0,totR)));
}
console.log('\nOK');
