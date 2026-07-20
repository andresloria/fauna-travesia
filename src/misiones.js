// ============================================================
// misiones.js — DESBLOQUEO de animales por misiones (ver ARENA.md).
// Copiado del sistema del juego original: misiones por RANGO (D→S), y la mayoría
// piden RACHAS ("ganá N seguidos con X en el equipo"). La racha es lo que obliga
// a armar estrategia: no alcanza con grindear, hay que ganar sin fallar.
//
// Ejemplos reales del original que sirvieron de molde:
//   "Win Four Battles In A Row With Neji"
//   "Win 5 Battles In A Row With Shikamaru Or Temari In Your Team"
//   "Win 5 Battles In A Row With At Least One Member Of The Sound Genin"
//   "Win 15 Battles With Naruto, Sasuke, Or Sakura In Your Team"
//   "Defeat the Sand Siblings with Hinata / Shino / Kiba on your team"
// ============================================================

// ---------- RANGOS: qué tan difícil es ver al animal ----------
export const RANGOS = {
  D: { n:'Rango D', desc:'Fauna que se ve seguido',        rareza:'comun',      color:'#6f6552' },
  C: { n:'Rango C', desc:'Cuesta un poco más',             rareza:'raro',       color:'#2f6f8f' },
  B: { n:'Rango B', desc:'Poca gente los ve',              rareza:'ultrararo',  color:'#6b3f9e' },
  A: { n:'Rango A', desc:'Encuentro de toda una vida',     rareza:'legendario', color:'#a8791a' },
  S: { n:'Rango S', desc:'Ya no deberían existir',         rareza:'extinto',    color:'#a8442a' },
};
// La rareza del animal define su rango automáticamente.
export const rangoDe = (rareza) =>
  ({ comun:'D', raro:'C', ultrararo:'B', legendario:'A', extinto:'S', mitico:'S' })[rareza] || 'D';

// ---------- TIPOS DE OBJETIVO ----------
// racha      : ganar N combates SEGUIDOS (se reinicia al perder)  ← el del original
// total      : ganar N combates (acumulado, no se pierde)
// conEquipo  : la condición exige tener a X (o a alguno de X) en el equipo
// bioma      : el equipo entero debe ser de ese bioma
// sinCaidos  : ganar sin que caiga ninguno de los tuyos
// liberar    : liberar N animales PLENOS (conservación)
// rescatar   : rescatar N especies distintas de un bioma
// vencer     : derrotar a un cabecilla concreto
// sinEsquiva : ganar sin usar la Esquiva ni una vez
// soloClase  : ganar usando solo habilidades de cierta clase (toxina, instinto…)

