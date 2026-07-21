// ============================================================
// arena.js — MOTOR de combate por turnos, reglas de Naruto-Arena (The Basics).
// Lógica PURA y testeable (como engine.js): sin DOM, sin estado global.
//
// Reglas implementadas (ver ARENA.md §1-§2b, fuente: el wiki del original):
//   · Equipos de 3, vida 100 PARA TODOS. Sin niveles ni pasivas: todos entran
//     con sus 3 habilidades + esquiva; solo limita el COSTO de energia.
//   · Energía = biomas (🌳🌾🌊⛰). Cada ganancia es 25% cada tipo, AL AZAR.
//     Primer turno: 1. Después: 1 por cada animal vivo al final de tu turno.
//   · 1 habilidad por animal por turno, pagando costo (comodín = cualquiera).
//   · Cola: las habilidades se ejecutan EN EL ORDEN elegido.
//   · Recargas por habilidad. Esquiva universal (invulnerable 1t, recarga 4).
//   · Clases: instant / sostenido (sigue solo; se pausa si aturden al usuario
//     o el blanco es invulnerable) / control (cae si el usuario muere).
//   · La toxina ATRAVIESA invulnerabilidad. Exponer anula invulnerabilidad
//     y reducción. Perforante ignora reducción. Defensa destructible absorbe.
// ============================================================

import { SP } from './fauna_roster.js';
import { habsDe, ESQUIVA } from './habilidades.js';

export const BIOMAS = ['bosque', 'sabana', 'agua', 'montana'];
export const VIDA = 100;

// ---------- compensación por abrir ----------
// Medido en espejo perfecto (mismo equipo de los dos lados, 6000 combates):
// quien ABRE ganaba el 61,1%, y el primer animal en caer era del que responde
// el 63,5% de las veces. Es TEMPO puro: pegar primero adelanta las muertes.
// Para un juego 1v1 con ranking eso es letal — la mitad de las derrotas se
// sienten robadas. El que responde arranca con energía extra en su 1er turno.
// El valor sale de la tabla que midió tools/compensa.mjs.
export const COMPENSA_SEGUNDO = 1;

// ---------- construcción ----------
// equipo: [{key}] ×3  →  unidades listas para combatir.
// SIN NIVELES y SIN PASIVAS: todos entran con sus 3 habilidades + esquiva.
export function mkUnidad({ key, ref = null }, lado, idx) {
  const sp = SP[key] || { n: key, e: '🐾', bio: 'bosque' };
  const kit = habsDe(key);
  return {
    uid: `${lado}${idx}`, lado, idx, key,
    ref,                                      // clave del animal del refugio
    n: sp.n, e: sp.e, bio: BIOMAS.includes(sp.bio) ? sp.bio : 'montana',
    hp: VIDA, viva: true,
    habs: [...kit.habs, { ...ESQUIVA, esEsquiva: true }],
    recargas: {},                             // nombre → turnos restantes
    efectos: [],                              // efectos activos sobre la unidad
    defensa: 0, defensaPerm: 0,               // destructible (y la permanente)
    usadaEsteTurno: false,
    contadores: { golpeada: 0, ataco: false },
  };
}

export function mkCombate(equipoA, equipoB, opts = {}) {
  const rng = opts.rng || Math.random;
  const st = {
    rng,
    unidades: [
      ...equipoA.slice(0, 3).map((a, i) => mkUnidad(a, 'A', i)),
      ...equipoB.slice(0, 3).map((a, i) => mkUnidad(a, 'B', i)),
    ],
    energia: { A: zeroE(), B: zeroE() },
    turno: 0,                                 // nº de medio-turno global
    jugados: { A: 0, B: 0 },                  // turnos que YA jugó cada lado
    lado: opts.abre || (rng() < 0.5 ? 'A' : 'B'),
    log: [],
    fin: null,                                // 'A' | 'B' cuando alguien gana
  };
  // cuánta energía extra recibe el que RESPONDE en su primer turno (ver
  // COMPENSA_SEGUNDO). opts.compensa existe para poder medirlo desde tools/.
  st.compensa = opts.compensa === undefined ? COMPENSA_SEGUNDO : opts.compensa;
  st.abrio = st.lado;                         // quién abrió, para saber quién compensa
  ganarEnergia(st, st.lado, 1);               // regla: tu primer turno da 1 energía
  return st;
}
const zeroE = () => ({ bosque: 0, sabana: 0, agua: 0, montana: 0 });

