// ============================================================
// game.js — ESTADO y FLUJO de la partida.
// Mantiene el estado, decide qué pasa en cada nodo y llama al motor.
// NO dibuja: para mostrar cosas llama a this.ui.<algo>().
// ============================================================

import * as E from './engine.js';
import * as M from './meta.js';
import { ITEMS, RARE_ITEMS, SECRET, RULES, itemBonus } from './data.js';

export class Game {
  constructor(ui = null) {
    this.ui = ui;          // se inyecta desde main.js
    this.s = null;         // estado actual
  }

  // ---------- arranque ----------
  newRun() {
    const avatar = this.loadAvatar();
    let mode = 'normal', seenIntro = false;
    try { mode = localStorage.getItem('fauna_mode') || 'normal'; } catch {}
    try { seenIntro = localStorage.getItem('fauna_intro') === '1'; } catch {}
    // 1ª vez de todas: pantalla de HISTORIA; si ya tenés avatar, directo a starter
    const phase = !seenIntro ? 'intro' : (avatar ? 'starter' : 'avatar');
    this.s = {
      phase,
      avatar, mode,                            // 'normal' | 'furtivo' (si te derrotan un animal, se lo roban)
      team: [], hearts: RULES.MAX_HEARTS, cleared: 0, released: 0,
      country: null, countryBag: null, lastCountryIdx: null,
      map: null, currentId: null,
      starters: ['perro', 'gato', 'comemaiz'].map(k => E.mkAnimal(k)),   // básicos fijos
      bag: [],                 // objetos (tesoros) sin equipar
      wilds: null, wildLeg: false, offer: null, event: null, battle: null, editId: null, log: [],
    };
    this.render();
  }

  // ---------- avatar del jugador (identidad; se guarda entre runs) ----------
  loadAvatar() {
    try { const r = localStorage.getItem('fauna_avatar'); return r ? JSON.parse(r) : null; }
    catch { return null; }
  }
  saveAvatar(a) { try { localStorage.setItem('fauna_avatar', JSON.stringify(a)); } catch {} }
  chooseAvatar(name, flag) {
    const a = { name: (name || '').trim().slice(0, 18) || 'Viajero', flag: flag || '🌎' };
    this.s.avatar = a; this.saveAvatar(a);
    this.s.phase = 'starter';
    this.log(`🧭 Sos <b>${a.name}</b> ${a.flag}`);
    this.render();
  }
  editAvatar() { this.s.phase = 'avatar'; this.render(); }
  // termina la intro de historia → avatar (o starter si ya existe). Se recuerda.
  startFromIntro() {
    try { localStorage.setItem('fauna_intro', '1'); } catch {}
    this.s.phase = this.s.avatar ? 'starter' : 'avatar';
    this.render();
  }
  replayIntro() { this.s.phase = 'intro'; this.render(); }
  // hitos de la HISTORIA según cuántas provincias llevás
  storyBeat(depth) {
    if (depth === 0) return '🌿 Tu sueño es ver a TODOS los animales de Costa Rica… pero algo anda mal con la fauna.';
    if (depth === 1) return '🔍 Los animales que te atacaron estaban <b>drogados</b>. Alguien los está usando.';
    if (depth === 3) return '🕸️ Lo confirmás: hay una <b>RED de cazadores furtivos</b> operando en todo el país.';
    if (depth === 5) return '🔥 Los cazadores ya te temen: saben que vas a sacarlos del país.';
    return null;
  }
  // modo de juego (normal / furtivo); se recuerda como preferencia
  setMode(mode) {
    this.s.mode = (mode === 'furtivo') ? 'furtivo' : 'normal';
    try { localStorage.setItem('fauna_mode', this.s.mode); } catch {}
    this.render();
  }

