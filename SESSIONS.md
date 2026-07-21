# SESSIONS — bitácora de Fauna · Travesía

Registro de cada tanda de trabajo, para poder ubicarse en cualquier estado del proyecto.
Repo: `github.com/andresloria/fauna-travesia` · Live: `fauna-travesia.vercel.app`

---

## Sesión — 22 jul 2026 · #4 VERSUS: DOS JUGADORES EN EL MISMO APARATO

Botón **⚔ 2 JUGADORES** en la pantalla principal. Sin servidor, sin cuentas,
sin romper la regla de "sitio estático".

- **Armado por turnos**: el jugador 1 elige 3 y pone su nombre, después el 2.
- **La arena dejó de asumir que el jugador es el lado A.** Ahora hay `yo()` que
  devuelve `st.lado` en PvP: toda la pantalla se dibuja desde el punto de vista
  del que tiene el turno — sus animales abajo, los del otro arriba, su energía,
  sus habilidades. Verificado: al pasar el turno los equipos se dan vuelta.
- **Cortina entre jugadas**: "Pasale el aparato a [nombre]" a pantalla completa.
  Sin eso el que espera ve la jugada del otro y el juego pierde la gracia.
- El botón AUTO se esconde (no tiene sentido con dos humanos) y **el versus NO
  toca el progreso de la campaña**: es un modo aparte.

### Por qué esto importa para el balance
El #3 quedó trabado porque cinco palancas de datos no movieron la brecha, y la
hipótesis viva es que **el driver sea la IA y no los kits**. En versus no juega
la IA: juegan dos personas. Si la brecha se achica ahí, el balance de datos
estaba bien todo el tiempo y lo que había que arreglar era el bot.
**Es la medición que ninguna simulación puede dar.**

---

## Sesión — 22 jul 2026 · #3 BALANCE: CINCO PALANCAS, NINGUNA FUNCIONÓ

Objetivo: cerrar la brecha entre los 12 que siempre ganan (71%) y los 12 que
siempre pierden (32%). **No se logró.** Queda documentado para no repetirlo.

### Lo que SÍ se arregló (correctitud, no balance)
- **13 habilidades hacían daño GRATIS.** En el documento costaban 0 porque eran
  de preparación ("se transforma en otra"); la aproximación las volvió ataques.
  El precio sale de la economía real del juego (`tabla_precios`: poder mediano
  por escalón de costo), no de números inventados.
- **2 habilidades eran IMPAGABLES.** Las 6 leyendas tienen bioma `noche`, que no
  es uno de los 4 del motor: La Carreta tenía costo `["noche"]`, imposible de
  pagar. Ahora cae a comodín + guarda que revienta el generador si vuelve a pasar.

### Las cinco palancas, todas medidas
| Palanca | Desviación típica |
|---|---|
| (control, sin tocar nada) | 11,20 |
| Subir el daño de los flojos | 11,00 |
| Abaratar sus costos | 11,21 |
| Bajarles las recargas | 11,21 |
| Elegirlos por actividad estimada | **10,97** |
| Energía sesgada al bioma del equipo (100%) | 9,83 † |

† única que mueve algo, pero cambia una regla central del juego (25% al azar).

### Por qué fallaron (lo que sí se aprendió)
`tools/que_gana.mjs` midió la correlación de cada rasgo con ganar:
**ningún rasgo del kit predice ganar.** Daño +0,17 · perforar +0,03 · área
−0,02 · control +0,03. Lo único con señal es la **ACTIVIDAD** (+0,56): cuántas
veces el animal consigue jugar por turno. León breñero juega 0,69 → gana 77%;
Oso hormiguero juega 0,28 → gana 26%.

Pero subir la actividad tampoco movió el resultado. **La hipótesis viva es que
el driver sea la IA (`colaAuto`), no los datos**: si el bot no sabe usar un
kit, ningún número que le suba lo salva. Eso explicaría por qué cinco cambios
distintos en los datos dan lo mismo. **Verificarlo antes de tocar más números.**

📌 **La "brecha mejor−peor" es una métrica basura**: es el máximo menos el
mínimo de 130 estimaciones ruidosas y se mueve ±3 puntos entre corridas solo
por azar. Estuve persiguiendo ruido varias iteraciones. Las que aguantan
comparación son la **desviación típica** y el promedio top-12 vs fondo-12 —
`tools/ranking.mjs` ahora reporta las tres y avisa cuál es cuál.

---

## Sesión — 22 jul 2026 · DOS BUGS GRAVES DEL MOTOR + aturdir total

Andrés pidió: aturdir siempre completo (no por clase), y auditar que TODAS las
habilidades peguen lo que dicen. La auditoría destapó dos bugs de motor que
llevaban semanas escondidos.

### 🐛 BUG 1 — el aturdimiento de 1 turno NO EXISTÍA (114 habilidades)
`caducarEfectos` corre sobre el lado que ENTRA a jugar. Un "aturdido 1 turno"
puesto al rival se descontaba a 0 y **desaparecía antes de que el rival
jugara**. La habilidad más común del juego no hacía absolutamente nada.

Arreglo: cada efecto lleva `desde` (el turno en que nació) y **no caduca en el
turno en que se aplicó**. Los buffs propios no cambian: siguen protegiéndote
durante el turno rival y venciendo al empezar el tuyo (verificado).

### 🐛 BUG 2 — "gana 1 de energía" tiraba la energía a la basura
`darEnergia` hacía `pool['comodin']++` y el pool solo tiene los 4 biomas:
creaba una llave basura `comodin: null` y la energía prometida nunca llegaba.
Ahora el comodín entrega un bioma AL AZAR, como la energía del turno.

### Aturdir completo
`POR_CLASE = False` en el generador: todo aturdimiento aturde TODO. El detalle
por clase queda en el código por si hay que volver.
**No quedó roto**: especies con aturdir 50,2% vs sin aturdir 49,4%.

### `tools/auditar_habilidades.mjs` (nuevo)
Prueba las **408 habilidades una por una** en combate controlado y compara lo
que pasó contra lo que declaran: daño, área (que toque a los 3), curación,
toxina, aturdir, exponer, marca, invulnerable, reducción, contraataque,
defensa, robo/quema de energía, amplificar, limpiar y dar energía. Además
verifica que la DESCRIPCIÓN mencione los números reales.
**Resultado final: 408/408 sin fallas.**