// ---------- utilidades de consulta ----------
export const vivos = (st, lado) => st.unidades.filter(u => u.lado === lado && u.viva);
export const rival = (lado) => (lado === 'A' ? 'B' : 'A');
export const totalE = (e) => BIOMAS.reduce((s, b) => s + e[b], 0);

const tiene = (u, tipo) => u.efectos.some(f => f.t === tipo);
const efecto = (u, tipo) => u.efectos.filter(f => f.t === tipo);
export const invulnerable = (u) => tiene(u, 'invulnerable');
export const expuesta = (u) => tiene(u, 'exponer');
export const aturdida = (u, clases = []) =>
  efecto(u, 'aturdir').some(f => !f.clase || clases.includes(f.clase));
export const enModo = (u) => tiene(u, 'modo');

// ---------- energía ----------
export function ganarEnergia(st, lado, n) {
  const ganadas = [];
  for (let i = 0; i < n; i++) {
    const b = BIOMAS[Math.floor(st.rng() * 4)];   // 25% cada tipo, como el original
    st.energia[lado][b]++;
    ganadas.push(b);
  }
  return ganadas;
}

// ¿alcanza la energía del lado para pagar esta lista de costos (con comodines)?
export function alcanza(pool, costos) {
  const p = { ...pool };
  let comodines = 0;
  for (const c of costos.flat()) {
    if (c === 'comodin' || c === 'TODO') { comodines += (c === 'comodin' ? 1 : 0); continue; }
    if (p[c] > 0) p[c]--; else return false;
  }
  // los comodines se pagan con lo que sobre
  const sobra = totalE(p);
  return sobra >= comodines;
}

// paga (muta el pool); los comodines se pagan del tipo más abundante
export function pagar(pool, costo) {
  let todo = false;
  for (const c of costo) {
    if (c === 'TODO') { todo = true; continue; }
    if (c === 'comodin') {
      const b = BIOMAS.slice().sort((x, y) => pool[y] - pool[x])[0];
      if (pool[b] > 0) pool[b]--;
    } else if (pool[c] > 0) pool[c]--;
  }
  if (todo) for (const b of BIOMAS) pool[b] = 0;   // definitiva: gasta TODA la energía
}

// ---------- cambio de energía ----------
// Podés cambiar 3 energías CUALESQUIERA por 1 del tipo que elijás, una vez
// por turno. (El original usa 5; Andrés lo bajó a 3 el 22-jul para que la
// válvula de escape se pueda usar de verdad en turnos tempranos.)
export function puedeCambiar(st, lado) {
  return !st.fin && !(st.cambioUsado && st.cambioUsado[lado])
      && totalE(st.energia[lado]) >= 3;
}
export function cambiarEnergia(st, lado, tipo) {
  if (!BIOMAS.includes(tipo) || !puedeCambiar(st, lado)) return false;
  const pool = st.energia[lado];
  // paga las 3 sacando siempre del montón más grande (conserva las escasas)
  for (let i = 0; i < 3; i++) {
    const b = BIOMAS.slice().sort((x, y) => pool[y] - pool[x])[0];
    pool[b]--;
  }
  pool[tipo]++;
  st.cambioUsado = { ...(st.cambioUsado || {}), [lado]: true };
  st.log.push({ t: 'cambio', lado, tipo });
  return true;
}

// ---------- validación de acciones ----------
// ¿puede u usar su habilidad i ahora? (sin considerar el resto de la cola)
export function puedeUsar(st, u, i) {
  const h = u.habs[i];
  if (!h || !u.viva || u.usadaEsteTurno) return { ok: false, motivo: 'no disponible' };
  if (u.recargas[h.n] > 0) return { ok: false, motivo: `recarga ${u.recargas[h.n]}` };
  if (aturdida(u, h.clases || [])) return { ok: false, motivo: 'aturdida' };
  if (!alcanza(st.energia[u.lado], [h.costo === undefined ? [] : h.costo]))
    return { ok: false, motivo: 'sin energía' };
  return { ok: true };
}

