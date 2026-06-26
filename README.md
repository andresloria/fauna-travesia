# 🐾 FAUNA · Travesía — Guardianes de Costa Rica

Roguelike de fauna **100% tica**: sos guardaparques y recorrés las **7 provincias**
de Costa Rica **rescatando** animales, **rehabilitándolos** (herido → recuperándose
→ pleno) y peleando batallas de cartas contra **furtivos y traficantes** para
liberar a sus animales. El objetivo no es coleccionar: es **devolver** fauna sana a
la naturaleza (puntaje de conservación 🌿). Al final, el bosque nuboso de
**Monteverde ☁️** y el Cabecilla. ¿Cuántos animales salvás?

---

## ▶️ Cómo correrlo

El juego usa **módulos de JavaScript** (`import`/`export`), así que no se abre con
doble clic — hay que servirlo. Cualquiera de estas opciones:

```bash
# opción 1: con Node (no instala nada permanente)
npx serve .

# opción 2: con Python
python3 -m http.server 8000
```

Luego abrí `http://localhost:3000` (serve) o `http://localhost:8000` (python).

**Tests del motor** (no necesitan navegador):

```bash
npm test
```

---

## 🗂️ Estructura del proyecto

La idea central: **separar las reglas del juego de cómo se ve**. Cada archivo
tiene un solo trabajo.

```
fauna-travesia/
├── index.html         → el "cascarón": contenedores vacíos + carga main.js
├── styles.css         → todo el look (colores, tarjetas, mapa, ficha de edición)
├── make_assets.py     → baja el arte: SVGs de animales (OpenMoji) + siluetas de país
├── assets/
│   ├── animales/      → arte vectorial por especie (<key>.svg)
│   └── paises/        → siluetas de país para el fondo del mapa (<slug>.svg)
├── src/
│   ├── data.js        → CONTENIDO: animales, EFECTOS, biomas, países, objetos, reglas
│   ├── engine.js      → LÓGICA PURA: mapa, combate con efectos, niveles, sorteo de país (sin DOM)
│   ├── game.js        → ESTADO y FLUJO: nodos, captura, editar personaje, mochila
│   ├── ui.js          → INTERFAZ: dibuja el estado y conecta los clics
│   └── main.js        → conecta game + ui y arranca
└── test/
    └── engine.test.mjs → pruebas de la lógica
```

> **Assets:** el arte NO se versiona a mano. Corré `python make_assets.py` para (re)bajar
> los SVGs de animales (OpenMoji, CC BY-SA) y las siluetas de país (mapsicon, MIT) a `assets/`.

### ¿Dónde toco para…?

| Quiero… | Voy a… |
|---|---|
| agregar un animal o cambiar sus stats/efecto | `src/data.js` (`SP`) + agregar su SVG a `make_assets.py` |
| cambiar/agregar un efecto roguelike | `src/data.js` (`ABILITIES`, texto) y `src/engine.js` (`fight`, lógica) |
| agregar un país | `src/data.js` (`COUNTRIES`) + su silueta en `make_assets.py` |
| hacerlo más fácil o más difícil | `src/engine.js` (`retSize`, `bossSize`, `enemyLevel`) — escalan por profundidad |
| cambiar las reglas de evolución | `src/data.js` (`RULES.EVO_LEVELS`) y `engine.js` (`levelUp`) |
| cambiar cómo se ve algo | `styles.css` y `src/ui.js` |
| inventar un tipo de nodo nuevo | `src/engine.js` (`pickType`) y `src/game.js` (`resolveNode`) |

---

## 🧠 Por qué está separado así

- **`engine.js` no toca el navegador.** Recibe datos, devuelve resultados. Por eso
  se puede **probar con Node** (`npm test`) y, sobre todo, es **el mismo código que
  va a correr en el servidor** cuando hagamos multiplayer.
- **`game.js` no dibuja.** Solo decide. Para mostrar algo llama a `this.ui.*`. Si
  mañana cambiás toda la interfaz, no tocás ni una regla.
- **`ui.js` no decide nada.** Solo dibuja el estado y avisa cuando hacés clic.

