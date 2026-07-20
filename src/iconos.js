// ============================================================
// iconos.js — qué DIBUJO le toca a cada habilidad.
// Los iconos son pixel art 16×16 (exportados a 64px) generados por
// make_iconos_hab.py → assets/iconos/<nombre>.png
//
// La elección va en dos pasos:
//   1. Por EFECTO (veneno, escudo, curar, robar, aturdir, área…): así el
//      jugador aprende "el escudo azul = defensa" sin leer.
//   2. Si es daño directo simple, por la FORMA del ataque: garra, colmillo,
//      pico, ala, cola, tenaza o lengua — según el nombre de la habilidad y,
//      si no alcanza, según qué clase de animal es.
// ============================================================

import { SP } from './fauna_roster.js';

export const ICONO_URL = (nombre) => `assets/iconos/${nombre}.png`;

// ---------- por palabra del nombre (lo más específico) ----------
const POR_NOMBRE = [
  [/zarpazo|zarpa|garra|rasgu|manotazo|arañ/i, 'garra'],
  [/mordida|morder|dentellada|tarascada|colmill|craneo|cráneo/i, 'colmillo'],
  [/pico|picotazo|picada/i, 'pico'],
  [/ala|aletazo|aleteo|vuelo|alza/i, 'ala'],
  [/cola|coletazo/i, 'cola'],
  [/tenaza|pinza|aguij/i, 'tenaza'],
  // ojo: "salto" NO va acá — el Puma tiene "Salto de caza" y le tocaba lengua
  // de rana. Sin regla, cae en porAnimal(): la rana → lengua, el puma → garra.
  [/lengua|lengüetazo/i, 'lengua'],
  [/embestida|carga|cornada|empuje|golpe|impacto|cabezazo/i, 'impacto'],
];

// ---------- por tipo de animal (cuando el nombre no dice nada) ----------
const POR_BIOMA = { agua: 'tenaza', sabana: 'impacto', montana: 'garra', bosque: 'garra' };
const esAve = (key) => /ave|pajaro|tucan|lapa|lora|loro|colibri|garza|aguila|zopilote|halcon|buho|lechuza|quetzal|carpintero|jacamar|momoto|tangara|trogon|oropendola|saltarin|tinamu|chachalaca|caracara|espatula|ibis|jabiru|fragata|pelicano|anhinga|cusingo|tantalo|yiguirro|bienteveo|comemaiz|martin|golondrina/i.test(key);
const esRept = (key) => /serpiente|boa|coral|cascabel|terciopelo|bocaraca|bejuquilla|mica|matabuey|iguana|garrobo|basilisco|anolis|geco|salamanqueja|cocodrilo|caiman|tortuga|jicotea|lagarto/i.test(key);
const esAnfi = (key) => /rana|sapo|salamandra/i.test(key);
const esMar  = (key) => /cangrejo|tenaza|abeja|hormiga|escarabajo|mariposa|tarantula|araña|calamar|medusa|coral/i.test(key);

function porAnimal(key) {
  if (esAve(key)) return 'pico';
  if (esAnfi(key)) return 'lengua';
  if (esMar(key)) return 'tenaza';
  if (esRept(key)) return 'colmillo';
  const bio = SP[key]?.bio;
  return POR_BIOMA[bio] || 'garra';
}

// ---------- elección final ----------
export function iconoDe(h, key) {
  if (!h) return 'impacto';
  if (h.esEsquiva || /esquivar/i.test(h.n || '')) return 'esquiva';

  const efs = h.efectos || [];
  const tipos = efs.map(f => f.t);
  const tiene = (t) => tipos.includes(t);
  const dano = efs.find(f => f.t === 'dano');

  // 1) efectos que mandan sobre el daño
  if (tiene('modo')) return 'modo';
  if (tiene('marcaPermanente')) return 'marca';
  if (tiene('robarEnergia')) return 'robar';
  if (tiene('quemarEnergia')) return 'quemar';
  if (tiene('contraataque')) return 'contra';
  if (tiene('exponer')) return 'exponer';
  if (tiene('aturdir')) return 'aturdir';
  if (tiene('curarTurnos')) return 'curar_turnos';
  if (tiene('curar')) return 'curar';
  if (tiene('defensa')) return 'escudo';
  if (tiene('invulnerable') && !dano) return 'invulnerable';
  if (tiene('reducir')) return 'reducir';
  if (tiene('danoTurnos') || (dano && dano.toxina)) return 'veneno';

  // 2) daño directo
  if (dano) {
    if (dano.v >= 100) return 'definitiva';
    if (dano.obj === 'todos') return 'area';
  }
  if (tiene('invulnerable')) return 'invulnerable';

  // 3) la forma del ataque: primero el nombre, después el animal
  const nombre = h.n || '';
  for (const [re, ico] of POR_NOMBRE) if (re.test(nombre)) return ico;
  return porAnimal(key || '');
}

// <img> listo para meter en el HTML
export const iconoIMG = (h, key, clase = '') =>
  `<img class="ico-hab ${clase}" src="${ICONO_URL(iconoDe(h, key))}" alt="" draggable="false">`;