// objetivos válidos para la habilidad (uids)
export function objetivosDe(st, u, i) {
  const h = u.habs[i];
  if (!h) return [];
  const efs = h.efectos || [];
  const necesitaEnemigo = efs.some(f => f.obj === 'enemigo');
  const necesitaAliado = efs.some(f => f.obj === 'aliado');
  if (necesitaEnemigo) {
    return vivos(st, rival(u.lado))
      .filter(v => !invulnerable(v) || atraviesa(h) || expuesta(v))
      .map(v => v.uid);
  }
  if (necesitaAliado) return vivos(st, u.lado).map(v => v.uid);
  return [u.uid];                               // self / equipo / todos
}
const atraviesa = (h) => (h.clases || []).includes('toxina') ||
  (h.efectos || []).some(f => f.ignoraInvulnerable || f.t === 'danoTurnos');

// ---------- cola y ejecución del turno ----------
// cola: [{uid, hab, objetivo}] en el ORDEN elegido por el jugador.
export function validarCola(st, lado, cola) {
  const costos = [];
  const usadas = new Set();
  for (const acc of cola) {
    const u = st.unidades.find(x => x.uid === acc.uid);
    if (!u || u.lado !== lado || !u.viva) return { ok: false, motivo: 'unidad inválida' };
    if (usadas.has(acc.uid)) return { ok: false, motivo: '1 habilidad por animal' };
    usadas.add(acc.uid);
    const h = u.habs[acc.hab];
    if (!h) return { ok: false, motivo: 'habilidad inválida' };
    if (u.recargas[h.n] > 0) return { ok: false, motivo: `${h.n} en recarga` };
    if (aturdida(u, h.clases || [])) return { ok: false, motivo: `${u.n} aturdida` };
    costos.push(h.costo || []);
  }
  if (!alcanza(st.energia[lado], costos)) return { ok: false, motivo: 'energía insuficiente' };
  return { ok: true };
}

export function ejecutarTurno(st, cola) {
  const lado = st.lado;
  const v = validarCola(st, lado, cola);
  if (!v.ok) return { ok: false, motivo: v.motivo };
  const eventos = [];

  // 1. ejecutar la cola EN ORDEN
  for (const acc of cola) {
    if (st.fin) break;
    const u = st.unidades.find(x => x.uid === acc.uid);
    if (!u.viva) continue;                      // murió por un contraataque previo
    const h = u.habs[acc.hab];
    pagar(st.energia[lado], h.costo || []);
    u.usadaEsteTurno = true;
    u.recargas[h.n] = (h.recarga || 0) + 1;     // +1 porque tickea al final de ESTE turno
    u.contadores.ataco = true;
    aplicarHabilidad(st, u, h, acc.objetivo, eventos);
    chequearFin(st);
  }

  // 2. efectos de fin de turno del lado activo (sostenidos, toxinas del RIVAL tickean
  //    al inicio del turno de su dueño — modelo simple: todo tickea aquí por unidad)
  tickFinDeTurno(st, lado, eventos);

  // 3. pasar turno
  st.turno++;
  st.jugados[lado]++;
  st.lado = rival(lado);
  for (const u of st.unidades) if (u.lado === lado) {
    for (const k of Object.keys(u.recargas)) if (u.recargas[k] > 0) u.recargas[k]--;
  }
  for (const u of st.unidades) { u.usadaEsteTurno = false; }

  // 4. energía del lado entrante: SU primer turno = 1; después, 1 por vivo
  if (st.cambioUsado) st.cambioUsado[st.lado] = false;   // puede volver a cambiar
  if (!st.fin) {
    // primer turno = 1 (+ compensación si NO abriste); después, 1 por vivo
    const n = st.jugados[st.lado] === 0
      ? 1 + (st.lado !== st.abrio ? (st.compensa || 0) : 0)
      : vivos(st, st.lado).length;
    const ganadas = ganarEnergia(st, st.lado, n);
    eventos.push({ t: 'energia', lado: st.lado, ganadas });
    // duración de efectos del lado entrante (sus buffs caducan al empezar su turno)
    for (const u of st.unidades) if (u.lado === st.lado) caducarEfectos(u, st.turno);
  }
  st.log.push(...eventos);
  return { ok: true, eventos };
}

// ---------- aplicación de una habilidad ----------
function unidadesObjetivo(st, u, f, objetivoUid) {
  switch (f.obj) {
    case 'self': return [u];
    case 'aliado': {
      const o = st.unidades.find(x => x.uid === objetivoUid);
      return o && o.lado === u.lado && o.viva ? [o] : [u];
    }
    case 'equipo': return vivos(st, u.lado);
    case 'enemigo': {
      const o = st.unidades.find(x => x.uid === objetivoUid);
      return o && o.lado !== u.lado && o.viva ? [o] : [];
    }
    case 'todos': return vivos(st, rival(u.lado));
    default: return [u];
  }
}

