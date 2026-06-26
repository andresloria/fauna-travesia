// ============================================================
// ui.js — INTERFAZ. Lee el estado y lo dibuja en el DOM.
// Conecta los clics a los métodos del juego con addEventListener.
// Si algún día cambiás el look, es acá.
// ============================================================

import { BIOMES, ABILITIES, RULES, PLAYER_FLAGS } from './data.js';

const ART = (key) => `assets/animales/${key}.svg`;
const STAGE = ['HERIDO', 'RECUPERA', 'PLENO'];   // etapas de rehabilitación

export function createUI(game) {
  const $ = (id) => document.getElementById(id);
  const phaseArea = $('phaseArea'), runbar = $('runbar'), logBox = $('log');

  // ---------- tarjeta de animal ----------
  function animalCard(a, opts = {}) {
    const stage = Math.min(2, a.evo || 0);
    const tcls = a.ext ? 'extinct' : a.leg ? 'legendary' : ['t-base', 't-evo1', 't-evo2'][stage];
    const stageLabel = a.ext ? 'EXTINTO' : a.leg ? 'LEGENDARIO' : STAGE[stage];
    const ab = ABILITIES[a.ab];
    const act = opts.trade ? 'trade' : opts.edit ? 'edit' : null;
    const cls = 'acard ' + tcls
      + (opts.fainted ? ' fainted' : '') + (opts.cls ? ' ' + opts.cls : '')
      + (act ? ' clickable' : '') + (opts.lead ? ' lead' : '');
    const bio = BIOMES[a.bio] ? BIOMES[a.bio].e : '';
    const data = act ? `data-act="${act}" data-uid="${a.uid}"` : '';
    const abil = ab ? `<span class="abil ${ab.cls}">${ab.sym} ${ab.n}</span>` : '';
    const lead = opts.lead ? `<span class="leadtag">PELEA 1°</span>` : '';
    const ord = opts.order ? `<span class="ord">${opts.order}</span>` : '';
    return `<div class="${cls}" ${data}>
      ${lead}
      <span class="stage">${stageLabel} · Nv${a.level}</span>
      <span class="bio">${bio}</span>
      <div class="art"><img src="${ART(a.key)}" alt="${a.n}" draggable="false"></div>
      <div class="an">${a.n}</div>
      <div class="stats"><span class="st atk">⚔${a.atk}</span><span class="st hp">❤${Math.max(0, a.hp)}</span></div>
      ${abil}${ord}</div>`;
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
      ? `<div class="chip avatar"><div class="k">Jugador</div><div class="v">${s.avatar.flag} ${s.avatar.name}</div></div>` : '';
    runbar.innerHTML = `${av}
      <div class="chip country"><div class="k">Provincia</div><div class="v">${s.country ? s.country.flag + ' ' + s.country.n : '—'}</div></div>
      <div class="chip"><div class="k">Corazones</div><div class="hearts">${'❤'.repeat(s.hearts) || '—'}</div></div>
      <div class="chip"><div class="k">Provincias</div><div class="v">${s.cleared}/${RULES.RUN_LENGTH}</div></div>
      <div class="chip"><div class="k">Refugio</div><div class="v">${s.team.length}/${RULES.MAX_TEAM}</div></div>
      <div class="chip"><div class="k">Liberados</div><div class="v" style="color:var(--hp)">🌿 ${s.released || 0}</div></div>
      <div class="chip"><div class="k">Mochila</div><div class="v">${s.bag.length ? s.bag.map(i => i.e).join('') : '—'}</div></div>`;
  }
  function renderLog(s) { logBox.innerHTML = s.log.map(l => `<div class="le">${l}</div>`).join(''); }

  // ---------- fondo del país ----------
  function countryBg(s) {
    if (!s.country) return '';
    if (s.country.ocean || !s.country.map) return `<div class="mapbg ocean"></div>`;
    return `<div class="mapbg" style="-webkit-mask-image:url('assets/paises/${s.country.map}.svg');mask-image:url('assets/paises/${s.country.map}.svg')"></div>`;
  }

  // ---------- pantallas ----------
  function renderAvatar(s) {
    const cur = s.avatar || {};
    const sel = cur.flag || PLAYER_FLAGS[0];
    phaseArea.innerHTML = `
      <div class="avatarbox">
        <div class="big">🧭</div><h3>¿Quién protege la fauna?</h3>
        <label>Tu nombre de guardaparques</label>
        <input type="text" id="avName" maxlength="18" placeholder="Tu nombre" value="${cur.name || ''}">
        <label>Tu país</label>
        <div class="flaggrid">${PLAYER_FLAGS.map(f =>
          `<div class="flagopt ${f === sel ? 'sel' : ''}" data-act="flag" data-flag="${f}">${f}</div>`).join('')}</div>
        <div class="center"><button class="btn" data-act="avatar-go">Empezar la misión 🌿</button></div>
        <div class="map-hint" style="margin-top:12px">Es tu identidad (sale en tu barra y al final). Lo podés cambiar luego.</div>
      </div>`;
  }

  function renderStarter(s) {
    const who = s.avatar
      ? `<div class="map-hint" style="margin-bottom:10px">Guardaparques ${s.avatar.flag} <b>${s.avatar.name}</b> · <button class="linklike" data-act="edit-avatar">cambiar</button></div>` : '';
    phaseArea.innerHTML = `
      ${who}
      <div class="section-h">Elegí tu primer rescate</div>
      <div class="starters">${s.starters.map((a, i) =>
        `<div class="starter" data-act="starter" data-i="${i}">${animalCard(a, {})}</div>`).join('')}</div>
      <div class="map-hint">Cada animal trae un <b>efecto</b> distinto. Con él arrancás tu refugio; a los demás los rescatás en el camino.</div>`;
  }

  function renderMap(s) {
    const X = [20, 50, 80], yFor = (r) => 90 - r * 15.5;
    const current = s.map.nodesById[s.currentId];
    const all = Object.values(s.map.nodesById);
    let lines = '';
    s.map.rows.slice(0, 5).forEach(row => row.forEach(n => n.children.forEach(c => {
      const avail = n === current && current.children.includes(c);
      lines += `<line x1="${X[n.c]}" y1="${yFor(n.r)}" x2="${X[c.c]}" y2="${yFor(c.r)}"
        stroke="${avail ? 'var(--gold)' : 'rgba(196,160,78,.25)'}" stroke-width="${avail ? '0.8' : '0.4'}"/>`;
    })));
    const nodes = all.map(n => {
      const avail = current.children.includes(n);
      const cls = ['mnode', n.type === 'bioma' ? ('bioma-' + n.bio) : n.type,
        n === current ? 'current' : '', avail ? 'available' : '',
        (n.visited && n !== current) ? 'visited' : '',
        (!avail && !n.visited && n !== current) ? 'locked' : ''].join(' ');
      const ic = n.type === 'bioma' ? BIOMES[n.bio].e : n.type === 'combate' ? '🪤' : n.type === 'cazador' ? '🏹'
        : n.type === 'intercambio' ? '🔄' : n.type === 'tesoro' ? '🎁' : n.type === 'descanso' ? '🏕️' : n.type === 'airport' ? '🚨' : '🧭';
      const lab = n.type === 'bioma' ? BIOMES[n.bio].n : n.type === 'combate' ? 'Furtivo' : n.type === 'cazador' ? 'Traficantes'
        : n.type === 'intercambio' ? 'Traslado' : n.type === 'tesoro' ? 'Hallazgo' : n.type === 'descanso' ? 'Refugio' : n.type === 'airport' ? (s.country.secret ? 'Cabecilla' : 'Cabecilla') : 'Inicio';
      const data = avail ? `data-act="node" data-id="${n.id}"` : '';
      return `<div class="${cls}" style="left:${X[n.c]}%;top:${yFor(n.r)}%" ${data}>
        <div class="disc">${ic}</div><div class="ml">${lab}</div></div>`;
    }).join('');
    const meta = s.country.secret ? 'enfrentá al Cabecilla 🚨' : 'cruzá la provincia y frená a los furtivos 🚨';
    phaseArea.innerHTML = `
      <div class="section-h">${s.country.flag} ${s.country.n} · ${meta}</div>
      <div class="mapwrap">${countryBg(s)}
        <div class="maptag">${s.country.flag} <b>${s.country.n}</b> · ${s.country.secret ? 'final ☁️' : 'provincia ' + (s.cleared + 1) + '/' + RULES.RUN_LENGTH}</div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>${nodes}</div>
      <div class="map-hint">Tocá un nodo iluminado para avanzar. Sabés el bioma, pero el animal a rescatar sale al azar.</div>
      ${teamHTML(s.team, { editable: true, panel: true, order: true })}`;
  }

  function renderWild(s) {
    const a = s.pendingWild, ab = ABILITIES[a.ab], full = s.team.length >= RULES.MAX_TEAM;
    const acts = full
      ? [['Rescatar (refugio lleno)', 'replace'], ['Dejarlo', 'leave']]
      : [['Rescatar 🩹', 'capture'], ['Dejarlo', 'leave']];
    const head = a.leg
      ? `<div class="section-h legend-h">✦ ¡Un LEGENDARIO necesita rescate! · ${BIOMES[a.bio].e} ${BIOMES[a.bio].n}</div>`
      : `<div class="section-h">${BIOMES[a.bio].e} ${BIOMES[a.bio].n} · un animal necesita rescate 🩹</div>`;
    phaseArea.innerHTML = `
      ${head}
      <div class="event-box${a.leg ? ' legend-box' : ''}">
        ${a.leg ? `<div class="legbanner">✦ Encuentro rarísimo — no aparece seguido</div>` : ''}
        <div style="margin:0 auto;max-width:150px">${animalCard(a, {})}</div>
        <div class="desc">${ab ? `<b>${ab.sym} ${ab.n}</b> — ${ab.desc}` : ''}</div>
        <div class="center">${acts.map(([t, k]) =>
          `<button class="btn ${k === 'leave' ? 'ghost' : ''}" data-act="wild" data-k="${k}">${t}</button>`).join('')}</div>
      </div>
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
    phaseArea.innerHTML = `
      <div class="event-box"><div class="big">${ev.emoji}</div><div class="title">${ev.title}</div>
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
             ${it.e} ${it.n} <span class="plus">+${it.atk}⚔ +${it.hp}❤</span></button>`).join('')
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
    const who = s.avatar ? `${s.avatar.flag} <b>${s.avatar.name}</b> ` : '';
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
  const FX = { poison:'☣', shield:'🛡', heal:'✚', first:'⚡', rage:'🔥', thorns:'🌵' };
  // carta de combate, con barra de vida y vida actual/máx
  function battleCard(a, max) {
    const stage = Math.min(2, a.evo || 0);
    const tcls = a.ext ? 'extinct' : a.leg ? 'legendary' : ['t-base', 't-evo1', 't-evo2'][stage];
    const stageLabel = a.ext ? 'EXTINTO' : a.leg ? 'LEGENDARIO' : STAGE[stage];
    const ab = ABILITIES[a.ab];
    const bio = BIOMES[a.bio] ? BIOMES[a.bio].e : '';
    return `<div class="acard ${tcls} battlecard" id="bc-${a.uid}">
      <span class="stage">${stageLabel} · Nv${a.level}</span><span class="bio">${bio}</span>
      <div class="art"><img src="${ART(a.key)}" alt="${a.n}" draggable="false"></div>
      <div class="an">${a.n}</div>
      <div class="hpbar"><div class="hpfill"></div></div>
      <div class="bstats"><span class="st atk">⚔${a.atk}</span><span class="hpnum">❤<span class="hpcur">${a.hp}</span>/${max}</span></div>
      ${ab ? `<span class="abil ${ab.cls}">${ab.sym} ${ab.n}</span>` : ''}</div>`;
  }

  function playBattle(s, done) {
    const b = s.battle;
    const max = {}, abOf = {};
    s.team.forEach(a => { max[a.uid] = a.hp; abOf[a.uid] = a.ab; });
    b.enemy.forEach(a => { max[a.uid] = a.hp; abOf[a.uid] = a.ab; });
    const hp = {}; Object.keys(max).forEach(u => hp[u] = max[u]);
    const nameOf = (uid) => { const a = s.team.find(x => x.uid === uid) || b.enemy.find(x => x.uid === uid); return a ? a.e + ' ' + a.n : ''; };

    renderRunbar(s);
    phaseArea.innerHTML = `
      <div class="section-h">Combate · ${s.country.flag} ${s.country.n} <span id="turnbadge" class="turnbadge"></span></div>
      <div class="arena">
        <div class="vsrow">
          <div class="bside"><div class="side-label">🏕️ Tu refugio</div><div class="team">${s.team.map(a => battleCard(a, max[a.uid])).join('')}</div></div>
          <div class="vs-badge">VS</div>
          <div class="bside"><div class="side-label">${b.oppEmoji} ${b.oppName}</div><div class="team">${b.enemy.map(a => battleCard(a, max[a.uid])).join('')}</div></div>
        </div>
        <div class="battle-msg" id="bmsg">¡Empieza el combate!</div>
      </div>`;

    // ritmo del combate (ms) — subir para más lento, bajar para más rápido
    const T_START = 950, T_IMPACT = 450, T_SETTLE = 780, T_END = 1700;
    const card = (uid) => document.getElementById('bc-' + uid);
    const setHp = (uid) => {
      const el = card(uid); if (!el) return;
      const pct = Math.max(0, Math.round(100 * Math.max(0, hp[uid]) / max[uid]));
      const f = el.querySelector('.hpfill');
      f.style.width = pct + '%';
      f.className = 'hpfill' + (pct <= 25 ? ' low' : pct <= 50 ? ' mid' : '');
      const c = el.querySelector('.hpcur'); if (c) c.textContent = Math.max(0, hp[uid]);
    };
    const popup = (uid, text, cls) => {
      const el = card(uid); if (!el) return;
      const p = document.createElement('span'); p.className = 'popup ' + cls; p.textContent = text;
      el.appendChild(p); setTimeout(() => p.remove(), 1150);
    };
    const clearFront = () => document.querySelectorAll('.battlecard.front').forEach(e => e.classList.remove('front', 'enemy', 'lungeA', 'lungeB'));
    Object.keys(hp).forEach(setHp);
    const msg = document.getElementById('bmsg'), turnb = document.getElementById('turnbadge');

    let i = 0;
    const tick = () => {
      if (i >= b.steps.length) {
        clearFront();
        if (msg) msg.textContent = b.result === 'W' ? '¡Ganaste! 🏆' : b.result === 'T' ? 'Empate (cuenta como derrota)' : 'Perdiste…';
        return setTimeout(done, T_END);
      }
      const st = b.steps[i++];
      if (turnb) turnb.textContent = 'Turno ' + i;
      clearFront();
      const ca = card(st.aUid), cb = card(st.bUid);
      if (ca) ca.classList.add('front', 'lungeA');
      if (cb) cb.classList.add('front', 'enemy', 'lungeB');
      const fxTxt = (st.fx && st.fx.length) ? ' · ' + [...new Set(st.fx)].map(k => FX[k] + ' ' + (ABILITIES[k] ? ABILITIES[k].n : '')).join('  ') : '';
      if (msg) msg.innerHTML = `${nameOf(st.aUid)} ⚔️ ${nameOf(st.bUid)}${fxTxt}`;
      setTimeout(() => {
        const dA = hp[st.aUid] - st.aHp, dB = hp[st.bUid] - st.bHp;
        hp[st.aUid] = st.aHp; hp[st.bUid] = st.bHp;
        setHp(st.aUid); setHp(st.bUid);
        if (dB > 0) popup(st.bUid, '−' + dB, 'dmg'); else if (dB < 0) popup(st.bUid, '+' + (-dB), 'heal');
        if (dA > 0) popup(st.aUid, '−' + dA, 'dmg'); else if (dA < 0) popup(st.aUid, '+' + (-dA), 'heal');
        // efectos atribuidos al portador (sabemos su ability)
        (st.fx || []).forEach(k => {
          const sym = FX[k];
          if (k === 'poison') { if (abOf[st.aUid] === 'poison') popup(st.bUid, sym, 'fx'); if (abOf[st.bUid] === 'poison') popup(st.aUid, sym, 'fx'); }
          else if (k === 'thorns') { if (abOf[st.aUid] === 'thorns') popup(st.bUid, sym, 'fx'); if (abOf[st.bUid] === 'thorns') popup(st.aUid, sym, 'fx'); }
          else if (k === 'shield') { if (abOf[st.aUid] === 'shield') popup(st.aUid, sym, 'fx'); if (abOf[st.bUid] === 'shield') popup(st.bUid, sym, 'fx'); }
          else if (k === 'heal') { if (abOf[st.aUid] === 'heal') popup(st.aUid, sym, 'fx'); if (abOf[st.bUid] === 'heal') popup(st.bUid, sym, 'fx'); }
        });
        if (st.faintA && ca) ca.classList.add('fainted');
        if (st.faintB && cb) cb.classList.add('fainted');
        setTimeout(tick, T_SETTLE);
      }, T_IMPACT);
    };
    setTimeout(tick, T_START);
  }

  // ---------- dispatcher + wiring ----------
  function render(s) {
    renderRunbar(s);
    renderLog(s);
    if (s.phase === 'avatar') renderAvatar(s);
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
        else if (act === 'flag') { phaseArea.querySelectorAll('.flagopt').forEach(f => f.classList.remove('sel')); elm.classList.add('sel'); }
        else if (act === 'avatar-go') { const sel = phaseArea.querySelector('.flagopt.sel'); game.chooseAvatar(phaseArea.querySelector('#avName').value, sel ? sel.dataset.flag : '🌎'); }
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
          const k = elm.dataset.k;
          if (k === 'capture') game.captureWild();
          else if (k === 'replace') game.captureReplace();
          else game.leaveWild();
        } else if (act === 'event') s.event.actions[+elm.dataset.i].action();
      });
    });
    const restart = $('modal').querySelector('[data-act="restart"]');
    if (restart) restart.onclick = () => { $('overlay').classList.remove('show'); game.newRun(); };
  }

  return { render, playBattle };
}
