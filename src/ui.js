// ============================================================
// ui.js — INTERFAZ. Lee el estado y lo dibuja en el DOM.
// Conecta los clics a los métodos del juego con addEventListener.
// Si algún día cambiás el look, es acá.
// ============================================================

import { SP, BIOMES, ABILITIES, RARITY, RULES, PLAYER_FLAGS, itemBonus } from './data.js';
import * as M from './meta.js';

// Arte pixel por especie. Todo el roster (SP) tiene su PNG en assets/animales/
// (generado con gen_pixel.py). Si algún día agregás una especie sin PNG, generala.
const ART = (key) => (SP[key] && SP[key].folk) ? `assets/folclor/${key}.png` : `assets/animales/${key}.png`;
// retrato del guía (avatar del jugador): hombre o mujer
const GUIDE = (g) => `assets/personajes/guia_${g === 'mujer' ? 'mujer' : 'hombre'}.png`;
const STAGE = ['HERIDO', 'RECUPERA', 'PLENO'];   // etapas de rehabilitación

export function createUI(game) {
  const $ = (id) => document.getElementById(id);
  const phaseArea = $('phaseArea'), runbar = $('runbar'), logBox = $('log');

  // ---------- tarjeta de animal ----------
  function animalCard(a, opts = {}) {
    const stage = Math.min(2, a.evo || 0);
    const tcls = a.folk ? 'mitico' : a.ext ? 'extinct' : a.leg ? 'legendary' : ['t-base', 't-evo1', 't-evo2'][stage];
    const stageLabel = a.folk ? 'MÍTICO' : a.ext ? 'EXTINTO' : a.leg ? 'LEGENDARIO' : STAGE[stage];
    const ab = ABILITIES[a.ab], ab2 = a.ab2 ? ABILITIES[a.ab2] : null, ab3 = a.ab3 ? ABILITIES[a.ab3] : null;
    const act = opts.trade ? 'trade' : opts.edit ? 'edit' : null;
    const cls = 'acard ' + tcls + ' rc-' + a.rarity
      + (opts.fainted || a.down ? ' fainted' : '') + (a.down ? ' down' : '') + (opts.cls ? ' ' + opts.cls : '')
      + (act ? ' clickable' : '') + (opts.lead ? ' lead' : '');
    const bio = BIOMES[a.bio] ? BIOMES[a.bio].e : '';
    const data = act ? `data-act="${act}" data-uid="${a.uid}"` : '';
    const badge = (x) => `<span class="abil ${x.cls}">${x.sym} ${x.n}</span>`;
    const abil = (ab ? badge(ab) : '') + (ab2 ? badge(ab2) : '') + (ab3 ? badge(ab3) : '');
    const rar = RARITY[a.rarity];
    // la etiqueta de rareza solo para raro/ultrararo: legendario/extinto ya lo dicen en la etiqueta de nivel + el brillo
    const rarTag = (rar && (a.rarity === 'raro' || a.rarity === 'ultrararo')) ? `<span class="rar ${rar.cls}">${rar.n}</span>` : '';
    const downTag = a.down ? `<span class="downtag">💤 Debilitado</span>` : '';
    const lead = opts.lead ? `<span class="leadtag">PELEA 1°</span>` : '';
    const ord = opts.order ? `<span class="ord">${opts.order}</span>` : '';
    const items = (a.items && a.items.length)
      ? `<div class="cititems">${a.items.map(it => `<span title="${it.n} (${itemBonus(it)})">${it.e}</span>`).join('')}</div>` : '';
    return `<div class="${cls}" ${data}>
      ${lead}${rarTag}${downTag}
      <span class="stage">${stageLabel} · Nv${a.level}</span>
      <span class="bio">${bio}</span>
      <div class="art"><img src="${ART(a.key)}" alt="${a.n}" draggable="false"></div>
      <div class="an">${a.n}</div>
      <div class="stats"><span class="st atk">⚔${a.atk}</span><span class="st hp">❤${Math.max(0, a.hp)}</span><span class="st def">🛡${a.def || 0}</span><span class="st spd">💨${a.spd}</span><span class="st hab">🌀${a.hab || 0}</span></div>
      ${abil}${items}${ord}</div>`;
  }
  function teamHTML(team, o = {}) {
    if (!team.length) return `<div class="team"><div class="empty-slot">🦴</div></div>`;
    const cards = team.map((a, i) =>
      animalCard(a, { edit: o.editable, trade: o.trade, order: o.order ? i + 1 : null, lead: o.order && i === 0 })).join('');
    const inner = `<div class="team">${cards}</div>`;
    if (!o.panel) return inner;
    return `<div class="teampanel">
      <div class="teamhead"><span class="t">🏕️ Tu refugio</span><span class="s">orden de pelea →  ·  tocá una carta para ver/liberar</span></div>
      ${inner}</div>`;
  }

  // ---------- barras fijas ----------
  function renderRunbar(s) {
    const av = s.avatar
      ? `<div class="chip avatar"><img class="guideav" src="${GUIDE(s.avatar.guide)}" alt="" draggable="false"><div class="avtx"><div class="k">Guía</div><div class="v">${s.avatar.name}</div></div></div>` : '';
    runbar.innerHTML = `${av}
      <div class="chip country"><div class="k">Provincia</div><div class="v">${s.country ? s.country.flag + ' ' + s.country.n : '—'}</div></div>
      <div class="chip"><div class="k">Corazones</div><div class="hearts">${'❤'.repeat(s.hearts) || '—'}</div></div>
      <div class="chip"><div class="k">Provincias</div><div class="v">${s.cleared}/${RULES.RUN_LENGTH}</div></div>
      <div class="chip"><div class="k">Equipo</div><div class="v">${s.team.length}/${RULES.MAX_TEAM}</div></div>
      <div class="chip"><div class="k">Liberados</div><div class="v" style="color:var(--hp)">🌿 ${s.released || 0}</div></div>
      <div class="chip"><div class="k">Mochila</div><div class="v">${s.bag.length ? s.bag.map(i => i.e).join('') : '—'}</div></div>`;
  }
  function renderLog(s) { logBox.innerHTML = s.log.map(l => `<div class="le">${l}</div>`).join(''); }

  // ---------- escenarios por provincia ----------
  const PROV_SCENE = {
    'San José': 'lugar_sanjose', 'Alajuela': 'lugar_alajuela', 'Cartago': 'lugar_cartago',
    'Heredia': 'lugar_heredia', 'Guanacaste': 'lugar_guanacaste', 'Puntarenas': 'lugar_puntarenas',
    'Limón': 'lugar_limon', 'Monteverde': 'lugar_monteverde',
  };
  const SCN = (slug) => `assets/escenarios/${slug}.png`;
  // paisaje/lugar emblemático de la provincia (fondo de combate y descanso).
  // En el mapa Tenebroso, el fondo es el Sanatorio Durán de noche.
  const sceneFor = (c) => c && c.night ? SCN('bg_sanatorio') : SCN(c && PROV_SCENE[c.n] ? PROV_SCENE[c.n] : 'bioma_bosque');
  // emblema del bando enemigo (cazador o cabecilla en pixel); null si es animal salvaje
  function enemyEmblem(kind) {
    const slug = kind === 'jefe' ? 'cabecilla' : (kind === 'cazador' || kind === 'retador') ? 'cazador' : null;
    return slug ? `<img class="opp-emblem" src="${SCN(slug)}" alt="">` : '';
  }

  // ---------- fondo del mapa: Costa Rica en pixel (de día o Tenebroso de noche) ----------
  function countryBg(s) {
    const night = s.country && s.country.night;
    return `<div class="mapbg cr${night ? ' night' : ''}" style="background-image:url('${SCN(night ? 'mapa_noche' : 'mapa_cr')}')"></div>`;
  }

  // ---------- pantallas ----------
  // ---------- intro de HISTORIA ----------
  function renderIntro() {
    phaseArea.innerHTML = `
      <div class="introbox">
        <div class="big">🌿🇨🇷</div>
        <h2 class="introt">Guardianes de Costa Rica</h2>
        <p>Soñás con ser <b>guía de naturaleza</b> y ver, con tus propios ojos, a <b>todos los animales de Costa Rica</b>.</p>
        <p>Pero apenas arrancás descubrís algo terrible: una <b>red de cazadores furtivos</b> recorre el país. A los animales les dan una <b>droga</b> que los domina… y los hace <b>atacar</b> a quien se les acerca.</p>
        <p>Por eso, en cada bioma y lugar, la fauna arremete contra vos. No son malos: están <b>drogados y asustados</b>. Tu trabajo es frenarlos, <b>rescatarlos</b> y devolverles la libertad. 🩹🌿</p>
        <p>Y los animales lo sienten. Notan lo que hacés por ellos… y empiezan a <b>ayudarte</b>.</p>
        <p>Tu misión: cruzar las <b>7 provincias</b>, desbaratar a los cazadores y <b>sacarlos del país</b>. 🇨🇷</p>
        <div class="center"><button class="btn" data-act="intro-go">Empezar mi travesía 🧭</button></div>
      </div>`;
  }

  function renderAvatar(s) {
    const cur = s.avatar || {};
    const guide = cur.guide || 'hombre';
    const opt = (g) => `<div class="guideopt ${g === guide ? 'sel' : ''}" data-act="guide" data-guide="${g}">
        <img src="${GUIDE(g)}" alt="Guía" draggable="false"><span class="pick">Elegir</span></div>`;
    phaseArea.innerHTML = `
      <div class="avatarbox">
        <div class="big">🧭</div><h3>¿Quién protege la fauna?</h3>
        <label>Tu nombre de guardaparques</label>
        <input type="text" id="avName" maxlength="18" placeholder="Tu nombre" value="${cur.name || ''}">
        <label>Elegí tu guía</label>
        <div class="guidegrid">${opt('hombre')}${opt('mujer')}</div>
        <div class="center"><button class="btn" data-act="avatar-go">Empezar la misión 🌿</button></div>
        <div class="map-hint" style="margin-top:12px">Es tu identidad (sale en tu barra y al final). Lo podés cambiar luego.</div>
      </div>`;
  }

  function renderStarter(s) {
    const who = s.avatar
      ? `<div class="map-hint guideline" style="margin-bottom:10px">Guardaparques <img class="guidemini" src="${GUIDE(s.avatar.guide)}" alt=""> <b>${s.avatar.name}</b> · <button class="linklike" data-act="edit-avatar">cambiar</button></div>` : '';
    const furtivo = s.mode === 'furtivo';
    const modeSel = `<div class="modesel">
      <span class="ms-k">Modo de juego</span>
      <div class="ms-opts">
        <button class="ms-opt ${!furtivo ? 'on' : ''}" data-act="mode" data-mode="normal">🌿 Normal</button>
        <button class="ms-opt ${furtivo ? 'on danger' : ''}" data-act="mode" data-mode="furtivo">🪤 Furtivo</button>
      </div>
      <span class="ms-d">${furtivo
        ? '<b>Difícil:</b> si derrotan a un animal tuyo en combate, los cazadores <b>se lo roban</b> (desaparece).'
        : 'Los animales caídos en combate vuelven a tu refugio al terminar la pelea.'}</span>
    </div>`;
    phaseArea.innerHTML = `
      ${who}
      ${modeSel}
      <div class="section-h">Elegí tu primer rescate</div>
      <div class="starters">${s.starters.map((a, i) =>
        `<div class="starter" data-act="starter" data-i="${i}">${animalCard(a, {})}</div>`).join('')}</div>
      <div class="map-hint">Cada animal trae un <b>efecto</b> distinto. Con él arrancás tu refugio; a los demás los rescatás en el camino.</div>`;
  }

  const NODE_IC = { combate: '🪤', cazador: '🏹', salvaje: '🐾', intercambio: '🔄', tesoro: '🎁', descanso: '🏕️', sorpresa: '❓', airport: '🚨', start: '🧭' };
  const NODE_LAB = { combate: 'Furtivo', cazador: 'Traficantes', salvaje: 'Salvaje', intercambio: 'Traslado', tesoro: 'Hallazgo', descanso: 'Refugio', sorpresa: 'Sorpresa', airport: 'Cabecilla', start: 'Inicio' };
  // ícono PIXEL de cada casilla (sobre el disco). El resto sigue con emoji.
  const BIO_TILE = { bosque: 'casilla_bosque', montana: 'casilla_montana', agua: 'casilla_mar', sabana: 'casilla_sabana' };
  const tileImgFor = (n) => n.type === 'bioma' ? BIO_TILE[n.bio]
    : n.type === 'intercambio' ? 'casilla_traslado'
    : n.type === 'tesoro' ? 'casilla_hallazgo'
    : n.type === 'descanso' ? 'casilla_refugio'
    : n.type === 'salvaje' ? 'casilla_salvaje'
    : (n.type === 'cazador' || n.type === 'combate') ? 'cazador'
    : n.type === 'airport' ? 'cabecilla' : null;
  function renderMap(s) {
    const current = s.map.nodesById[s.currentId];
    const all = s.map.seq;
    // sendero lineal: cada nodo se une al siguiente
    let lines = '';
    all.forEach(n => n.children.forEach(c => {
      const avail = n === current && current.children.includes(c);
      lines += `<line x1="${n.x}" y1="${n.y}" x2="${c.x}" y2="${c.y}"
        stroke="${avail ? 'var(--gold)' : 'rgba(196,160,78,.3)'}" stroke-width="${avail ? '0.9' : '0.5'}"/>`;
    }));
    const nodes = all.map(n => {
      const avail = current.children.includes(n);
      const cls = ['mnode', n.type === 'bioma' ? ('bioma-' + n.bio) : n.type,
        n === current ? 'current' : '', avail ? 'available' : '',
        (n.visited && n !== current) ? 'visited' : '',
        (!avail && !n.visited && n !== current) ? 'locked' : ''].join(' ');
      const folk = n.type === 'folclor';
      const ic = n.type === 'bioma' ? BIOMES[n.bio].e : (NODE_IC[n.type] || '•');
      const lab = folk ? (SP[n.boss] ? SP[n.boss].n : 'Leyenda')
        : n.type === 'bioma' ? BIOMES[n.bio].n : (NODE_LAB[n.type] || '');
      const timg = folk ? null : tileImgFor(n);
      const disc = folk ? `<img src="${ART(n.boss)}" alt="" draggable="false">`
        : timg ? `<img src="${SCN(timg)}" alt="" draggable="false">` : ic;
      const isImg = folk || timg;
      const data = avail ? `data-act="node" data-id="${n.id}"` : '';
      return `<div class="${cls}" style="left:${n.x}%;top:${n.y}%" ${data}>
        <div class="disc${isImg ? ' img' : ''}">${disc}</div><div class="ml">${lab}</div></div>`;
    }).join('');
    const night = s.country.night;
    const meta = night ? 'vencé a los 6 seres del folclor 🌑'
      : s.country.secret ? 'enfrentá al Cabecilla 🚨' : 'elegí tu ruta hasta el Cabecilla 🚨';
    const tag = night ? 'noche tenebrosa 🌑' : s.country.secret ? 'final ☁️' : 'provincia ' + (s.cleared + 1) + '/' + RULES.RUN_LENGTH;
    const hint = night
      ? 'No hay vuelta atrás: vencé a cada leyenda para avanzar. Pelean ellas mismas — 3 poderes y muchísima vida. 🌑'
      : 'Elegí tu ruta: tocá un nodo iluminado. Las primeras 2 filas son tranquilas; después acechan los cazadores. ❓ = sorpresa.';
    phaseArea.innerHTML = `
      <div class="section-h">${s.country.flag} ${s.country.n} · ${meta}</div>
      <div class="mapwrap linear${night ? ' night' : ''}">${countryBg(s)}
        <div class="maptag">${s.country.flag} <b>${s.country.n}</b> · ${tag}</div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>${nodes}</div>
      <div class="map-hint">${hint}</div>
      ${teamHTML(s.team, { editable: true, panel: true, order: true })}`;
  }

  function renderWild(s) {
    const wilds = s.wilds, full = s.team.length >= RULES.MAX_TEAM;
    const bio = BIOMES[wilds[0].bio];
    const rescBtn = full ? 'Rescatar (cambia al más débil)' : 'Rescatar 🩹';
    if (s.wildLeg) {
      const a = wilds[0], ab = ABILITIES[a.ab];
      phaseArea.innerHTML = `
        <div class="section-h legend-h">✦ ¡Un LEGENDARIO necesita rescate! · ${bio.e} ${bio.n}</div>
        <div class="event-box legend-box">
          <div class="legbanner">✦ Encuentro rarísimo — no aparece seguido</div>
          <div style="margin:0 auto;max-width:150px">${animalCard(a, {})}</div>
          <div class="desc">${ab ? `<b>${ab.sym} ${ab.n}</b> — ${ab.desc}` : ''}</div>
          <div class="center"><button class="btn" data-act="wild" data-i="0">${rescBtn}</button>
            <button class="btn ghost" data-act="wild" data-i="-1">Dejarlo</button></div>
        </div>
        ${teamHTML(s.team, { panel: true, order: true })}`;
      return;
    }
    const cards = wilds.map((a, i) => {
      const ab = ABILITIES[a.ab];
      return `<div class="wildpick">
        ${animalCard(a, {})}
        <div class="wilddesc">${ab ? `${ab.sym} ${ab.n}` : ''}</div>
        <button class="btn" data-act="wild" data-i="${i}">${rescBtn}</button>
      </div>`;
    }).join('');
    phaseArea.innerHTML = `
      <div class="section-h">${bio.e} ${bio.n} · 3 animales necesitan rescate — elegí uno 🩹</div>
      <div class="wildrow">${cards}</div>
      <div class="center"><button class="btn ghost" data-act="wild" data-i="-1">Seguir sin rescatar</button></div>
      ${teamHTML(s.team, { panel: true, order: true })}`;
  }

  function renderTrade(s) {
    const a = s.offer;
    phaseArea.innerHTML = `
      <div class="section-h trade-h">🔄 Intercambio · te ofrecen un animal de más nivel</div>
      <div class="event-box trade-box">
        <div style="margin:0 auto;max-width:150px">${animalCard(a, {})}</div>
        <div class="desc">Llega a <b>Nv ${a.level}</b> (2-3 niveles arriba de tu mejor). Entregá uno de los tuyos a cambio, o seguí sin cambiar.</div>
        <div class="center"><button class="btn ghost" data-act="trade-skip">Seguir sin cambiar</button></div>
      </div>
      <div class="section-h">👇 Tocá el animal que querés ENTREGAR</div>
      ${teamHTML(s.team, { panel: true, order: true, trade: true })}`;
  }

  function renderEvent(s) {
    const ev = s.event;
    const big = ev.imgKey ? `<img class="event-legend" src="${ART(ev.imgKey)}" alt="" draggable="false">` : ev.emoji;
    phaseArea.innerHTML = `
      <div class="event-box${ev.imgKey ? ' legend' : ''}"><div class="big">${big}</div><div class="title">${ev.title}</div>
        <div class="desc">${ev.desc}</div>
        <div class="center">${ev.actions.map((a, i) => `<button class="btn" data-act="event" data-i="${i}">${a.label}</button>`).join('')}</div>
      </div>
      ${teamHTML(s.team, { panel: true, order: true })}`;
  }

  function renderEdit(s) {
    const a = game.animal(s.editId);
    if (!a) return renderMap(s);
    const ab = ABILITIES[a.ab];
    const slots = [];
    for (let i = 0; i < RULES.MAX_ITEMS; i++) {
      const it = a.items[i];
      slots.push(it ? `<div class="slot full" title="${it.n}">${it.e}</div>` : `<div class="slot">·</div>`);
    }
    const bag = s.bag.length
      ? s.bag.map((it, i) =>
          `<button class="bagitem" data-act="equip" data-bag="${i}" ${a.items.length >= RULES.MAX_ITEMS ? 'disabled' : ''}>
             ${it.e} ${it.n} <span class="plus">${itemBonus(it)}</span></button>`).join('')
      : `<div class="map-hint" style="margin:0;text-align:left">Sin objetos. Conseguís tesoros 🎁 en el mapa.</div>`;
    phaseArea.innerHTML = `
      <div class="section-h">Editar compañero <span style="flex:0 0 auto"><button class="btn ghost" data-act="edit-close">◀ Volver al mapa</button></span></div>
      <div class="editp">
        <div class="editcard">${animalCard(a, {})}</div>
        <div class="editf">
          <div class="field"><label>Compañero</label>
            <div class="editname">${a.leg ? '✦ ' : ''}${a.n}${a.leg ? ' <span class="legtag">legendario</span>' : ''}</div></div>
          <div class="field"><label>Estadísticas</label>
            <div class="statline">
              <div class="statbox"><div class="k">Ataque</div><div class="v" style="color:var(--atk)">${a.atk}</div></div>
              <div class="statbox"><div class="k">Vida</div><div class="v" style="color:var(--hp)">${a.hp}</div></div>
              <div class="statbox"><div class="k">Defensa</div><div class="v" style="color:#c9a24a">🛡 ${a.def || 0}</div></div>
              <div class="statbox"><div class="k">Velocidad</div><div class="v" style="color:#7fb0e0">${a.spd}</div></div>
              <div class="statbox"><div class="k">Nivel</div><div class="v">${a.level}</div></div>
              <div class="statbox"><div class="k">Efecto</div><div class="v abil-v">${ab ? ab.sym + ' ' + ab.n : '—'}</div></div>
            </div></div>
          <div class="field"><label>Objetos equipados (${a.items.length}/${RULES.MAX_ITEMS})</label>
            <div class="slots">${slots.join('')}</div></div>
          <div class="field"><label>Mochila — tocá para equipar</label>
            <div class="bagrow">${bag}</div></div>
          <div class="field"><label>Conservación</label>
            <div class="map-hint" style="margin:0;text-align:left">${(a.evo || 0) >= RULES.PLENO_EVO
              ? '🌿 Está <b>PLENO</b>: liberarlo suma a tu conservación (el objetivo del juego).'
              : 'Aún se está recuperando. Liberalo cuando esté <b>pleno</b> para sumar conservación.'}</div></div>
          <div class="editbtns">
            <button class="btn ghost" data-act="edit-move" data-dir="-1">◀ Mover</button>
            <button class="btn ghost" data-act="edit-move" data-dir="1">Mover ▶</button>
            <button class="btn" data-act="edit-front">Al frente</button>
            <button class="btn ${(a.evo || 0) >= RULES.PLENO_EVO ? 'liberar' : 'ghost'}" data-act="edit-release" ${s.team.length <= 1 ? 'disabled' : ''}>Liberar 🌿</button>
          </div>
        </div>
      </div>`;
  }

  function renderWin(s) {
    const who = s.avatar ? `<b>${s.avatar.name}</b> ` : '';
    if (s.nightWin) {
      $('modal').innerHTML = `
        <div class="crest"><img class="event-legend" src="${ART('f_carreta')}" alt="" draggable="false"></div><h2>Noche de espantos superada</h2>
        <p>${who}tomó el <b>sendero prohibido</b> y, en la <b style="color:#b39ddb">Costa Rica de noche</b> 🌑, venció a
           <b>La Segua</b>, <b>el Cadejos</b>, <b>la Llorona</b>, <b>la Tulevieja</b>, <b>el Padre sin Cabeza</b> y
           <b>la Carreta sin Bueyes</b>. Pocos guías sobreviven para contarlo. 🕯️</p>
        <button class="btn" data-act="restart">Nueva travesía</button>`;
      $('overlay').classList.add('show');
      return;
    }
    $('modal').innerHTML = `
      <div class="crest">🦋</div><h2>¡Costa Rica a salvo!</h2>
      <p>${who}protegió las <b>7 provincias</b> 🇨🇷, venció al Cabecilla en <b style="color:var(--gold)">Monteverde</b> ☁️
         y devolvió <b style="color:var(--hp)">🌿 ${s.released || 0}</b> ${s.released === 1 ? 'animal' : 'animales'} sanos a la naturaleza.</p>
      <button class="btn" data-act="restart">Nueva misión</button>`;
    $('overlay').classList.add('show');
  }

  function renderGameOver(s) {
    $('modal').innerHTML = `
      <div class="crest">🍂</div><h2>Fin de la misión</h2>
      <p>Recorriste <b style="color:var(--gold)">${s.cleared}</b> ${s.cleared === 1 ? 'provincia' : 'provincias'} y liberaste
         <b style="color:var(--hp)">🌿 ${s.released || 0}</b> ${s.released === 1 ? 'animal' : 'animales'} antes de caer.</p>
      <button class="btn" data-act="restart">Nueva misión</button>`;
    $('overlay').classList.add('show');
  }

  // ---------- combate animado (DOM estable: se construye una vez y se anima) ----------
  const FX = { poison:'☣', shield:'🛡', heal:'✚', first:'⚡', rage:'🔥', thorns:'🌵', dodge:'🌀' };
  const FXN = { dodge:'Esquiva', heal:'Regenera' };   // nombres para fx que no son ABILITIES
  // carta de combate, con barra de vida y vida actual/máx
  function battleCard(a, max) {
    const stage = Math.min(2, a.evo || 0);
    const tcls = a.folk ? 'mitico' : a.ext ? 'extinct' : a.leg ? 'legendary' : ['t-base', 't-evo1', 't-evo2'][stage];
    const stageLabel = a.folk ? 'MÍTICO' : a.ext ? 'EXTINTO' : a.leg ? 'LEGENDARIO' : STAGE[stage];
    const ab = ABILITIES[a.ab], ab2 = a.ab2 ? ABILITIES[a.ab2] : null, ab3 = a.ab3 ? ABILITIES[a.ab3] : null;
    const badge = (x) => `<span class="abil ${x.cls}">${x.sym} ${x.n}</span>`;
    const bio = BIOMES[a.bio] ? BIOMES[a.bio].e : '';
    return `<div class="acard ${tcls} rc-${a.rarity} battlecard" id="bc-${a.uid}">
      <span class="stage">${a.folk ? '🌑 ' : ''}Nv${a.level}</span><span class="bio">${bio}</span>
      <div class="art"><img src="${ART(a.key)}" alt="${a.n}" draggable="false"></div>
      <div class="an">${a.n}</div>
      <div class="hpbar"><div class="hpfill"></div></div>
      <div class="bstats"><span class="st atk">⚔${a.atk}</span><span class="st def">🛡${a.def || 0}</span><span class="st spd">💨${a.spd}</span><span class="st hab">🌀${a.hab || 0}</span><span class="hpnum">❤<span class="hpcur">${a.hp}</span>/${max}</span></div>
      ${ab ? badge(ab) : ''}${ab2 ? badge(ab2) : ''}${ab3 ? badge(ab3) : ''}
      <div class="hitlayer"></div></div>`;
  }

  // Combate SIMULTÁNEO: dos filas (tu equipo arriba, enemigo abajo). Cada paso del
  // motor es un "tier" (los de igual velocidad embisten a la vez) o un efecto de
  // fin de ronda. La UI solo anima los `steps` que ya calculó el motor.
  function playBattle(s, done) {
    window.faunaMusic?.set(s.country && s.country.night ? 'noche' : 'battle');
    const b = s.battle;
    const allies = b.fighters || s.team;             // solo los NO debilitados pelean
    const max = {}, hp = {};
    const sideA = new Set(allies.map(a => a.uid));   // tu equipo (arriba)
    [...allies, ...b.enemy].forEach(a => { max[a.uid] = a.hp; hp[a.uid] = a.hp; });

    renderRunbar(s);
    phaseArea.innerHTML = `
      <div class="section-h">Combate · ${s.country.flag} ${s.country.n} <span id="turnbadge" class="turnbadge"></span></div>
      <div class="arena">
        <div class="arenabg" style="background-image:url('${sceneFor(s.country)}')"></div>
        <div class="side-label">🏕️ Tu refugio</div>
        <div class="teamrow" id="rowA">${allies.map(a => battleCard(a, max[a.uid])).join('')}</div>
        <div class="vs-badge">VS</div>
        <div class="teamrow" id="rowB">${b.enemy.map(a => battleCard(a, max[a.uid])).join('')}</div>
        <div class="side-label enemy-label">${enemyEmblem(b.kind) || b.oppEmoji} ${b.oppName}</div>
        <div class="battle-msg" id="bmsg">¡Empieza el combate!</div>
      </div>`;

    // ritmo (ms) — subí para más lento
    const T_START = 480, T_LUNGE = 340, T_SETTLE = 360, T_END = 1500;
    const DY = window.innerWidth <= 520 ? 11 : 16;
    const card = (uid) => document.getElementById('bc-' + uid);
    const dead = (uid) => { const el = card(uid); return el && el.classList.contains('fainted'); };
    const lunge = (uid) => { const el = card(uid); if (el && !dead(uid)) el.style.transform = `translateY(${sideA.has(uid) ? DY : -DY}px) scale(1.06)`; };
    const rest = (uid) => { const el = card(uid); if (el && !dead(uid)) el.style.transform = ''; };
    const flash = (uid) => { const el = card(uid); if (!el) return; const h = el.querySelector('.hitlayer'); if (!h) return; h.classList.remove('flash'); void h.offsetWidth; h.classList.add('flash'); };
    const setHp = (uid) => {
      const el = card(uid); if (!el) return;
      const pct = Math.max(0, Math.round(100 * Math.max(0, hp[uid]) / max[uid]));
      const f = el.querySelector('.hpfill'); if (f) { f.style.width = pct + '%'; f.className = 'hpfill' + (pct <= 25 ? ' low' : pct <= 50 ? ' mid' : ''); }
      const c = el.querySelector('.hpcur'); if (c) c.textContent = Math.max(0, hp[uid]);
    };
    const popup = (uid, text, cls) => {
      const el = card(uid); if (!el) return;
      const p = document.createElement('span'); p.className = 'popup ' + cls; p.textContent = text;
      el.appendChild(p); setTimeout(() => p.remove(), 1100);
    };
    const faint = (uid) => { const el = card(uid); if (el) el.classList.add('fainted'); };
    // aplica el snapshot de vida del paso: barras + popups de daño/cura + destello
    const applyHp = (snap) => {
      Object.keys(snap).forEach(uid => {
        const d = hp[uid] - snap[uid];
        if (d !== 0) {
          hp[uid] = snap[uid]; setHp(uid);
          if (d > 0) { popup(uid, '−' + d, 'dmg'); flash(uid); }
          else { popup(uid, '+' + (-d), 'heal'); }
        }
      });
    };
    Object.keys(max).forEach(setHp);
    const msg = document.getElementById('bmsg'), turnb = document.getElementById('turnbadge');
    const nameOf = (uid) => { const a = [...allies, ...b.enemy].find(x => x.uid === uid); return a ? a.n : ''; };
    const fxLabel = (keys) => [...new Set(keys)].map(k => FX[k] + ' ' + (ABILITIES[k] ? ABILITIES[k].n : (FXN[k] || ''))).join('  ');

    let i = 0;
    const tick = () => {
      if (i >= b.steps.length) {
        if (msg) msg.textContent = b.result === 'W' ? '¡Ganaste! 🏆' : b.result === 'T' ? 'Empate (cuenta como derrota)' : 'Perdiste…';
        return setTimeout(done, T_END);
      }
      const st = b.steps[i++];
      if (turnb) turnb.textContent = 'Turno ' + i;
      if (st.kind === 'strike') {
        const a0 = st.attacks[0];                 // un atacante por paso (por turnos)
        const froms = [...new Set(st.attacks.map(a => a.from))];
        froms.forEach(lunge);                     // el atacante embiste a su objetivo
        const fxk = st.attacks.flatMap(a => a.fx || []);
        if (msg) msg.innerHTML = `${nameOf(a0.from)} ⚔️ ${nameOf(a0.to)}` + (fxk.length ? ' · ' + fxLabel(fxk) : '');
        setTimeout(() => {
          applyHp(st.hp);
          st.attacks.forEach(a => {
            const fx = a.fx || [];
            if (fx.includes('dodge')) popup(a.to, FX.dodge, 'fx');       // esquivó: sin daño
            if (fx.includes('shield')) popup(a.to, FX.shield, 'fx');
            if (fx.includes('thorns')) popup(a.from, FX.thorns, 'fx');
            if (fx.includes('poison')) popup(a.to, FX.poison, 'fx');     // dejó una pila de veneno
          });
          (st.faints || []).forEach(faint);
          froms.forEach(rest);
          setTimeout(tick, T_SETTLE);
        }, T_LUNGE);
      } else {   // efecto de fin de ronda (veneno)
        if (msg) msg.innerHTML = fxLabel(st.effects.map(e => e.type)) || 'Fin de ronda';
        applyHp(st.hp);
        st.effects.forEach(e => popup(e.type === 'poison' ? e.to : e.uid, FX[e.type], 'fx'));
        (st.faints || []).forEach(faint);
        setTimeout(tick, T_SETTLE);
      }
    };
    setTimeout(tick, T_START);
  }

  // ---------- dispatcher + wiring ----------
  function render(s) {
    // fuera de combate: exploración… o tema TENEBROSO si estás en el mapa de noche
    window.faunaMusic?.set(s.country && s.country.night ? 'noche' : 'map');
    renderRunbar(s);
    renderLog(s);
    if (s.phase === 'intro') renderIntro(s);
    else if (s.phase === 'avatar') renderAvatar(s);
    else if (s.phase === 'starter') renderStarter(s);
    else if (s.phase === 'map') renderMap(s);
    else if (s.phase === 'wild') renderWild(s);
    else if (s.phase === 'trade') renderTrade(s);
    else if (s.phase === 'event') renderEvent(s);
    else if (s.phase === 'edit') renderEdit(s);
    else if (s.phase === 'win') renderWin(s);
    else if (s.phase === 'over') renderGameOver(s);
    // 'battle' lo maneja playBattle directamente
    wire(s);
  }

  function wire(s) {
    phaseArea.querySelectorAll('[data-act]').forEach(elm => {
      const act = elm.dataset.act;
      elm.addEventListener('click', () => {
        if (act === 'starter') game.chooseStarter(+elm.dataset.i);
        else if (act === 'mode') game.setMode(elm.dataset.mode);
        else if (act === 'guide') { phaseArea.querySelectorAll('.guideopt').forEach(f => f.classList.remove('sel')); elm.classList.add('sel'); }
        else if (act === 'intro-go') game.startFromIntro();
        else if (act === 'avatar-go') { const sel = phaseArea.querySelector('.guideopt.sel'); game.chooseAvatar(phaseArea.querySelector('#avName').value, sel ? sel.dataset.guide : 'hombre'); }
        else if (act === 'edit-avatar') game.editAvatar();
        else if (act === 'node') game.goNode(+elm.dataset.id);
        else if (act === 'edit') game.openEdit(+elm.dataset.uid);
        else if (act === 'trade') game.tradeFor(+elm.dataset.uid);
        else if (act === 'trade-skip') game.skipTrade();
        else if (act === 'edit-close') game.closeEdit();
        else if (act === 'edit-move') game.moveAnimal(s.editId, +elm.dataset.dir);
        else if (act === 'edit-front') game.frontAnimal(s.editId);
        else if (act === 'edit-release') game.releaseAnimal(s.editId);
        else if (act === 'equip') game.equipItem(s.editId, +elm.dataset.bag);
        else if (act === 'wild') {
          const idx = +elm.dataset.i;
          if (idx >= 0) game.captureWild(idx); else game.leaveWild();
        } else if (act === 'event') s.event.actions[+elm.dataset.i].action();
      });
    });
    const restart = $('modal').querySelector('[data-act="restart"]');
    if (restart) restart.onclick = () => { $('overlay').classList.remove('show'); game.newRun(); };
  }

  // ---------- paneles meta (colección + logros) y avisos ----------
  function openPanel(html) {
    const m = $('modal'); m.className = 'modal panel'; m.innerHTML = html;
    $('overlay').classList.add('show');
    const close = m.querySelector('[data-act="panel-close"]'); if (close) close.onclick = closePanel;
    $('overlay').onclick = (e) => { if (e.target === $('overlay')) closePanel(); };
  }
  function closePanel() { $('overlay').classList.remove('show'); $('modal').className = 'modal'; $('overlay').onclick = null; }

  function dexHtml() {
    const dex = M.getDex();
    const keys = [...Object.keys(SP).filter(k => !SP[k].leg), ...Object.keys(SP).filter(k => SP[k].leg)];
    const got = keys.filter(k => dex.has(k)).length;
    const cell = (k) => {
      const has = dex.has(k), sp = SP[k];
      return `<div class="dexcell ${has ? 'got' : 'locked'} r-${sp.rarity}">
        <div class="dexart">${has ? `<img src="${ART(k)}" alt="${sp.n}">` : '<span class="qm">?</span>'}</div>
        <div class="dexn">${has ? sp.n : '? ? ?'}</div></div>`;
    };
    return `<div class="panelhead"><h3>📖 Colección · <b>${got}/${keys.length}</b></h3>
      <button class="btn ghost" data-act="panel-close">Cerrar ✕</button></div>
      <p class="panelsub">Especies de fauna tica que rescataste alguna vez. Se guardan entre partidas.</p>
      <div class="dexgrid">${keys.map(cell).join('')}</div>`;
  }
  function achHtml() {
    const got = M.getAch();
    const n = M.ACHIEVEMENTS.filter(a => got.has(a.id)).length;
    const rows = M.ACHIEVEMENTS.map(a => {
      const has = got.has(a.id);
      return `<div class="achrow ${has ? 'got' : 'locked'}">
        <div class="ache">${has ? a.e : '🔒'}</div>
        <div class="achtx"><div class="achn">${has ? a.n : '???'}</div><div class="achd">${a.d}</div></div>
        ${has ? '<div class="achok">✓</div>' : ''}</div>`;
    }).join('');
    return `<div class="panelhead"><h3>🏆 Logros · <b>${n}/${M.ACHIEVEMENTS.length}</b></h3>
      <button class="btn ghost" data-act="panel-close">Cerrar ✕</button></div>
      <div class="achlist">${rows}</div>`;
  }
  function toast(a) {
    const t = document.createElement('div'); t.className = 'toast';
    t.innerHTML = `<span class="te">${a.e}</span><span><b>¡Logro!</b> ${a.n}</span>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2800);
  }
  // botones fijos (📖 colección, 🏆 logros)
  const dexBtn = $('dexBtn'), achBtn = $('achBtn');
  if (dexBtn) dexBtn.onclick = () => openPanel(dexHtml());
  if (achBtn) achBtn.onclick = () => openPanel(achHtml());

  return { render, playBattle, toast };
}