function aplicarHabilidad(st, u, h, objetivoUid, eventos) {
  const efs = (enModo(u) && h.enModo) ? h.enModo : (h.efectos || []);
  eventos.push({ t: 'usa', uid: u.uid, hab: h.n, objetivo: objetivoUid });
  for (const f of efs) {
    for (const o of unidadesObjetivo(st, u, f, objetivoUid)) {
      aplicarEfecto(st, u, o, f, h, eventos);
      // sello de nacimiento: en qué turno se aplicó (lo usa caducarEfectos)
      for (const x of o.efectos) if (x.desde === undefined) x.desde = st.turno;
      for (const x of u.efectos) if (x.desde === undefined) x.desde = st.turno;
      if (st.fin) return;
    }
  }
}

function aplicarEfecto(st, u, o, f, h, eventos) {
  switch (f.t) {
    case 'dano': {
      hacerDano(st, u, o, f.v, h, eventos, { toxina: !!f.toxina, ignoraDefensa: !!f.ignoraDefensa });
      break;
    }
    case 'danoTurnos':
      o.efectos.push({ t: 'dot', v: f.v, turnos: f.turnos, de: u.uid, hab: h.n });
      break;
    case 'curar': case 'curarTurnos': {
      if (f.t === 'curar') { const antes = o.hp; o.hp = Math.min(VIDA, o.hp + f.v);
        eventos.push({ t: 'cura', uid: o.uid, v: o.hp - antes }); }
      else o.efectos.push({ t: 'hot', v: f.v, turnos: f.turnos });
      break;
    }
    case 'defensa':
      if (f.permanente) { o.defensaPerm = Math.max(o.defensaPerm, f.v); o.defensa = Math.max(o.defensa, f.v); }
      else o.defensa += f.v;
      break;
    case 'reducir': o.efectos.push({ t: 'reducir', v: f.v, turnos: f.turnos }); break;
    case 'invulnerable':
      if (!expuesta(o)) o.efectos.push({ t: 'invulnerable', turnos: f.turnos });
      break;
    case 'aturdir':
      o.efectos.push({ t: 'aturdir', turnos: f.turnos, clase: f.clase || null });
      break;
    case 'exponer':
      o.efectos.push({ t: 'exponer', turnos: f.turnos });
      o.efectos = o.efectos.filter(x => x.t !== 'invulnerable');   // rompe la esquiva activa
      break;
    case 'robarEnergia': case 'quemarEnergia': {
      const pool = st.energia[rival(u.lado)];
      const con = BIOMAS.filter(b => pool[b] > 0);
      if (con.length) {
        const b = con[Math.floor(st.rng() * con.length)];
        pool[b]--;
        if (f.t === 'robarEnergia') st.energia[u.lado][b]++;
        eventos.push({ t: f.t, uid: u.uid, bioma: b });
      }
      break;
    }
    // ⚠️ BUG ARREGLADO (22-jul): esto hacía `pool['comodin']++`, y el pool solo
    // tiene los 4 biomas — creaba una llave basura `comodin: null` y la energía
    // prometida NO llegaba nunca. El comodín significa "cualquiera", así que
    // ahora entrega un bioma AL AZAR, igual que la energía del turno.
    case 'darEnergia': {
      const b = BIOMAS.includes(f.tipo) ? f.tipo : BIOMAS[Math.floor(st.rng() * 4)];
      st.energia[u.lado][b] += (f.n || 1);
      eventos.push({ t: 'ganaEnergia', uid: u.uid, bioma: b });
      break;
    }
    case 'contraataque': u.efectos.push({ t: 'contra', v: f.v, turnos: 2 }); break;
    case 'amplificar': o.efectos.push({ t: 'amp', v: f.v, turnos: f.turnos }); break;
    case 'limpiar': o.efectos = o.efectos.filter(x => !['dot', 'aturdir', 'exponer', 'marca'].includes(x.t)); break;
    case 'modo': u.efectos.push({ t: 'modo', turnos: f.turnos }); break;
    case 'marcaPermanente': o.efectos.push({ t: 'marca', v: f.v, turnos: 999 }); break;
  }
}

