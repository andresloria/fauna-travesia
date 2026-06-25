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
