// ============================================================
// seleccionUI.js — PANTALLA PRINCIPAL del rediseño (mockup aprobado):
// arriba la FICHA del animal tocado (sus 3 habilidades + esquiva y su rango), botonera
// EMPEZAR/MISIONES, y abajo: tu equipo (3) · el refugio completo (desbloqueados
// a color, bloqueados en gris con su misión) · tu perfil (récord y racha).
// Habla con liga.js (estado) y lanza combates con arenaUI.js.
// ============================================================

import * as L from './liga.js';
import { SP } from './fauna_roster.js';
import { habsDe, ESQUIVA } from './habilidades.js';
import { rangoDe, RANGOS } from './misiones.js';
import { iconoIMG } from './iconos.js';
import { abrirArena } from './arenaUI.js';
import { playScene } from './dialogo.js';
import { HISTORIA, TENEBROSO, bossOf } from './historia.js';

const ART = (key) => (SP[key] && SP[key].folk) ? `assets/folclor/${key}.png` : `assets/animales/${key}.png`;
// Colores de RANGO (fondo de la insignia, con letra blanca encima). Subidos de
// brillo con el tema oscuro: los tonos viejos daban 3.9 de contraste.
const RCOLOR = { D: '#8d8266', C: '#3f92bd', B: '#ac7ee6', A: '#d3a134', S: '#d95e42' };
const BCOLOR = { bosque: '#4caf6a', sabana: '#d9a441', agua: '#3f9bd6', montana: '#9b7bc4', noche: '#6a5490' };
// versión para cuando el color de bioma se usa como TEXTO.
// ⚠️ Ojo con esta tabla: se INVIERTE cuando cambia el fondo. Con el skin GBA
// (crema) tenía que ser oscura; con el tema oscuro tiene que ser CLARA. Los
// tonos oscuros de antes daban 2.33 de contraste sobre los paneles nuevos.
const BCOLOR_TXT = { bosque: '#7fe0a0', sabana: '#f0c46a', agua: '#7fc8f5', montana: '#c3a8e8', noche: '#a894d8' };
const BEMO = { bosque: '🌳', sabana: '🌾', agua: '🌊', montana: '⛰️', noche: '🌑' };
const ORBC = { bosque: '#3f8f4a', sabana: '#c8923f', agua: '#2f6f8f', montana: '#8a6f9a', comodin: '#9a9a9a' };

const BIOMA_N = { bosque:'Bosque', sabana:'Sabana', agua:'Agua', montana:'Montaña', comodin:'Comodín' };
// el costo se muestra con el ICONO del bioma (mismo criterio que en la arena)
const orbes = (costo) => !costo || !costo.length
  ? '<span class="sl-free">GRATIS</span>'
  : costo.map(c => c === 'TODO'
      ? '<b class="sl-todo">TODA</b>'
      : `<img class="sl-orb" src="assets/iconos/bioma_${c}.png" alt="${BIOMA_N[c] || c}"
           title="${BIOMA_N[c] || c}" draggable="false">`).join('');

