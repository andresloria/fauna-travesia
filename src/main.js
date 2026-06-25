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

// ---------- ambiente de fondo (selva neotropical, CC0) ----------
// Los navegadores no dejan autoplay: arranca tras el primer toque del usuario.
// La preferencia (on/off) se guarda; volumen suave para no tapar nada.
(function setupAmbient() {
  const btn = document.getElementById('soundBtn');
  if (!btn) return;
  const audio = new Audio('assets/audio/selva.mp3');
  audio.loop = true;
  audio.volume = 0.32;
  let on = (localStorage.getItem('fauna_sound') || 'on') !== 'off';

  const sync = () => { btn.textContent = on ? '🔊' : '🔇'; btn.classList.toggle('off', !on); };
  const play = () => { if (on) audio.play().catch(() => {}); };
  sync();

  // primer gesto en la página → intenta arrancar (si está activado)
  window.addEventListener('pointerdown', function once() {
    window.removeEventListener('pointerdown', once);
    play();
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    on = !on;
    try { localStorage.setItem('fauna_sound', on ? 'on' : 'off'); } catch {}
    if (on) play(); else audio.pause();
    sync();
  });
})();