function hacerDano(st, u, o, base, h, eventos, { toxina = false, ignoraDefensa = false } = {}) {
  if (!o || !o.viva) return;
  // invulnerable bloquea, salvo toxina/perforante o si está expuesta
  if (invulnerable(o) && !toxina && !atraviesa(h) && !expuesta(o)) {
    eventos.push({ t: 'bloqueado', uid: o.uid }); return;
  }
  let v = base;
  v += efecto(u, 'amp').reduce((s, f) => s + f.v, 0);          // amplificado propio
  if (efecto(u, 'amp').length) u.efectos = u.efectos.filter(x => x.t !== 'amp');
  v += efecto(o, 'marca').reduce((s, f) => s + f.v, 0);        // marca permanente
  if (!toxina && !expuesta(o)) {
    const red = efecto(o, 'reducir').reduce((s, f) => s + f.v, 0);
    v = Math.max(0, v - red);
  }
  if (!ignoraDefensa && !toxina && o.defensa > 0) {
    const absorbe = Math.min(o.defensa, v);
    o.defensa -= absorbe; v -= absorbe;
  }
  if (v <= 0) { eventos.push({ t: 'golpe', de: u.uid, uid: o.uid, v: 0 }); return; }
  o.hp -= v;
  o.contadores.golpeada++;
  eventos.push({ t: 'golpe', de: u.uid, uid: o.uid, v, toxina });
  // contraataque activo del golpeado
  for (const c of efecto(o, 'contra')) if (u.viva && u.lado !== o.lado)
    { u.hp -= c.v; eventos.push({ t: 'contra', de: o.uid, uid: u.uid, v: c.v }); revisarMuerte(st, u, eventos); }
  revisarMuerte(st, o, eventos);
}

function revisarMuerte(st, o, eventos) {
  if (o.hp > 0 || !o.viva) return;
  o.viva = false; o.hp = 0; o.efectos = [];
  eventos.push({ t: 'cae', uid: o.uid });
  chequearFin(st);
}

function chequearFin(st) {
  if (!vivos(st, 'A').length) st.fin = 'B';
  else if (!vivos(st, 'B').length) st.fin = 'A';
}

// ---------- fin de turno: dots, hots, caducidad ----------
// ⚠️ Solo tickean las unidades del lado que ACABA de jugar: así una toxina de
// "3 turnos" dura 3 rondas completas (como el original), no 3 medio-turnos.
function tickFinDeTurno(st, lado, eventos) {
  // AGOTAMIENTO: pasada la ronda 20 el combate se vuelve insostenible y todos
  // pierden vida (creciente). Evita las peleas eternas entre equipos defensivos
  // sin tocar el juego normal, que dura ~12 rondas.
  const ronda = Math.floor(st.turno / 2);
  const cansancio = ronda >= 20 ? 5 + (ronda - 20) * 5 : 0;
  for (const u of st.unidades) {
    if (!u.viva || u.lado !== lado) continue;
    if (cansancio) {
      u.hp -= cansancio;
      eventos.push({ t: 'agotamiento', uid: u.uid, v: cansancio });
      revisarMuerte(st, u, eventos);
      if (st.fin) return;
    }
    for (const f of efecto(u, 'dot')) {
      u.hp -= f.v; f.turnos--;
      eventos.push({ t: 'toxina', uid: u.uid, v: f.v });
      revisarMuerte(st, u, eventos);
      if (st.fin) return;
    }
    for (const f of efecto(u, 'hot')) {
      const antes = u.hp; u.hp = Math.min(VIDA, u.hp + f.v); f.turnos--;
      if (u.hp > antes) eventos.push({ t: 'cura', uid: u.uid, v: u.hp - antes });
    }
    u.efectos = u.efectos.filter(f => !(['dot', 'hot'].includes(f.t) && f.turnos <= 0));
  }
}

// ⚠️ BUG ARREGLADO (22-jul): esto corre sobre el lado que ENTRA a jugar, así
// que un "aturdido 1 turno" que le acababas de poner al rival se descontaba a
// 0 y desaparecía ANTES de que el rival jugara: 114 habilidades de aturdir no
// hacían absolutamente nada. Ahora un efecto no caduca en el mismo turno en
// que nació (`desde`), así que dura la jugada completa del que lo recibió.
// Los buffs propios no cambian: siguen protegiéndote durante el turno rival y
// venciendo al empezar el tuyo.
function caducarEfectos(u, turnoActual) {
  for (const f of u.efectos) {
    if (['dot', 'hot', 'marca'].includes(f.t)) continue;
    if (f.desde !== undefined && f.desde === turnoActual - 1) continue;  // recién nacido
    f.turnos--;
  }
  u.efectos = u.efectos.filter(f => f.turnos > 0);
  // la defensa permanente se reaplica sola (Gaara: Armor of Sand)
  if (u.defensaPerm > 0) u.defensa = Math.max(u.defensa, u.defensaPerm);
}

