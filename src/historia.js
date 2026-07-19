// ============================================================
// historia.js — GUION del juego: cabecillas por provincia, escenas de historia
// (llegada / careo con el jefe / victoria), charlas de lugar y comentarios sobre
// los animales rescatados. Solo DATOS + helpers puros: la UI la pinta dialogo.js.
//
// Formato de una ESCENA = array de LÍNEAS:
//   { who, txt, hi, opts }
//     who  : 'guia' (usa el retrato del jugador) | clave de cabecilla | 'narrador'
//     txt  : el texto. Admite {nombre} y {provincia} como marcadores.
//     hi   : palabras a resaltar en color dentro de txt (opcional)
//     opts : hasta 4 opciones [{t:'texto del botón', reply:'respuesta'}] (opcional)
//            elegir cualquiera muestra su `reply` (si tiene) y sigue la escena.
// ============================================================

// ---------- CABECILLAS: uno distinto por provincia ----------
// `art` = assets/personajes/<art>.png (generado con gen_bosses.py)
export const CABECILLAS = {
  'San José':   { art:'boss_sanjose',   n:'Don Rufino',    t:'el de los trajes' },
  'Alajuela':   { art:'boss_alajuela',  n:'El Mandador',   t:'capataz de la finca' },
  'Cartago':    { art:'boss_cartago',   n:'El Páramo',     t:'el frío de la montaña' },
  'Heredia':    { art:'boss_heredia',   n:'Doña Zoraida',  t:'la del látigo' },
  'Guanacaste': { art:'boss_guanacaste',n:'El Sabanero',   t:'jinete de la pampa' },
  'Puntarenas': { art:'boss_puntarenas',n:'Capitán Mero',  t:'el del muelle' },
  'Limón':      { art:'boss_limon',     n:'El Muellero',   t:'dueño del puerto' },
  'Monteverde': { art:'boss_monteverde',n:'EL CABECILLA',  t:'el dueño de la red' },
};
export const bossOf = (prov) => CABECILLAS[prov] || CABECILLAS['Monteverde'];