📌 Dos veces el "fallo" era del auditor, no del juego: (1) comparar el pool de
energía antes/después no sirve porque el rival GANA energía al entrar y tapa
el robo — hay que mirar el evento del log; (2) marcó 7 habilidades como "sin
efecto" cuando lo que pasaba es que no sabía medir `amplificar`, `limpiar` ni
`darEnergia`. **Antes de acusar al juego, sospechar de la herramienta.**

De paso, la compensación por abrir mejoró sola a **51,1%** (era 52,3%).

---

## Sesión — 22 jul 2026 · COMPENSACIÓN POR ABRIR (arreglo #2, bloqueador de PvP)

Quien abría el combate ganaba el **61,5%** (medido en ESPEJO PERFECTO: mismo
equipo de los dos lados, así lo único que cambia es quién mueve primero). Y el
primer animal en caer era del que responde el **63,5%** de las veces: tempo
puro. Para un 1v1 con ranking eso es letal — la mitad de las derrotas se
sienten robadas.

**Arreglo: el que RESPONDE arranca con +1 energía** (`COMPENSA_SEGUNDO`).

`tools/compensa.mjs` (nuevo) probó los cuatro valores con la misma semilla:

| compensa | gana el que abre | 1ª caída es suya |
|---|---|---|
| +0 | 61,5% ❌ | 36,5% |
| **+1** | **52,3%** ✅ | 45,6% |
| +2 | 40,7% ❌ | 56,4% |
| +3 | 30,6% ❌ | 66,2% |

**52,3% es aceptable para competitivo**: las blancas en ajedrez rondan ese
mismo número y es el juego competitivo más estudiado que existe. +2 se pasa de
rosca y le da la ventaja al que responde. No hay valor entero perfecto.

`opts.compensa` existe para poder APAGARLA y medirla (lo usa la herramienta y
hay un test que lo cubre).

Efecto lateral en la campaña: la frustración temprana bajó otro poco
(15,2% → **12,8%** de partidas con 4+ derrotas seguidas), porque el jugador ya
no come el turno gratis del rival cuando el sorteo le va en contra.

⚠️ **Lo que esto NO arregla**: la brecha entre animales. top-12 vs peores
sigue en **90,9%** (era 91,7%). Ese es el arreglo #3.

---

## Sesión — 22 jul 2026 (noche) · EXPEDICIONES (arreglo #1 del veredicto)

Tras 10.000 partidas simuladas, el problema más grave no era el balance: **la
campaña duraba ~2,8 horas de reloj sin un solo corte** donde soltar el juego.

- **Cada provincia es una EXPEDICIÓN cerrada.** `st.exped` cuenta peleas,
  victorias, animales liberados, turnos y desbloqueos de la tanda;
  `registrarResultado` la devuelve en `out.expedicion` al vencer al cabecilla
  y arranca una nueva.
- **Pantalla de cierre** (`resumenExpedicion` en seleccionUI): "SAN JOSÉ
  LIBERADA" con las 4 cifras de la tanda, los animales que se unieron, y **dos
  botones**: seguir a la próxima provincia, o *"Dejarlo por hoy"* — que
  confirma que todo quedó guardado. Ese es el permiso explícito para irse.
- **WINS_PARA_JEFE 4 → 3**: corta ~20% del total.

### Medido antes y después (`tools/enganche.mjs`, nuevo)
| | antes | después |
|---|---|---|
| Campaña completa | 2,8 h (supuesto) | **1,6 h MEDIDAS**, en 8 sesiones |
| Una sesión (provincia) | no existía | **~12 min · 7 peleas** |
| Primer cabecilla | 16 min | **13 min** |
| Partidas con 4+ derrotas seguidas | 20,9% | **15,2%** |

📌 `enganche.mjs` traía el largo de campaña **hardcodeado en 96 peleas**; lo
"midió" sin medir nada y me dio 2,8 h aun después del cambio. Ahora juega
campañas de verdad hasta Monteverde. **Un número que no se recalcula es un
número que miente.**

📌 Verificado en el navegador jugando de verdad hasta vencer al cabecilla de
San José, no solo en simulación.

---

## Sesión — 22 jul 2026 (tarde) · cambio 3→1, música de aventura, ANIMACIONES

- **Cambio de energía: 3→1** (era 5→1 como el original; Andrés lo bajó para
  que la válvula sirva en turnos tempranos). Motor + botón + tests al día.
- **Música general nueva**: `make_musica_aventura.py` → `aventura.mp3` (37.8 s,
  152 BPM). Rock de aventura en RE MAYOR limpio, a propósito distinto del
  power metal de pelea (MI menor distorsionado a 168): el salto al combate se
  siente. Bombo en negras, bajo pulsante en corcheas, I–V–vi–IV, arpegio de
  pluck y melodía heroica pentatónica en la 2ª vuelta. Verificada por espectro.
- **ANIMACIONES DE COMBATE de verdad**: `animarTurno` ya no re-cuenta jugadas —
  sigue el **log de eventos del motor** en orden:
  · `usa` → el atacante SE LANZA hacia la fila contraria (mis tarjetas suben,
    las del rival bajan) con su flecha y el cartel
  · `golpe` → sacudida + destello + número (violeta si es toxina); si la
    defensa lo absorbió todo, "🛡 absorbido"
  · `bloqueado` → **EL ESQUIVE**: paso al costado con fantasma + "¡esquivada!"
  · `cura` verde · `contra` con 🌵 · `agotamiento` gris · `cae` → se desploma
  Números flotantes con corrimiento al azar para que no se tapen.
- Verificado con MutationObserver en vivo: ar-lanza, ar-pega y ar-esquiva
  dispararon en una pelea AUTO real, 0 errores de consola.

📌 Animar desde el LOG del motor y no desde la cola del jugador: la cola no
sabe de contraataques, toxinas ni esquives — el log sí.

---

## Sesión — 22 jul 2026 · KIT ÚNICO PARA LAS 136 ESPECIES + cambio de energía

Reclamo de Andrés (con razón): el documento trae **179 kits completos** y el
juego solo usaba 37 — el resto compartía plantillas casi iguales.

