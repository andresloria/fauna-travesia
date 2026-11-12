// ============================================================
// travesia/rueda.js — LA RUEDA DE ATAQUE (prototipo del modo Travesía).
//
// Adaptación de Pokémon Duel: cada animal pelea con una RUEDA dividida en
// gajos. Se gira, sale un gajo, y el COLOR decide quién gana el duelo.
//
// La gracia es que la rueda NO se inventa: sale del kit que cada especie YA
// tiene (3 habilidades del documento + la Esquiva universal). El tamaño del
// gajo es INVERSO a lo que cuesta la habilidad — lo barato sale seguido, lo
// demoledor casi nunca. Así las 136 especies tienen rueda propia sin escribir
// un solo dato nuevo.
//
// Motor PURO: no toca el DOM. El rng se inyecta para que sea reproducible.
// ============================================================

import { SP } from '../fauna_roster.js';
import { habsDe, ESQUIVA } from '../habilidades.js';

export const COLORES = ['blanco', 'dorado', 'morado', 'azul', 'rojo'];

// ⚠️ DECISIÓN DE DISEÑO: las fuentes de Pokémon Duel se contradicen en
// AZUL vs DORADO. Acá gana el DORADO (es el gajo de prioridad y el más caro
// de sacar). Si el azul le ganara a todo, la Esquiva sería dominante y las
// habilidades fuertes no valdrían la pena. Se cambia acá para probar al revés.
export const DORADO_PERFORA_AZUL = true;

// Cuánto "vale" cada punto de un efecto. Los que se miden por punto
// multiplican por su v; los de bandera (aturdir, exponer…) valen fijo.
const POR_PUNTO = ['dano', 'danoTurnos', 'curar', 'curarTurnos', 'defensa',
  'reducir', 'amplificar', 'contraataque'];
const PESO_EF = {
  dano: 1, danoTurnos: 1.6, curar: 0.8, curarTurnos: 1.2, defensa: 0.6,
  reducir: 0.9, amplificar: 1.2, contraataque: 1.0,
  aturdir: 26, exponer: 16, invulnerable: 20, marcaPermanente: 12,
  robarEnergia: 14, darEnergia: 12, quemarEnergia: 10, limpiar: 8, modo: 14,
};

export function potenciaEf(f) {
  const base = PESO_EF[f.t] ?? 10;
  const v = typeof f.v === 'number' ? f.v : 1;
  let p = POR_PUNTO.includes(f.t) ? base * v : base;
  if (f.turnos) p *= 1 + f.turnos * 0.18;
  if (f.obj === 'todos' || f.obj === 'equipo') p *= 1.6;
  if (f.permanente) p *= 1.35;
  return p;
}
export const potencia = (hab) => (hab.efectos || []).reduce((s, f) => s + potenciaEf(f), 0);

// ---------- color del gajo ----------
// Prioridad: azul (defensa) > blanco (daño) > morado (estado) > dorado (prep).
const esDano = (f) => f.t === 'dano' && (f.obj === 'enemigo' || f.obj === 'todos');
const ES_ESTADO = ['aturdir', 'exponer', 'danoTurnos', 'marcaPermanente',
  'robarEnergia', 'quemarEnergia'];

// ⚠️ APRENDIDO MIDIENDO: la primera versión mandaba los auto-buffs (defensa,
// curar, amplificar) a 'dorado' SIN daño. Resultado: el 57.7% de los duelos no
// resolvía nada, nadie despejaba bloqueos y el 68% de las partidas terminaba
// en empate por límite de turnos. En Duel el DORADO ES DAÑO. Ahora un auto-buff
// se traduce a un golpe dorado con daño derivado de su potencia: la pieza sigue
// siendo "la defensiva", pero el duelo RESUELVE.
export const DANO_DORADO_MIN = 10;