// ---------- ESCENAS por provincia ----------
// Cada provincia: al LLEGAR (contexto + trama), el CAREO con su cabecilla y la
// VICTORIA (avance de la historia). La trama avanza provincia a provincia.
export const HISTORIA = {
  'San José': {
    llegada: [
      { who:'narrador', txt:'La capital. Bocinas, humo y, entre callejones, jaulas tapadas con lonas.' },
      { who:'guia', txt:'Vine a ser guía de naturaleza, no a esto. Pero si aquí empieza la red, aquí empiezo yo.', hi:['guía de naturaleza','la red'] },
    ],
    jefe: [
      { who:'boss_sanjose', txt:'¿Vos sos el guiacito que anda soltando mi mercadería? Qué tierno.', hi:['mercadería'] },
      { who:'guia', txt:'No es mercadería. Son animales. Y los estás drogando para que ataquen.', hi:['drogando'] },
      { who:'boss_sanjose', txt:'Negocio es negocio. Te doy una tajada y te devolvés a tus pajaritos.',
        opts:[
          { t:'¿Cuánto ofrecés?', reply:'Ja. Ni con todo el oro te alcanza para comprarme.' },
          { t:'¿Quién está arriba tuyo?', reply:'Ah… ese nombre no se dice en voz alta, muchacho.' },
          { t:'Soy guía, no cómplice.', reply:'Entonces sos un problema. Y los problemas se resuelven.' },
          { t:'Devolvémelos y me voy.', reply:'Lo que entra a mis jaulas no sale. Nunca.' },
        ] },
      { who:'boss_sanjose', txt:'Que sea rápido. Tengo un cargamento saliendo a las seis.' },
    ],
    victoria: [
      { who:'boss_sanjose', txt:'Esperá… esperá. Yo solo muevo cajas. El que manda está en el bosque nuboso.', hi:['bosque nuboso'] },
      { who:'guia', txt:'Entonces al bosque nuboso voy. Pero primero, provincia por provincia.' },
    ],
  },
  'Alajuela': {
    llegada: [
      { who:'narrador', txt:'Mangales, caña y el Poás humeando al fondo. Huele a tierra mojada… y a miedo.' },
      { who:'guia', txt:'Los peones dicen que de noche pasan camiones sin placas rumbo al volcán.', hi:['camiones sin placas'] },
    ],
    jefe: [
      { who:'boss_alajuela', txt:'¡Ey! Esta finca es mía y todo lo que camina aquí también.' },
      { who:'guia', txt:'Un saíno no es tuyo. Un venado no es tuyo. Nada de esto es tuyo.' },
      { who:'boss_alajuela', txt:'Aquí el que no trabaja para mí, trabaja bajo tierra.',
        opts:[
          { t:'¿Cuántos animales tenés?', reply:'Los que quepan. Y caben muchos.' },
          { t:'Te vas a arrepentir.', reply:'Muchos lo dijeron. Ninguno volvió a decirlo.' },
          { t:'Solo quiero llevármelos.', reply:'Llevátelos… si podés con mi gente.' },
          { t:'Nada que hablar.', reply:'Así me gusta. Corto y derecho.' },
        ] },
    ],
    victoria: [
      { who:'boss_alajuela', txt:'La droga… no la hacemos aquí. Llega de la montaña fría. De Cartago.', hi:['montaña fría','Cartago'] },
      { who:'guia', txt:'Cartago, entonces. Gracias por el dato, Mandador.' },
    ],
  },
  'Cartago': {
    llegada: [
      { who:'narrador', txt:'Neblina, piedra vieja y el Irazú mirando desde arriba. Aquí hasta el aire pesa.' },
      { who:'guia', txt:'Entre las ruinas hay un laboratorio. Ahí preparan lo que les dan a los animales.', hi:['laboratorio'] },
    ],
    jefe: [
      { who:'boss_cartago', txt:'Sabía que ibas a llegar. Lo supe desde San José.' },
      { who:'guia', txt:'Entonces sabés por qué estoy aquí. Apagá el laboratorio.' },
      { who:'boss_cartago', txt:'La fórmula los hace obedecer. Sin ella, la red no existe.',
        opts:[
          { t:'¿Qué les hacés exactamente?', reply:'Les quito el miedo… y de paso, la voluntad.' },
          { t:'¿Se puede revertir?', reply:'Con tiempo. Y con manos como las tuyas. Lástima.' },
          { t:'Sos un monstruo.', reply:'Soy un químico. El monstruo firma los cheques.' },
          { t:'Se acabó.', reply:'Todo se acaba. Unos antes que otros.' },
        ] },
      { who:'guia', txt:'Entonces la apago yo.' },
    ],
    victoria: [
      { who:'boss_cartago', txt:'La fórmula sale de una flor… que solo crece en Monteverde.', hi:['una flor','Monteverde'] },
      { who:'guia', txt:'Todo apunta al mismo lugar. Ya falta menos.' },
    ],
  },
  'Heredia': {
    llegada: [
      { who:'narrador', txt:'La ciudad de las flores. Cafetales hasta donde da la vista… y jaulas entre las matas.' },
      { who:'guia', txt:'Usan los beneficios de café para esconder los envíos. Descarado.', hi:['beneficios de café'] },
    ],
    jefe: [
      { who:'boss_heredia', txt:'Ay, mi amor, ¿venís a arruinarme la cosecha?' },
      { who:'guia', txt:'Vengo a sacar a los animales de sus jaulas.' },
      { who:'boss_heredia', txt:'Esas "jaulas" pagan escuelas, muchachito. ¿Vos qué pagás?',
        opts:[
          { t:'Eso no lo justifica.', reply:'Nada se justifica. Pero todo se cobra.' },
          { t:'¿A quién le vendés?', reply:'A gente con más plata que vos y menos alma que yo.' },
          { t:'Dejá el látigo.', reply:'El látigo es para los que no entienden. Ojalá vos sí.' },
          { t:'Ya basta de hablar.', reply:'Qué lástima. Hablás bonito.' },
        ] },
    ],
    victoria: [
      { who:'boss_heredia', txt:'Del puerto salen los grandes. Yo solo muevo lo chiquito, te lo juro.', hi:['puerto'] },
      { who:'guia', txt:'Puertos hay dos. Voy a ver los dos.' },
    ],
  },
  'Guanacaste': {
    llegada: [
      { who:'narrador', txt:'Pampa seca, guanacastes de sombra ancha y el sol pegando como martillo.' },
      { who:'guia', txt:'Aquí arrean fauna como si fuera ganado. Hasta usan carretas para no hacer ruido.', hi:['como si fuera ganado'] },
    ],
    jefe: [
      { who:'boss_guanacaste', txt:'Buenas. ¿Se le perdió algo por mi pampa, amigo?' },
      { who:'guia', txt:'Se le perdieron a usted: un jaguar, dos venados y una lapa.' },
      { who:'boss_guanacaste', txt:'Aquí el que lacea, se queda con lo laceado. Ley de sabana.',
        opts:[
          { t:'Esa ley no existe.', reply:'Existe mientras yo tenga el lazo.' },
          { t:'Respeto su tierra, no su oficio.', reply:'Y yo respeto su valor… no su criterio.' },
          { t:'¿Cuánto le pagan?', reply:'Lo suficiente para no preguntar de dónde viene.' },
          { t:'Suéltelos.', reply:'Ni amarrado, muchacho.' },
        ] },
    ],
    victoria: [
      { who:'boss_guanacaste', txt:'Le voy a decir algo de hombre: el jefe no compra animales… los colecciona.', hi:['los colecciona'] },
      { who:'guia', txt:'Colecciona. Como si fueran figuritas.' },
    ],
  },
  'Puntarenas': {
    llegada: [
      { who:'narrador', txt:'El Pacífico, el faro y un muelle lleno de cajas que nadie quiere abrir.' },
      { who:'guia', txt:'Si logran embarcarlos, se van del país para siempre. Aquí no puedo fallar.', hi:['se van del país'] },
    ],
    jefe: [
      { who:'boss_puntarenas', txt:'¡Fuera de mi muelle! Ese contenedor zarpa con marea alta.' },
      { who:'guia', txt:'Ese contenedor no zarpa. Punto.' },
      { who:'boss_puntarenas', txt:'Llevo treinta años moviendo carga. ¿Y vos qué llevás? ¿Binoculares?',
        opts:[
          { t:'Llevo cinco amigos.', reply:'Ja. Bichos amaestrados. Ya veremos.' },
          { t:'¿Qué hay en el contenedor?', reply:'Lo que se paga bien. Y se paga muy bien.' },
          { t:'Todavía puede parar esto.', reply:'Parar es hundirse, muchacho.' },
          { t:'Abrilo.', reply:'Sobre mi cubierta.' },
        ] },
    ],
    victoria: [
      { who:'boss_puntarenas', txt:'El manifiesto… destino final, Monteverde. Siempre Monteverde.', hi:['Monteverde'] },
      { who:'guia', txt:'Falta un puerto. Y después, la niebla.' },
    ],
  },
  'Limón': {
    llegada: [
      { who:'narrador', txt:'Caribe: calipso a lo lejos, plataneras, cacao… y grúas trabajando de noche.' },
      { who:'guia', txt:'Este es el puerto grande. Si aquí corto la salida, la red se ahoga.', hi:['la red se ahoga'] },
    ],
    jefe: [
      { who:'boss_limon', txt:'Respect, muchacho. Llegaste más lejos que todos los otros.' },
      { who:'guia', txt:'Entonces ya sabés cómo termina.' },
      { who:'boss_limon', txt:'Yo no odio a los animales. Yo odio ser pobre. No es lo mismo.',
        opts:[
          { t:'Hay otras formas.', reply:'Decíselo a mi barrio. A ver si te creen.' },
          { t:'Eso no te absuelve.', reply:'No pedí perdón. Pedí que entendás.' },
          { t:'Vení conmigo, entonces.', reply:'…No me tientes, guía. No me tientes.' },
          { t:'Terminemos.', reply:'Como quieras. Sin rencor.' },
        ] },
    ],
    victoria: [
      { who:'boss_limon', txt:'Última cosa: en Monteverde no hay bodega. Hay un zoológico privado.', hi:['zoológico privado'] },
      { who:'guia', txt:'Un zoológico. Los tiene vivos… exhibidos.' },
    ],
  },
  'Monteverde': {
    llegada: [
      { who:'narrador', txt:'El bosque nuboso. Silencio total. Ni un pájaro canta aquí arriba.' },
      { who:'guia', txt:'Siete provincias. Y todo terminaba donde empezó mi sueño de ser guía.', hi:['Siete provincias'] },
    ],
    jefe: [
      { who:'boss_monteverde', txt:'Al fin. El guiacito que me desarmó el país entero.' },
      { who:'guia', txt:'Solté lo que tenías encerrado. Eso es todo.' },
      { who:'boss_monteverde', txt:'¿Sabés por qué los colecciono? Porque el país se los está comiendo igual. Yo al menos los conservo.',
        opts:[
          { t:'Conservar no es encerrar.', reply:'Es lo mismo con mejor prensa. Preguntale a cualquier zoológico.' },
          { t:'¿Cuántos tenés?', reply:'Los suficientes para llenar un bosque. MI bosque.' },
          { t:'Vas a devolverlos todos.', reply:'Nadie devuelve nada. Solo cambia de dueño.' },
          { t:'Se acabó, de verdad.', reply:'Eso lo decide el último que quede en pie.' },
        ] },
      { who:'boss_monteverde', txt:'Vení, pues. Veamos si tus rescatados pelean por vos… o solo por comida.' },
    ],
    victoria: [
      { who:'boss_monteverde', txt:'…Se van. Todos se van. ¿Sabés lo que me costó juntarlos?' },
      { who:'guia', txt:'Sé lo que les costó a ellos. Eso me alcanza.' },
      { who:'narrador', txt:'Las jaulas se abren. El bosque nuboso vuelve a hacer ruido.' },
    ],
  },
};