### Reasignación
`ASIGNADOS` en `make_habilidades_doc.py`: los kits de animales del documento
que no tienen sprite se reasignan **por afinidad** a especies que sí lo tienen
(el mapache recibe el kit de arena de Gaara —Shukaku ES un mapache-tanuki—, el
venado el del clan Nara que cría venados, la jicotea el de Guy cuya invocación
es una tortuga, las leyendas del folclor los kits de jefes: la Segua el zorro
de nueve colas, la Tulevieja a Konan de la lluvia…). Resultado:
- **136/136 especies con kit del documento, 0 duplicados** (el generador
  REVIENTA si dos especies quedan con el mismo kit — no puede volver a pasar).
- 43 kits quedan en reserva para especies nuevas (lista en el reporte).
- Las mecánicas sin estructura se aproximan **leyendo el efecto completo en
  inglés** (`aprox_desde_en`); solo 22 de 408 habilidades quedaron genéricas
  (las de sellos/invocaciones, listadas para curar a mano).

### Reglas del original (el scribd que pasó Andrés)
El documento de Scribd está truncado (solo se ve el índice), pero el índice
coincide con The Basics que ya implementamos. Lo que sí faltaba:
- **CAMBIO DE ENERGÍA: 5 cualesquiera → 1 del tipo que elijás, 1 vez por
  turno** (`cambiarEnergia` en arena.js + botón "⇄ 5→1" bajo la columna de
  energía). Paga sacando de los montones más grandes. En la UI solo se ofrece
  con la cola vacía: si ya encolaste, esas 5 podrían estar reservadas.

### Verificado
- 0 kits duplicados en el juego vivo (medido en el navegador sobre las 136).
- Cambio 5→1 probado en vivo: 3🌳+2🌾 → 1⛰, una vez por turno, con test.
- Liga completa: 100% terminadas, 0 colgadas, 0 excepciones, 82-93
  desbloqueos por liga. 21 tests arena + 6 misiones + 46 engine.

📌 Los tests que nombraban habilidades del documento ("Sangría" del
murciélago) se rompen con cada reasignación: SIEMPRE kit de laboratorio.

---

## Sesión — 21 jul 2026 (cierre) · POWER METAL Y AJUSTES DE JUEGO

- **Música de combate: power metal** (`make_musica_pelea.py` → `pelea_metal.mp3`,
  45.7 s, 168 BPM, estéreo). Todo sintetizado con numpy, melodía original.
  Los ingredientes: power chords de sierra con saturación `tanh` (el ampli a
  válvulas comprime, no recorta), palm mute en corcheas para el galope, doble
  bombo en semicorcheas, y lead en **menor armónica** duplicado una tercera
  arriba = las guitarras gemelas. Progresión i-VI-VII-i en Mi menor.
  Verificado por espectro (no se puede escuchar desde acá): picos en 164 Hz
  (E3), 123 Hz (B2) y 73 Hz — el acorde de quinta esperado; 0 s en silencio;
  diferencia L/R de 0.32, o sea estéreo de verdad.
- **Icono de bioma en el costo** de cada habilidad, en la arena y en la ficha.
  Antes eran puntitos de color y había que acordarse de cuál era cuál.
- **Hover**: pasar el mouse por una habilidad ya muestra qué hace, sin tocarla
  ni encolarla; al salir vuelve a lo que estabas mirando.
- **El botón ATRÁS ya no saca del juego** (`atrasSeguro` en main.js): se deja un
  estado de más en el historial y se repone cada vez que el navegador lo
  consume. Ahora "atrás" cierra el modal de misiones, y en pleno combate no
  hace nada.

📌 Un `addEventListener` dentro de `render()` se acumula: uno por repintado.
Va afuera, en el armado.

---

## Sesión — 21 jul 2026 (noche) · SE FUE EL SKIN GBA

El juego quedaba partido en dos: entrabas con el skin GBA (cielo celeste,
paneles crema, marcos de 3px, tipografía pixel) y peleabas con la arena nueva.
Ahora **todo el juego usa el mismo lenguaje visual**: fondo oscuro, paneles
translúcidos, esquinas redondeadas, sans del sistema.

⚠️ **Los sprites y los iconos siguen siendo pixel art** — es el arte del juego.
Lo que se modernizó es el CROMADO de la interfaz.

### Cómo se hizo (sin borrar 900 líneas)
Un bloque **`TEMA MODERNO`** al final de `styles.css` que pisa al viejo por
orden de cascada. Lo que lo hace barato: **las variables viejas ahora apuntan al
tema nuevo** (`--px` y `--body` → la sans; `--line`, `--ink-g`… → la paleta
oscura), así que cientos de reglas se modernizaron solas. El CSS del juego de
tablero descartado quedó en el archivo pero no se renderiza.

### Trampas que aparecieron
- 📌 **`details.how` le gana a `.how`.** El skin viejo pintaba con el selector de
  dos partes, así que el `.how` del tema nuevo perdía por especificidad y la caja
  seguía crema. Hay que repetir el selector completo.
- 📌 **Las tablas de color de TEXTO se INVIERTEN al cambiar el fondo.**
  `BCOLOR_TXT` en `seleccionUI.js` se había oscurecido a propósito para el fondo
  crema; sobre los paneles oscuros daba **2.33** de contraste. Ahora es la
  versión clara. La misma trampa, al revés.
- 📌 **Insignias de rango: letra OSCURA.** Los colores de rango son tonos medios;
  con letra blanca daban 3.5-3.8.
- 📌 **Cuidado con el medidor de contraste**: al sumar los degradados de los
  ancestros tomó el degradado del `body` como fondo de todo y marcó 141 textos
  malos que estaban bien. Los degradados se anotan aparte y se miran a ojo.

Verificado midiendo: **0 textos bajo 4.5** en inicio, armar-equipo y misiones;
**0 elementos con el fondo crema**; **0 con fuente pixel**; sin desborde en 375px.

---

## Sesión — 21 jul 2026 (tarde) · AUDITORÍA DE MISIONES

El modo historia ya existía y funciona (armar equipo → cazadores de la provincia
→ cada 4 victorias el cabecilla → 8 provincias → liga libre con las leyendas).
Lo que faltaba era que las misiones de desbloqueo **se pudieran cumplir**.

`node tools/auditar_misiones.mjs` (nuevo) revisa las 105 misiones de dos formas:
estática (¿pide algo que no existe?) y **empírica** (juega ligas completas y mira
quién se desbloquea de verdad). Antes: **9 rotas + 4 durísimas**. Ahora: **0**.

