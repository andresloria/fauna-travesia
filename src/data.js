// ============================================================
// data.js — CONTENIDO del juego (lo más fácil de tocar)
// Para balancear o agregar animales/países, editá este archivo.
// No hay lógica acá: solo datos.
// ============================================================

// Cada especie: nombre, emoji (respaldo), ataque/vida base (Nv1), bioma y efecto (ab).
// El arte real vive en assets/animales/<key>.svg (ver make_assets.py).
export const SP = {
  perezoso:{ n:'Perezoso',   e:'🦥', atk:1, hp:6, bio:'bosque',  ab:'heal' },
  tucan:   { n:'Tucán',      e:'🦜', atk:2, hp:3, bio:'bosque',  ab:'first' },
  ranadardo:{n:'Rana dardo', e:'🐸', atk:4, hp:1, bio:'bosque',  ab:'poison' },
  jaguar:  { n:'Jaguar',     e:'🐆', atk:5, hp:4, bio:'bosque',  ab:'rage' },
  mono:    { n:'Mono',       e:'🐒', atk:2, hp:3, bio:'bosque',  ab:'first' },
  tigre:   { n:'Tigre',      e:'🐅', atk:6, hp:5, bio:'bosque',  ab:'rage' },
  koala:   { n:'Koala',      e:'🐨', atk:1, hp:5, bio:'bosque',  ab:'shield' },
  pangolin:{ n:'Pangolín',   e:'🦔', atk:1, hp:5, bio:'bosque',  ab:'thorns' },

  leon:    { n:'León',       e:'🦁', atk:5, hp:5, bio:'sabana',  ab:'rage' },
  elefante:{ n:'Elefante',   e:'🐘', atk:3, hp:9, bio:'sabana',  ab:'shield' },
  jirafa:  { n:'Jirafa',     e:'🦒', atk:2, hp:7, bio:'sabana',  ab:'first' },
  guepardo:{ n:'Guepardo',   e:'🐆', atk:6, hp:2, bio:'sabana',  ab:'first' },
  cebra:   { n:'Cebra',      e:'🦓', atk:2, hp:5, bio:'sabana',  ab:'heal' },
  canguro: { n:'Canguro',    e:'🦘', atk:4, hp:4, bio:'sabana',  ab:'first' },
  emu:     { n:'Emú',        e:'🦤', atk:3, hp:3, bio:'sabana',  ab:'thorns' },
  cobra:   { n:'Cobra',      e:'🐍', atk:5, hp:2, bio:'sabana',  ab:'poison' },

  hipo:    { n:'Hipopótamo', e:'🦛', atk:4, hp:8, bio:'agua',    ab:'shield' },
  cocodrilo:{n:'Cocodrilo',  e:'🐊', atk:5, hp:6, bio:'agua',    ab:'first' },
  tiburon: { n:'Tiburón',    e:'🦈', atk:6, hp:4, bio:'agua',    ab:'rage' },
  pulpo:   { n:'Pulpo',      e:'🐙', atk:3, hp:4, bio:'agua',    ab:'poison' },
  orca:    { n:'Orca',       e:'🐋', atk:6, hp:6, bio:'agua',    ab:'rage' },
  delfin:  { n:'Delfín',     e:'🐬', atk:3, hp:3, bio:'agua',    ab:'first' },
  tortuga: { n:'Tortuga',    e:'🐢', atk:1, hp:8, bio:'agua',    ab:'shield' },
  anaconda:{ n:'Anaconda',   e:'🐍', atk:4, hp:5, bio:'agua',    ab:'poison' },
  capibara:{ n:'Capibara',   e:'🦫', atk:1, hp:6, bio:'agua',    ab:'heal' },
  pirana:  { n:'Piraña',     e:'🐟', atk:5, hp:1, bio:'agua',    ab:'rage' },

  oso:     { n:'Oso pardo',  e:'🐻', atk:5, hp:7, bio:'montana', ab:'rage' },
  alce:    { n:'Alce',       e:'🫎', atk:3, hp:8, bio:'montana', ab:'shield' },
  lobo:    { n:'Lobo',       e:'🐺', atk:4, hp:3, bio:'montana', ab:'first' },
  buho:    { n:'Búho',       e:'🦉', atk:3, hp:2, bio:'montana', ab:'first' },
  condor:  { n:'Cóndor',     e:'🦅', atk:4, hp:3, bio:'montana', ab:'first' },
  foca:    { n:'Foca',       e:'🦭', atk:3, hp:5, bio:'montana', ab:'heal' },

  // ── LEGENDARIOS ── no van en ningún pool; salen muy rara vez vía COUNTRIES[*].legend.
  // Stats superiores y `leg:true` para el marco prismático.
  pavoreal:   { n:'Pavo Real',      e:'🦚', atk:4, hp:7, bio:'sabana',  ab:'heal',   leg:true },
  rinoceronte:{ n:'Rinoceronte',    e:'🦏', atk:6, hp:9, bio:'sabana',  ab:'shield', leg:true },
  bisonte:    { n:'Bisonte',        e:'🦬', atk:6, hp:8, bio:'montana', ab:'rage',   leg:true },
  morfo:      { n:'Morfo Azul',     e:'🦋', atk:5, hp:4, bio:'bosque',  ab:'first',  leg:true },
  calamar:    { n:'Calamar Gigante',e:'🦑', atk:7, hp:6, bio:'agua',    ab:'poison', leg:true },
  llama:      { n:'Llama Dorada',   e:'🦙', atk:4, hp:8, bio:'montana', ab:'heal',   leg:true },
};