// ---------- EASTER EGG: el MAPA TENEBROSO ----------
// Al entrar (una sola vez), el careo con cada leyenda y el cierre tras La Llorona.
// `who` usa la clave del ser (f_segua…) para que salga su propio arte.
export const TENEBROSO = {
  entrada: [
    { who:'narrador', txt:'La niebla se cierra. El camino que traías ya no está detrás tuyo.' },
    { who:'guia', txt:'Esto no es Costa Rica de día… es la otra. La que cuentan los abuelos.', hi:['la otra'] },
    { who:'narrador', txt:'Seis presencias esperan en el camino. No se les pasa por un lado: se les pasa por encima.' },
  ],
  f_carreta: [
    { who:'narrador', txt:'Se oyen ruedas de madera sobre piedra. No hay bueyes. No hay boyero.' },
    { who:'f_carreta', txt:'…crac… crac… ¿Traés carga, muchacho? Yo cargo lo que nadie quiere cargar.', hi:['carga'] },
    { who:'guia', txt:'Yo cargo animales que van de vuelta a su casa. Esa carga sí la llevo con gusto.' },
    { who:'f_carreta', txt:'Entonces subite… o quitate. Las dos cuestan igual.',
      opts:[
        { t:'¿A dónde llevás todo eso?', reply:'A donde va todo lo que se olvida. Sigo yendo desde hace siglos.' },
        { t:'¿Quién te condenó?', reply:'Yo mismo. Por avaro. Igual que los que vos venís persiguiendo.' },
        { t:'No me quito.', reply:'Ningún vivo se ha quitado. Ninguno ha pasado tampoco.' },
        { t:'Entonces te quito yo.', reply:'…crac… crac… veamos.' },
      ] },
  ],
  f_segua: [
    { who:'narrador', txt:'Una mujer hermosa al borde del camino pide que la lleven. No le veás la cara.' },
    { who:'f_segua', txt:'Qué bueno que viniste. Tenía tanto tiempo de estar sola…' },
    { who:'guia', txt:'Señora… con todo respeto, voy a seguir mirando al frente.' },
    { who:'f_segua', txt:'¿Y por qué? ¿Te doy miedo, o te da miedo lo que vas a ver?',
      opts:[
        { t:'Miedo me da la vanidad.', reply:'Ah… entonces ya entendiste mi castigo mejor que yo.' },
        { t:'¿Qué le pasó?', reply:'Me quisieron por la cara. Y me quedé sin nada más que cara… hasta que la perdí.' },
        { t:'Vengo por los animales.', reply:'Todos vienen por algo. Ninguno se va con eso.' },
        { t:'Dejame pasar.', reply:'Miráme primero. Solo un segundito.' },
      ] },
    { who:'narrador', txt:'Levanta la cara. Es una calavera de caballo.' },
  ],
  f_cadejos: [
    { who:'narrador', txt:'Dos ojos rojos en la oscuridad. Cadenas que arrastran, pero no lo detienen.' },
    { who:'f_cadejos', txt:'Grrr… ¿Andás solo de noche, guía? Mala costumbre.' },
    { who:'guia', txt:'No ando solo. Ando con cinco que me eligieron.', hi:['cinco que me eligieron'] },
    { who:'f_cadejos', txt:'Hay un cadejos blanco que cuida al borracho y uno negro que se lo lleva. Adiviná cuál soy.',
      opts:[
        { t:'El blanco.', reply:'Ja. Optimista. Eso me gusta… y me da hambre.' },
        { t:'El negro.', reply:'Listo el muchacho. Lástima que serlo no te salve.' },
        { t:'Los dos.', reply:'…Nadie había dicho eso. Nadie.' },
        { t:'Me da igual.', reply:'A mí no. Yo elijo con quién me quedo.' },
      ] },
  ],
  f_tulevieja: [
    { who:'narrador', txt:'Un llanto de bebé entre las piedras del río. Y un sombrero de tule que se mueve solo.' },
    { who:'f_tulevieja', txt:'¿No oís? Mi güila. La estoy buscando desde hace tanto…', hi:['Mi güila'] },
    { who:'guia', txt:'Señora, ese llanto no es de un bebé. Es el suyo.' },
    { who:'f_tulevieja', txt:'¡No me lo digás! ¡Vos qué sabés de perder algo que no volvés a ver!',
      opts:[
        { t:'Sé de especies que ya no vuelven.', reply:'…Entonces sí sabés. Y aun así seguís buscando. Como yo.' },
        { t:'Puedo ayudarla a buscar.', reply:'Nadie me había ofrecido eso. Nadie.' },
        { t:'Descanse ya.', reply:'¡Descansar! ¿Y si aparece y yo no estoy?' },
        { t:'Tengo que pasar.', reply:'Pasá, pues. Pero el llanto se te va a pegar.' },
      ] },
  ],
  f_padre: [
    { who:'narrador', txt:'Una sotana avanza por el sendero. Arriba del cuello no hay nada.' },
    { who:'f_padre', txt:'…' },
    { who:'guia', txt:'¿Padre? …No tiene cómo contestarme.' },
    { who:'f_padre', txt:'(La voz sale de todas partes menos de él) Confesá, entonces. ¿Qué te trae de noche?',
      opts:[
        { t:'Vine a rescatar animales.', reply:'Buena obra. ¿Y por qué te tiembla la mano?' },
        { t:'Vine a terminar algo.', reply:'Todos venimos a eso. Pocos terminan.' },
        { t:'No tengo nada que confesar.', reply:'Ese es siempre el primer pecado.' },
        { t:'¿Y usted qué hizo?', reply:'Perdí la cabeza por soberbia. Literalmente.' },
      ] },
  ],
  f_llorona: [
    { who:'narrador', txt:'El río suena distinto aquí. Y sobre el agua, un lamento que no se acaba.' },
    { who:'f_llorona', txt:'¡Ay, mis hijoooos! …¿Vos también me los venís a quitar?', hi:['mis hijoooos'] },
    { who:'guia', txt:'No. Yo devuelvo. Es lo único que he hecho en toda esta travesía.', hi:['Yo devuelvo'] },
    { who:'f_llorona', txt:'Devolver… Yo no pude. Los perdí en el agua y ya no hay agua que me limpie.',
      opts:[
        { t:'Nadie merece eso para siempre.', reply:'¿Y quién sos vos para perdonarme? …Aunque suena bonito.' },
        { t:'Yo también he perdido.', reply:'Se te nota. Por eso llegaste hasta aquí.' },
        { t:'Deje ir el río.', reply:'El río es lo único que me queda de ellos.' },
        { t:'Vengo a terminar esto.', reply:'Entonces terminá. Soy la última. Después… silencio.' },
      ] },
  ],
  final: [
    { who:'narrador', txt:'La Llorona calla. Es la primera vez en siglos que el río suena solo.' },
    { who:'f_llorona', txt:'Gracias… guía. Ya puedo ir a buscarlos de verdad.' },
    { who:'guia', txt:'Que le vaya bien, señora.' },
    { who:'narrador', txt:'La niebla se abre. Amanece sobre Costa Rica, y las seis leyendas descansan.' },
    { who:'guia', txt:'Nadie me va a creer esto. Ni yo me lo creo.' },
  ],
};