### Bugs de código que encontró
- **`soloClase` nunca se cumplía**: `cumpleFiltro()` hacía `return false` fijo.
  La Rana dardo era indesbloqueable. Implementado leyendo las clases de cada
  habilidad usada en el log (la Esquiva no cuenta: es universal).
- **Los objetivos anidados (`obj.y`) nunca avanzaban**: `avanzarMision` solo
  miraba `obj.tipo`, así que el Sapo dorado ("rescatá N de montaña **Y** ganá el
  juego") era imposible. Ahora cada objetivo lleva su contador (el anidado con
  sufijo `':y'`).
- **`sinPerder` no existe** como filtro (el real es `sinCaidos`): se ignoraba en
  silencio.
- **Las misiones de "ganá el juego" eran de un solo intento**: se evaluaban solo
  en la pelea final de Monteverde. Si esa vez no cumplías el filtro, se perdían
  para siempre. Ahora cada jefe de la liga libre da otra oportunidad.
- Las descripciones de los kits de plantilla decían "**dano**" sin ñ (561).

### Números que se ajustaron, con la razón
- **Racha CON filtro extra → 3.** Con ~50% de victoria, encadenar 6 es 1.6% por
  intento; sumarle "sin que caiga ninguno" o "equipo de un solo bioma" lo volvía
  inalcanzable. Las rachas SIN filtro (3 y 5) andaban bien y quedaron igual.
- **Leyendas: 100% en vez de 60%** cuando quedan pendientes. Con 60% al azar, la
  Llorona y la Tulevieja casi nunca salían.
- **Sapo dorado: 12 → 9** especies de montaña (había exactamente 12: pedía el
  100% sin margen).

📌 **El perfil del simulador decide el veredicto.** Un jugador que arma equipos
AL AZAR nunca va a cumplir "ganá 3 seguidas con equipo de puro agua", y eso NO
significa que la misión esté rota. Por eso el auditor mide con dos perfiles
(azar y cazamisiones) y solo marca ROTA la que ni el cazamisiones logra.
Y las que dependen de decisiones que la IA no toma (`sinEsquiva`, `soloClase`,
`soloUnoVivo`) **no son simulables**: se prueban a mano en
`test/misiones.test.mjs` (6 pruebas). Sin eso, habría "arreglado" misiones que
estaban bien.

Desbloqueos por liga: **88.4 → 92.8**. 100% de ligas terminadas, 0 excepciones.

---

## Sesión — 21 jul 2026 · LOS KITS OFICIALES (documento de Andrés)

Andrés mandó `fauna-travesia-habilidades.json` + `Fauna-Travesia_Ataques_final.xlsx`:
**722 habilidades de 100 animales**, portadas 1:1 de los personajes del original
(4 habilidades por personaje). Desde hoy **ese documento manda** sobre las
plantillas.

### Qué se hizo
- **`make_habilidades_doc.py`** (nuevo): lee el JSON y genera `src/movesets_doc.js`
  + `REPORTE_HABILIDADES.md`. Re-correr cuando llegue una versión nueva del doc.
- **`src/habilidades.js`**: la prioridad ahora es `MOVESETS_DOC` → `MOVESETS`
  (a mano) → `MOVESETS_GEN` (plantilla).
- **Cada animal del doc trae 4 habilidades + la esquiva universal = 5 botones**
  (antes eran 3 + esquiva). Verificado en escritorio y celular: no se desborda.
- **Tests despegados de los datos**: 6 pruebas buscaban "Zarpazo" o "Mordida al
  cráneo" y se rompían con cada actualización del documento. Ahora usan un KIT de
  laboratorio que se le enchufa a la unidad, así prueban el MOTOR y no los datos.

### Decisiones que quedaron fijadas
- **Chakra → bioma** (1:1, el documento dice "sin cambios"):
  Taijutsu=🌳bosque · Ninjutsu=🌊agua · Bloodline=⛰montaña · Genjutsu=🌾sabana ·
  Random=⚪comodín.
- **La descripción se GENERA desde los efectos implementados**, nunca se copia del
  documento. Así el texto no puede prometer algo que el motor no hace. Lo que no se
  pudo implementar sale en el reporte, no escondido en una descripción bonita.
- **Duración desde el inglés**: 36 reducciones de daño traen el valor pero no los
  turnos (solo 7 lo dicen). Poner 1 por defecto dejaba habilidades de recarga 5 que
  protegían un turno — basura. Se lee del `efecto_en` ("for 4 turns"), que además es
  la fuente autoritativa según la leyenda del Excel.
- **27 habilidades sin mecánica estructurada** (reflejos, sellos, invocaciones,
  vínculos de vida) se **aproximaron a mano** leyendo su efecto completo en inglés;
  17 quedaron en kits base. Dejarlas vacías eran 27 botones muertos.
- Cuando un animal trae varios kits (el personaje tenía versiones), se usa el
  **primero completo**; el resto queda en `VARIANTES_DOC`, sin usar.

### ⚠️ Balance: el pool quedó MEZCLADO
`node tools/doc_vs_gen.mjs` (nuevo):

| | resultado |
|---|---|
| documento vs plantilla | el documento gana **29%** |
| documento vs documento | 48.8% (parejo) |
| plantilla vs plantilla | 49.9% (parejo) |

Cada mitad es coherente consigo misma, pero **las plantillas pegan más fuerte que
los kits oficiales** (básico de 20-25 con recarga 0 contra 15 con recarga 1). Las
37 especies oficiales quedan en desventaja mientras convivan con las 93 de
plantilla. Se resuelve solo cuando el documento cubra las 136 — o bajando las
plantillas a la escala del documento. **Falta la decisión de Andrés.**

📌 Un tester que mide contra un equipo de referencia se vuelve mentiroso si el
equipo de referencia también cambia: `tools/kits.mjs` marcaba 97% para medio
roster porque la Boa (que es parte del trío de referencia) se había debilitado.

---

## Sesión — 19/20 jul 2026

### Cómo está el juego HOY (lo que está en vivo y funcionando)

