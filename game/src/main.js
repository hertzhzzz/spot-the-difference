// Two Harbours — Spot the Difference: boot, state machine and the one loop.
// Screens: title, play, paused, levelclear, gameover, win.
// ?seed=N fixes the decorative scatter. ?shot=title|play|levelup|over stages a
// scene instead of running the loop, paints it twice and sets window.__shotReady.
import { BEST_KEY, CLICK_SLACK, WRONG_PENALTY, FOUND_POINTS, HINT_COST, HINTS_PER_GAME, TIME_BONUS_PER_SECOND, WRONG_FLASH_MS, HINT_FLASH_MS } from './config.js';
import { LEVELS } from './levels.js';
import { createRenderer, SCREEN_TITLE, SCREEN_PLAY, SCREEN_PAUSED, SCREEN_LEVELCLEAR, SCREEN_OVER, SCREEN_WIN } from './render.js';
import { createInput } from './input.js';
import { createAudio } from './audio.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);
void seed;

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off: the best score then lasts this visit only.
  }
}

const state = {
  screen: SCREEN_TITLE,
  levelIndex: 0,
  found: new Set(),
  foundAnim: {},
  score: 0,
  best: readBest(),
  timeLeft: LEVELS[0].time,
  hintsLeft: HINTS_PER_GAME,
  mistakes: 0,
  streak: 0,
  wrongFlash: null,
  hintDiff: null,
  hintUntil: 0,
  levelBonus: 0,
  overReason: null,
  muted: false,
};

function level() {
  return LEVELS[state.levelIndex];
}

function startLevel(index) {
  state.levelIndex = index;
  state.found = new Set();
  state.foundAnim = {};
  state.timeLeft = LEVELS[index].time;
  state.streak = 0;
  state.wrongFlash = null;
  state.hintDiff = null;
  state.levelBonus = 0;
  state.overReason = null;
  state.screen = SCREEN_PLAY;
  announce(`Level ${index + 1}: ${LEVELS[index].name}. ${LEVELS[index].diffs.length} differences to find.`);
}

function startGame() {
  state.score = 0;
  state.hintsLeft = HINTS_PER_GAME;
  state.mistakes = 0;
  startLevel(0);
}

function finishLevel() {
  state.levelBonus = Math.ceil(state.timeLeft) * TIME_BONUS_PER_SECOND;
  state.score += state.levelBonus;
  audio.clear();
  if (state.levelIndex + 1 >= LEVELS.length) {
    state.screen = SCREEN_WIN;
    if (state.score > state.best) {
      state.best = state.score;
      saveBest(state.best);
    }
    announce(`You found them all! Final score ${state.score}.`);
  } else {
    state.screen = SCREEN_LEVELCLEAR;
    announce(`Level clear! Time bonus ${state.levelBonus}. Score ${state.score}.`);
  }
}

function gameOver(reason) {
  state.overReason = reason;
  state.screen = SCREEN_OVER;
  if (state.score > state.best) {
    state.best = state.score;
    saveBest(state.best);
  }
  audio.over();
  announce(`Game over. Score ${state.score}.`);
}

function findAt(x, y) {
  if (state.screen !== SCREEN_PLAY) return 'not-playing';
  for (const diff of level().diffs) {
    if (state.found.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= (diff.r + CLICK_SLACK) * (diff.r + CLICK_SLACK)) {
      state.found.add(diff.id);
      state.foundAnim[diff.id] = performance.now();
      state.streak += 1;
      state.score += FOUND_POINTS + (state.streak - 1) * 10;
      audio.found();
      announce(`Found: ${diff.label}. ${level().diffs.length - state.found.size} left.`);
      if (state.found.size === level().diffs.length) finishLevel();
      return 'found';
    }
  }
  state.mistakes += 1;
  state.streak = 0;
  state.score = Math.max(0, state.score - WRONG_PENALTY);
  state.wrongFlash = { x, y, side: 'A', until: performance.now() + WRONG_FLASH_MS };
  audio.wrong();
  return 'wrong';
}

function useHint() {
  if (state.screen !== SCREEN_PLAY) return;
  if (state.hintsLeft <= 0 || state.score < HINT_COST) return;
  const remaining = level().diffs.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  state.hintsLeft -= 1;
  state.score -= HINT_COST;
  state.hintDiff = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintUntil = performance.now() + HINT_FLASH_MS;
  audio.hint();
}

function announce(text) {
  status.textContent = text;
}

function onButton(id) {
  audio.unlock();
  if (id === 'sound') {
    state.muted = audio.toggleMute();
    return;
  }
  if (id === 'confirm') {
    if (state.screen === SCREEN_TITLE) startGame();
    else if (state.screen === SCREEN_LEVELCLEAR) startLevel(state.levelIndex + 1);
    else if (state.screen === SCREEN_OVER || state.screen === SCREEN_WIN) startGame();
    else if (state.screen === SCREEN_PAUSED) state.screen = SCREEN_PLAY;
    return;
  }
  if (id === 'start' || id === 'again') { audio.click(); startGame(); return; }
  if (id === 'next') { audio.click(); startLevel(state.levelIndex + 1); return; }
  if (id === 'retry') { audio.click(); startLevel(state.levelIndex); return; }
  if (id === 'menu') {
    audio.click();
    state.screen = SCREEN_TITLE;
    state.levelIndex = 0;
    state.found = new Set();
    state.foundAnim = {};
    state.timeLeft = LEVELS[0].time;
    announce('Two Harbours. Spot the difference.');
    return;
  }
  if (id === 'pause') {
    if (state.screen === SCREEN_PLAY) { state.screen = SCREEN_PAUSED; announce('Paused.'); }
    else if (state.screen === SCREEN_PAUSED) { state.screen = SCREEN_PLAY; announce('Resumed.'); }
    return;
  }
  if (id === 'hint') { useHint(); }
}

const input = createInput(canvas, {
  onButton,
  onPanel(x, y, side) {
    audio.unlock();
    if (state.screen !== SCREEN_PLAY) return;
    const result = findAt(x, y);
    if (result === 'wrong') {
      state.wrongFlash = { x, y, side, until: performance.now() + WRONG_FLASH_MS };
    }
  },
});

// The game object the screenshot stager drives with the real rules.
const game = {
  state,
  startGame,
  startLevel,
  findAt,
  useHint,
  gameOver,
};

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.25, (now - last) / 1000);
  last = now;
  if (state.screen === SCREEN_PLAY) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      gameOver('time');
    }
  }
  const buttons = renderer.draw(state, now);
  input.setButtons(buttons);
  requestAnimationFrame(frame);
}

function runShot(name) {
  const scene = stageShot(name, game);
  void scene;
  let painted = 0;
  function paint() {
    const buttons = renderer.draw(state, performance.now());
    input.setButtons(buttons);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

announce('Two Harbours. Spot the difference.');
if (shot) runShot(shot);
else requestAnimationFrame(frame);