// (El sistema de PASIVAS se eliminó el 20-jul: solo ataques.)

// ============================================================
// AUTO / IA — arma una cola razonable para el lado activo.
// Heurística: enfocar al rival más débil alcanzable; sanar si urge;
// esquivar si está por morir y no hay mejor uso.
// ============================================================
export function colaAuto(st, lado = st.lado) {
  const pool = { ...st.energia[lado] };
  const cola = [];
  const enemigos = vivos(st, rival(lado)).sort((a, b) => a.hp - b.hp);
  if (!enemigos.length) return cola;
  const foco = enemigos[0];

  for (const u of vivos(st, lado)) {
    let mejor = null, mejorNota = 0;
    for (let i = 0; i < u.habs.length; i++) {
      const h = u.habs[i];
      if (u.recargas[h.n] > 0) continue;
      if (aturdida(u, h.clases || [])) continue;
      const costo = h.costo || [];
      if (!alcanza(pool, [costo])) continue;
      const objs = objetivosDe(st, u, i);
      if (!objs.length) continue;
      let nota = 0;
      const efs = h.efectos || [];
      for (const f of efs) {
        if (f.t === 'dano') nota += f.obj === 'todos' ? f.v * enemigos.length : f.v;
        if (f.t === 'danoTurnos') nota += f.v * f.turnos * 0.8;
        if (f.t === 'curar') {
          const herido = vivos(st, lado).sort((a, b) => a.hp - b.hp)[0];
          nota += herido.hp < 55 ? f.v * 1.2 : 0;
        }
        if (f.t === 'defensa') nota += f.v * 0.5;
        if (f.t === 'invulnerable') nota += (u.hp < 35 ? 30 : 5);
        if (f.t === 'aturdir') nota += 18;
        if (f.t === 'exponer') nota += enemigos.some(e => invulnerable(e)) ? 40 : 12;
        if (f.t === 'robarEnergia') nota += 10;
        if (f.t === 'modo') nota += 22;
        if (f.t === 'marcaPermanente') nota += 14;
      }
      nota -= costo.length * 3;                  // la energía vale
      if (h.esEsquiva && u.hp >= 35) nota = Math.min(nota, 4);
      if (nota > mejorNota) {
        const objEnemigo = efs.some(f => f.obj === 'enemigo');
        const objAliado = efs.some(f => f.obj === 'aliado');
        let objetivo = u.uid;
        if (objEnemigo) {
          const alcanzables = objetivosDe(st, u, i);
          objetivo = alcanzables.includes(foco.uid) ? foco.uid : alcanzables[0];
        } else if (objAliado) {
          objetivo = vivos(st, lado).sort((a, b) => a.hp - b.hp)[0].uid;
        }
        mejor = { uid: u.uid, hab: i, objetivo }; mejorNota = nota;
      }
    }
    if (mejor) {
      const h = u.habs[mejor.hab];
      pagar(pool, h.costo || []);
      cola.push(mejor);
    }
  }
  // primero lo que expone/aturde, después el daño (el orden importa)
  const peso = (acc) => {
    const u = st.unidades.find(x => x.uid === acc.uid);
    const efs = u.habs[acc.hab].efectos || [];
    if (efs.some(f => ['exponer', 'aturdir', 'quemarEnergia', 'robarEnergia'].includes(f.t))) return 0;
    if (efs.some(f => ['modo', 'defensa', 'reducir'].includes(f.t))) return 1;
    return 2;
  };
  return cola.sort((a, b) => peso(a) - peso(b));
}

// combate completo automático (para simulación y tests)
export function combateAuto(equipoA, equipoB, opts = {}) {
  const st = mkCombate(equipoA, equipoB, opts);  // (ya reparte la energía inicial)
  let guard = 0;
  while (!st.fin && guard++ < 200) {
    const r = ejecutarTurno(st, colaAuto(st));
    if (!r.ok) ejecutarTurno(st, []);           // sin jugadas válidas: pasa
  }
  if (!st.fin) st.fin = vivos(st, 'A').reduce((s, u) => s + u.hp, 0) >=
                        vivos(st, 'B').reduce((s, u) => s + u.hp, 0) ? 'A' : 'B';
  return st;
}