export const BIOMES = {
  bosque:  { n:'Bosque',  e:'🌳' },
  sabana:  { n:'Sabana',  e:'🌾' },
  agua:    { n:'Agua',    e:'🌊' },
  montana: { n:'Montaña', e:'⛰️' },
};

// Efectos roguelike. `sym` es el símbolo de la insignia; `cls` la clase de color.
// La LÓGICA de cada efecto vive en engine.js (fight). Acá solo el texto/estilo.
export const ABILITIES = {
  poison:{ n:'Veneno',       sym:'☣', cls:'poison', desc:'El enemigo del frente pierde 1 ❤ cada turno aunque no lo golpeen.' },
  shield:{ n:'Escudo',       sym:'🛡', cls:'shield', desc:'Aguanta el primer golpe que recibiría sin perder vida.' },
  heal:  { n:'Regenera',     sym:'✚', cls:'heal',   desc:'Si sobrevive el turno, recupera 1 ❤ al final.' },
  first: { n:'Primer golpe', sym:'⚡', cls:'first',  desc:'Ataca antes que el rival: puede tumbarlo sin recibir daño.' },
  rage:  { n:'Furia',        sym:'🔥', cls:'rage',   desc:'+2 ⚔ por cada compañero ya caído en este combate.' },
  thorns:{ n:'Púas',         sym:'🌵', cls:'thorns', desc:'Devuelve 1 de daño a quien lo ataque.' },
};

// Países. El ORDEN ya NO define dificultad: el juego sortea el destino y la
// dificultad sube por cuántos llevás cruzados (profundidad). `map` = slug de la
// silueta en assets/paises/; `ocean:true` = sin silueta (motivo de océano).
export const COUNTRIES = [
  { flag:'🇨🇷', n:'Costa Rica',  map:'costa-rica', legend:'morfo',       pool:['perezoso','tucan','ranadardo','jaguar','mono','hipo','cocodrilo'] },
  { flag:'🇰🇪', n:'Kenia',       map:'kenia',      legend:'rinoceronte', pool:['leon','elefante','jirafa','guepardo','cebra','hipo','cobra'] },
  { flag:'🇦🇺', n:'Australia',   map:'australia',  pool:['canguro','koala','cocodrilo','emu','tiburon','cobra'] },
  { flag:'🇨🇦', n:'Canadá',      map:'canada',     legend:'bisonte',     pool:['oso','alce','lobo','buho','foca'] },
  { flag:'🇧🇷', n:'Brasil',      map:'brasil',     pool:['anaconda','capibara','pirana','jaguar','tucan','mono'] },
  { flag:'🇮🇳', n:'India',       map:'india',      legend:'pavoreal',    pool:['tigre','elefante','cobra','pangolin','mono','condor'] },
  { flag:'🌊',  n:'Mar abierto', map:null, ocean:true, legend:'calamar', pool:['tiburon','pulpo','orca','delfin','tortuga','foca'] },
  { flag:'⛰️', n:'Los Andes',   map:'los-andes',  legend:'llama',       pool:['condor','oso','lobo','buho','alce','foca'] },
];

// Banderas para el avatar del jugador (identidad, sin efecto en el juego).
export const PLAYER_FLAGS = ['🇨🇷','🇲🇽','🇪🇸','🇦🇷','🇨🇴','🇧🇷','🇺🇸','🇨🇦','🇫🇷','🇩🇪','🇯🇵','🇬🇧'];

export const ITEMS = [
  { n:'Músculo',   e:'💪', atk:2, hp:0 },
  { n:'Carne',     e:'🥩', atk:0, hp:3 },
  { n:'Adrenalina',e:'⚡', atk:2, hp:1 },
  { n:'Caparazón', e:'🛡️', atk:0, hp:4 },
];

export const RULES = {
  MAX_TEAM: 5,
  MAX_HEARTS: 3,
  MAX_ITEMS: 3,        // objetos que se le pueden equipar a un animal
  STARTER_LEVEL: 2,    // nivel inicial de tu primer compañero
  EVO_LEVELS: [3, 6],  // niveles en los que un animal evoluciona (crece extra)
  LEG_CHANCE: 0.01,    // probabilidad de que un encuentro de bioma sea legendario (~1%)
};
