// ============================================================
// auditar_habilidades.mjs — ¿CADA habilidad hace lo que dice?
//
// No alcanza con que el juego no reviente: una habilidad puede declarar
// "30 de daño" y pegar 0 porque el objetivo salió mal, o curar al enemigo
// en vez de al aliado. Esto prueba las 544 habilidades UNA POR UNA en un
// combate controlado y compara lo que PASÓ contra lo que la habilidad DICE.
//
// Para cada habilidad:
//   1. se arma un combate limpio con energía infinita
//   2. se usa SOLO esa habilidad, sobre el objetivo que ella pide
//   3. se lee el log del motor y se verifica cada efecto declarado
//   4. se comprueba que la DESCRIPCIÓN mencione los números que de verdad hizo
//
//   node tools/auditar_habilidades.mjs [repeticiones por habilidad]
// ============================================================
import * as A from '../src/arena.js';
import { SP } from '../src/fauna_roster.js';
import { habsDe } from '../src/habilidades.js';

const REPS = Number(process.argv[2] || 3);
const keys = Object.keys(SP);

const fallas = [];
const avisos = [];
let probadas = 0, ejecuciones = 0;

// combate de laboratorio: yo con el animal a probar, rival con 3 bichos fijos
function montar(key) {
  const st = A.mkCombate(
    [{ key }, { key: 'perro' }, { key: 'gato' }],
    [{ key: 'tortuga' }, { key: 'tortuga' }, { key: 'tortuga' }],
    { abre: 'A', compensa: 0 });
  st.energia.A = { bosque: 99, sabana: 99, agua: 99, montana: 99 };
  return st;
}

const objetivoDe = (h) => {
  const efs = h.efectos || [];
  if (efs.some(f => f.obj === 'enemigo')) return 'B0';
  if (efs.some(f => f.obj === 'aliado')) return 'A1';
  return 'A0';
};

