// ============================================================
// movesets_gen.js — GENERADO por make_movesets.py. NO editar a mano.
// Kits ARENA para los animales SIN kit propio en habilidades.js.
// Numeros del estudio de Naruto-Arena (tools/na_personajes.json, ARENA.md §2b).
// Vida 100 para todos; la rareza sube la complejidad del kit, no los numeros.
// SIN NIVELES y SIN PASIVAS: las 3 habilidades estan disponibles desde el
// principio; lo unico que limita es el COSTO EN ENERGIA DE BIOMA.
// Re-generar: python make_movesets.py --aplicar
// ============================================================

export const MOVESETS_GEN = {
  perezoso_dos: {
    habs:[
      { n:'Atrapar', desc:'Aturde sus habilidades fisicas 2 turnos.', costo:['bosque', 'comodin'], recarga:2, clases:['natural', 'rango', 'control'], efectos:[{ t:'aturdir', turnos:2, obj:'enemigo', clase:'fisico' }] },
      { n:'Dentellada', desc:'GRATIS: gana 20 de defensa destructible.', costo:[], recarga:2, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:20, obj:'self' }] },
      { n:'Piel de piedra', desc:'PERMANENTE: 40 de defensa destructible; se reaplica sola.', costo:['comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  mono_congo: {
    habs:[
      { n:'Embestida', desc:'30 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Arremetida', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['bosque', 'montana'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  monocara: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Golpe de gracia', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  mono_arana: {
    habs:[
      { n:'Mordisco', desc:'20 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Coro del monte', desc:'15 de dano a TODOS y tu equipo gana 10 de defensa destructible.', costo:['montana', 'comodin'], recarga:0, clases:['natural', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'defensa', v:10, obj:'equipo' }] },
      { n:'Savia nueva', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  mono_titi: {
    habs:[
      { n:'Garra rapida', desc:'25 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Torbellino', desc:'Invulnerable 1 turno Y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
      { n:'Zarpazo doble', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'sabana'], recarga:1, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  manigordo: {
    habs:[
      { n:'Tarascada', desc:'25 de dano; ademas recibe 10 menos de dano 1 turno.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }, { t:'reducir', v:10, turnos:1, obj:'self' }] },
      { n:'Carga de peso', desc:'35 de dano a TODOS los enemigos.', costo:['bosque', 'comodin', 'comodin'], recarga:2, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:35, obj:'todos' }] },
      { n:'Cortina de polvo', desc:'TODO tu equipo se vuelve invulnerable 1 turno.', costo:['bosque', 'bosque'], recarga:5, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'equipo' }] },
    ],
  },
  caucel: {
    habs:[
      { n:'Mordida', desc:'30 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Bramido', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['bosque', 'montana'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Rastrear', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  leon_brenero: {
    habs:[
      { n:'Zarpazo', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Golpe de lomo', desc:'30 de dano que atraviesa la defensa destructible.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  tigrillo: {
    habs:[
      { n:'Dentellada', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Carga de peso', desc:'30 de dano que atraviesa la defensa destructible.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Sangre en el aire', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  danta: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Mordisco', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { n:'Ponerse tieso', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['comodin'], recarga:2, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Andanada', desc:'45 de dano a TODOS los enemigos.', costo:['bosque', 'comodin', 'comodin'], recarga:3, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'todos' }] },
    ],
  },
  saino: {
    habs:[
      { n:'Manotazo', desc:'10 de dano por turno durante 3 turnos.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { n:'Garra desgarradora', desc:'30 de dano a un enemigo.', costo:['sabana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Ultimo aliento', desc:'45 de dano. Ignora la defensa destructible.', costo:['sabana', 'comodin'], recarga:3, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'enemigo', ignoraDefensa:true }] },
    ],
  },
  chancho_monte: {
    habs:[
      { n:'Garra rapida', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Mordida al hueso', desc:'30 de dano que atraviesa la defensa destructible.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Modo cazador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  cabro_monte: {
    habs:[
      { n:'Manotazo', desc:'10 de dano por turno durante 3 turnos.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { n:'Garra desgarradora', desc:'30 de dano a un enemigo.', costo:['montana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Loto abierto', desc:'45 de dano. Ignora la defensa destructible.', costo:['montana', 'comodin'], recarga:3, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'enemigo', ignoraDefensa:true }] },
    ],
  },
  pizote: {
    habs:[
      { n:'Tarascada', desc:'15 de dano que atraviesa la defensa destructible.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado y le quita los efectos daninos.', costo:['sabana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
      { n:'Madriguera', desc:'Un aliado se cura 10 por turno durante 3 turnos.', costo:['comodin', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }] },
    ],
  },
  mapache: {
    habs:[
      { n:'Tarascada', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Rafaga', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  mapache_cangrejero: {
    habs:[
      { n:'Empujon', desc:'20 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Rafaga', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  martilla: {
    habs:[
      { n:'Embestida', desc:'20 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Canto del bosque', desc:'15 de dano a TODOS y tu equipo gana 10 de defensa destructible.', costo:['sabana', 'comodin'], recarga:0, clases:['natural', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'defensa', v:10, obj:'equipo' }] },
      { n:'Aliento vital', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  olingo: {
    habs:[
      { n:'Embestida', desc:'10 de dano por turno durante 3 turnos.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { n:'Zarpazo doble', desc:'30 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Arremetida final', desc:'45 de dano. Ignora la defensa destructible.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'enemigo', ignoraDefensa:true }] },
    ],
  },
  tolomuco: {
    habs:[
      { n:'Manotazo', desc:'30 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Tromba', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['bosque', 'agua'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Rastrear', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  grison: {
    habs:[
      { n:'Mordida', desc:'30 de dano. Durante su modo pega +15.', costo:['sabana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Mordida al hueso', desc:'30 de dano que atraviesa la defensa destructible.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  nutria: {
    habs:[
      { n:'Golpe de hocico', desc:'25 de dano; ademas recibe 10 menos de dano 1 turno.', costo:['agua'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }, { t:'reducir', v:10, turnos:1, obj:'self' }] },
      { n:'Golpe de lomo', desc:'35 de dano a TODOS los enemigos.', costo:['agua', 'comodin', 'comodin'], recarga:2, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:35, obj:'todos' }] },
      { n:'Refugio del viento', desc:'TODO tu equipo se vuelve invulnerable 1 turno.', costo:['agua', 'agua'], recarga:5, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'equipo' }] },
    ],
  },
  comadreja: {
    habs:[
      { n:'Garra rapida', desc:'15 de dano que atraviesa la defensa destructible.', costo:['montana'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado y le quita los efectos daninos.', costo:['agua'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
      { n:'Madriguera', desc:'Un aliado se cura 10 por turno durante 3 turnos.', costo:['comodin', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }] },
    ],
  },
  zorro_pelon: {
    habs:[
      { n:'Manotazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cercar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Rafaga', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  oso_hormiguero: {
    habs:[
      { n:'Dentellada', desc:'30 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Bramido', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['bosque', 'montana'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  serafin: {
    habs:[
      { n:'Empujon', desc:'25 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno Y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
      { n:'Garra desgarradora', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'sabana'], recarga:1, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  armadillo: {
    habs:[
      { n:'Tarascada', desc:'20 de dano a un enemigo.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hacerse bola', desc:'Invulnerable 2 turnos mientras hace 10 de dano por turno.', costo:['agua'], recarga:2, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'invulnerable', turnos:2, obj:'self' }, { t:'danoTurnos', v:10, turnos:2, obj:'enemigo' }] },
      { n:'Cerrar filas', desc:'Todo tu equipo recibe 10 menos de dano durante 3 turnos.', costo:['comodin'], recarga:3, clases:['instinto', 'unico', 'sostenido'], efectos:[{ t:'reducir', v:10, turnos:3, obj:'equipo' }] },
    ],
  },
  tepezcuintle: {
    habs:[
      { n:'Trabar', desc:'Aturde sus habilidades fisicas 2 turnos.', costo:['bosque', 'comodin'], recarga:2, clases:['natural', 'rango', 'control'], efectos:[{ t:'aturdir', turnos:2, obj:'enemigo', clase:'fisico' }] },
      { n:'Mordida', desc:'GRATIS: gana 20 de defensa destructible.', costo:[], recarga:2, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:20, obj:'self' }] },
      { n:'Coraza ancestral', desc:'PERMANENTE: 40 de defensa destructible; se reaplica sola.', costo:['comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  guatusa: {
    habs:[
      { n:'Mordisco', desc:'20 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Brote', desc:'15 de dano a TODOS y tu equipo gana 10 de defensa destructible.', costo:['agua', 'comodin'], recarga:0, clases:['natural', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'defensa', v:10, obj:'equipo' }] },
      { n:'Savia nueva', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  ardilla: {
    habs:[
      { n:'Mordisco', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cercar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Golpe de gracia', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  coyote: {
    habs:[
      { n:'Tarascada', desc:'30 de dano. Durante su modo pega +15.', costo:['montana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Tarascada feroz', desc:'30 de dano que atraviesa la defensa destructible.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  zorro_gris: {
    habs:[
      { n:'Empujon', desc:'20 de dano a un enemigo.', costo:['sabana'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cercar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Rafaga', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  manati: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Atrapar', desc:'Aturde sus habilidades fisicas 2 turnos.', costo:['agua', 'comodin'], recarga:2, clases:['natural', 'rango', 'control'], efectos:[{ t:'aturdir', turnos:2, obj:'enemigo', clase:'fisico' }] },
      { n:'Zarpazo', desc:'GRATIS: gana 20 de defensa destructible.', costo:[], recarga:2, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:20, obj:'self' }] },
      { n:'Caparazon eterno', desc:'PERMANENTE: 40 de defensa destructible; se reaplica sola.', costo:['comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  delfin: {
    habs:[
      { n:'Embestida', desc:'15 de dano que atraviesa la defensa destructible.', costo:['agua'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Arrimo', desc:'Cura 25 a un aliado y le quita los efectos daninos.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
      { n:'Madriguera', desc:'Un aliado se cura 10 por turno durante 3 turnos.', costo:['comodin', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }] },
    ],
  },
  ballena: {
    habs:[
      { n:'Arañazo', desc:'10 de dano por turno durante 3 turnos.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { n:'Carga de peso', desc:'30 de dano a un enemigo.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Ultimo aliento', desc:'45 de dano. Ignora la defensa destructible.', costo:['agua', 'comodin'], recarga:3, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'enemigo', ignoraDefensa:true }] },
    ],
  },
  yiguirro: {
    habs:[
      { n:'Picotazo', desc:'25 de dano; ademas recibe 10 menos de dano 1 turno.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }, { t:'reducir', v:10, turnos:1, obj:'self' }] },
      { n:'Arrebato de altura', desc:'35 de dano a TODOS los enemigos.', costo:['bosque', 'comodin', 'comodin'], recarga:2, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:35, obj:'todos' }] },
      { n:'Refugio del viento', desc:'TODO tu equipo se vuelve invulnerable 1 turno.', costo:['bosque', 'bosque'], recarga:5, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'equipo' }] },
    ],
  },
  lapa: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Roce de plumas', desc:'10 de dano por turno durante 3 turnos.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { n:'Picotazo perforante', desc:'30 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Arremetida final', desc:'45 de dano. Ignora la defensa destructible.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'enemigo', ignoraDefensa:true }] },
    ],
  },
  lapa_verde: {
    habs:[
      { n:'Picotazo', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Picada en picada', desc:'30 de dano que atraviesa la defensa destructible.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  tucan: {
    habs:[
      { n:'Garra en picada', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Rafaga', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  tucan_castano: {
    habs:[
      { n:'Tijera de alas', desc:'25 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno Y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
      { n:'Vuelo rasante', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'sabana'], recarga:1, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  cusingo: {
    habs:[
      { n:'Rasguño en vuelo', desc:'15 de dano que atraviesa la defensa destructible.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Abrigo', desc:'Cura 25 a un aliado y le quita los efectos daninos.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
      { n:'Madriguera', desc:'Un aliado se cura 10 por turno durante 3 turnos.', costo:['comodin', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }] },
    ],
  },
  tucancillo: {
    habs:[
      { n:'Tijera de alas', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Rafaga', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  pajaro_campana: {
    habs:[
      { n:'Roce de plumas', desc:'30 de dano a un enemigo.', costo:['montana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Arremetida', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['montana', 'agua'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Delatar', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  oropendola: {
    habs:[
      { n:'Golpe de ala', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Zarpa oportuna', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  colibri_fuego: {
    habs:[
      { n:'Roce de plumas', desc:'15 de dano que atraviesa la defensa destructible.', costo:['montana'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Abrigo', desc:'Cura 25 a un aliado y le quita los efectos daninos.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
      { n:'Nido seguro', desc:'Un aliado se cura 10 por turno durante 3 turnos.', costo:['comodin', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }] },
    ],
  },
  colibri_talamanca: {
    habs:[
      { n:'Punzada de pico', desc:'20 de dano por turno durante 2 turnos.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Coro del monte', desc:'15 de dano a TODOS y tu equipo gana 10 de defensa destructible.', costo:['bosque', 'comodin'], recarga:0, clases:['natural', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'defensa', v:10, obj:'equipo' }] },
      { n:'Savia nueva', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  ermitano: {
    habs:[
      { n:'Tijera de alas', desc:'25 de dano; ademas recibe 10 menos de dano 1 turno.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }, { t:'reducir', v:10, turnos:1, obj:'self' }] },
      { n:'Torbellino de plumas', desc:'35 de dano a TODOS los enemigos.', costo:['bosque', 'comodin', 'comodin'], recarga:2, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:35, obj:'todos' }] },
      { n:'Refugio del viento', desc:'TODO tu equipo se vuelve invulnerable 1 turno.', costo:['bosque', 'bosque'], recarga:5, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'equipo' }] },
    ],
  },
  jacamar: {
    habs:[
      { n:'Roce de plumas', desc:'25 de dano; ademas recibe 10 menos de dano 1 turno.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }, { t:'reducir', v:10, turnos:1, obj:'self' }] },
      { n:'Picada en picada', desc:'35 de dano a TODOS los enemigos.', costo:['bosque', 'comodin', 'comodin'], recarga:2, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:35, obj:'todos' }] },
      { n:'Refugio del viento', desc:'TODO tu equipo se vuelve invulnerable 1 turno.', costo:['bosque', 'bosque'], recarga:5, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'equipo' }] },
    ],
  },
  momoto: {
    habs:[
      { n:'Punzada de pico', desc:'15 de dano que atraviesa la defensa destructible.', costo:['sabana'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado y le quita los efectos daninos.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
      { n:'Nido seguro', desc:'Un aliado se cura 10 por turno durante 3 turnos.', costo:['comodin', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }] },
    ],
  },
  tangara_azul: {
    habs:[
      { n:'Picotazo', desc:'20 de dano y aturde sus habilidades fisicas 1 turno.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'aturdir', turnos:1, obj:'enemigo', clase:'fisico' }] },
      { n:'Amparo', desc:'Cura 25 a un aliado.', costo:['sabana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Coraje', desc:'MODO: 4 turnos recibiendo 10 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  tangara_dorada: {
    habs:[
      { n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['montana'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cercar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Rafaga', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  bienteveo: {
    habs:[
      { n:'Aletazo', desc:'20 de dano por turno durante 2 turnos.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Canto del bosque', desc:'15 de dano a TODOS y tu equipo gana 10 de defensa destructible.', costo:['montana', 'comodin'], recarga:0, clases:['natural', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'defensa', v:10, obj:'equipo' }] },
      { n:'Aliento vital', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  garza: {
    habs:[
      { n:'Garra en picada', desc:'20 de dano a un enemigo.', costo:['sabana'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Rafaga', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  espatula: {
    habs:[
      { n:'Tijera de alas', desc:'30 de dano a un enemigo.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Bramido', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['agua', 'montana'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  jabiru: {
    habs:[
      { n:'Garra en picada', desc:'20 de dano y aturde sus habilidades fisicas 1 turno.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'aturdir', turnos:1, obj:'enemigo', clase:'fisico' }] },
      { n:'Lamer heridas', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Segundo aire', desc:'MODO: 4 turnos recibiendo 10 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  tantalo: {
    habs:[
      { n:'Rasguño en vuelo', desc:'25 de dano; ademas recibe 10 menos de dano 1 turno.', costo:['agua'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }, { t:'reducir', v:10, turnos:1, obj:'self' }] },
      { n:'Caida en flecha', desc:'35 de dano a TODOS los enemigos.', costo:['agua', 'comodin', 'comodin'], recarga:2, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:35, obj:'todos' }] },
      { n:'Cortina de polvo', desc:'TODO tu equipo se vuelve invulnerable 1 turno.', costo:['agua', 'agua'], recarga:5, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'equipo' }] },
    ],
  },
  ibis: {
    habs:[
      { n:'Punzada de pico', desc:'30 de dano a un enemigo.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Tromba', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['agua', 'montana'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Delatar', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  pelicano: {
    habs:[
      { n:'Rasguño en vuelo', desc:'10 de dano por turno durante 3 turnos.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { n:'Espolon de garra', desc:'30 de dano a un enemigo.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Ultimo aliento', desc:'45 de dano. Ignora la defensa destructible.', costo:['agua', 'comodin'], recarga:3, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'enemigo', ignoraDefensa:true }] },
    ],
  },
  fragata: {
    habs:[
      { n:'Picoteo', desc:'30 de dano a un enemigo.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Arremetida', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['agua', 'bosque'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Delatar', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  aguila_harpia: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Roce de plumas', desc:'10 de dano por turno durante 3 turnos.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { n:'Torbellino de plumas', desc:'30 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Loto abierto', desc:'45 de dano. Ignora la defensa destructible.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'enemigo', ignoraDefensa:true }] },
    ],
  },
  caracara: {
    habs:[
      { n:'Garra en picada', desc:'10 de dano por turno durante 3 turnos.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { n:'Picada en picada', desc:'30 de dano a un enemigo.', costo:['sabana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Ultimo aliento', desc:'45 de dano. Ignora la defensa destructible.', costo:['sabana', 'comodin'], recarga:3, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'enemigo', ignoraDefensa:true }] },
    ],
  },
  zopilote_negro: {
    habs:[
      { n:'Aletazo', desc:'25 de dano por turno durante 2 turnos.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Torbellino', desc:'Invulnerable 1 turno Y 15 de dano a TODOS los enemigos.', costo:['sabana'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
      { n:'Picada en picada', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['sabana', 'bosque'], recarga:1, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  zopilote_rojo: {
    habs:[
      { n:'Roce de plumas', desc:'30 de dano a un enemigo.', costo:['sabana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Tromba', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['sabana', 'agua'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Rastrear', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  lechuza: {
    habs:[
      { n:'Picoteo', desc:'30 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Tromba', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['bosque', 'montana'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Rastrear', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  carpintero: {
    habs:[
      { n:'Picoteo', desc:'25 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Torbellino', desc:'Invulnerable 1 turno Y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
      { n:'Garra certera', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'montana'], recarga:1, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  saltarin: {
    habs:[
      { n:'Garra en picada', desc:'20 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Brote', desc:'15 de dano a TODOS y tu equipo gana 10 de defensa destructible.', costo:['sabana', 'comodin'], recarga:0, clases:['natural', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'defensa', v:10, obj:'equipo' }] },
      { n:'Aliento vital', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  trogon: {
    habs:[
      { n:'Picoteo', desc:'25 de dano; ademas recibe 10 menos de dano 1 turno.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }, { t:'reducir', v:10, turnos:1, obj:'self' }] },
      { n:'Arrebato de altura', desc:'35 de dano a TODOS los enemigos.', costo:['bosque', 'comodin', 'comodin'], recarga:2, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:35, obj:'todos' }] },
      { n:'Cortina de polvo', desc:'TODO tu equipo se vuelve invulnerable 1 turno.', costo:['bosque', 'bosque'], recarga:5, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'equipo' }] },
    ],
  },
  martin_pescador: {
    habs:[
      { n:'Picoteo', desc:'20 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Golpe de gracia', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  anhinga: {
    habs:[
      { n:'Roce de plumas', desc:'30 de dano. Durante su modo pega +15.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Garra certera', desc:'30 de dano que atraviesa la defensa destructible.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Modo cazador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  tinamu: {
    habs:[
      { n:'Picoteo', desc:'25 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno Y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
      { n:'Garra certera', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'sabana'], recarga:1, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  chachalaca: {
    habs:[
      { n:'Garra en picada', desc:'30 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Bramido', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['bosque', 'sabana'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  loro: {
    habs:[
      { n:'Aletazo', desc:'25 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno Y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
      { n:'Arrebato de altura', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'agua'], recarga:1, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  rana_verdinegra: {
    habs:[
      { n:'Drenar', desc:'20 de toxina y le ROBA 1 energia al enemigo.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { n:'Secrecion', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'rango', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Parapeto', desc:'Todo tu equipo gana 20 de defensa destructible.', costo:['montana', 'comodin'], recarga:3, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  rana_cristal: {
    habs:[
      { n:'Brinco corto', desc:'20 de dano por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Brote', desc:'15 de dano a TODOS y tu equipo gana 10 de defensa destructible.', costo:['sabana', 'comodin'], recarga:0, clases:['natural', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'defensa', v:10, obj:'equipo' }] },
      { n:'Aliento vital', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  rana_lechera: {
    habs:[
      { n:'Zarpa humeda', desc:'15 de dano que atraviesa la defensa destructible.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado y le quita los efectos daninos.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
      { n:'Querencia', desc:'Un aliado se cura 10 por turno durante 3 turnos.', costo:['comodin', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }] },
    ],
  },
  rana_tungara: {
    habs:[
      { n:'Zarpa humeda', desc:'20 de dano y aturde sus habilidades fisicas 1 turno.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'aturdir', turnos:1, obj:'enemigo', clase:'fisico' }] },
      { n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Coraje', desc:'MODO: 4 turnos recibiendo 10 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  rana_gladiadora: {
    habs:[
      { n:'Zarpa humeda', desc:'25 de dano; ademas recibe 10 menos de dano 1 turno.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }, { t:'reducir', v:10, turnos:1, obj:'self' }] },
      { n:'Salto desde el dosel', desc:'35 de dano a TODOS los enemigos.', costo:['bosque', 'comodin', 'comodin'], recarga:2, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:35, obj:'todos' }] },
      { n:'Refugio del viento', desc:'TODO tu equipo se vuelve invulnerable 1 turno.', costo:['bosque', 'bosque'], recarga:5, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'equipo' }] },
    ],
  },
  rana_payaso: {
    habs:[
      { n:'Picadura toxica', desc:'20 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Marca letal', desc:'10 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['montana'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  sapo_marino: {
    habs:[
      { n:'Aguijonazo', desc:'20 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['sabana'], recarga:1, clases:['toxina', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Herida abierta', desc:'10 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['agua'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  sapo_dorado: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Picadura toxica', desc:'20 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['montana'], recarga:1, clases:['toxina', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Herida abierta', desc:'10 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['agua'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['montana', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  salamandra: {
    habs:[
      { n:'Zarpa humeda', desc:'20 de dano y aturde sus habilidades fisicas 1 turno.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'aturdir', turnos:1, obj:'enemigo', clase:'fisico' }] },
      { n:'Lamer heridas', desc:'Cura 25 a un aliado.', costo:['agua'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Coraje', desc:'MODO: 4 turnos recibiendo 10 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  garrobo: {
    habs:[
      { n:'Enroscada', desc:'15 de dano por turno durante 2 turnos.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Ponerse tieso', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 30 de dano.', costo:['comodin'], recarga:2, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:30, obj:'self' }] },
      { n:'Represalia total', desc:'Todo tu equipo recibe 10 menos de dano durante 3 turnos.', costo:['sabana', 'montana'], recarga:4, clases:['instinto', 'unico', 'sostenido'], efectos:[{ t:'reducir', v:10, turnos:3, obj:'equipo' }] },
    ],
  },
  basilisco: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Rafaga', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  anolis: {
    habs:[
      { n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Espinas al aire', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['bosque'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Andanada de espinas', desc:'20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  geco: {
    habs:[
      { n:'Mordisco seco', desc:'25 de dano; ademas recibe 10 menos de dano 1 turno.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }, { t:'reducir', v:10, turnos:1, obj:'self' }] },
      { n:'Azote de cola', desc:'35 de dano a TODOS los enemigos.', costo:['bosque', 'comodin', 'comodin'], recarga:2, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:35, obj:'todos' }] },
      { n:'Cortina de polvo', desc:'TODO tu equipo se vuelve invulnerable 1 turno.', costo:['bosque', 'bosque'], recarga:5, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'equipo' }] },
    ],
  },
  caiman: {
    habs:[
      { n:'Latigazo de cola', desc:'30 de dano. Durante su modo pega +15.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Fauces de acero', desc:'30 de dano que atraviesa la defensa destructible.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  boa: {
    habs:[
      { n:'Espina ponzoñosa', desc:'15 de dano que atraviesa la defensa destructible.', costo:['comodin'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'rango', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Rocio negro', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  bocaraca: {
    habs:[
      { n:'Sorbo', desc:'20 de toxina y le ROBA 1 energia al enemigo.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { n:'Roce toxico', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'rango', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Barrera viva', desc:'Todo tu equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:3, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  lora: {
    habs:[
      { n:'Baba acida', desc:'15 de dano que atraviesa la defensa destructible.', costo:['comodin'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['montana'], recarga:1, clases:['toxina', 'rango', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Rocio negro', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  cascabel: {
    habs:[
      { n:'Aguijonazo', desc:'20 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['sabana'], recarga:1, clases:['toxina', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Marca letal', desc:'10 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['agua'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  matabuey: {
    habs:[
      { n:'Espina ponzoñosa', desc:'15 de dano que atraviesa la defensa destructible.', costo:['comodin'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Emponzoñar', desc:'20 de toxina por turno durante 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'rango', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Rocio negro', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  coral: {
    habs:[
      { n:'Baba acida', desc:'15 de dano que atraviesa la defensa destructible.', costo:['comodin'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'rango', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Bruma acida', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  serpiente_mar: {
    habs:[
      { n:'Picadura toxica', desc:'20 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['agua'], recarga:1, clases:['toxina', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Marca letal', desc:'10 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['sabana'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  mica: {
    habs:[
      { n:'Sorbo', desc:'20 de toxina y le ROBA 1 energia al enemigo.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { n:'Roce toxico', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'rango', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Barrera viva', desc:'Todo tu equipo gana 20 de defensa destructible.', costo:['montana', 'comodin'], recarga:3, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  bejuquilla: {
    habs:[
      { n:'Aguijonazo', desc:'20 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Marca letal', desc:'10 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['agua'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  tortuga_baula: {
    habs:[
      { n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Rodar', desc:'Invulnerable 2 turnos mientras hace 10 de dano por turno.', costo:['sabana'], recarga:2, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'invulnerable', turnos:2, obj:'self' }, { t:'danoTurnos', v:10, turnos:2, obj:'enemigo' }] },
      { n:'Cerrar filas', desc:'Todo tu equipo recibe 10 menos de dano durante 3 turnos.', costo:['comodin'], recarga:3, clases:['instinto', 'unico', 'sostenido'], efectos:[{ t:'reducir', v:10, turnos:3, obj:'equipo' }] },
    ],
  },
  tortuga_carey: {
    habs:[
      { n:'Trabar', desc:'Aturde sus habilidades fisicas 2 turnos.', costo:['agua', 'comodin'], recarga:2, clases:['natural', 'rango', 'control'], efectos:[{ t:'aturdir', turnos:2, obj:'enemigo', clase:'fisico' }] },
      { n:'Latigazo de cola', desc:'GRATIS: gana 20 de defensa destructible.', costo:[], recarga:2, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:20, obj:'self' }] },
      { n:'Coraza ancestral', desc:'PERMANENTE: 40 de defensa destructible; se reaplica sola.', costo:['comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  tortuga_lora: {
    habs:[
      { n:'Tarascada', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { n:'Erizarse', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['comodin'], recarga:2, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Andanada', desc:'45 de dano a TODOS los enemigos.', costo:['agua', 'comodin', 'comodin'], recarga:3, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'todos' }] },
    ],
  },
  tortuga_cabezona: {
    habs:[
      { n:'Golpe de escamas', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { n:'Erizarse', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['comodin'], recarga:2, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Andanada', desc:'45 de dano a TODOS los enemigos.', costo:['agua', 'comodin', 'comodin'], recarga:3, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'todos' }] },
    ],
  },
  jicotea: {
    habs:[
      { n:'Tarascada', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { n:'Ponerse tieso', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['comodin'], recarga:2, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Estruendo', desc:'45 de dano a TODOS los enemigos.', costo:['agua', 'comodin', 'comodin'], recarga:3, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'todos' }] },
    ],
  },
  tiburon_martillo: {
    habs:[
      { n:'Pinza rapida', desc:'30 de dano. Durante su modo pega +15.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Remolino de agua', desc:'30 de dano que atraviesa la defensa destructible.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  tiburon_ballena: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Enterrar', desc:'Aturde sus habilidades fisicas 2 turnos.', costo:['agua', 'comodin'], recarga:2, clases:['natural', 'rango', 'control'], efectos:[{ t:'aturdir', turnos:2, obj:'enemigo', clase:'fisico' }] },
      { n:'Embate', desc:'GRATIS: gana 20 de defensa destructible.', costo:[], recarga:2, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:20, obj:'self' }] },
      { n:'Caparazon eterno', desc:'PERMANENTE: 40 de defensa destructible; se reaplica sola.', costo:['comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  pez_vela: {
    habs:[
      { n:'Cabezazo de agua', desc:'30 de dano. Durante su modo pega +15.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Pinza trituradora', desc:'30 de dano que atraviesa la defensa destructible.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  marlin: {
    habs:[
      { n:'Pinza rapida', desc:'30 de dano. Durante su modo pega +15.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Tenaza aplastante', desc:'30 de dano que atraviesa la defensa destructible.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Sangre en el aire', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus golpes mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  mantarraya: {
    habs:[
      { n:'Pinza rapida', desc:'20 de dano y aturde sus habilidades fisicas 1 turno.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'aturdir', turnos:1, obj:'enemigo', clase:'fisico' }] },
      { n:'Lamer heridas', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Coraje', desc:'MODO: 4 turnos recibiendo 10 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  mariposa: {
    habs:[
      { n:'Golpe de caparazon', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Zarpa oportuna', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  mariposa_buho: {
    habs:[
      { n:'Coletazo', desc:'25 de dano; ademas recibe 10 menos de dano 1 turno.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }, { t:'reducir', v:10, turnos:1, obj:'self' }] },
      { n:'Remolino de agua', desc:'35 de dano a TODOS los enemigos.', costo:['bosque', 'comodin', 'comodin'], recarga:2, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:35, obj:'todos' }] },
      { n:'Refugio del viento', desc:'TODO tu equipo se vuelve invulnerable 1 turno.', costo:['bosque', 'bosque'], recarga:5, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'equipo' }] },
    ],
  },
  mariposa_julia: {
    habs:[
      { n:'Cabezazo de agua', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Rafaga', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  hormiga_bala: {
    habs:[
      { n:'Toxina', desc:'20 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Sello ponzoñoso', desc:'10 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['sabana'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
      { n:'Nube toxica', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  escarabajo: {
    habs:[
      { n:'Aguijonazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Espinas al aire', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['bosque'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Lluvia de puas', desc:'20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  cangrejo: {
    habs:[
      { n:'Tenaza', desc:'20 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Erizarse', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['agua'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Andanada de espinas', desc:'20 de dano a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  tiburon: {
    habs:[
      { n:'Aguijonazo', desc:'10 de dano por turno durante 3 turnos.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { n:'Picadura profunda', desc:'30 de dano a un enemigo.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Loto abierto', desc:'45 de dano. Ignora la defensa destructible.', costo:['agua', 'comodin'], recarga:3, clases:['fisico', 'melee', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'enemigo', ignoraDefensa:true }] },
    ],
  },
  quetzaldorado: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Picoteo', desc:'20 de dano y aturde sus habilidades fisicas 1 turno.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'aturdir', turnos:1, obj:'enemigo', clase:'fisico' }] },
      { n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['sabana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Segundo aire', desc:'MODO: 4 turnos recibiendo 10 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  tarantula: {
    habs:[
      { n:'Aguijonazo', desc:'20 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Marca letal', desc:'10 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['agua'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  perro: {
    habs:[
      { n:'Dentellada', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Rodar', desc:'Invulnerable 2 turnos mientras hace 10 de dano por turno.', costo:['sabana'], recarga:2, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'invulnerable', turnos:2, obj:'self' }, { t:'danoTurnos', v:10, turnos:2, obj:'enemigo' }] },
      { n:'Escudo de manada', desc:'Todo tu equipo recibe 10 menos de dano durante 3 turnos.', costo:['comodin'], recarga:3, clases:['instinto', 'unico', 'sostenido'], efectos:[{ t:'reducir', v:10, turnos:3, obj:'equipo' }] },
    ],
  },
  gato: {
    habs:[
      { n:'Arañazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Golpe de gracia', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  comemaiz: {
    habs:[
      { n:'Roce de plumas', desc:'15 de dano que atraviesa la defensa destructible.', costo:['sabana'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Abrigo', desc:'Cura 25 a un aliado y le quita los efectos daninos.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
      { n:'Madriguera', desc:'Un aliado se cura 10 por turno durante 3 turnos.', costo:['comodin', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }] },
    ],
  },
  f_segua: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Susurro', desc:'20 de dano a un enemigo.', costo:['montana'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cercar', desc:'10 de dano; ademas no puede reducir dano ni volverse invulnerable 2 turnos.', costo:['comodin'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:10, obj:'enemigo' }, { t:'exponer', turnos:2, obj:'enemigo' }] },
      { n:'Golpe de gracia', desc:'40 de dano y le quema 1 energia al enemigo.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  f_cadejos: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Golpe de sombra', desc:'30 de dano a un enemigo.', costo:['montana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Tromba', desc:'15 de dano a TODOS los enemigos por turno durante 3 turnos.', costo:['montana', 'agua'], recarga:3, clases:['fisico', 'unico', 'sostenido'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'danoTurnos', v:15, turnos:3, obj:'enemigo' }] },
      { n:'Rastrear', desc:'GRATIS: ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
    ],
  },
  f_llorona: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Espina ponzoñosa', desc:'15 de dano que atraviesa la defensa destructible.', costo:['comodin'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['montana'], recarga:1, clases:['toxina', 'rango', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Rocio negro', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  f_tulevieja: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Baba acida', desc:'15 de dano que atraviesa la defensa destructible.', costo:['comodin'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo', ignoraDefensa:true }] },
      { n:'Savia negra', desc:'20 de toxina por turno durante 2 turnos.', costo:['montana'], recarga:1, clases:['toxina', 'rango', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { n:'Rocio negro', desc:'MODO: 4 turnos recibiendo 15 menos de dano.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  f_padre: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Caricia helada', desc:'25 de dano a un enemigo.', costo:['montana'], recarga:0, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { n:'Erizarse', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['comodin'], recarga:2, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Andanada', desc:'45 de dano a TODOS los enemigos.', costo:['montana', 'comodin', 'comodin'], recarga:3, clases:['fisico', 'rango', 'unico', 'instant'], efectos:[{ t:'dano', v:45, obj:'todos' }] },
    ],
  },
  f_carreta: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Caricia helada', desc:'15 de dano por turno durante 2 turnos.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Ponerse tieso', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 30 de dano.', costo:['comodin'], recarga:2, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:30, obj:'self' }] },
      { n:'Devolver el golpe', desc:'Todo tu equipo recibe 10 menos de dano durante 3 turnos.', costo:['montana', 'sabana'], recarga:4, clases:['instinto', 'unico', 'sostenido'], efectos:[{ t:'reducir', v:10, turnos:3, obj:'equipo' }] },
    ],
  },
};