export function colorDe(hab) {
  const efs = hab.efectos || [];
  if (efs.some(f => f.t === 'invulnerable' && (f.obj === 'self' || !f.obj))) return 'azul';
  if (efs.some(esDano)) {
    // caro o demoledor = dorado (prioridad: le gana al morado y perfora el azul)
    const caro = (hab.costo || []).length >= 2;
    const fuerte = efs.filter(esDano).reduce((s, f) => s + (f.v || 0), 0) >= 35;
    return (caro || fuerte) ? 'dorado' : 'blanco';
  }
  if (efs.some(f => ES_ESTADO.includes(f.t) || (f.t === 'reducir' && f.obj === 'enemigo'))) return 'morado';
  return 'dorado';                       // auto-buff: dorado con daño derivado
}

export function danoDe(hab) {
  const directo = (hab.efectos || []).filter(esDano).reduce((s, f) => s + (f.v || 0), 0);
  if (directo > 0) return directo;
  if (colorDe(hab) !== 'dorado') return 0;              // azul y morado no pegan
  return Math.max(DANO_DORADO_MIN, Math.round(potencia(hab) / 3));
}

// las estrellas desempatan morado contra morado
export const estrellasDe = (hab) => Math.max(1, Math.min(3,
  Math.round(potencia(hab) / 18)));

// ---------- tamaño del gajo ----------
export const BASE_PESO = 13;
export function pesoDe(hab) {
  const costo = (hab.costo || []).length;
  const rec = hab.recarga || 0;
  const p = Math.round(BASE_PESO - potencia(hab) / 10 - costo * 2.2 - rec * 0.9);
  return Math.max(1, Math.min(9, p));
}

// el gajo de FALLO: cuanto más raro el animal, menos falla
const FALLO_POR_RAREZA = { comun: 6, raro: 5, ultrararo: 4, legendario: 2, mitico: 2 };
// La Esquiva gana a casi todo pero NO resuelve el duelo. Si su gajo es grande
// el tablero se traba, así que va chica y fija (medido: con peso 5 el azul era
// el 20% de la rueda y las partidas morían por límite de turnos).
export const PESO_ESQUIVA = 3;

export const mkGajo = (hab) => ({
  n: hab.n, color: colorDe(hab), peso: pesoDe(hab),
  dano: danoDe(hab), estrellas: estrellasDe(hab), efectos: hab.efectos || [],
});

// mp 1-3 desde el `spd` del roster (1-8). Ya venía tematizado: el perezoso
// tiene spd 1 y el mono tití spd 8.
export const mpDe = (key) => {
  const s = SP[key] ? SP[key].spd : 4;
  return s <= 3 ? 1 : s <= 6 ? 2 : 3;
};

export function ruedaDe(key) {
  const sp = SP[key] || {};
  const { habs } = habsDe(key);
  const gajos = (habs || []).map(mkGajo);
  gajos.push({ ...mkGajo(ESQUIVA), peso: PESO_ESQUIVA });       // azul universal
  gajos.push({
    n: 'Fallo', color: 'rojo', peso: FALLO_POR_RAREZA[sp.rarity] ?? 4,
    dano: 0, estrellas: 0, efectos: [],
  });
  return { key, mp: mpDe(key), bio: sp.bio || null, gajos };
}

// EL BIOMA DEL NODO: en su propio hábitat el animal falla la mitad.
// Es la regla nueva que le da identidad propia al modo y reusa las 4 energías.
export function ruedaEnBioma(rueda, bioNodo) {
  if (!bioNodo || bioNodo !== rueda.bio) return rueda;
  return {
    ...rueda,
    gajos: rueda.gajos.map(g => g.color === 'rojo'
      ? { ...g, peso: Math.max(1, Math.round(g.peso / 2)) } : g),
  };
}

export const pesoTotal = (rueda) => rueda.gajos.reduce((s, g) => s + g.peso, 0);

export function girar(rueda, rng = Math.random) {
  const total = pesoTotal(rueda);
  let r = rng() * total;
  for (const g of rueda.gajos) { r -= g.peso; if (r < 0) return g; }
  return rueda.gajos[rueda.gajos.length - 1];
}

export function probabilidades(rueda) {
  const total = pesoTotal(rueda);
  return rueda.gajos.map(g => ({ n: g.n, color: g.color, pct: +(g.peso / total * 100).toFixed(1) }));
}