  // ---------- meta-progreso (colección + logros, persisten entre partidas) ----------
  award(id) {
    const a = M.unlock(id);
    if (a) { this.log(`🏆 Logro desbloqueado: ${a.e} <b>${a.n}</b>`); if (this.ui && this.ui.toast) this.ui.toast(a); }
  }
  registerDex(a) {            // registra una especie rescatada + revisa hitos
    if (!a) return;
    M.addDex(a.key);
    if (a.leg) this.award('legendario');
    const c = M.dexCount();
    if (c >= 10) this.award('dex10');
    if (c >= 25) this.award('dex25');
    if (c >= 50) this.award('dex50');
    if (this.s.team.length >= RULES.MAX_TEAM) this.award('refugio');
  }
  checkConserva() {
    if (this.s.released >= 5) this.award('conserva5');
    if (this.s.released >= 15) this.award('conserva15');
  }

  log(msg) { this.s.log.unshift(msg); if (this.s.log.length > 50) this.s.log.pop(); }
  node(id) { return this.s.map.nodesById[id]; }
  current() { return this.node(this.s.currentId); }
  animal(uid) { return this.s.team.find(a => a.uid === uid); }
  depth() { return this.s.cleared; }   // dificultad = países ya cruzados
  fighters() { return this.s.team.filter(a => !a.down); }   // los que NO están debilitados

  // ---------- inicial ----------
  chooseStarter(i) {
    const a = this.s.starters[i];
    E.setLevel(a, RULES.STARTER_LEVEL);
    this.s.team.push(a);
    this.log(`🩹 Tu primer rescate: ${a.e} <b>${a.n}</b> (Nv ${a.level})`);
    this.award('prim_rescate'); this.registerDex(a);
    this.enterCountry();
  }

  // ---------- país / mapa (país al azar, dificultad por profundidad) ----------
  enterCountry() {
    const s = this.s;
    const draw = E.drawCountry(s.countryBag, s.lastCountryIdx);
    s.country = draw.country; s.countryBag = draw.bag; s.lastCountryIdx = draw.idx;
    s.map = E.generateMap(s.country, this.depth());
    s.currentId = s.map.startId;
    this.current().visited = true;
    s.phase = 'map';
    this.log(`🧭 Llegás a la provincia de ${s.country.flag} <b>${s.country.n}</b> (${this.depth() + 1}/${RULES.RUN_LENGTH})`);
    const beat = this.storyBeat(this.depth());
    if (beat) this.log(beat);
    this.render();
  }

  goNode(id) {
    if (this.s.phase !== 'map') return;
    const n = this.node(id);
    if (!this.current().children.includes(n)) return; // solo nodos conectados
    this.s.currentId = id;
    n.visited = true;
    this.resolveNode(n);
  }

  resolveNode(n) {
    const s = this.s, d = this.depth();
    switch (n.type) {
      case 'bioma':    return this.wildEncounter(n.bio);
      case 'combate':  return this.startBattle(
        E.genEnemy(s.country, E.retSize(d), E.enemyLevel(d, false)),
        'Furtivo', '🪤', 'retador');
      case 'cazador':  return this.startBattle(
        E.genEnemy(s.country, E.poacherSize(d), E.poacherLevel(d)),
        'Banda de traficantes', '🏹', 'cazador');
      case 'intercambio': {
        const maxLv = s.team.reduce((m, a) => Math.max(m, a.level), 1);
        s.offer = E.genTrade(maxLv);
        s.phase = 'trade';
        this.log(`🔄 Te ofrecen ${s.offer.e} <b>${s.offer.n}</b> (Nv ${s.offer.level})`);
        return this.render();
      }
      case 'airport':  return this.startBattle(
        E.genEnemy(s.country, E.bossSize(d), E.enemyLevel(d, true)),
        s.country.secret ? 'El Cabecilla' : 'Cabecilla furtivo', '🚨', 'jefe');
      case 'tesoro': {
        const it = E.pick(ITEMS);
        s.bag.push(it);
        return this.showEvent('🎁', 'Hallazgo',
          `Encontraste ${it.e} <b>${it.n}</b> (${itemBonus(it)}). Lo guardás en la mochila — equipalo a un animal desde su ficha.`,
          [{ label: 'Continuar', action: () => this.backToMap() }]);
      }
      case 'salvaje': {
        // animal(es) salvaje(s) a un nivel PARECIDO al tuyo (un toque por debajo) — pelea justa
        const f = this.fighters(), n = f.length || 1;
        const avg = Math.round(f.reduce((m, a) => m + a.level, 0) / n);
        const lvl = Math.max(1, avg - 1);
        return this.startBattle(E.genEnemy(s.country, Math.min(RULES.MAX_TEAM, n), lvl), 'Animal salvaje', '🐾', 'salvaje');
      }
      case 'descanso': {
        s.hearts = Math.min(RULES.MAX_HEARTS, s.hearts + 1);
        const revived = s.team.filter(a => a.down);
        revived.forEach(a => { a.down = false; });
        const rmsg = revived.length
          ? ` Tus animales debilitados se <b>recuperan</b>: ${revived.map(a => a.e + ' ' + a.n).join(', ')} vuelven a la pelea. 🌿`
          : '';
        return this.showEvent('🏕️', 'Refugio',
          `Descansás y recuperás un corazón ❤️ (${s.hearts}/${RULES.MAX_HEARTS}).${rmsg}`,
          [{ label: 'Continuar', action: () => this.backToMap() }]);
      }
      case 'sorpresa': return this.resolveSorpresa(n);
    }
  }