**Contenido**
- 136 especies (127 fauna tica + 6 leyendas del folclor + 3 básicos), arte pixel real.
- 7 provincias + Monteverde (final) + **mapa Tenebroso** (easter egg: ir SIEMPRE por la izquierda).
- **130 fichas oficiales** con datos reales (`src/fichas.js`): nombre científico, hábitat tico,
  dieta, dato curioso y estado de conservación. Salen la 1ª vez que rescatás cada especie.
- **8 cabecillas propios**, uno por provincia, con arte y personalidad (`src/historia.js`).
- **Sistema de diálogos** estilo novela visual (`src/dialogo.js`): retrato, placa de nombre,
  palabras resaltadas, hasta 4 opciones con respuesta, botón **SALTAR ⏭ / Esc**.
- Guion completo: llegada / careo / victoria por provincia, entrada + 6 leyendas + cierre del
  Tenebroso, charlas de lugar, y el guía **aconseja** ante un hallazgo raro comparando con tu equipo.

**Aspecto**
- Skin GBA en TODA la interfaz: cielo celeste, paneles crema con borde grueso y bisel,
  tipografía pixel auto-hospedada (Press Start 2P + VT323 en `assets/fonts/`).
- Mapas con identidad por provincia: pasto propio, vista del lugar real al fondo y props de
  PixelLab (Teatro Nacional, Basílica, ruinas, volcán, faro, árbol de Guanacaste, plataneras…).
- **Cartas estilo colección**: marco que brilla según rareza (común nada → raro sutil → ultra
  medio → legendario oro → extinto cobre → **mítico con aura negra**), arte a sangre sobre el
  bioma, corazones de vida y barras de estadísticas.

### Lo que se hizo en esta sesión

**1. Veredicto del juego** — simulador propio, 3000 partidas + 50.000 duelos. Hallazgos:
- `MAX_HEARTS` era 1 → cualquier derrota mataba, y los "+1 corazón" del refugio y del cabecilla
  **no hacían nada** (topados en 1). El juego era una ruleta de 8 tiros (43% llegaba al final).
- **"Primer golpe" rendía 31.7% en 1v1: MENOS que no tener habilidad (32.4%).**
- "Escudo" servía una sola vez por pelea (35.4%). "Veneno" dominaba (84.7%).
- En un **espejo exacto el bando A ganaba el 100%** (el desempate iba por uid).
- **Subir de nivel casi no se sentía**: 2 niveles = +4 puntos de victoria; +2 de defensa = +21.
- El experto y el normal ganaban igual (33.6% vs 36.2%) → **no había estrategia**.

**2. Arreglos (todos medidos, no a ojo)**
- Primer golpe: rearma **cada ronda** + su golpe de prioridad pega **+1**.
- Escudo: amortigua **un tercio del 1er golpe de cada ronda** (con la mitad se volvía OP: 77.6%).
- Desempate **al azar** → espejos a 48-50%.
- El nivel da **defensa cada 3 niveles** → 2 niveles ahora valen **+26 puntos** (antes +4).
- `MAX_HEARTS: 2` — los corazones por fin significan algo.
- `enemyLevel(depth, isBoss, playerLvl)`: **piso que sigue al jugador** sin adelantarlo. Se
  terminaba en Nv~25 contra un cabecilla Nv~15. Efecto: **farmear dejó de ser gratis**
  (el perfil que grindea bajó de 92% a 56.7%).
- Anti-frustración: si todo el equipo queda debilitado, **el más entero se levanta**.
- Reparto de habilidades: de 53 puntos de diferencia a **30**; todas por encima de "sin habilidad".

**3. Diseño del combate nuevo (ARENA)** — ver `ARENA.md`
Estudiado del wiki de Naruto-Arena (reglas + fichas de personajes reales). El lenguaje numérico
está **copiado, no inventado**.

**4. Sistema de misiones** — ver `src/misiones.js`
Rangos D→S derivados de la rareza; la mayoría piden **rachas** (perder reinicia), que es lo que
obliga a armar estrategia.

**5. (20-jul) REGLA: vida 100 para TODOS** — pedido de Andrés. Como el original: ni nivel ni
rareza tocan stats; el nivel solo desbloquea habilidades. Escrito en ARENA.md §3.

**6. (20-jul) Estudio COMPLETO del wiki** — los 22 personajes documentados de Naruto-Arena,
cada habilidad con daño/costo/recarga/clases → `tools/na_personajes.json` (crudo) y
ARENA.md §2b (patrones destilados: el kit-MODO, setup→payoff, exponer como counter de la
esquiva, perforante, invisible, marca permanente…).

**7. (20-jul) Moveset para las 136 especies** — `make_movesets.py` genera
`src/movesets_gen.js` (122 kits por arquetipo: rol × bioma × rareza, números del estudio;
la rareza sube COMPLEJIDAD, no números) + los 14 a mano de `habilidades.js` que siempre
mandan. `habsDe()` ya resuelve contra ambos: **cobertura 136/136**. Quedan 13 marcados
`TODO kit a mano` (legendarios/míticos sin kit propio: danta*, manatí, lapa, águila harpía,
sapo dorado*, tiburón ballena, quetzal dorado y las 6 leyendas). *danta y sapo_dorado tienen
provisional pero merecen kit único.

**8. (20-jul) Mockups aprobados en artifacts** — pantalla de combate CALCADA de la referencia
del original (fondo de selva del juego, tuyos a la izquierda / rival a la derecha / tiles al
medio, LISTO+timer+energía arriba, descripción abajo) y pantalla de armar equipo (ficha al
tocar, refugio abajo, misiones visibles en los bloqueados). Falta implementarlas en el juego.

---

## DECISIÓN GRANDE (20-jul): REDISEÑO TOTAL DEL COMBATE
Andrés: *"vamos a quitar el juego como estaba previsto antes; rediseño total; las mismas
reglas de Naruto-Arena (The Basics)"*. El combate automático (`fight()`) se RETIRA.
Reglas fieles: vida 100 parejo · energía 25% al azar por tipo · 1er turno 1 energía,
después 1 por vivo · cola en orden · recargas · esquiva universal · clases
instant/sostenido/control · toxina atraviesa invulnerabilidad.

