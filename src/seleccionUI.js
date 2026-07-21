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
const RCOLOR = { D: '#6f6552', C: '#2f6f8f', B: '#6b3f9e', A: '#a8791a', S: '#a8442a' };
const BCOLOR = { bosque: '#3f8f4a', sabana: '#c8923f', agua: '#2f6f8f', montana: '#8a6f9a', noche: '#4a3a63' };
const BEMO = { bosque: '🌳', sabana: '🌾', agua: '🌊', montana: '⛰️', noche: '🌑' };
const ORBC = { bosque: '#3f8f4a', sabana: '#c8923f', agua: '#2f6f8f', montana: '#8a6f9a', comodin: '#9a9a9a' };

const orbes = (costo) => !costo || !costo.length
  ? '<span class="sl-free">GRATIS</span>'
  : costo.map(c => c === 'TODO'
      ? '<b class="sl-todo">TODA</b>'
      : `<i class="sl-orb" style="background:${ORBC[c]}"></i>`).join('');

export function crearSeleccion(root) {
  const st = L.cargar();
  let equipo = st.ultimoEquipo.filter(k => L.desbloqueado(st, k)).slice(0, 3);
  let fichaKey = equipo[0] || st.desbloqueados[0];
  let modal = null;   // 'misiones' | null

  // ---------- avatar (primera vez) ----------
  function pedirGuia() {
    root.innerHTML = `
      <div class="sl-head"><div class="t">🌿 GUARDIANES DE COSTA RICA</div>
        <div class="s">Los cazadores drogan a la fauna para pelear con ella. Vos la rescatás venciéndolos.</div></div>
      <div class="gbabox sl-avatar">
        <div class="sl-avt">¿Quién sos?</div>
        <input id="slNombre" class="sl-input" maxlength="14" placeholder="Tu nombre" value="Guía">
        <div class="sl-avopts">
          <div class="sl-avopt sel" data-g="hombre"><img src="assets/personajes/retrato_guia_hombre.png" alt="Guía"></div>
          <div class="sl-avopt" data-g="mujer"><img src="assets/personajes/retrato_guia_mujer.png" alt="Guía"></div>
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
            <span class="sl-fbio" style="color:${BCOLOR[sp.bio]}">${BEMO[sp.bio] || ''} ${sp.bio}</span>
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
        render();
      },
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