export function crearSeleccion(root) {
  const st = L.cargar();
  let equipo = st.ultimoEquipo.filter(k => L.desbloqueado(st, k)).slice(0, 3);
  let fichaKey = equipo[0] || st.desbloqueados[0];
  let modal = null;   // 'misiones' | null

  // El "atrás" del navegador cierra el modal en vez de sacarte del juego
  // (main.js lo convierte en este evento; ver atrasSeguro). Se engancha UNA
  // vez: si fuera dentro de render() se acumularía uno por repintado.
  window.addEventListener('fauna:atras', () => {
    if (!modal) return;
    modal = null;
    const b = root.querySelector('#slModal');
    if (b) b.innerHTML = '';
  });

  // ---------- avatar (primera vez) ----------
  function pedirGuia() {
    root.innerHTML = `
      <div class="sl-head"><div class="t">🌿 GUARDIANES DE COSTA RICA</div>
        <div class="s">Los cazadores drogan a la fauna para pelear con ella. Vos la rescatás venciéndolos.</div></div>
      <div class="gbabox sl-avatar">
        <div class="sl-avt">¿Quién sos?</div>
        <input id="slNombre" class="sl-input" maxlength="14" placeholder="Tu nombre" value="Guía">
        <div class="sl-avopts">
          <div class="sl-avopt sel" data-g="hombre"><img src="assets/personajes/guia_hombre.png" alt="Guía"></div>
          <div class="sl-avopt" data-g="mujer"><img src="assets/personajes/guia_mujer.png" alt="Guía"></div>
        </div>
        <button class="sl-btn go" id="slGo">EMPEZAR 🌿</button>
      </div>`;
    root.querySelectorAll('.sl-avopt').forEach(el => el.onclick = () => {
      root.querySelectorAll('.sl-avopt').forEach(x => x.classList.remove('sel'));
      el.classList.add('sel');
    });
    root.querySelector('#slGo').onclick = () => {
      st.guia = {
        name: (root.querySelector('#slNombre').value || 'Guía').trim(),
        guide: root.querySelector('.sl-avopt.sel').dataset.g,
      };
      L.guardar(st);
      render();
    };
  }

  // ---------- ficha del animal ----------
  function fichaHTML() {
    const key = fichaKey, sp = SP[key];
    if (!sp) return '';
    const abierto = L.desbloqueado(st, key);
    const kit = habsDe(key);          // SIN niveles: siempre están las 3
    const rango = rangoDe(sp.rarity);
    const habs = kit.habs.map(h => `
      <div class="sl-ht">
        <div class="sl-htn">${iconoIMG(h, key)}${h.n}</div>
        <div class="sl-htd">${h.desc}</div>
        <div class="sl-htf">${orbes(h.costo)}<em>↻ ${h.recarga || 0}</em></div>
      </div>`).join('') + `
      <div class="sl-ht esq">
        <div class="sl-htn">${iconoIMG(ESQUIVA, key)}Esquivar</div>
        <div class="sl-htd">${ESQUIVA.desc}</div>
        <div class="sl-htf">${orbes(ESQUIVA.costo)}<em>↻ ${ESQUIVA.recarga}</em></div>
      </div>`;
    const mision = abierto ? '' : (() => {
      const m = L.misionDeLiga(key), p = L.progresoMision(st, key, m);
      return `<div class="sl-mision">🔒 <b>${m.n}</b> — ${m.desc} <em>(${p.n}/${p.meta})</em></div>`;
    })();
    return `
      <div class="sl-ficha gbabox">
        <div class="sl-retrato ${abierto ? '' : 'bloq'}" style="--b:${BCOLOR[sp.bio] || '#3f8f4a'}">
          <span class="sl-rk" style="--r:${RCOLOR[rango]}">${rango}</span>
          <img src="${ART(key)}" alt="${sp.n}">
        </div>
        <div class="sl-finfo">
          <div class="sl-fnom">${sp.n.toUpperCase()}
            <span class="sl-fbio" style="color:${BCOLOR_TXT[sp.bio] || BCOLOR[sp.bio]}">${BEMO[sp.bio] || ''} ${sp.bio}</span>
          </div>
          <div class="sl-habrow">${habs}</div>
          ${mision}
        </div>
      </div>`;
  }

  // ---------- grid del refugio ----------
  function tileHTML(key) {
    const sp = SP[key];
    const abierto = L.desbloqueado(st, key);
    const rango = rangoDe(sp.rarity);
    const enEq = equipo.includes(key);
    const m = abierto ? null : L.misionDeLiga(key);
    return `<button class="sl-tile ${abierto ? '' : 'bloq'} ${enEq ? 'eneq' : ''} ${fichaKey === key ? 'foco' : ''}"
        data-key="${key}" style="--b:${BCOLOR[sp.bio] || '#3f8f4a'}">
      <span class="sl-trk" style="--r:${RCOLOR[rango]}">${rango}</span>
      <img src="${ART(key)}" alt="${sp.n}" loading="lazy">
      <span class="sl-tn">${sp.n}</span>
      ${abierto ? (enEq ? '<span class="sl-teq">EN EQUIPO</span>' : '') : '<span class="sl-lock">🔒</span>'}
    </button>`;
  }

  function gridHTML() {
    const orden = Object.keys(SP).filter(k => !SP[k].starter || L.desbloqueado(st, k));
    orden.sort((a, b) => {
      const da = L.desbloqueado(st, a) ? 0 : 1, db = L.desbloqueado(st, b) ? 0 : 1;
      if (da !== db) return da - db;
      return (SP[a].n || '').localeCompare(SP[b].n || '');
    });
    return orden.map(tileHTML).join('');
  }

  // ---------- render principal ----------
  function render() {
    if (!st.guia) return pedirGuia();
    const prov = L.provinciaActual(st);
    const jefe = L.tocaJefe(st);
    const libre = L.enLigaLibre(st);
    const b = bossOf(prov.n);
    const rumbo = libre
      ? `LIGA LIBRE · las leyendas acechan`
      : jefe ? `¡TE ESPERA ${b.n.toUpperCase()}!`
             : `${prov.flag} ${prov.n} · ${st.winsProv}/${L.WINS_PARA_JEFE} para el cabecilla`;
    root.innerHTML = `
      <div class="sl-head"><div class="t">🌿 ARMÁ TU EQUIPO</div><div class="s">${rumbo}</div></div>
      ${fichaHTML()}
      <div class="sl-acts">
        <button class="sl-btn go" id="slPelear" ${equipo.length === 3 ? '' : 'disabled'}>
          ${jefe && !libre ? '🚨 ENFRENTAR AL CABECILLA' : '▶ EMPEZAR COMBATE'}</button>
        <button class="sl-btn mis" id="slMisiones">📜 MISIONES</button>
        <button class="sl-btn mis" id="slVersus">⚔ 2 JUGADORES</button>
      </div>
      <div class="sl-bottom">
        <div class="gbabox sl-panel">
          <div class="sl-secth">Tu equipo</div>
          <div class="sl-slots">${[0, 1, 2].map(i => {
            const k = equipo[i];
            if (!k) return `<div class="sl-slot vacio"><span class="sn">${i + 1}</span><span class="mas">+</span></div>`;
            return `<div class="sl-slot" data-key="${k}" style="--b:${BCOLOR[SP[k].bio]}">
              <span class="sn">${i + 1}</span><img src="${ART(k)}" alt="">
              <span class="slb">${SP[k].n}</span><span class="qx">✕</span></div>`;
          }).join('')}</div>
        </div>
        <div class="gbabox sl-panel">
          <div class="sl-secth">Refugio — ${st.desbloqueados.length} de ${Object.keys(SP).length}</div>
          <div class="sl-grid">${gridHTML()}</div>
        </div>
        <div class="gbabox sl-panel sl-perfil">
          <div class="sl-pnom">${st.guia.name.toUpperCase()}</div>
          <img class="sl-pav" src="assets/personajes/guia_${st.guia.guide}.png" alt="">
          <div class="sl-prow"><span>Récord</span><b>${st.record.w} - ${st.record.l}</b></div>
          <div class="sl-prow"><span>Liberados</span><b>${st.liberados}</b></div>
          <div class="sl-prow"><span>Provincias</span><b>${Math.min(st.prov, 8)}/8</b></div>
          <div class="sl-racha"><b>🔥 ${st.racha}</b>seguidas<br><em>mejor: ${st.mejorRacha}</em></div>
        </div>
      </div>
      <div id="slModal"></div>`;
    conectar();
    if (modal === 'misiones') abrirMisiones();
  }

  function conectar() {
    root.querySelectorAll('.sl-tile').forEach(el => el.onclick = () => {
      const key = el.dataset.key;
      if (fichaKey !== key) { fichaKey = key; render(); return; }   // 1er toque: ficha
      if (!L.desbloqueado(st, key)) return;
      if (equipo.includes(key)) equipo = equipo.filter(k => k !== key);  // 2º toque: entra/sale
      else if (equipo.length < 3) equipo.push(key);
      render();
    });
    root.querySelectorAll('.sl-slot .qx').forEach(el => el.onclick = (e) => {
      e.stopPropagation();
      equipo = equipo.filter(k => k !== el.parentElement.dataset.key);
      render();
    });
    const pelear = root.querySelector('#slPelear');
    if (pelear) pelear.onclick = () => empezar();
    root.querySelector('#slMisiones').onclick = () => { modal = 'misiones'; abrirMisiones(); };
    root.querySelector('#slVersus').onclick = () => abrirVersus();
  }

  // ---------- misiones ----------
  function abrirMisiones() {
    const lista = L.listaMisiones(st);
    const box = root.querySelector('#slModal');
    box.innerHTML = `<div class="sl-ov"><div class="sl-modal gbabox">
      <div class="sl-mh">📜 MISIONES — así se desbloquean los demás <button class="sl-x" id="slCerrar">✕</button></div>
      <div class="sl-mlist">${['D', 'C', 'B', 'A', 'S'].map(r => {
        const filas = lista[r];
        if (!filas.length) return '';
        return `<div class="sl-mr"><b style="--r:${RCOLOR[r]}">${RANGOS[r].n}</b><em>${RANGOS[r].desc}</em></div>` +
          filas.map(({ key, sp, m, p }) => `
            <div class="sl-mrow" data-key="${key}">
              <img src="${ART(key)}" alt="">
              <div class="sl-mtx"><b>${sp.n}</b><span>${m.desc}</span>
                <div class="sl-mbar"><i style="width:${Math.round(p.n / p.meta * 100)}%"></i><em>${p.n}/${p.meta}</em></div>
              </div>
            </div>`).join('');
      }).join('')}</div>
    </div></div>`;
    box.querySelector('#slCerrar').onclick = () => { modal = null; box.innerHTML = ''; };
    box.querySelectorAll('.sl-mrow').forEach(el => el.onclick = () => {
      modal = null; box.innerHTML = ''; fichaKey = el.dataset.key; render();
    });
  }

  // ---------- historia (reusa el sistema de novela visual) ----------
  function escena(scene, o = {}) {
    if (!scene || !scene.length) return Promise.resolve();
    const prov = o.prov || L.provinciaActual(st);
    let boss, bossName, bossTitle;
    if (o.folk) {
      const sp = SP[o.folk];
      boss = `assets/folclor/${o.folk}.png`; bossName = sp.n; bossTitle = 'leyenda de Costa Rica';
    } else {
      const bb = bossOf(prov.n);
      boss = `assets/personajes/${bb.art}.png`; bossName = bb.n; bossTitle = bb.t;
    }
    return playScene(scene, {
      guia: `assets/personajes/retrato_${st.guia.guide === 'mujer' ? 'mujer' : 'hombre'}.png`,
      boss, bossName, bossTitle,
      heroName: st.guia.name, provincia: prov.n,
      bg: o.folk ? 'assets/escenarios/bg_sanatorio.png' : L.fondoDe(prov, false),
    });
  }

  // ---------- pelear ----------
  async function empezar() {
    const pelea = L.proximaPelea(st);
    const h = HISTORIA[pelea.prov.n];
    // escena de llegada (una vez por provincia) y careo con el jefe
    if (!L.enLigaLibre(st)) {
      const vLleg = 'llegada_' + pelea.prov.n;
      if (h && !st.vistas[vLleg]) { st.vistas[vLleg] = 1; L.guardar(st); await escena(h.llegada, { prov: pelea.prov }); }
      if (pelea.tipo === 'jefe' && h) await escena(h.jefe, { prov: pelea.prov });
    }
    if (pelea.tipo === 'leyenda') await escena(TENEBROSO[pelea.key], { folk: pelea.key });

    if (window.faunaMusic) window.faunaMusic.set('battle');
    abrirArena({
      miEquipo: equipo.map(k => ({ key: k, ref: k })),
      rivalEquipo: pelea.rivales,
      titulo: pelea.titulo, sub: pelea.sub,
      fondo: pelea.fondo, bigart: pelea.bigart, rivalArt: pelea.rivalArt,
      guiaArt: `assets/personajes/guia_${st.guia.guide}.png`, guiaSub: st.guia.name,
      onFin: async (gane, _caidos, arenaSt) => {
        if (window.faunaMusic) window.faunaMusic.set('map');
        const r = L.registrarResultado(st, pelea, arenaSt, equipo);
        // narrativa post-pelea
        if (gane && pelea.tipo === 'jefe') {
          const hh = HISTORIA[pelea.prov.n];
          if (hh) await escena(hh.victoria, { prov: pelea.prov });
        }
        if (gane && pelea.tipo === 'leyenda') {
          await avisar('🌑 ¡LEYENDA VENCIDA!', `${SP[pelea.key].n} se une a tu refugio. Nadie te va a creer.`);
        }
        for (const d of r.desbloqueos) {
          await avisar('🔓 ¡MISIÓN CUMPLIDA!', `${SP[d].e || ''} <b>${SP[d].n}</b> se une a tu refugio.`);
        }
        if (r.ganoJuego) await avisar('🏆 ¡COSTA RICA LIBRE!',
          'Venciste al Cabecilla en Monteverde. La red cayó… pero la LIGA LIBRE apenas empieza: las leyendas del Tenebroso te esperan.');
        // CIERRE DE EXPEDICIÓN: el punto pensado para soltar el juego
        if (r.expedicion) await resumenExpedicion(r.expedicion);
        render();
      },
    });
  }

  // ---------- VERSUS: dos jugadores en el mismo aparato ----------
  // Sin servidor ni cuentas: los dos arman equipo por turnos y después se
  // pasan el teléfono en cada jugada (la arena pone una cortina en medio).
  // Es la forma más barata de probar el balance con humanos de verdad, que es
  // la medición que ninguna simulación da.
  function abrirVersus() {
    const libres = st.desbloqueados.filter(k => SP[k]);
    let quien = 0;                          // 0 = jugador 1, 1 = jugador 2
    const nombres = ['Jugador 1', 'Jugador 2'];
    const equipos = [[], []];

    const box = root.querySelector('#slModal');
    const pintar = () => {
      const eq = equipos[quien];
      box.innerHTML = `<div class="sl-ov"><div class="sl-modal gbabox">
        <div class="sl-mh">⚔ VERSUS — arma tu equipo
          <button class="sl-x" id="vsX">✕</button></div>
        <div class="sl-vs">
          <div class="sl-vsfila">
            <label>Turno de</label>
            <input class="sl-input" id="vsNombre" maxlength="14" value="${nombres[quien]}">
          </div>
          <div class="sl-secth">Tu equipo (${eq.length}/3)</div>
          <div class="sl-slots" style="flex-direction:row">
            ${[0, 1, 2].map(i => eq[i]
              ? `<div class="sl-slot" data-quitar="${i}" style="flex:1">
                   <img src="${ART(eq[i])}" alt=""><span class="slb">${SP[eq[i]].n}</span></div>`
              : '<div class="sl-slot vacio" style="flex:1"><span class="mas">+</span></div>').join('')}
          </div>
          <div class="sl-secth">Elegí de tu refugio</div>
          <div class="sl-grid" style="max-height:34vh">
            ${libres.map(k => `<button class="sl-tile ${eq.includes(k) ? 'eneq' : ''}"
                data-vs="${k}"><img src="${ART(k)}" alt="" loading="lazy">
                <span class="sl-tn">${SP[k].n}</span></button>`).join('')}
          </div>
          <button class="sl-btn go" id="vsOk" ${eq.length === 3 ? '' : 'disabled'}>
            ${quien === 0 ? '▶ Listo — le toca al jugador 2' : '⚔ ¡A PELEAR!'}</button>
        </div>
      </div></div>`;

      box.querySelector('#vsX').onclick = () => { box.innerHTML = ''; modal = null; };
      box.querySelector('#vsNombre').oninput = (e) => { nombres[quien] = e.target.value || `Jugador ${quien + 1}`; };
      box.querySelectorAll('[data-vs]').forEach(el => el.onclick = () => {
        const k = el.dataset.vs;
        const i = equipos[quien].indexOf(k);
        if (i >= 0) equipos[quien].splice(i, 1);
        else if (equipos[quien].length < 3) equipos[quien].push(k);
        pintar();
      });
      box.querySelectorAll('[data-quitar]').forEach(el => el.onclick = () => {
        equipos[quien].splice(+el.dataset.quitar, 1); pintar();
      });
      box.querySelector('#vsOk').onclick = () => {
        if (equipos[quien].length < 3) return;
        if (quien === 0) { quien = 1; pintar(); return; }
        box.innerHTML = ''; modal = null;
        pelearVersus(nombres, equipos);
      };
    };
    modal = 'versus';
    pintar();
  }

  function pelearVersus(nombres, equipos) {
    if (window.faunaMusic) window.faunaMusic.set('battle');
    abrirArena({
      pvp: true,
      jugador1: nombres[0], jugador2: nombres[1],
      miEquipo: equipos[0].map(k => ({ key: k })),
      rivalEquipo: equipos[1].map(k => ({ key: k })),
      titulo: nombres[1], sub: 'versus',
      fondo: 'assets/escenarios/bioma_bosque.png',
      guiaArt: `assets/personajes/guia_${st.guia.guide}.png`,
      onFin: async (ganoJ1) => {
        if (window.faunaMusic) window.faunaMusic.set('map');
        // el versus NO toca el progreso de la campaña: es un modo aparte
        await avisar('⚔ FIN DEL VERSUS',
          `Ganó <b>${ganoJ1 ? nombres[0] : nombres[1]}</b>. Esta pelea no afecta tu liga.`);
        render();
      },
    });
  }

  // ---------- cierre de EXPEDICIÓN ----------
  // La liga entera son ~2,8 horas de reloj y no tenía ningún corte: el jugador
  // no sabía cuándo podía dejarla. Cada provincia liberada cierra acá, con su
  // resumen y DOS botones bien claros — seguir, o dejarlo hasta la próxima.
  function resumenExpedicion(e) {
    return new Promise(res => {
      const mins = Math.max(1, Math.round(e.turnos / 2 * 8 / 60));
      const prox = L.provinciaActual(st);
      const bichos = e.desbloqueos.slice(0, 6).map(k =>
        `<span class="sl-exb"><img src="${ART(k)}" alt=""> ${SP[k].n}</span>`).join('');
      const ov = document.createElement('div');
      ov.className = 'sl-ov';
      ov.innerHTML = `<div class="sl-aviso sl-exped gbabox">
        <div class="sl-at">🌿 ${e.provincia.toUpperCase()} LIBERADA</div>
        <div class="sl-exgrid">
          <div><b>${e.w}</b><span>victorias</span></div>
          <div><b>${e.peleas}</b><span>combates</span></div>
          <div><b>${e.liberados}</b><span>animales liberados</span></div>
          <div><b>${mins}</b><span>minutos</span></div>
        </div>
        ${e.desbloqueos.length ? `<div class="sl-exnew">
            <div class="sl-secth">Se unieron al refugio</div>
            <div class="sl-exlist">${bichos}${e.desbloqueos.length > 6
              ? `<span class="sl-exb">+${e.desbloqueos.length - 6} más</span>` : ''}</div>
          </div>` : ''}
        <div class="sl-am">${st.ganoJuego
          ? 'Ganaste la liga. De acá en adelante es liga libre.'
          : `Sigue <b>${prox.flag || ''} ${prox.n}</b>. Tu avance ya quedó guardado.`}</div>
        <div class="sl-exbtns">
          <button class="sl-btn go" id="exSeguir">▶ Seguir a ${st.ganoJuego ? 'la liga libre' : prox.n}</button>
          <button class="sl-btn" id="exParar">Dejarlo por hoy</button>
        </div>
      </div>`;
      document.body.appendChild(ov);
      const cerrar = () => { ov.remove(); res(); };
      ov.querySelector('#exSeguir').onclick = cerrar;
      ov.querySelector('#exParar').onclick = () => {
        cerrar();
        avisar('🌿 Nos vemos', 'Todo quedó guardado en este dispositivo. Cerrá la pestaña tranquilo: cuando vuelvas seguís justo acá.');
      };
    });
  }

  function avisar(titulo, msg) {
    return new Promise(res => {
      const ov = document.createElement('div');
      ov.className = 'sl-ov';
      ov.innerHTML = `<div class="sl-aviso gbabox"><div class="sl-at">${titulo}</div>
        <div class="sl-am">${msg}</div><button class="sl-btn go">Seguir</button></div>`;
      document.body.appendChild(ov);
      ov.querySelector('button').onclick = () => { ov.remove(); res(); };
    });
  }

  render();
  return { render, get estado() { return st; } };
}