**✅ HECHO (20-jul): `src/arena.js` — el motor nuevo, lógica pura** con
`test/arena.test.mjs` (20 pruebas): construcción, economía de energía (matar baja la
economía del rival), cola en orden (exponer→pegar al invulnerable), recargas, toxina vs
esquiva, defensa destructible (+ ignorarla), robar energía, pasivas (Caparazón, Madrugador,
Púas…), IA `colaAuto` + `combateAuto`, y fuzz de 500 combates (52.8% el que abre, 0 cuelgues).
Los 46 tests viejos siguen verdes (el motor viejo aún existe hasta el swap de UI).

**✅ HECHO (20-jul): la PANTALLA de combate + el SWAP.**
- `src/arenaUI.js` + CSS `ar-*` en styles.css: ventana 940×600 escalada entera (estilo
  emulador), fondo de selva del juego, cabecilla grande, tus filas a la izquierda con
  tiles de habilidad, rivales a la derecha, LISTO + timer (60 s; si vence, pasa el turno,
  como el original), energía por bioma, cola con números de orden (click al tile encolado
  la saca), objetivos en amarillo, AUTO (usa `colaAuto`), RENDIRSE, descripción abajo.
- `game.js startBattle()` YA NO usa `E.fight()`: abre la arena con los **3 de mayor nivel**
  en pie y devuelve el resultado a `onBattleEnd()` intacto (corazones, debilitados,
  recompensas, modo furtivo — todo el flujo de siempre).
- Verificado EN NAVEGADOR con clicks reales: seleccionar → objetivos encendidos → cola
  ①② → LISTO pega → AUTO termina el combate → cartel → onFin → el juego siguió sin
  errores de consola. Bug arreglado de paso: las toxinas tickeaban cada medio-turno
  (ahora tickean al cierre del turno del envenenado = 1 vez por ronda, como el original).
- Cache-busting: index.html a `?v=10` · puerto local a **5650**.

**✅ HECHO (20-jul, tarde): EL TABLERO SE FUE — estructura Naruto-Arena completa.**
Pedido de Andrés: *"el sistema de ir por un tablero lo descartamos; ahora será igual que
Naruto-Arena; ~30 animales fijos y el resto por misiones; música más relajante"*.
- **`src/liga.js`** — el juego nuevo: LIGA por provincias. Rivales al azar del pool de la
  provincia → cada **4 victorias, el cabecilla** (con sus escenas de historia de siempre)
  → 7 provincias → **Monteverde** → **liga libre** donde las 6 leyendas del Tenebroso
  aparecen de jefes (vencerlas las desbloquea). XP por victoria (+2, jefe +4) → nivel
  (tabla 2/5/9/14/20/27/35, cap Nv8) → habilidades. Persistencia en `fauna_liga_v1`.
- **31 animales de BASE** (comunes cubriendo roles y biomas) y **105 con MISIÓN**: las 25
  a mano + `misionAutoDe()` (misiones.js) genera el resto por rango. Progreso real desde
  el log de la arena: rachas con filtros, totales, curado/robado/contraataques, jefes,
  leyendas, "rescatar" = especies GANADAS (las de base no cuentan — la Danta se
  auto-cumplía el día 1, arreglado y verificado).
- **`src/seleccionUI.js`** — la pantalla principal (mockup aprobado): ficha con pasiva +
  4 habilidades (Nv marcado), equipo de 3, refugio con candados y misión visible, perfil
  con récord/racha, modal MISIONES por rango con barras de progreso, avatar 1ª vez.
- **`main.js` reescrito** (el tablero quedó sin usar en game.js/ui.js/engine.js) ·
  index.html nuevo (v=11, "Cómo se juega" del rediseño).
- **`assets/audio/ambiente.mp3`** — música RELAJANTE nueva (make_musica_ambiente.py:
  pads lentos, caja de música pentatónica, pájaros, brisa; 74 s loop) para la selección;
  pelea.ogg sigue en combate.
- **Verificado en navegador**: avatar → selección (136 tiles) → EMPEZAR → escena de
  llegada VN → arena "CAZADORES DE SAN JOSÉ" → victoria → aviso de misión cumplida →
  récord/racha/liberados guardados → 4 wins muestra "¡TE ESPERA DON RUFINO!" con botón
  🚨 ENFRENTAR AL CABECILLA. Cero errores de consola. Puerto local: **5651**.

**✅ HECHO (20-jul, noche): SIN NIVELES, SIN PASIVAS + celular arreglado.**
Pedido de Andrés: *"eliminá los niveles, todos pueden usar todas las habilidades, solo
depende del costo de energía de bioma; eliminá las pasivas, únicamente los ataques"* +
*"en celular se ve cortadísimo, es injugable"*.
- **Fuera niveles y XP**: `habsDe(key)` devuelve siempre las 3 + esquiva. Fuera de
  `arena.js` (mkUnidad sin `nivel`), `liga.js` (sin XP ni `st.animales`), `seleccionUI.js`
  (sin "Nv" ni avisos de subida). La dificultad ahora la da el POOL: en provincias
  avanzadas y contra cabecillas salen especies de rareza mayor (`elegirRivales`).
- **Fuera pasivas**: se borró todo el registro del motor (~60 líneas) y el generador.
- **⚠️ REBALANCE OBLIGADO (medido con `tools/kits.mjs`)**: quitar las pasivas destapó que
  los kits cuyo **básico costaba bioma específico se quedaban sin jugar** (rendían 5% vs
  94% de los que tenían básico gratis). Prueba directa: mismo animal, básico gratis 97%
  vs básico con bioma 0%. **Arreglo: el básico ahora cuesta 1 COMODÍN y pega 20, parejo
  para los 136** (los 14 a mano incluidos). El bioma sigue mandando en la 2ª y 3ª.
  Resultado: roles de **41%–61%** (antes 5%–94%), brecha entre animales en juego real
  **23.6 puntos** (antes 48.6), 0 peleas estancadas (antes 66), combates de 15 turnos
  (antes 23). Puma nerfeado: su definitiva de 100 ahora exige 2 de montaña + toda la
  energía (mataba de un golpe en el turno 1 → 96% de victorias).
- **📱 CELULAR**: la ventana fija de 940×600 se dibujaba **de x=287 a x=654 en una
  pantalla de 375** (casi toda fuera) y a escala 0.39 la letra quedaba en 2px. Ahora:
  (a) la ventana se ancla con `position:absolute; left/top:50%` + `translate(-50%,-50%)`
  para que nunca se salga en escritorio, y (b) **bajo 900px NO se escala**: un @media la
  convierte en columna fluida (marcador → rivales → tus filas → descripción), tiles de
  65×58 y letra de 10px. Verificado en 375×812: ventana de 6→369, **0 desbordes**, sin
  scroll horizontal, y tocar habilidad → objetivos → LISTO funciona.
