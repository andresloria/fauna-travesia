// ============================================================
// data.js — CONTENIDO del juego (lo más fácil de tocar).
// Guardianes de Costa Rica: fauna 100% tica, recorrés las 7 provincias
// rescatando y rehabilitando animales, peleás contra furtivos y los liberás.
// No hay lógica acá: solo datos.
// ============================================================

// Cada especie: nombre, emoji (respaldo), ataque/vida base, VELOCIDAD (spd, decide
// quién pega primero), bioma y efecto (ab). Arte real en assets/animales/<key>.svg.
export const SP = {
  // ── BOSQUE / selva húmeda ──
  perezoso:  { n:'Perezoso',     e:'🦥', atk:1, hp:7, spd:1, bio:'bosque',  ab:'heal' },
  monocara:  { n:'Mono carablanca', e:'🐒', atk:2, hp:3, spd:8, bio:'bosque', ab:'first' },
  tucan:     { n:'Tucán',        e:'🦜', atk:2, hp:3, spd:8, bio:'bosque',  ab:'first' },
  ranadardo: { n:'Rana dardo',   e:'🐸', atk:4, hp:1, spd:4, bio:'bosque',  ab:'poison' },
  serpiente: { n:'Terciopelo',   e:'🐍', atk:5, hp:2, spd:6, bio:'bosque',  ab:'poison' },
  jaguar:    { n:'Jaguar',       e:'🐆', atk:5, hp:4, spd:7, bio:'bosque',  ab:'rage' },
  manigordo: { n:'Manigordo',    e:'🐈', atk:3, hp:3, spd:8, bio:'bosque',  ab:'first' },
  pizote:    { n:'Pizote',       e:'🦝', atk:3, hp:4, spd:5, bio:'bosque',  ab:'first' },
  murcielago:{ n:'Murciélago',   e:'🦇', atk:3, hp:2, spd:8, bio:'bosque',  ab:'poison' },
  mariposa:  { n:'Morfo azul',   e:'🦋', atk:2, hp:2, spd:7, bio:'bosque',  ab:'first' },
  abeja:     { n:'Abeja',        e:'🐝', atk:3, hp:1, spd:7, bio:'bosque',  ab:'poison' },

  // ── MONTAÑA / bosque nuboso ──
  quetzal:   { n:'Quetzal',      e:'🐦', atk:2, hp:4, spd:7, bio:'montana', ab:'heal' },
  puma:      { n:'Puma',         e:'🐆', atk:5, hp:5, spd:7, bio:'montana', ab:'rage' },
  coyote:    { n:'Coyote',       e:'🐺', atk:4, hp:3, spd:7, bio:'montana', ab:'first' },

  // ── SABANA / bosque seco (Guanacaste) ──
  venado:    { n:'Venado',       e:'🦌', atk:2, hp:6, spd:7, bio:'sabana',  ab:'shield' },
  saino:     { n:'Saíno',        e:'🐗', atk:4, hp:5, spd:4, bio:'sabana',  ab:'rage' },
  iguana:    { n:'Iguana',       e:'🦎', atk:2, hp:5, spd:4, bio:'sabana',  ab:'thorns' },
  garza:     { n:'Garza',        e:'🐦', atk:2, hp:3, spd:6, bio:'sabana',  ab:'first' },

  // ── AGUA / costas y ríos ──
  cocodrilo: { n:'Cocodrilo',    e:'🐊', atk:5, hp:6, spd:3, bio:'agua',    ab:'first' },
  tortuga:   { n:'Tortuga marina', e:'🐢', atk:1, hp:8, spd:1, bio:'agua',  ab:'shield' },
  ballena:   { n:'Ballena jorobada', e:'🐋', atk:6, hp:8, spd:3, bio:'agua', ab:'rage' },
  delfin:    { n:'Delfín',       e:'🐬', atk:3, hp:3, spd:8, bio:'agua',    ab:'first' },
  tiburon:   { n:'Tiburón',      e:'🦈', atk:6, hp:4, spd:6, bio:'agua',    ab:'rage' },
  cangrejo:  { n:'Cangrejo',     e:'🦀', atk:2, hp:5, spd:3, bio:'agua',    ab:'thorns' },
  basilisco: { n:'Basilisco',    e:'🦎', atk:3, hp:3, spd:8, bio:'agua',    ab:'first' },

  // ── LEGENDARIOS ── rarísimos, no van en ningún pool; salen vía .legend.
  lapa:         { n:'Lapa roja',     e:'🦜', atk:5, hp:6, spd:6, bio:'bosque',  ab:'rage', leg:true },
  quetzaldorado:{ n:'Quetzal Dorado', e:'🐦', atk:4, hp:9, spd:8, bio:'montana', ab:'heal', leg:true },
};

export const BIOMES = {
  bosque:  { n:'Bosque',  e:'🌳' },
  sabana:  { n:'Sabana',  e:'🌾' },
  agua:    { n:'Agua',    e:'🌊' },
  montana: { n:'Montaña', e:'⛰️' },
};

