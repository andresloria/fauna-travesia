// ============================================================
// meta.js — META-PROGRESO que persiste ENTRE partidas (localStorage):
//   - Colección ("dex"): especies que alguna vez rescataste.
//   - Logros: hitos desbloqueados.
// Es puro estado guardado; game.js lo alimenta y ui.js lo muestra.
// ============================================================

const DEX_KEY = 'fauna_dex';
const ACH_KEY = 'fauna_logros';

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

// ---------- Logros ----------
export const ACHIEVEMENTS = [
  { id: 'prim_rescate', e: '🩹', n: 'Primer rescate',     d: 'Rescatá tu primer animal.' },
  { id: 'refugio',      e: '🏕️', n: 'Refugio lleno',       d: 'Tené 5 animales en tu refugio.' },
  { id: 'dex10',        e: '📖', n: 'Naturalista',         d: 'Registrá 10 especies en la colección.' },
  { id: 'dex25',        e: '📚', n: 'Biólogo de campo',    d: 'Registrá 25 especies.' },
  { id: 'dex50',        e: '🔬', n: 'Experto en fauna',    d: 'Registrá 50 especies.' },
  { id: 'legendario',   e: '✦',  n: 'Leyenda viva',        d: 'Rescatá un animal legendario.' },
  { id: 'prov1',        e: '🛡️', n: 'Guardaparques',       d: 'Liberá tu primera provincia.' },
  { id: 'traficantes',  e: '🚔', n: 'Anti-tráfico',        d: 'Vencé a una banda de traficantes.' },
  { id: 'conserva5',    e: '🌿', n: 'Conservacionista',    d: 'Devolvé 5 animales a la naturaleza.' },
  { id: 'conserva15',   e: '🌳', n: 'Restaurador',         d: 'Devolvé 15 animales a la naturaleza.' },
  { id: 'impecable',    e: '💪', n: 'Impecable',           d: 'Ganá un combate sin que caiga ningún animal tuyo.' },
  { id: 'furtivo',      e: '💀', n: 'A puro pulso',        d: 'Liberá una provincia en Modo Furtivo.' },
  { id: 'prov7',        e: '🇨🇷', n: 'Héroe nacional',      d: 'Liberá las 7 provincias.' },
  { id: 'cabecilla',    e: '👑', n: 'El Cabecilla cae',    d: 'Vencé al jefe final en Monteverde.' },
];
export const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));

export function getAch() { return load(ACH_KEY); }
// desbloquea un logro; devuelve el logro si era nuevo (para mostrar aviso), o null
export function unlock(id) {
  const s = load(ACH_KEY);
  if (s.has(id) || !ACH_BY_ID[id]) return null;
  s.add(id); save(ACH_KEY, s);
  return ACH_BY_ID[id];
}