  // Casilla SORPRESA: puede dar un objeto, una pelea, una emboscada de cazadores
  // o (raro) un JEFE DE ZONA — un animal muy fuerte que, si lo vencés, rescatás.
  resolveSorpresa(n) {
    const s = this.s, d = this.depth(), r = E.rnd(100), late = n.r > E.SAFE_ROWS;
    if (n.r >= 2 && r < 8) return this.zoneBoss();                      // jefe de zona (raro, difícil)
    if (r < 40) {                                                       // hallazgo
      const it = E.rnd(100) < 22 ? E.pick(RARE_ITEMS) : E.pick(ITEMS);
      s.bag.push(it);
      return this.showEvent('❓', '¡Sorpresa! Un hallazgo',
        `Entre la maleza aparece ${it.e} <b>${it.n}</b> (${itemBonus(it)}). A la mochila.`,
        [{ label: 'Seguir 🧭', action: () => this.backToMap() }]);
    }
    if (late && d >= 3 && r < 60) return this.startBattle(              // emboscada de traficantes
      E.genEnemy(s.country, E.poacherSize(d), E.poacherLevel(d)), 'Emboscada de traficantes', '🏹', 'cazador');
    if (late && r < 74) return this.startBattle(                        // furtivo al acecho
      E.genEnemy(s.country, E.retSize(d), E.enemyLevel(d, false)), 'Furtivo al acecho', '🪤', 'retador');
    // por defecto: un animal drogado y alterado te ataca
    const f = this.fighters(), nf = f.length || 1;
    const avg = Math.round(f.reduce((m, a) => m + a.level, 0) / nf);
    return this.startBattle(E.genEnemy(s.country, Math.min(RULES.MAX_TEAM, nf), Math.max(1, avg)),
      'Animal alterado', '🐾', 'salvaje');
  }
  zoneBoss() {
    const s = this.s;
    this.log('👑 ¡Un <b>jefe de zona</b> aparece! Un animal poderoso, drogado por los cazadores…');
    return this.startBattle(E.genZoneBoss(s.country, this.depth()), 'Jefe de zona', '👑', 'jefezona');
  }

  backToMap() { this.s.phase = 'map'; this.s.editId = null; this.render(); }
  nextCountry() {
    if (this.s.cleared >= RULES.RUN_LENGTH) return this.enterSecret();
    this.enterCountry();
  }
  // final: el bosque nuboso de Monteverde. Vencer al Cabecilla = ganar.
  enterSecret() {
    const s = this.s;
    s.country = SECRET;
    s.map = E.generateMap(SECRET, this.depth());
    s.currentId = s.map.startId;
    this.current().visited = true;
    s.phase = 'map';
    this.log(`☁️ El rastro lleva a <b>${SECRET.n}</b>. Acá se esconde el <b>CABECILLA</b> de toda la red — vencelo y sacás a los cazadores del país.`);
    this.render();
  }