Esta es la parte que importa para crecer como dev: cuando algo falla, sabés en qué
archivo buscar. Un bug de balance → `data.js`/`engine.js`. Un bug visual → `ui.js`.

---

## 🌐 Hoja de ruta hacia el multiplayer

El juego ya está estructurado para esto. El plan:

1. **Servidor con [PartyKit](https://www.partykit.io/)** (corre sobre Cloudflare).
   Una "sala" por partida que importa **`engine.js` tal cual** y guarda el estado.
2. **El cliente** (este mismo `ui.js`) se vuelve "tonto": dibuja el estado que le
   llega del servidor y manda acciones (`avanzar a nodo`, `capturar`, etc.).
3. **El nodo aeropuerto ✈️** deja de generar un jefe IA y, en su lugar, te empareja
   con **otro jugador real** que también llegó a su aeropuerto.

Como el motor ya está aislado y no depende del DOM, ese paso es sobre todo
"mover `engine.js` al servidor y conectar los mensajes", no reescribir el juego.

---

## ✅ Hecho

- Arte vectorial real por animal (OpenMoji) + variantes visibles por evolución (BASE / EVO I / EVO II).
- Efectos roguelike por animal: veneno, escudo, regenera, primer golpe, furia, púas (`ABILITIES` + `fight`).
- **Avatar del jugador** (nombre + país) que se guarda entre runs (`localStorage`); sale en la barra. Identidad para el futuro multiplayer.
- Editar personaje: equipar objetos, reordenar, poner al frente, liberar.
- **Animales legendarios** muy raros (`RULES.LEG_CHANCE` ~1%) atados a ciertos países (`COUNTRIES[*].legend`), con marco prismático.
- Equipo en panel propio bien visible (orden de pelea numerado, “pelea 1°”).
- Países al azar cada run; la dificultad escala por profundidad, no por el país.
- Fondo del mapa con la silueta del país que tocó (océano para Mar abierto).
- **Música de ambiente** (selva neotropical) con botón 🔊/🔇 (preferencia guardada, arranca tras el primer toque).
- **Cazadores furtivos 🏹** (nodo de alto riesgo): equipos fuertes. Si te ganan: −1 corazón y te roban un animal. Si les ganás: doble nivel + objeto raro.
- **Intercambio 🔄** (nodo): entregás un animal y recibís otro 2-3 niveles más alto.
- **13 países y 50+ animales** para más variedad (Indonesia, Egipto, China, México, Argentina + pools ampliados).
- **Campaña de 8 países** (`RULES.RUN_LENGTH`): al conquistarlos se abre un **nivel secreto**, la *Tierra Perdida* ❄️, con **fauna extinta** (mamut, dinos, dodo) y marco "EXTINTO". Vencer su jefe = pantalla de victoria 👑.
- **Dificultad escalonada**: sube por provincia (profundidad) y por cuán adentro del mapa estás (fila del nodo). Perilla: `RAMP` en engine.js (subir = más fácil).
- **Combate claro**: barras de vida, números de daño flotantes, efectos visibles (☣🛡✚) sobre la carta afectada, los dos que pelean resaltados y embistiendo, y un paso a paso con contador de turnos. La arena se construye una vez y se anima (no repinta).

## 🎨 Créditos de assets

- **Arte de animales:** [OpenMoji](https://openmoji.org/) — CC BY-SA 4.0.
- **Siluetas de país:** [mapsicon](https://github.com/djaiss/mapsicon) — MIT.
- **Ambiente de selva:** “Peruvian Amazon birds frogs daytime” de *nonamethefish* ([Freesound](https://freesound.org/people/nonamethefish/sounds/653743/)) — CC0.

## 💡 Ideas para mejorar (cuando querás)

- Sinergias de bioma (3 animales de agua → bono al equipo).
- Nodos raros: tienda con monedas, animal legendario.
- Animación de líneas del mapa y reordenar arrastrando.
- El multiplayer (ver arriba).

Hecho con cariño en Costa Rica 🇨🇷
