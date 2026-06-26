// ============================================================
// game.js — ESTADO y FLUJO de la partida.
// Mantiene el estado, decide qué pasa en cada nodo y llama al motor.
// NO dibuja: para mostrar cosas llama a this.ui.<algo>().
// ============================================================

import * as E from './engine.js';
import { ITEMS, RARE_ITEMS, SECRET, RULES } from './data.js';

export class Game {
  constructor(ui = null) {
    this.ui = ui;          // se inyecta desde main.js
    this.s = null;         // estado actual
  }

  // ---------- arranque ----------
  newRun() {
    const avatar = this.loadAvatar();
    const noLeg = Object.keys(E.SP).filter(k => !E.SP[k].leg);   // los starters no son legendarios
    this.s = {
      phase: avatar ? 'starter' : 'avatar',   // si ya tenés avatar, vas directo a elegir compañero
      avatar,
      team: [], hearts: RULES.MAX_HEARTS, cleared: 0, released: 0,
      country: null, countryBag: null, lastCountryIdx: null,
      map: null, currentId: null,
      starters: E.shuffle(noLeg).slice(0, 3).map(k => E.mkAnimal(k)),
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

  log(msg) { this.s.log.unshift(msg); if (this.s.log.length > 50) this.s.log.pop(); }
  node(id) { return this.s.map.nodesById[id]; }
  current() { return this.node(this.s.currentId); }
  animal(uid) { return this.s.team.find(a => a.uid === uid); }
  depth() { return this.s.cleared; }   // dificultad = países ya cruzados

  // ---------- inicial ----------
  chooseStarter(i) {
    const a = this.s.starters[i];
    E.setLevel(a, RULES.STARTER_LEVEL);
    this.s.team.push(a);
    this.log(`🩹 Tu primer rescate: ${a.e} <b>${a.n}</b> (Nv ${a.level})`);
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
    const rb = Math.floor((n.r || 0) / 2);   // ramp dentro del mapa: cuanto más cerca del aeropuerto, más duro
    switch (n.type) {
      case 'bioma':    return this.wildEncounter(n.bio);
      case 'combate':  return this.startBattle(
        E.genEnemy(s.country, E.retSize(d), E.enemyLevel(d, false) + rb),
        'Furtivo', '🪤', 'retador');
      case 'cazador':  return this.startBattle(
        E.genEnemy(s.country, E.poacherSize(d), E.poacherLevel(d) + rb),
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
          `Encontraste ${it.e} <b>${it.n}</b> (+${it.atk}⚔ +${it.hp}❤). Lo guardás en la mochila — equipalo a un animal desde su ficha.`,
          [{ label: 'Continuar', action: () => this.backToMap() }]);
      }
      case 'descanso':
        s.hearts = Math.min(RULES.MAX_HEARTS, s.hearts + 1);
        return this.showEvent('🏕️', 'Refugio',
          `Descansás en el refugio y recuperás un corazón ❤️ (${s.hearts}/${RULES.MAX_HEARTS}).`,
          [{ label: 'Continuar', action: () => this.backToMap() }]);
    }
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
    this.log(`☁️ Subís al bosque nuboso de <b>${SECRET.n}</b>… acá se esconde el cabecilla.`);
    this.render();
  }

  // ---------- encuentro salvaje ----------
  wildEncounter(bio) {
    const s = this.s, d = this.depth();
    // muy rara vez, encuentro legendario (uno solo); si no, 3 animales para elegir
    if (s.country.legend && E.rnd(100) < RULES.LEG_CHANCE * 100) {
      const a = E.mkAnimal(s.country.legend); E.setLevel(a, E.wildLevel(d));
      s.wilds = [a]; s.wildLeg = true;
      this.log(`✦ ¡Un LEGENDARIO necesita ayuda: ${a.e} <b>${a.n}</b>!`);
    } else {
      s.wilds = E.genWildChoices(s.country, bio, d, 3); s.wildLeg = false;
    }
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
    this.backToMap();
  }
  skipTrade() { this.s.offer = null; this.backToMap(); }

  // ---------- combate ----------
  startBattle(enemy, oppName, oppEmoji, kind) {
    const s = this.s;
    const { result, steps } = E.fight(s.team, enemy);  // el motor decide; la UI solo anima
    s.phase = 'battle';
    s.battle = { enemy, oppName, oppEmoji, steps, result, kind };
    this.ui.playBattle(s, () => this.onBattleEnd());
  }
  onBattleEnd() {
    const s = this.s, b = s.battle, won = b.result === 'W';
    if (b.kind === 'jefe') {
      if (won) {
        if (s.country.secret) return this.victory();   // ¡venciste al Cabecilla en Monteverde!
        s.cleared++;
        s.team.forEach(a => E.levelUp(a));
        s.hearts = Math.min(RULES.MAX_HEARTS, s.hearts + 1);
        s.released += 2;                                // liberás a los animales que tenían cautivos
        this.log(`🌿 Liberaste a los animales cautivos de ${s.country.n} (conservación +2)`);
        const last = s.cleared >= RULES.RUN_LENGTH;
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
        this.log(`🏆 Frenaste a los traficantes: doble recuperación + ${it.e} <b>${it.n}</b> (conservación +1)`);
        return this.showEvent('🏆', '¡Traficantes frenados!',
          `Liberaste a los animales que llevaban 🌿 (conservación +1). Tu refugio sube <b>DOBLE</b> y te llevás un objeto raro: ${it.e} <b>${it.n}</b> (+${it.atk}⚔ +${it.hp}❤).`,
          [{ label: 'Continuar', action: () => this.backToMap() }]);
      }
      return this.poachLoss();
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
    a.items.push(it); a.atk += it.atk; a.hp += it.hp;
    this.log(`${it.e} <b>${it.n}</b> equipado a ${a.e} ${a.n}`);
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
  victory()  { this.s.phase = 'win'; this.render(); }

  render() { if (this.ui) this.ui.render(this.s); }
}