- 19/19 tests del motor (3 actualizados a la economía nueva).

**✅ HECHO (20-jul, cierre): iconos de habilidad + arreglo de "no se ve".**
- **"eso no se ve"** era `image-rendering: pixelated` sobre sprites de 256px
  mostrados a 46-90px: al REDUCIR, 'pixelated' tira pixeles y rompe el dibujo
  (es el mismo bug que ya se había arreglado para los sprites del juego y se
  coló en las pantallas nuevas). Los sprites reducidos van con `auto`;
  'pixelated' queda SOLO para lo que se amplía (fondos tileados, escenarios).
- **ICONOS DE HABILIDAD**: `make_iconos_hab.py` dibuja 24 iconos pixel art
  16×16 (exportados x4 a 64px) → `assets/iconos/`. El mapeo vive en
  `src/iconos.js` y elige en 2 pasos: primero por EFECTO (veneno, escudo,
  curar, robar, quemar, exponer, aturdir, área, modo, marca…) para que el
  jugador aprenda el símbolo sin leer; si es daño simple, por la FORMA del
  ataque (garra/colmillo/pico/ala/cola/tenaza/lengua) según el nombre y, si no
  alcanza, según qué clase de animal es. Verificado: **las 544 habilidades
  mapean a un archivo existente, 0 rotas**. Se muestran solo en divisores
  exactos de 64 (32px en combate, 16px en la ficha) para que no se aliaseen.
- ⚠️ **PixelLab está en $0** (`get_balance`), por eso los iconos son dibujados
  por código. Si se recarga, se pueden reemplazar uno por uno sin tocar nada
  más: el juego solo pide `assets/iconos/<nombre>.png`.
- **Nombres más variados**: el vocabulario de `make_movesets.py` se amplió →
  de 104 nombres únicos a **174** para 408 ranuras (repetición 3.9x → 2.3x).

**✅ HECHO (20-jul, cierre 2): KITS VARIADOS — se corrigió el "copy-paste".**
Andrés: *"no pongas un ataque generico por 1, que todos sean diferentes... que
existan unos que peguen con 1 energia pero de BIOMA... lo hiciste super generico"*.
Tenía razón y mi arreglo anterior (todos con básico de 1 comodín) era **el error
opuesto**. Conté los costos REALES del original (`tools/na_personajes.json`):
  23 habilidades cuestan **1 chakra ESPECÍFICO** ← la categoría de daño más grande
  38 cuestan 1 Random, pero casi todas son el Bloqueo universal y los MODOS
   5 son GRATIS (marcas/setup, nunca daño fuerte) · los combos de 2 y 3 son mixtos
- **17 FORMAS de kit** calcadas de personajes reales (`make_movesets.py`), 2-3 por
  rol, elegidas de forma determinista por animal: *Lee* (castigo sostenido),
  *Sasuke* (dos golpes + MODO), *Kiba* (área sostenida + marca gratis), *Temari*
  (área cara + refugio de equipo), *Kin* (barato encadenado), *Neji* (presión
  con recarga 1), *Sakura*, *Rin*, *Hinata*, *Shino*, *Obito*, *Dosu*, *Gaara*,
  *Chouji*, *Zaku* y dos de púas. Ahora dos animales del mismo rol suelen tener
  estructura de costo, recarga y efectos DISTINTA.
- Reparto de costos resultante: **124 de 1 energía de bioma**, comodín reservado
  para modos/bloqueos, 17 gratis, 15 de 3 energías. Espeja al original.
- **Los combates dejaron de ser rápidos**: de 15 a **24-28 turnos** por pelea.
- **AGOTAMIENTO** (`arena.js`): pasada la ronda 20 todos pierden vida creciente.
  Sin esto, con costos de bioma **138 peleas se estancaban en 200 turnos** entre
  equipos defensivos. Ahora: **0 estancadas** en 30.000 combates.
- Balance por rol: **42.9%–62.5%** (el rol *primer golpe* subió de 35% a 49%
  tras subirle el daño; *veneno* bajó de 80% poniéndole recarga a Dosu).
- `tools/kits.mjs` corregido: medía tríos del MISMO animal, lo que castigaba de
  más a los mono-bioma. Ahora mide el animal + 2 socios fijos (equipo mixto real).

⚠️ **Hallazgo abierto**: en la simulación el perfil "experto" (elige por poder de
kit) ahora rinde PEOR que el que elige al azar. No es que el juego esté mal: es
que **la diversidad de biomas pesa más que el poder bruto del kit**, y la
heurística del simulador no lo sabe. Hay que enseñarle a valorar la cobertura de
energía antes de volver a usar esos números como medida de "jugar bien".

**✅ HECHO (20-jul, cierre 3): guías con su arte completo + FONDO DE BOSQUE.**
Decisión final de Andrés: *"usá esos artes sin editar nada, también quitá el
color celeste y poné verde con árboles"*.
- **Los guías van con el PNG original, sin recortar ni retocar y SIN NADA
  encima**: se quitó el `opacity:.6` del no-seleccionado (eso sí alteraba la
  imagen; ahora el no elegido se distingue con un velo del MARCO, vía `::after`).
  Verificado en el navegador: opacity 1 en ambos, `filter:none`.
- ⚠️ **Por qué "no se ve el pelo": está así en el arte.** Ampliando el archivo
  ×5 se ve que el pelo del guía son **hebras sueltas de 1-2 px** sobre una
  cabeza casi calva. A 256px esas hebras desaparecen. Solución: mostrarlos al
  **DOBLE (512 = ×2 exacto)** y **APILADOS**, que así caben en el ancho normal
  de la página; en celular bajan a ×1 (256), también exacto. Solo escalas
  enteras, nunca una rota.
- Se probaron y descartaron antes: `pixelated` reducido (pierde píxeles), `auto`
  reducido (emborrona pelo y barba) y un retrato recortado ×2 (legible pero él
  quiere el arte entero). También se descartó ensanchar el `.wrap` con `:has()`
  para ponerlos lado a lado: el panel de 1040px se salía de la página.