for (const key of keys) {
  const habs = habsDe(key).habs;
  for (let i = 0; i < habs.length; i++) {
    const h = habs[i];
    probadas++;
    const esperado = {
      dano: 0, danoTodos: 0, dot: false, cura: 0, curaTurnos: false,
      defensa: 0, reducir: false, invul: false, aturdir: false,
      exponer: false, contra: false, roba: false, quema: false, marca: false,
      amplifica: 0, limpia: false, daEnergia: false,
    };
    for (const f of (h.efectos || [])) {
      if (f.t === 'dano') { if (f.obj === 'todos') esperado.danoTodos += f.v; else if (f.obj !== 'self') esperado.dano += f.v; }
      if (f.t === 'danoTurnos') esperado.dot = true;
      if (f.t === 'curar') esperado.cura += f.v;
      if (f.t === 'curarTurnos') esperado.curaTurnos = true;
      if (f.t === 'defensa') esperado.defensa += f.v;
      if (f.t === 'reducir') esperado.reducir = true;
      if (f.t === 'invulnerable') esperado.invul = true;
      if (f.t === 'aturdir') esperado.aturdir = true;
      if (f.t === 'exponer') esperado.exponer = true;
      if (f.t === 'contraataque') esperado.contra = true;
      if (f.t === 'robarEnergia') esperado.roba = true;
      if (f.t === 'quemarEnergia') esperado.quema = true;
      if (f.t === 'marcaPermanente') esperado.marca = true;
      if (f.t === 'amplificar') esperado.amplifica += f.v;
      if (f.t === 'limpiar') esperado.limpia = true;
      if (f.t === 'darEnergia') esperado.daEnergia = true;
    }
    const nada = Object.values(esperado).every(v => v === 0 || v === false);
    if (nada) { avisos.push([key, h.n, 'efecto de un tipo que el auditor todavía no sabe medir']); continue; }

    for (let r = 0; r < REPS; r++) {
      ejecuciones++;
      const st = montar(key);
      const yo = st.unidades[0];
      const obj = objetivoDe(h);
      const objetivo = st.unidades.find(u => u.uid === obj);
      const hpAntes = objetivo.hp;
      const aliado = st.unidades.find(u => u.uid === 'A1');
      aliado.hp = 40;                                  // para poder ver curaciones
      // para poder ver 'limpiar' hay que tener algo sucio encima
      if (esperado.limpia) {
        for (const u of [yo, aliado]) u.efectos.push({ t: 'dot', v: 5, turnos: 3, desde: -9 });
      }
      const eAantes = A.totalE(st.energia.A);
      const hpAliado = aliado.hp;
      const enemigosAntes = st.unidades.filter(u => u.lado === 'B').map(u => u.hp);
      st.energia.B = { bosque: 3, sabana: 3, agua: 3, montana: 3 };
      const eB = A.totalE(st.energia.B);

      const res = A.ejecutarTurno(st, [{ uid: 'A0', hab: i, objetivo: obj }]);
      if (!res.ok) { fallas.push([key, h.n, `la cola fue rechazada: ${res.motivo}`]); break; }
      const ev = res.eventos || [];
      const golpes = ev.filter(e => e.t === 'golpe' && String(e.uid).startsWith('B'));
      const pegado = golpes.reduce((s, e) => s + (e.v || 0), 0);

      // --- daño a un enemigo ---
      if (esperado.dano > 0) {
        const bajo = hpAntes - objetivo.hp;
        if (bajo <= 0 && pegado <= 0)
          fallas.push([key, h.n, `declara ${esperado.dano} de daño y NO pegó nada`]);
        else if (pegado > 0 && Math.abs(pegado - esperado.dano) > esperado.dano * 0.5 + 1)
          avisos.push([key, h.n, `declara ${esperado.dano}, pegó ${pegado}`]);
      }
      // --- daño en área: tiene que tocar a los 3 ---
      if (esperado.danoTodos > 0) {
        const tocados = st.unidades.filter((u, ix) => u.lado === 'B' && u.hp < enemigosAntes[ix - 3]).length;
        if (tocados < 3)
          fallas.push([key, h.n, `es de ÁREA y solo tocó a ${tocados} de 3`]);
      }
      // --- curación ---
      if (esperado.cura > 0) {
        const objCura = (h.efectos || []).some(f => f.t === 'curar' && f.obj === 'self') ? yo : aliado;
        const base = objCura === yo ? A.VIDA : hpAliado;
        if (objCura.hp <= base && objCura.hp < A.VIDA)
          fallas.push([key, h.n, `declara curar ${esperado.cura} y no curó (${base} → ${objCura.hp})`]);
      }
      // --- estados sobre el objetivo ---
      const tiene = (u, t) => u.efectos.some(f => f.t === t);
      if (esperado.dot && !st.unidades.some(u => tiene(u, 'dot')))
        fallas.push([key, h.n, 'declara toxina por turnos y no dejó el efecto']);
      if (esperado.curaTurnos && !st.unidades.some(u => tiene(u, 'hot')))
        fallas.push([key, h.n, 'declara curación por turnos y no dejó el efecto']);
      if (esperado.aturdir && !st.unidades.some(u => u.lado === 'B' && tiene(u, 'aturdir')))
        fallas.push([key, h.n, 'declara aturdir y el enemigo no quedó aturdido']);
      if (esperado.exponer && !st.unidades.some(u => u.lado === 'B' && tiene(u, 'exponer')))
        fallas.push([key, h.n, 'declara exponer y el enemigo no quedó expuesto']);
      if (esperado.marca && !st.unidades.some(u => u.lado === 'B' && tiene(u, 'marca')))
        fallas.push([key, h.n, 'declara marca y no la dejó']);
      if (esperado.invul && !st.unidades.some(u => u.lado === 'A' && tiene(u, 'invulnerable')))
        fallas.push([key, h.n, 'declara invulnerable y nadie quedó invulnerable']);
      if (esperado.reducir && !st.unidades.some(u => u.lado === 'A' && tiene(u, 'reducir')))
        fallas.push([key, h.n, 'declara reducción de daño y no la dejó']);
      if (esperado.contra && !st.unidades.some(u => u.lado === 'A' && tiene(u, 'contra')))
        fallas.push([key, h.n, 'declara contraataque y no lo dejó']);
      if (esperado.defensa > 0 && !st.unidades.some(u => u.lado === 'A' && u.defensa > 0))
        fallas.push([key, h.n, `declara ${esperado.defensa} de defensa y nadie la ganó`]);
      // --- amplificar: el próximo golpe tiene que pegar MÁS ---
      if (esperado.amplifica > 0 && !st.unidades.some(u => u.lado === 'A' && u.efectos.some(f => f.t === 'amp')))
        fallas.push([key, h.n, `declara +${esperado.amplifica} al próximo golpe y no dejó el efecto`]);
      // --- limpiar: el veneno que le pusimos tiene que haber desaparecido ---
      if (esperado.limpia) {
        const objL = (h.efectos || []).some(f => f.t === 'limpiar' && f.obj === 'aliado') ? aliado : yo;
        if (objL.efectos.some(f => f.t === 'dot'))
          fallas.push([key, h.n, 'declara limpiar efectos dañinos y la toxina sigue puesta']);
      }
      // --- dar energía: el pool propio tiene que subir (descontando el costo) ---
      if (esperado.daEnergia) {
        const gastado = (h.costo || []).filter(c => c !== 'TODO').length;
        if (A.totalE(st.energia.A) <= eAantes - gastado)
          fallas.push([key, h.n, 'declara dar energía y el pool no subió']);
      }
      // --- energía del rival ---
      // ⚠️ NO se puede comparar el pool antes/después: al pasar el turno, B
      // GANA su energía y tapa el robo. Se mira el evento del log.
      if (esperado.roba || esperado.quema) {
        const t2 = esperado.roba ? 'robarEnergia' : 'quemarEnergia';
        if (!ev.some(e => e.t === t2))
          fallas.push([key, h.n, `declara ${esperado.roba ? 'robar' : 'quemar'} energía y no pasó`]);
      }
    }

    // --- la DESCRIPCIÓN tiene que nombrar los números reales ---
    const d = h.desc || '';
    if (!d.trim()) fallas.push([key, h.n, 'sin descripción']);
    else {
      for (const f of (h.efectos || [])) {
        if (['dano', 'danoTurnos', 'curar', 'defensa'].includes(f.t) && f.v &&
            !d.includes(String(f.v)))
          avisos.push([key, h.n, `la descripción no menciona el ${f.v} de ${f.t}: "${d.slice(0, 60)}"`]);
      }
    }
  }
}