// ---------- CHARLAS de lugar (aparecen a veces al entrar a una casilla) ----------
export const CHARLAS = {
  descanso: [
    [ { who:'guia', txt:'Un rato de sombra. Los animales respiran… y yo también.' } ],
    [ { who:'narrador', txt:'Alguien dejó agua y comida en el refugio. No todos en este país están con ellos.' },
      { who:'guia', txt:'Gracias, quien sea que seás.' } ],
    [ { who:'guia', txt:'Reviso patas, alas y respiración. Rehabilitar no es solo curar: es devolverles el miedo sano.', hi:['el miedo sano'] } ],
    [ { who:'narrador', txt:'En la pared del refugio hay nombres escritos: guardaparques que pasaron por aquí.' },
      { who:'guia', txt:'Voy a poner el mío cuando termine. No antes.' } ],
  ],
  tesoro: [
    [ { who:'guia', txt:'Lo que sirve, sirve. En el campo no se desprecia nada.' } ],
    [ { who:'narrador', txt:'Una mochila vieja, olvidada entre las raíces.' },
      { who:'guia', txt:'De algún compañero que no volvió. La llevo yo, entonces.' } ],
    [ { who:'guia', txt:'Comida de verdad. Mis rescatados se lo merecen más que yo.' } ],
  ],
  bioma: [
    [ { who:'narrador', txt:'Un crujido entre la maleza. Ojos que miran… y no huyen.' },
      { who:'guia', txt:'Tranquilo. No vengo a cazarte.' } ],
    [ { who:'guia', txt:'Aquí el bosque todavía suena como debe: bicho, agua y viento. Buena señal.', hi:['Buena señal'] } ],
    [ { who:'narrador', txt:'Huellas frescas en el barro, y encima, la marca de una bota.' },
      { who:'guia', txt:'Alguien más anda buscando. Hay que apurarse.' } ],
    [ { who:'guia', txt:'Cada especie que anoto es una que todavía existe. Me aferro a esa lista.' } ],
  ],
  cazador: [
    [ { who:'narrador', txt:'Radios, cuerdas y una jaula todavía tibia.' },
      { who:'guia', txt:'Llegué tarde otra vez. No la próxima.' } ],
    [ { who:'narrador', txt:'Cajas rotuladas con nombres falsos: "frutas", "artesanía".' },
      { who:'guia', txt:'Artesanía. Hijos de… perdón. Sigo.' } ],
    [ { who:'guia', txt:'No los odio. Pero no los voy a dejar seguir. Son cosas distintas.', hi:['cosas distintas'] } ],
  ],
  salvaje: [
    [ { who:'narrador', txt:'El animal gruñe, pero sus pupilas están enormes. No es rabia: es la droga.' },
      { who:'guia', txt:'Aguantá, campeón. Ya te va a pasar.' } ],
    [ { who:'guia', txt:'Pelear con ellos me duele. Recordá: no es su culpa.', hi:['no es su culpa'] } ],
  ],
  intercambio: [
    [ { who:'narrador', txt:'Un veterinario de campo ofrece llevarse a uno para tratarlo mejor.' },
      { who:'guia', txt:'Si es por su bien, adelante. Esto no se trata de mi colección.' } ],
  ],
};

