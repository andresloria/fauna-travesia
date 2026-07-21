// ============================================================
// main.js — punto de entrada del REDISEÑO (20-jul): estructura Naruto-Arena.
// Ya no hay tablero: seleccionás 3 del refugio → rivales al azar → cada 4
// victorias, el cabecilla → 7 provincias + Monteverde → liga libre con las
// leyendas. Los animales se desbloquean por MISIONES (ver src/liga.js).
// El juego viejo de tablero quedó en src/game.js + src/ui.js (sin usar).
// ============================================================

import { crearSeleccion } from './seleccionUI.js';

const app = document.getElementById('app');
const sel = crearSeleccion(app);

// Útil para experimentar desde la consola: window.liga
window.liga = sel;

// ---------- música ----------
// Selección de equipo = TEMA DE AVENTURA (make_musica_aventura.py): rock
// luminoso en Re mayor a 152 — Andrés pidió algo más emocionante que el
// ambiente relajante (22-jul). La pelea sigue siendo el power metal.
// Combate = POWER METAL (make_musica_pelea.py): guitarras con distorsión, doble
// bombo y guitarras gemelas. Reemplaza al chiptune 8-bit de antes.
// arenaUI avisa con window.faunaMusic.set('battle'|'map').
(function setupMusic() {
  const btn = document.getElementById('soundBtn');
  const mk = (src, vol, pre = 'auto') => {
    const a = new Audio(); a.preload = pre; a.src = src; a.loop = true; a.volume = 0; a._vol = vol; return a;
  };
  const tracks = {
    map: mk('assets/audio/aventura.mp3', 0.30),      // aventura enérgica (22-jul)
    battle: mk('assets/audio/pelea_metal.mp3', 0.30),   // power metal, va más fuerte de por sí
    noche: mk('assets/audio/noche.mp3', 0.36, 'none'),   // leyendas del Tenebroso
  };
  let on = (localStorage.getItem('fauna_sound') || 'on') !== 'off';
  let started = false, want = 'map';

  function fade(a, to, ms) {
    clearInterval(a._ft);
    const from = a.volume, steps = Math.max(1, Math.round(ms / 40)); let i = 0;
    a._ft = setInterval(() => {
      i++; a.volume = Math.max(0, Math.min(1, from + (to - from) * i / steps));
      if (i >= steps) { clearInterval(a._ft); if (to === 0) a.pause(); }
    }, 40);
  }
  function apply() {
    if (!started) return;
    for (const k in tracks) {
      const a = tracks[k], target = (on && k === want) ? a._vol : 0;
      if (target > 0) { if (a.paused) { a.volume = 0; a.play().catch(() => {}); } fade(a, target, 600); }
      else fade(a, 0, 400);
    }
  }
  const sync = () => { if (btn) { btn.textContent = on ? '🔊' : '🔇'; btn.classList.toggle('off', !on); } };
  sync();

  window.faunaMusic = { set(name) { if (tracks[name]) { want = name; apply(); } } };

  window.addEventListener('pointerdown', function once() {
    window.removeEventListener('pointerdown', once);
    started = true; apply();
  });
  if (btn) btn.addEventListener('click', (e) => {
    e.stopPropagation();
    on = !on;
    try { localStorage.setItem('fauna_sound', on ? 'on' : 'off'); } catch {}
    apply(); sync();
  });
})();

// ---------- el botón ATRÁS no saca del juego ----------
// El juego es una sola página: sin esto, "atrás" te manda fuera del sitio y
// perdés la pelea que estabas jugando. Se deja siempre un estado de más en el
// historial y se vuelve a poner cada vez que el navegador lo consume; el
// "atrás" pasa a significar "cerrá lo que tengas abierto" (el modal de
// misiones), y en medio de un combate no hace nada.
(function atrasSeguro() {
  history.pushState({ fauna: 1 }, '');
  window.addEventListener('popstate', () => {
    history.pushState({ fauna: 1 }, '');        // reponer el tope
    if (document.querySelector('.ar-root')) return;   // en combate: no hacer nada
    // avisar a la UI por si tiene algo abierto que cerrar
    window.dispatchEvent(new CustomEvent('fauna:atras'));
  });
})();