const agrupar = (l) => {
  const m = new Map();
  for (const [k, hab, msg] of l) {
    const clave = msg.replace(/\d+/g, 'N').slice(0, 60);
    if (!m.has(clave)) m.set(clave, []);
    m.get(clave).push(`${SP[k]?.n || k} · ${hab}`);
  }
  return m;
};

console.log(`\n🔍 AUDITORÍA DE HABILIDADES — ${probadas} habilidades · ${ejecuciones} combates\n`);
if (!fallas.length) console.log('  ✅ ninguna habilidad falló: todas hacen lo que declaran\n');
else {
  console.log(`  ❌ ${fallas.length} FALLAS (la habilidad NO hace lo que dice)\n`);
  for (const [msg, casos] of agrupar(fallas)) {
    console.log(`  ── ${msg} (${casos.length})`);
    for (const c of casos.slice(0, 6)) console.log(`       ${c}`);
    if (casos.length > 6) console.log(`       …y ${casos.length - 6} más`);
  }
}
if (avisos.length) {
  console.log(`\n  ⚠️  ${avisos.length} avisos (no es error, pero conviene mirarlo)\n`);
  for (const [msg, casos] of agrupar(avisos)) {
    console.log(`  ── ${msg} (${casos.length})`);
    for (const c of casos.slice(0, 4)) console.log(`       ${c}`);
    if (casos.length > 4) console.log(`       …y ${casos.length - 4} más`);
  }
}
process.exitCode = fallas.length ? 1 : 0;