// ---------- comentarios sobre los ANIMALES rescatados ----------
const RAR_TXT = {
  comun:'Común, pero ninguno sobra.',
  raro:'No se ve todos los días.',
  ultrararo:'Un hallazgo de los buenos.',
  legendario:'Legendario. Poca gente lo ve en toda su vida.',
  extinto:'Se creía EXTINTO. Esto cambia todo.',
  mitico:'Esto… no debería existir.',
};
const BIO_TXT = { bosque:'del bosque', sabana:'de la sabana', agua:'del agua',
                  montana:'de la montaña', noche:'de la noche' };

// Línea que dice el guía al rescatar/mirar un animal (usa sus datos reales).
export function comentarioAnimal(a) {
  const rar = RAR_TXT[a.rarity] || RAR_TXT.comun;
  const bio = BIO_TXT[a.bio] || '';
  return {
    who: 'guia',
    txt: `${a.n} ${bio}. ${rar} Nivel ${a.level}, ${a.atk} de ataque y ${a.hp} de vida.`,
    hi: [a.n, (RAR_TXT[a.rarity] ? rar.split('.')[0] : '')].filter(Boolean),
  };
}

// Resumen del equipo al cerrar una provincia (detalles de los rescatados).
export function resumenEquipo(team) {
  if (!team || !team.length) return null;
  const mejor = team.reduce((m, a) => (a.level > m.level ? a : m), team[0]);
  const nombres = team.map(a => a.n).join(', ');
  return [
    { who:'guia', txt:`Conmigo vienen ${team.length}: ${nombres}.`, hi:[nombres] },
    { who:'guia', txt:`El más curtido es ${mejor.n} — nivel ${mejor.level}. Ya casi está listo para volver a ser libre.`, hi:[mejor.n, 'libre'] },
  ];
}

// ¿Hay charla para esta casilla? (probabilidad, para que no canse)
export function charlaDe(tipo, prob = 0.35) {
  const arr = CHARLAS[tipo];
  if (!arr || !arr.length || Math.random() > prob) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}
