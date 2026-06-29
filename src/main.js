// ============================================================
// main.js — punto de entrada. Conecta el juego con la interfaz.
// ============================================================

import { Game } from './game.js';
import { createUI } from './ui.js';

const game = new Game();
const ui = createUI(game);
game.ui = ui;     // inyectamos la interfaz en el juego
game.newRun();    // ¡a jugar!

// Útil para experimentar desde la consola del navegador: window.game
window.game = game;

// ---------- música 8-bit (CC0, OpenGameArt) ----------
// Dos temas que cambian según la fase: explorar el mapa = naturaleza,
// combate = acción. Crossfade suave. Los navegadores no dejan autoplay:
// arranca tras el primer toque. La preferencia (on/off) se guarda.
// La UI avisa la fase con window.faunaMusic.set('map' | 'battle').
(function setupMusic() {
  const btn = document.getElementById('soundBtn');
  // pre='none' = no se baja hasta que toca sonar (no cargamos 10 MP3 de golpe)
  const mk = (src, vol, pre = 'auto') => { const a = new Audio(); a.preload = pre; a.src = src; a.loop = true; a.volume = 0; a._vol = vol; return a; };
  const tracks = {
    map: mk('assets/audio/naturaleza.mp3', 0.30),   // intro / por defecto
    battle: mk('assets/audio/pelea.ogg', 0.40),     // combate
    noche: mk('assets/audio/noche.mp3', 0.38, 'none'),   // EASTER EGG: mapa Tenebroso
    // un tema por PROVINCIA (mismo hilo 8-bit, distinto color) — carga al llegar
    prov_sanjose:    mk('assets/audio/prov_sanjose.mp3', 0.30, 'none'),
    prov_alajuela:   mk('assets/audio/prov_alajuela.mp3', 0.30, 'none'),
    prov_cartago:    mk('assets/audio/prov_cartago.mp3', 0.30, 'none'),
    prov_heredia:    mk('assets/audio/prov_heredia.mp3', 0.30, 'none'),
    prov_guanacaste: mk('assets/audio/prov_guanacaste.mp3', 0.30, 'none'),
    prov_puntarenas: mk('assets/audio/prov_puntarenas.mp3', 0.30, 'none'),
    prov_limon:      mk('assets/audio/prov_limon.mp3', 0.30, 'none'),
    monteverde:      mk('assets/audio/monteverde.mp3', 0.32, 'none'),   // final secreto
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
      if (target > 0) { if (a.paused) { a.volume = 0; a.play().catch(() => {}); } fade(a, target, 500); }
      else fade(a, 0, 350);
    }
  }

  const sync = () => { if (btn) { btn.textContent = on ? '🔊' : '🔇'; btn.classList.toggle('off', !on); } };
  sync();

  window.faunaMusic = { set(name) { if (tracks[name]) { want = name; apply(); } } };

  // primer gesto → habilita el audio (si está activado)
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