export const MISIONES = {
  // ===================== RANGO D =====================
  perezoso: { rango:'D', n:'Con calma se llega',
    desc:'Ganá 3 combates seguidos con la Tortuga o el Perezoso en el equipo.',
    obj:{ tipo:'racha', n:3, conEquipo:['tortuga','perezoso'] } },

  iguana: { rango:'D', n:'Tomar el sol',
    desc:'Ganá 4 combates con un equipo entero de sabana.',
    obj:{ tipo:'total', n:4, bioma:'sabana' } },

  abeja: { rango:'D', n:'Polinizadora',
    desc:'Curá 200 de vida en total a tus aliados.',
    obj:{ tipo:'curado', n:200 } },

  murcielago: { rango:'D', n:'Guardián de la noche',
    desc:'Robá 10 energías al enemigo.',
    obj:{ tipo:'robado', n:10 } },

  // ===================== RANGO C =====================
  venado: { rango:'C', n:'Símbolo nacional',
    desc:'Ganá 4 combates seguidos sin que caiga ninguno de tus animales.',
    obj:{ tipo:'racha', n:4, sinCaidos:true } },

  serpiente: { rango:'D', n:'Respeto al terciopelo',
    desc:'Ganá 3 combates seguidos con al menos un animal venenoso en el equipo.',
    obj:{ tipo:'racha', n:3, conClase:'toxina' } },

  puercoespin: { rango:'C', n:'No me toqués',
    desc:'Devolvé 150 de daño con contraataques.',
    obj:{ tipo:'contraatacado', n:150 } },

  rana_ojos_rojos: { rango:'D', n:'La cara de Costa Rica',
    desc:'Rescatá 4 especies distintas de bosque.',
    obj:{ tipo:'rescatar', n:4, bioma:'bosque' } },

  // ===================== RANGO B =====================
  cocodrilo: { rango:'B', n:'El del Tárcoles',
    desc:'Ganá 5 combates seguidos con un equipo entero de agua.',
    obj:{ tipo:'racha', n:5, bioma:'agua' } },

  ranadardo: { rango:'D', n:'Veneno de la hojarasca',
    desc:'Ganá 3 combates seguidos usando SOLO habilidades de toxina.',
    obj:{ tipo:'racha', n:3, soloClase:'toxina' } },

  manigordo: { rango:'B', n:'Manos grandes',
    desc:'Vencé a 3 cabecillas distintos sin usar la Esquiva.',
    obj:{ tipo:'vencer', n:3, sinEsquiva:true } },

  // ===================== RANGO A =====================
  jaguar: { rango:'A', n:'El dueño del monte',
    desc:'Ganá 6 combates seguidos con un equipo de puro bosque.',
    obj:{ tipo:'racha', n:6, bioma:'bosque' } },

  quetzal: { rango:'A', n:'El ave sagrada',
    desc:'Liberá 10 animales PLENOS a la naturaleza.',
    obj:{ tipo:'liberar', n:10 } },

  puma: { rango:'A', n:'Cazador solitario',
    desc:'Ganá 5 combates seguidos quedándote con UN solo animal en pie.',
    obj:{ tipo:'racha', n:5, soloUnoVivo:true } },

  danta: { rango:'A', n:'El jardinero del bosque',
    desc:'Rescatá 25 especies distintas.',
    obj:{ tipo:'rescatar', n:25 } },

  tortuga_baula: { rango:'C', n:'La que cruza océanos',
    desc:'Rescatá 6 especies distintas de agua y liberá 3 plenas.',
    obj:{ tipo:'rescatar', n:6, bioma:'agua', y:{ tipo:'liberar', n:3 } } },

  aguila_harpia: { rango:'A', n:'Garras del dosel',
    desc:'Ganá 5 combates seguidos derrotando al enemigo más fuerte primero.',
    obj:{ tipo:'racha', n:5, primeroElFuerte:true } },

  // ===================== RANGO S =====================
  sapo_dorado: { rango:'S', n:'Lo que ya no está',
    desc:'Completá la Colección de Monteverde: rescatá 12 especies de montaña ' +
         'y ganá el juego sin perder un solo animal.',
    obj:{ tipo:'rescatar', n:12, bioma:'montana', y:{ tipo:'ganarJuego', sinPerder:true } } },

  quetzaldorado: { rango:'A', n:'La leyenda dorada',
    desc:'Ganá el juego con el Quetzal en el equipo, sin usar la Esquiva.',
    obj:{ tipo:'ganarJuego', conEquipo:['quetzal'], sinEsquiva:true } },

  // --- las leyendas del Tenebroso: se ganan venciéndolas ---
  f_carreta:   { rango:'S', n:'La carreta sin bueyes', desc:'Vencé a la Carreta en el mapa Tenebroso.', obj:{ tipo:'vencerFolk', key:'f_carreta' } },
  f_segua:     { rango:'S', n:'La Segua',              desc:'Vencé a la Segua en el mapa Tenebroso.',   obj:{ tipo:'vencerFolk', key:'f_segua' } },
  f_cadejos:   { rango:'S', n:'El Cadejos',            desc:'Vencé al Cadejos en el mapa Tenebroso.',   obj:{ tipo:'vencerFolk', key:'f_cadejos' } },
  f_tulevieja: { rango:'S', n:'La Tulevieja',          desc:'Vencé a la Tulevieja en el mapa Tenebroso.',obj:{ tipo:'vencerFolk', key:'f_tulevieja' } },
  f_padre:     { rango:'S', n:'El Padre sin Cabeza',   desc:'Vencé al Padre en el mapa Tenebroso.',     obj:{ tipo:'vencerFolk', key:'f_padre' } },
  f_llorona:   { rango:'S', n:'La Llorona',            desc:'Vencé a la Llorona: cerrá la noche.',      obj:{ tipo:'vencerFolk', key:'f_llorona' } },
};

// ---------- utilidades ----------
export const misionDe   = (key) => MISIONES[key] || null;
export const tieneMision= (key) => !!MISIONES[key];
export function porRango() {
  const o = { D:[], C:[], B:[], A:[], S:[] };
  for (const [k, m] of Object.entries(MISIONES)) (o[m.rango] || o.D).push({ key:k, ...m });
  return o;
}
// ¿está desbloqueado? (el progreso vive en meta.js / localStorage)
export const estaDesbloqueado = (key, desbloqueados) =>
  !MISIONES[key] || (desbloqueados && desbloqueados.has(key));