  // ---------- encuentro salvaje ----------
  wildEncounter(bio) {
    const s = this.s;
    // 3 animales para elegir, ponderados por rareza (común sale mucho; legendario/
    // extinto casi nunca). Si cae uno raro entre los 3, se avisa: es un hallazgo.
    s.wilds = E.genWildChoices(s.country, bio, this.depth(), 3);
    s.wildLeg = false;
    const rare = s.wilds.find(a => a.rarity === 'legendario' || a.rarity === 'extinto');
    if (rare) this.log(`✦ ¡AVISTAMIENTO ${rare.rarity.toUpperCase()}! Apareció ${rare.e} <b>${rare.n}</b>.`);
    s.phase = 'wild';
    this.render();
  }
  captureWild(idx) {
    const s = this.s, a = s.wilds && s.wilds[idx];
    if (!a) return;
    if (s.team.length >= RULES.MAX_TEAM) {       // refugio lleno: reemplaza al más débil
      let wi = 0; s.team.forEach((x, i) => { if ((x.atk + x.hp) < (s.team[wi].atk + s.team[wi].hp)) wi = i; });
      const old = s.team[wi]; s.team[wi] = a;
      this.log(`🩹 Rescataste a ${a.e} <b>${a.n}</b> (Nv ${a.level}); soltaste a ${old.e} ${old.n}`);
    } else {
      s.team.push(a);
      this.log(`🩹 Rescataste a ${a.e} <b>${a.n}</b> (Nv ${a.level})`);
    }
    this.registerDex(a);
    this.backToMap();
  }
  leaveWild() { this.backToMap(); }

  // ---------- intercambio ----------
  tradeFor(uid) {
    const s = this.s, i = s.team.findIndex(a => a.uid === uid);
    if (i < 0 || !s.offer) return;
    const old = s.team[i];
    s.team[i] = s.offer; s.offer = null;
    this.log(`🔄 Cambiaste ${old.e} ${old.n} por ${s.team[i].e} <b>${s.team[i].n}</b> (Nv ${s.team[i].level})`);
    this.registerDex(s.team[i]);
    this.backToMap();
  }
  skipTrade() { this.s.offer = null; this.backToMap(); }