- **✅ LO QUE FINALMENTE LO ARREGLÓ: FONDO OSCURO detrás del guía** (idea de
  Andrés). El sprite es de ropa tan/beige — su color medio es (140,122,100) —
  y yo lo tenía sobre verde CLARO: contraste **2.76**, se fundía con el fondo.
  Con un radial oscuro (#33513a→#16240f) el figura resalta y además le brillan
  las partes claras (canas, carné, reflejos). Se le sumó un `drop-shadow`
  blanco de 2px que separa la silueta **sin tocar los colores del sprite**.
  Ahí por fin se leen el pelo, los anteojos, la barba, el carné y el portapapeles.
  📌 Lección: antes de pelear con `image-rendering`, medir el CONTRASTE del
  sprite contra el fondo que se le pone detrás.
- **Fondo: bosque verde tileable** (`make_fondo_bosque.py` → 128×128 sin
  costura, copas vistas desde arriba en 3 verdes; se dibuja a 64px y se amplía
  ×2 para que el píxel quede chunky como los sprites). Reemplaza el degradado
  celeste en el `body`, con un velo oscuro arriba y abajo para que los paneles
  crema resalten.
- ⚠️ **El fondo oscuro rompió la legibilidad** y hubo que barrer contrastes:
  título, bajada y encabezados estaban entre **1.24 y 1.93** (mínimo 4.5). Se
  pasaron a claros con sombra (ahora 7.0–8.7). Además apareció que
  `details.how` tenía `background:rgba(0,0,0,.2)` — un resto del tema oscuro
  viejo — así que su texto quedaba ilegible: ahora es panel crema.
  De paso se arreglaron 5 contrastes que YA venían mal sobre crema (etiquetas
  chiquitas, el botón verde) y se agregó `BCOLOR_TXT`: el color de bioma sirve
  para bordes, pero como TEXTO daba 3.1 y necesitaba una versión oscura.
  **Barrido final: 0 textos por debajo de 4.5 en toda la pantalla.**

## PRÓXIMOS PASOS (retomar por acá)

0. ✅ **RESUELTO el 21-jul con el DOCUMENTO de Andrés** (ver sesión de abajo):
   los kits ya no son plantillas, salen de `fauna-travesia-habilidades.json`.
   Lo que queda de ese frente:
   - **Crear los 62 animales que faltan** (lista completa en
     `REPORTE_HABILIDADES.md`): sprite + entrada en el roster. El kit ya está
     escrito, entra solo al re-correr `python make_habilidades_doc.py`.
   - **Decidir qué hacer con las 99 especies que el documento NO trae**: hoy
     siguen con kit de plantilla y por eso son más fuertes que las oficiales
     (ver la nota de balance).

1. **Probar el arco completo jugando**: cabecilla → provincia 2 → … → Monteverde →
   liga libre con leyendas (solo probé la 1ª provincia + el estado del jefe).
2. **Kits a mano para los 13 marcados TODO** en `movesets_gen.js` (legendarios + leyendas).
3. **Retirar del repo el juego viejo** (game.js, ui.js, partes de engine.js y sus tests)
   cuando el nuevo esté rodado — o dejarlo como archivo histórico.
4. **Rebalancear con `combateAuto`**: nivel de rivales por provincia vs curva de XP.
5. Pulir la arena: daño flotante, sonido de golpes, indicador de sostenidos/control.
6. Las **fichas educativas** (fichas.js) hoy quedaron fuera del flujo — engancharlas al
   desbloquear una especie nueva (el guía te la presenta).

### Pendientes viejos (del juego de TABLERO, que se descartó)
Se dejan anotados solo por si algo se rescata; **ninguno aplica al juego actual**:
paneles laterales EQUIPO/MOCHILA/PROGRESO · el balance de "2 corazones / 81% de
victorias" (ya no hay corazones) · `assets/audio/tema_tico.mp3` sin cablear.

### Notas técnicas para el que retome
- **Caché de módulos ES**: el `?v=N` de `index.html` NO invalida los imports internos
  de `main.js`. Para ver cambios de `src/*.js` en local hay que **subir el puerto** en
  `.claude/launch.json` (va por **5657**).
- **El screenshot del navegador SÍ funciona** en estas sesiones (la nota vieja decía
  lo contrario). Se cuelga con imágenes muy grandes: si pasa, bajar el viewport.
  Igual conviene verificar por DOM con `javascript_tool` — contraste, desbordes y
  escalas se miden, no se miran.
- 📌 **Antes de pelear con `image-rendering`, medir el CONTRASTE del sprite contra
  el fondo que se le pone detrás.** Cuatro intentos se fueron en escalas y suavizado
  cuando el problema era que un sprite beige estaba sobre fondo verde claro (2.76).
- 📌 **Escalas de sprites: solo enteras** (×1, ×2) o fracciones exactas (½, ¼).
- El token de PixelLab se lee **solo** de `PIXELLAB_TOKEN`; nunca va al repo.
  ⚠️ **La cuenta está en $0** — no se puede generar arte ahí hasta recargar.

### Generadores (Python) — editar el script, nunca la salida
| Script | Genera |
|---|---|
| `make_movesets.py` | `src/movesets_gen.js` — los kits de las 122 especies sin kit propio |
| `make_iconos_hab.py` | `assets/iconos/*.png` — los 24 dibujos de habilidad |
| `make_fondo_bosque.py` | `assets/escenarios/fondo_bosque.png` — el fondo verde tileable |
| `make_musica_ambiente.py` | `assets/audio/ambiente.mp3` — el tema relajante |
| `make_fauna_data.py` | `src/fauna_roster.js` — el roster de 136 especies |
| `gen_props.py` · `gen_bosses.py` · `make_music_cr.py` | props, cabecillas y tema tico (PixelLab/numpy) |

### Herramientas de medición
| Comando | Para qué |
|---|---|
| `node test/arena.test.mjs` | 19 pruebas del motor de combate |
| `node test/engine.test.mjs` | 46 pruebas del motor viejo (sigue verde) |
| `node tools/liga_sim.mjs 1000` | juega ligas completas: victorias, turnos, cuelgues |
| `node tools/kits.mjs` | balance por rol y los kits extremos |
| `node tools/energia.mjs` | cuánto se queda sin jugar un equipo por falta de energía |