// Efectos roguelike. `sym` es el símbolo de la insignia; `cls` la clase de color.
export const ABILITIES = {
  poison:{ n:'Veneno',       sym:'☣', cls:'poison', desc:'El enemigo del frente pierde 1 ❤ cada turno aunque no lo golpeen.' },
  shield:{ n:'Escudo',       sym:'🛡', cls:'shield', desc:'Aguanta el primer golpe que recibiría sin perder vida.' },
  heal:  { n:'Regenera',     sym:'✚', cls:'heal',   desc:'Si sobrevive el turno, recupera 1 ❤ al final.' },
  first: { n:'Primer golpe', sym:'⚡', cls:'first',  desc:'Siempre ataca primero, sin importar la velocidad: puede tumbar al rival sin recibir daño.' },
  rage:  { n:'Furia',        sym:'🔥', cls:'rage',   desc:'+2 ⚔ por cada compañero ya caído en este combate.' },
  thorns:{ n:'Púas',         sym:'🌵', cls:'thorns', desc:'Devuelve 1 de daño a quien lo ataque.' },
};

// Las 7 PROVINCIAS de Costa Rica (se recorren todas en una run). El orden lo
// sortea el juego; la dificultad sube por cuántas llevás. `map` = silueta de CR.
export const COUNTRIES = [
  { flag:'🏙️', n:'San José',   map:'costa-rica', pool:['monocara','tucan','perezoso','manigordo','murcielago','mariposa','coyote'] },
  { flag:'🌋', n:'Alajuela',   map:'costa-rica', pool:['perezoso','ranadardo','jaguar','tucan','serpiente','cocodrilo','mariposa'] },
  { flag:'⛰️', n:'Cartago',    map:'costa-rica', pool:['quetzal','puma','venado','coyote','murcielago'] },
  { flag:'🌿', n:'Heredia',    map:'costa-rica', pool:['quetzal','monocara','perezoso','tucan','pizote','mariposa'] },
  { flag:'🌾', n:'Guanacaste', map:'costa-rica', legend:'lapa', pool:['saino','iguana','venado','garza','jaguar','cocodrilo','serpiente'] },
  { flag:'🌊', n:'Puntarenas', map:'costa-rica', legend:'lapa', pool:['cocodrilo','tortuga','ballena','delfin','tiburon','jaguar','basilisco'] },
  { flag:'🏝️', n:'Limón',      map:'costa-rica', pool:['perezoso','monocara','ranadardo','tortuga','cocodrilo','pizote','serpiente','cangrejo'] },
];

// FINAL — el bosque nuboso de Monteverde. Se abre al recorrer las 7 provincias.
// Aquí vive el Quetzal Dorado y el cabecilla de los furtivos. Vencerlo = ganar.
export const SECRET = {
  flag:'☁️', n:'Monteverde', map:'costa-rica', secret:true, legend:'quetzaldorado',
  pool:['quetzal','puma','venado','coyote','monocara','mariposa'],
};

export const ITEMS = [
  { n:'Hoja medicinal', e:'🌿', atk:0, hp:3 },
  { n:'Fruta madura',   e:'🍌', atk:2, hp:1 },
  { n:'Vendaje',        e:'🩹', atk:0, hp:4 },
  { n:'Néctar',         e:'🍯', atk:2, hp:0 },
];

// Objetos RAROS — recompensa por vencer a traficantes/cazadores.
export const RARE_ITEMS = [
  { n:'Collar GPS',      e:'📡', atk:4, hp:2 },
  { n:'Suero vital',     e:'💉', atk:2, hp:6 },
  { n:'Amuleto boruca',  e:'🪆', atk:3, hp:4 },
  { n:'Piedra esfera',   e:'🪨', atk:2, hp:5 },
];

// Banderas para el avatar del jugador (identidad, sin efecto en el juego).
export const PLAYER_FLAGS = ['🇨🇷','🇲🇽','🇪🇸','🇦🇷','🇨🇴','🇧🇷','🇺🇸','🇨🇦','🇫🇷','🇩🇪','🇯🇵','🇬🇧'];

export const RULES = {
  MAX_TEAM: 5,
  MAX_HEARTS: 3,
  MAX_ITEMS: 3,        // objetos que se le pueden equipar a un animal
  STARTER_LEVEL: 2,    // nivel inicial de tu primer rescatado
  EVO_LEVELS: [3, 6],  // niveles en los que un animal se RECUPERA (etapa de rehabilitación)
  LEG_CHANCE: 0.02,    // probabilidad de toparte un animal legendario (~2%)
  RUN_LENGTH: 7,       // provincias a recorrer antes de Monteverde (el final)
  PLENO_EVO: 2,        // etapa de rehabilitación a la que se considera "pleno" (listo para liberar)
};