  // ---------- combate ----------
  startBattle(enemy, oppName, oppEmoji, kind) {
    const s = this.s;
    const fighters = this.fighters();        // los debilitados NO pelean
    if (!fighters.length) {                   // equipo agotado: no podés combatir
      this.log('💤 Tu equipo está <b>agotado</b>. Buscá un refugio 🏕️ para recuperar a tus animales.');
      return this.hurt();
    }
    const { result, steps, fallenAUids } = E.fight(fighters, enemy);  // el motor decide; la UI solo anima
    s.phase = 'battle';
    s.battle = { enemy, fighters, oppName, oppEmoji, steps, result, kind, fallenAUids };
    this.ui.playBattle(s, () => this.onBattleEnd());
  }
  onBattleEnd() {
    const s = this.s, b = s.battle, won = b.result === 'W';
    if (won && !(b.fallenAUids && b.fallenAUids.length)) this.award('impecable');
    if (b.fallenAUids && b.fallenAUids.length) {
      if (s.mode === 'furtivo') {
        // MODO FURTIVO: a los que cayeron en combate se los roban (desaparecen)
        const stolen = [];
        b.fallenAUids.forEach(uid => { const i = s.team.findIndex(a => a.uid === uid); if (i >= 0) stolen.push(s.team.splice(i, 1)[0]); });
        if (stolen.length) this.log(`🪤 <b>Modo Furtivo</b>: los cazadores se llevaron ${stolen.map(a => a.e + ' ' + a.n).join(', ')} 😱`);
        if (s.team.length === 0) return this.gameOver();
      } else {
        // MODO NORMAL: quedan DEBILITADOS hasta llegar a un refugio
        const down = [];
        b.fallenAUids.forEach(uid => { const a = s.team.find(x => x.uid === uid); if (a && !a.down) { a.down = true; down.push(a); } });
        if (down.length) this.log(`💤 ${down.map(a => a.e + ' ' + a.n).join(', ')} ${down.length === 1 ? 'quedó debilitado' : 'quedaron debilitados'} — llevalos a un refugio 🏕️.`);
      }
    }
    if (b.kind === 'jefe') {
      if (won) {
        if (s.country.secret) return this.victory();   // ¡venciste al Cabecilla en Monteverde!
        s.cleared++;
        s.team.forEach(a => E.levelUp(a));
        s.hearts = Math.min(RULES.MAX_HEARTS, s.hearts + 1);
        s.released += 2;                                // liberás a los animales que tenían cautivos
        this.log(`🌿 Liberaste a los animales cautivos de ${s.country.n} (conservación +2)`);
        this.award('prov1'); this.checkConserva();
        if (s.mode === 'furtivo') this.award('furtivo');
        const last = s.cleared >= RULES.RUN_LENGTH;
        if (last) this.award('prov7');
        return this.showEvent('🏆', last ? '¡Las 7 provincias a salvo!' : '¡Provincia liberada!',
          last
            ? `Recorriste las 7 provincias 🇨🇷 y desbarataste a los furtivos. Tu refugio se fortalece… y se abre el sendero al bosque nuboso de Monteverde. ☁️`
            : `Frenaste a los furtivos de ${s.country.n} y liberaste a sus animales. Tu refugio se fortalece y recuperás un corazón ❤️.`,
          [{ label: last ? 'Subir a Monteverde ☁️' : 'Seguir viaje 🧭', action: () => this.nextCountry() }]);
      }
      return this.gameOver();
    }
    if (b.kind === 'cazador') {
      if (won) {
        s.team.forEach(a => {            // DOBLE rehabilitación
          E.levelUp(a);
          if (E.levelUp(a)) this.log(`🌿 ${a.e} <b>${a.n}</b> se recuperó hasta nivel ${a.level}!`);
        });
        const it = E.pick(RARE_ITEMS);
        s.bag.push(it);
        s.released += 1;
        this.award('traficantes'); this.checkConserva();
        this.log(`🏆 Frenaste a los traficantes: doble recuperación + ${it.e} <b>${it.n}</b> (conservación +1)`);
        return this.showEvent('🏆', '¡Traficantes frenados!',
          `Liberaste a los animales que llevaban 🌿 (conservación +1). Tu refugio sube <b>DOBLE</b> y te llevás un objeto raro: ${it.e} <b>${it.n}</b> (${itemBonus(it)}).`,
          [{ label: 'Continuar', action: () => this.backToMap() }]);
      }
      return this.poachLoss();
    }
    if (b.kind === 'jefezona') {
      if (won) {
        const boss = b.enemy[0];                       // lo RESCATÁS: se une a tu refugio
        boss.items = boss.items || [];
        if (s.team.length >= RULES.MAX_TEAM) {
          let wi = 0; s.team.forEach((x, i) => { if ((x.atk + x.hp) < (s.team[wi].atk + s.team[wi].hp)) wi = i; });
          const old = s.team[wi]; s.team[wi] = boss;
          this.log(`👑 Rescataste al JEFE DE ZONA ${boss.e} <b>${boss.n}</b> (Nv ${boss.level}); soltaste a ${old.e} ${old.n}`);
        } else {
          s.team.push(boss);
          this.log(`👑 ¡Rescataste al JEFE DE ZONA ${boss.e} <b>${boss.n}</b> (Nv ${boss.level})!`);
        }
        this.registerDex(boss); this.award('jefezona');
        return this.showEvent('👑', '¡Jefe de zona rescatado!',
          `Tras una pelea durísima liberaste a ${boss.e} <b>${boss.n}</b> de la droga de los cazadores. Ahora es el animal más fuerte de tu refugio (Nv ${boss.level}).`,
          [{ label: 'Increíble 🌿', action: () => this.backToMap() }]);
      }
      return this.hurt();
    }
    if (won) {
      s.team.forEach(a => { if (E.levelUp(a)) this.log(`🌿 ${a.e} <b>${a.n}</b> se recuperó hasta nivel ${a.level}!`); });
      this.log('Tu refugio sumó experiencia');
      return this.backToMap();
    }
    return this.hurt();
  }
  // perder contra traficantes: corazón + se llevan un animal (nunca el último)
  poachLoss() {
    const s = this.s; s.hearts--;
    let robo = '';
    if (s.team.length > 1) {
      const [a] = s.team.splice(E.rnd(s.team.length), 1);
      robo = ` Se llevaron a ${a.e} <b>${a.n}</b>. 😱`;
      this.log(`🏹 Los traficantes se llevaron a ${a.e} <b>${a.n}</b>`);
    }
    this.log(`Te ganaron los traficantes — corazones: ${'❤'.repeat(Math.max(0, s.hearts)) || '0'}`);
    if (s.hearts <= 0) return this.gameOver();
    this.showEvent('💔', 'Te ganaron los traficantes',
      `Bajás un corazón (${s.hearts}/${RULES.MAX_HEARTS}).${robo} Seguí adelante.`,
      [{ label: 'Continuar', action: () => this.backToMap() }]);
  }
  hurt() {
    const s = this.s; s.hearts--;
    this.log(`Perdiste el combate — corazones: ${'❤'.repeat(Math.max(0, s.hearts)) || '0'}`);
    if (s.hearts <= 0) return this.gameOver();
    this.showEvent('💔', 'Derrota',
      `Los furtivos te ganaron y bajás un corazón (${s.hearts}/${RULES.MAX_HEARTS}). Seguí adelante.`,
      [{ label: 'Continuar', action: () => this.backToMap() }]);
  }

