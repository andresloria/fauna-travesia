// ============================================================
// dialogo.js — motor de DIÁLOGOS estilo novela visual pixel:
// retrato grande sobre el escenario, placa con el nombre, caja de texto con
// palabras resaltadas y hasta 4 opciones en 2x2.
//
// Uso:
//   import { playScene } from './dialogo.js';
//   await playScene(escena, { guia:'assets/personajes/retrato_mujer.png',
//                             boss:'assets/personajes/boss_sanjose.png',
//                             bossName:'Don Rufino', bossTitle:'el de los trajes',
//                             heroName:'Andrés', bg:'assets/escenarios/lugar_sanjose.png' });
//
// La escena es un array de líneas (ver historia.js). playScene devuelve una
// Promise que se resuelve cuando termina; NO toca el estado del juego.
// ============================================================

const TYPE_MS = 18;          // velocidad del tecleo
let activo = null;           // escena en curso (para no encimar dos)

// escapa HTML y resalta las palabras de `hi` con <b class="hl">
function pinta(txt, hi, vars) {
  let s = String(txt);
  for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  s = s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  (hi || []).forEach(w => {
    if (!w) return;
    const safe = String(w).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
                          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    s = s.replace(new RegExp(safe, 'g'), m => `<b class="hl">${m}</b>`);
  });
  return s;
}

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}

export function playScene(scene, ctx = {}) {
  if (!scene || !scene.length) return Promise.resolve();
  if (activo) return activo.then(() => playScene(scene, ctx));   // encola
  const vars = { nombre: ctx.heroName || 'guía', provincia: ctx.provincia || '' };

  activo = new Promise(resolve => {
    // ---- estructura ----
    const ov = el('div', 'dlg-ov');
    if (ctx.bg) ov.style.setProperty('--dlg-bg', `url('${ctx.bg}')`);
    const stage = el('div', 'dlg-stage');
    const portrait = el('img', 'dlg-portrait');
    portrait.alt = '';
    portrait.draggable = false;
    const box = el('div', 'dlg-box');
    const plate = el('div', 'dlg-plate');
    const text = el('div', 'dlg-text');
    const opts = el('div', 'dlg-opts');
    const next = el('div', 'dlg-next', '▼');
    box.append(plate, text, opts, next);
    // botón SALTAR: cierra la escena completa de una (para quien no quiere leer)
    const skip = el('button', 'dlg-skip', 'SALTAR ⏭');
    skip.title = 'Saltar esta conversación (Esc)';
    skip.onclick = (e) => { e.stopPropagation(); cerrar(); };
    stage.append(skip, portrait, box);
    ov.append(stage);
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('on'));

    let i = 0, typing = null, done = false;

    const quien = (who) => {
      if (who === 'guia')     return { art: ctx.guia, n: ctx.heroName || 'Vos', t: 'guardaparques', cls: 'hero' };
      if (who === 'narrador') return { art: null, n: '', t: '', cls: 'narra' };
      return { art: ctx.boss, n: ctx.bossName || '???', t: ctx.bossTitle || '', cls: 'boss' };
    };

    function cerrar() {
      if (done) return; done = true;
      ov.classList.remove('on');
      setTimeout(() => { ov.remove(); activo = null; resolve(); }, 180);
    }

    function typeIn(html, cb) {
      // teclea texto plano; al terminar, mete el HTML con resaltados
      const plano = html.replace(/<[^>]+>/g, '');
      let k = 0; text.textContent = '';
      clearInterval(typing);
      typing = setInterval(() => {
        text.textContent = plano.slice(0, ++k);
        if (k >= plano.length) { clearInterval(typing); typing = null; text.innerHTML = html; cb && cb(); }
      }, TYPE_MS);
    }
    function completar() {                       // click a media escritura = mostrar todo
      if (!typing) return false;
      clearInterval(typing); typing = null;
      text.innerHTML = text.dataset.full || '';
      mostrarOpts();
      return true;
    }

    let lineaActual = null;
    function mostrarOpts() {
      opts.innerHTML = '';
      const o = lineaActual && lineaActual.opts;
      if (!o || !o.length) { next.style.display = 'block'; return; }
      next.style.display = 'none';
      o.slice(0, 4).forEach(op => {
        const b = el('button', 'dlg-opt', pinta(op.t, null, vars));
        b.onclick = (ev) => {
          ev.stopPropagation();
          opts.innerHTML = '';
          if (op.reply) {                          // el otro responde y seguimos
            const q = quien(lineaActual.who === 'guia' ? 'boss' : 'guia');
            if (q.art) { portrait.src = q.art; portrait.style.visibility = 'visible'; }
            else { portrait.removeAttribute('src'); portrait.style.visibility = 'hidden'; }
            plate.innerHTML = q.n ? `${q.n}<span>${q.t}</span>` : '';
            box.className = 'dlg-box ' + q.cls;
            const html = pinta(op.reply, lineaActual.hi, vars);
            text.dataset.full = html;
            lineaActual = { who: 'x' };            // sin opciones
            typeIn(html, () => { next.style.display = 'block'; });
          } else { avanzar(); }
        };
        opts.appendChild(b);
      });
    }

    function avanzar() {
      if (completar()) return;
      if (i >= scene.length) return cerrar();
      const l = scene[i++];
      lineaActual = l;
      const q = quien(l.who);
      if (q.art) { portrait.src = q.art; portrait.style.visibility = 'visible'; }
      else { portrait.removeAttribute('src'); portrait.style.visibility = 'hidden'; }
      plate.innerHTML = q.n ? `${q.n}<span>${q.t}</span>` : '';
      box.className = 'dlg-box ' + q.cls;
      const html = pinta(l.txt, l.hi, vars);
      text.dataset.full = html;
      next.style.display = 'none';
      opts.innerHTML = '';
      typeIn(html, mostrarOpts);
    }

    ov.addEventListener('click', avanzar);
    ov.tabIndex = 0;
    ov.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); avanzar(); }
      if (e.key === 'Escape') cerrar();
    });
    setTimeout(() => ov.focus(), 30);
    avanzar();
  });
  return activo;
}