// ---------- resolución del duelo ----------
// Devuelve quién gana el giro: 'A' / 'B' / null (empate).
export function ganadorDe(gA, gB) {
  const cA = gA.color, cB = gB.color;
  if (cA === 'rojo' && cB === 'rojo') return null;      // dos fallos: nada
  if (cA === 'rojo') return 'B';
  if (cB === 'rojo') return 'A';

  if (cA === 'azul' && cB === 'azul') return null;      // ambos se cubren
  if (cA === 'azul') return (cB === 'dorado' && DORADO_PERFORA_AZUL) ? 'B' : 'A';
  if (cB === 'azul') return (cA === 'dorado' && DORADO_PERFORA_AZUL) ? 'A' : 'B';

  if (cA === 'dorado' && cB === 'morado') return 'A';   // dorado tiene prioridad
  if (cB === 'dorado' && cA === 'morado') return 'B';

  if (cA === 'morado' && cB === 'blanco') return 'A';   // el estado gana al daño
  if (cB === 'morado' && cA === 'blanco') return 'B';

  if (cA === 'morado' && cB === 'morado') {             // desempata por estrellas
    if (gA.estrellas === gB.estrellas) return null;
    return gA.estrellas > gB.estrellas ? 'A' : 'B';
  }
  // blanco/dorado entre sí: manda el daño
  if (gA.dano === gB.dano) return null;
  return gA.dano > gB.dano ? 'A' : 'B';
}

// Qué le pasa al perdedor, según el gajo con el que ganó el otro.
// Solo el DAÑO saca piezas del tablero; el estado las deja ahí tocadas.
export function consecuencia(gajoGanador) {
  if (!gajoGanador) return 'nada';
  if (gajoGanador.dano > 0) return 'ko';
  if (gajoGanador.color === 'morado') return 'estado';
  return 'nada';                                        // esquiva o preparación
}

// ---------- qué hace el gajo, en palabras ----------
// ⚠️ NO se reusa la descripción del kit de la arena: ahí dice cosas como
// "gana 35 de defensa destructible", y en Travesía no hay vida ni defensa —
// ese mismo gajo es un golpe dorado de 10. El texto se GENERA de lo que el
// gajo hace de verdad acá, para que nunca mienta (igual que en la arena).
const ESTADO_TXT = {
  aturdir: 'lo aturde', exponer: 'lo deja expuesto', danoTurnos: 'lo envenena',
  marcaPermanente: 'lo marca', robarEnergia: 'le roba energía',
  quemarEnergia: 'le quema energía', reducir: 'lo debilita',
};

export function descripcionGajo(g) {
  if (g.color === 'rojo') return 'Pierde contra todo';
  if (g.color === 'azul') return 'Se cubre: gana a casi todo, pero no saca a nadie';
  if (g.color === 'morado') {
    const qué = (g.efectos || []).map(f => ESTADO_TXT[f.t]).filter(Boolean);
    const lista = [...new Set(qué)].join(' y ') || 'le deja un estado';
    return `Estado: ${lista} — gana al golpe blanco, pero no lo saca`;
  }
  if (g.color === 'dorado') return `Golpe de ${g.dano} · prioridad — perfora la esquiva`;
  return `Golpe de ${g.dano} — gana al que saque menos`;
}

export function resolverDuelo(gA, gB) {
  const ganador = ganadorDe(gA, gB);
  const gajo = ganador === 'A' ? gA : ganador === 'B' ? gB : null;
  return { ganador, gajoA: gA, gajoB: gB, tipo: consecuencia(gajo) };
}

// Esperanza del duelo entre dos ruedas: enumera todos los pares de gajos
// pesados. Sirve para la IA y para medir balance sin jugar partidas.
export function evDuelo(rA, rB) {
  const tA = pesoTotal(rA), tB = pesoTotal(rB);
  let koGana = 0, koPierde = 0, nada = 0;
  for (const a of rA.gajos) for (const b of rB.gajos) {
    const p = (a.peso / tA) * (b.peso / tB);
    const { ganador, tipo } = resolverDuelo(a, b);
    if (tipo === 'ko' && ganador === 'A') koGana += p;
    else if (tipo === 'ko' && ganador === 'B') koPierde += p;
    else nada += p;
  }
  return { koGana, koPierde, nada, ev: koGana - koPierde };
}