  // ---------- editar personaje ----------
  openEdit(uid) {
    if (this.s.phase !== 'map') return;
    this.s.editId = uid;
    this.s.phase = 'edit';
    this.render();
  }
  closeEdit() { this.backToMap(); }
  equipItem(uid, bagIndex) {
    const s = this.s, a = this.animal(uid);
    if (!a || a.items.length >= RULES.MAX_ITEMS) return;
    const it = s.bag[bagIndex]; if (!it) return;
    s.bag.splice(bagIndex, 1);
    a.items.push(it);
    a.atk += it.atk || 0; a.hp += it.hp || 0; a.spd += it.spd || 0; a.hab += it.hab || 0;
    this.log(`${it.e} <b>${it.n}</b> (${itemBonus(it)}) equipado a ${a.e} ${a.n}`);
    this.render();
  }
  moveAnimal(uid, dir) {
    const t = this.s.team, i = t.findIndex(a => a.uid === uid), j = i + dir;
    if (i < 0 || j < 0 || j >= t.length) return;
    [t[i], t[j]] = [t[j], t[i]];
    this.render();
  }
  frontAnimal(uid) {
    const t = this.s.team, i = t.findIndex(a => a.uid === uid);
    if (i <= 0) return;
    t.unshift(t.splice(i, 1)[0]);
    this.render();
  }
  // LIBERAR a la naturaleza. Si está PLENO (rehabilitado del todo) suma
  // conservación: ese ES el objetivo del juego. Si no, igual lo soltás (sin punto).
  releaseAnimal(uid) {
    const s = this.s, t = s.team;
    if (t.length <= 1) return;             // no podés quedarte sin refugio
    const i = t.findIndex(a => a.uid === uid);
    if (i < 0) return;
    const [a] = t.splice(i, 1);
    if ((a.evo || 0) >= RULES.PLENO_EVO) {
      s.released++;
      this.checkConserva();
      this.log(`🌿 Liberaste a ${a.e} <b>${a.n}</b> PLENO a la naturaleza. ¡Conservación +1! (${s.released})`);
    } else {
      this.log(`🌿 Soltaste a ${a.e} ${a.n} (aún no estaba pleno).`);
    }
    this.backToMap();
  }

  // ---------- equipo (reordenar desde el mapa) ----------
  swapTeam(i, j) {
    const t = this.s.team;
    if (this.s.phase !== 'map' || j < 0 || j >= t.length) return;
    [t[i], t[j]] = [t[j], t[i]];
    this.render();
  }

  // ---------- eventos / fin ----------
  showEvent(emoji, title, desc, actions) {
    this.s.phase = 'event';
    this.s.event = { emoji, title, desc, actions };
    this.render();
  }
  gameOver() { this.s.phase = 'over'; this.render(); }
  victory()  { this.award('cabecilla'); this.award('prov7'); this.s.phase = 'win'; this.render(); }

  render() { if (this.ui) this.ui.render(this.s); }
}
