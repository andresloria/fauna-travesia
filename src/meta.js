// ============================================================
// meta.js — META-PROGRESO que persiste ENTRE partidas (localStorage):
//   - Colección ("dex"): especies que alguna vez rescataste.
//   - Logros: hitos desbloqueados.
// Es puro estado guardado; game.js lo alimenta y ui.js lo muestra.
// ============================================================

const DEX_KEY = 'fauna_dex';
const ACH_KEY = 'fauna_logros';
const STATS_KEY = 'fauna_stats';

function load(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
  catch { return new Set(); }
}
function save(key, set) {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch {}
}

// ---------- Colección ----------
export function getDex() { return load(DEX_KEY); }
// agrega una o varias keys; devuelve true si alguna era nueva
export function addDex(keys) {
  const s = load(DEX_KEY); let added = false;
  (Array.isArray(keys) ? keys : [keys]).forEach(k => { if (k && !s.has(k)) { s.add(k); added = true; } });
  if (added) save(DEX_KEY, s);
  return added;
}
export function dexCount() { return load(DEX_KEY).size; }

// ---------- Estadísticas acumuladas (entre partidas) — alimentan los logros ----------
export function getStats() { try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{}'); } catch { return {}; } }
function saveStats(o) { try { localStorage.setItem(STATS_KEY, JSON.stringify(o)); } catch {} }
export function bump(key, by = 1) { const o = getStats(); o[key] = (o[key] || 0) + by; saveStats(o); return o[key]; }
export function bumpMax(key, val) { const o = getStats(); if ((o[key] || 0) < val) { o[key] = val; saveStats(o); } return getStats()[key]; }
export function markFolk(key) { const o = getStats(); const set = new Set(o.folk || []); set.add(key); o.folk = [...set]; saveStats(o); return set.size; }

// ---------- Logros ----------
const A = (id, e, n, d, cond) => ({ id, e, n, d, cond });
// tiers: genera un logro por cada umbral (id con prefijo), con cond(s)=>s[field]>=k
const tiers = (pfx, e, field, items, label) =>
  items.map(([k, n, extra]) => A(pfx + k, e, n, label(k, extra), s => (s[field] || 0) >= k));

// 15 base — se otorgan explícitamente desde game.js con award().
const BASE = [
  A('prim_rescate', '🩹', 'Primer rescate', 'Rescatá tu primer animal.'),
  A('refugio', '🏕️', 'Refugio lleno', 'Tené 5 animales en tu refugio.'),
  A('dex10', '📖', 'Naturalista', 'Registrá 10 especies en la colección.'),
  A('dex25', '📚', 'Biólogo de campo', 'Registrá 25 especies.'),
  A('dex50', '🔬', 'Experto en fauna', 'Registrá 50 especies.'),
  A('legendario', '✦', 'Leyenda viva', 'Rescatá un animal legendario.'),
  A('prov1', '🛡️', 'Guardaparques', 'Liberá tu primera provincia.'),
  A('traficantes', '🚔', 'Anti-tráfico', 'Vencé a una banda de traficantes.'),
  A('conserva5', '🌿', 'Conservacionista', 'Devolvé 5 animales a la naturaleza.'),
  A('conserva15', '🌳', 'Restaurador', 'Devolvé 15 animales a la naturaleza.'),
  A('impecable', '💪', 'Impecable', 'Ganá un combate sin que caiga ningún animal tuyo.'),
  A('jefezona', '👑', 'Domador de titanes', 'Vencé y rescatá a un jefe de zona.'),
  A('furtivo', '💀', 'A puro pulso', 'Liberá una provincia en Modo Furtivo.'),
  A('prov7', '🇨🇷', 'Héroe nacional', 'Liberá las 7 provincias.'),
  A('cabecilla', '👑', 'El Cabecilla cae', 'Vencé al jefe final en Monteverde.'),
];

// EASTER EGG — folclor tico (se otorgan con award() desde game.js).
const FOLK = [
  A('tenebroso', '🌑', 'Sendero prohibido', 'Descubrí el mapa secreto yendo siempre por la izquierda.'),
  A('folk_f_segua', '🐴', 'Cara de calavera', 'Vencé a La Segua.'),
  A('folk_f_cadejos', '🐕', 'Perro del infierno', 'Vencé al Cadejos.'),
  A('folk_f_llorona', '😱', 'El llanto callado', 'Vencé a La Llorona.'),
  A('folk_f_tulevieja', '🦇', 'La que roba niños', 'Vencé a La Tulevieja.'),
  A('folk_f_padre', '⛪', 'Sin cabeza ni perdón', 'Vencé al Padre sin Cabeza.'),
  A('folk_f_carreta', '🛒', 'El presagio de la muerte', 'Vencé a La Carreta sin Bueyes.'),
  A('folk_all', '💀', 'Noche de espantos', 'Vencé a los 6 seres del folclor en una sola noche.'),
];

// ~100 logros por milestones (evaluados con evaluate()).
const MILES = [
  ...tiers('dx', '📖', 'dex', [[5, 'Aprendiz de guía'], [15, 'Explorador'], [20, 'Cuaderno lleno'], [30, 'Conocedor'], [40, 'Rastreador'], [60, 'Coleccionista'], [75, 'Maestro naturalista'], [90, 'Erudito'], [100, 'Centenario'], [110, 'Casi todo'], [130, 'Pura vida total']], (k) => `Registrá ${k} especies en la colección.`),
  ...tiers('rl', '🌿', 'released', [[1, 'Primera libertad'], [3, 'Brisa de vida'], [10, 'Defensor verde'], [20, 'Restaurador de ecos'], [30, 'Guardián del bosque'], [50, 'Pulmón del país'], [75, 'Madre naturaleza'], [100, 'Renacer total']], (k) => `Devolvé ${k} animales a la naturaleza (en total).`),
  ...tiers('bw', '⚔️', 'battlesWon', [[1, 'Primer combate'], [5, 'Curtido'], [10, 'Veterano'], [25, 'Imparable'], [50, 'Leyenda del refugio'], [100, 'Centurión'], [200, 'Invicto del monte'], [400, 'Eterno']], (k) => `Ganá ${k} combates (en total).`),
  ...tiers('ip', '💪', 'impecables', [[3, 'Sin un rasguño'], [5, 'Muralla'], [10, 'Intocable'], [25, 'Perfección'], [50, 'Dios del aguante']], (k) => `Ganá ${k} combates sin que caiga ningún animal.`),
  ...tiers('tf', '🚔', 'trafficker', [[3, 'Cazador de cazadores'], [5, 'Operativo limpio'], [10, 'Red desmantelada'], [25, 'Pesadilla del tráfico']], (k) => `Vencé a ${k} bandas de traficantes.`),
  ...tiers('zb', '👑', 'zoneboss', [[3, 'Domador veterano'], [5, 'Rey de las bestias'], [10, 'Titán entre titanes']], (k) => `Vencé a ${k} jefes de zona.`),
  ...tiers('pr', '🗺️', 'maxProv', [[2, 'Dos provincias'], [3, 'Media isla'], [4, 'Cruzando el país'], [5, 'Casi héroe'], [6, 'A un paso']], (k) => `Liberá ${k} provincias en una corrida.`),
  ...tiers('rn', '🎒', 'runs', [[3, 'Reincidente'], [5, 'Trotamundos'], [10, 'Andariego'], [25, 'Sin fin']], (k) => `Empezá ${k} travesías.`),
  ...tiers('lv', '⬆️', 'maxLevel', [[5, 'Creciendo'], [10, 'Fortalecido'], [15, 'Veterano de campo'], [20, 'Bestia poderosa'], [25, 'Coloso'], [30, 'Máximo poder']], (k) => `Llevá un animal a nivel ${k}.`),
  ...tiers('lg', '✦', 'legendaries', [[3, 'Cazaleyendas'], [5, 'Mito andante'], [9, 'Las nueve leyendas']], (k) => `Tené ${k} legendarios distintos en la colección.`),
  ...tiers('ab', '🌀', 'abilities', [[3, 'Trío de poderes'], [6, 'Todos los poderes']], (k) => `Tené animales con ${k} habilidades distintas.`),
  ...tiers('bb', '🌳', 'bio_bosque', [[5, 'Amigo del bosque'], [10, 'Guardián del bosque'], [15, 'Alma del bosque']], (k) => `Rescatá ${k} especies de bosque.`),
  ...tiers('ba', '🌊', 'bio_agua', [[5, 'Amigo del agua'], [10, 'Guardián del agua']], (k) => `Rescatá ${k} especies de agua.`),
  ...tiers('bm', '⛰️', 'bio_montana', [[5, 'Amigo de la montaña'], [10, 'Guardián de la montaña']], (k) => `Rescatá ${k} especies de montaña.`),
  ...tiers('bs', '🌾', 'bio_sabana', [[5, 'Amigo de la sabana'], [10, 'Guardián de la sabana']], (k) => `Rescatá ${k} especies de sabana.`),
  ...tiers('it', '🎒', 'items', [[1, 'Equipado'], [10, 'Buen equipo'], [25, 'Cargado'], [50, 'Arsenal tico']], (k) => `Equipá ${k} objetos (en total).`),
  ...tiers('fv', '🪤', 'furtivoWins', [[3, 'A pulso x3'], [7, 'Furtivo total']], (k) => `Liberá ${k} provincias en Modo Furtivo.`),
];

// específicos por especie (cond sobre el set de la colección)
const SPECIES = [
  ['jaguar', '🐆', 'El rey del bosque', 'Rescatá un jaguar.'],
  ['sapo_dorado', '🟡', 'De vuelta de la extinción', 'Rescatá al sapo dorado (extinto).'],
  ['quetzal', '🐦', 'Ave sagrada', 'Rescatá un quetzal.'],
  ['danta', '🐃', 'La gran herbívora', 'Rescatá una danta.'],
  ['manati', '🐋', 'Gigante gentil', 'Rescatá un manatí.'],
  ['tortuga_baula', '🐢', 'Tortuga gigante', 'Rescatá una tortuga baula.'],
  ['lapa', '🦜', 'Rojo escarlata', 'Rescatá una lapa roja.'],
  ['puma', '🐆', 'Sombra de montaña', 'Rescatá un puma.'],
  ['aguila_harpia', '🦅', 'Reina del cielo', 'Rescatá un águila harpía.'],
  ['tiburon_ballena', '🦈', 'El gigante manchado', 'Rescatá un tiburón ballena.'],
  ['quetzaldorado', '🌟', 'El dorado', 'Rescatá al Quetzal Dorado.'],
  ['coyote', '🐺', 'Aullido lejano', 'Rescatá un coyote.'],
  ['perezoso', '🦥', 'Sin apuro', 'Rescatá un perezoso.'],
  ['mariposa', '🦋', 'Azul imposible', 'Rescatá un morfo azul.'],
  ['tucan', '🦜', 'Pico de colores', 'Rescatá un tucán.'],
  ['rana_ojos_rojos', '🐸', 'Ojos de fuego', 'Rescatá una rana de ojos rojos.'],
  ['mono_titi', '🐒', 'El más pequeño', 'Rescatá un mono tití.'],
  ['oso_hormiguero', '🐜', 'Lengua larga', 'Rescatá un oso hormiguero.'],
].map(([k, e, n, d]) => A('sp_' + k, e, n, d, s => s.dexSet && s.dexSet.has(k)));

const MISC = [
  A('todo_bioma', '🌎', 'De todo un poco', 'Rescatá al menos una especie de cada bioma.',
    s => (s.bio_bosque || 0) >= 1 && (s.bio_agua || 0) >= 1 && (s.bio_montana || 0) >= 1 && (s.bio_sabana || 0) >= 1),
];

export const ACHIEVEMENTS = [...BASE, ...FOLK, ...MILES, ...SPECIES, ...MISC];
export const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));

export function getAch() { return load(ACH_KEY); }
// desbloquea un logro POR ID (hitos base/folclor); devuelve el logro si era nuevo
export function unlock(id) {
  const s = load(ACH_KEY);
  if (s.has(id) || !ACH_BY_ID[id]) return null;
  s.add(id); save(ACH_KEY, s);
  return ACH_BY_ID[id];
}
// evalúa TODOS los logros con cond(stats) y desbloquea los que se cumplan;
// devuelve la lista de los NUEVOS (para mostrar avisos).
export function evaluate(stats) {
  const have = load(ACH_KEY); const fresh = [];
  for (const a of ACHIEVEMENTS) {
    if (a.cond && !have.has(a.id)) {
      try { if (a.cond(stats)) { have.add(a.id); fresh.push(a); } } catch {}
    }
  }
  if (fresh.length) save(ACH_KEY, have);
  return fresh;
}
