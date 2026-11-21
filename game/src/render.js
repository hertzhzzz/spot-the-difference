// Renderer: paints the HUD, the two panels, found markers, the bottom bar
// and every overlay screen. It also publishes the current clickable buttons
// (as {id, x, y, w, h}) so input.js can hit-test them.
import {
  CANVAS_W, CANVAS_H, SCENE_W, SCENE_H, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_Y,
  COLORS, FOUND_RING_MS, HINT_FLASH_MS,
} from './config.js';
import { LEVELS } from './levels.js';
import { drawScene } from './scenes.js';
import { createRandom } from './random.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVELCLEAR = 'levelclear';
export const SCREEN_OVER = 'gameover';
export const SCREEN_WIN = 'win';

const CENTER_X = 640;
const BTN_H = 46;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function button(ctx, id, x, y, w, label, fill, textColor = '#101828') {
  ctx.fillStyle = fill;
  roundRect(ctx, x, y, w, BTN_H, 10);
  ctx.fill();
  ctx.fillStyle = textColor;
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + BTN_H / 2 + 1);
  return { id, x, y, w, h: BTN_H };
}

function panelX(side) {
  return side === 'A' ? PANEL_LEFT_X : PANEL_RIGHT_X;
}

function ring(ctx, x, y, r, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function drawHud(state) {
    ctx.fillStyle = COLORS.hud;
    ctx.fillRect(0, 0, CANVAS_W, 96);
    const level = LEVELS[state.levelIndex];
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = COLORS.hudText;
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`Level ${state.levelIndex + 1} of ${LEVELS.length} — ${level.name}`, 24, 30);
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#b8c0cc';
    ctx.fillText(level.sub, 24, 60);
    ctx.textAlign = 'center';
    ctx.fillStyle = state.timeLeft <= 15 && state.screen === SCREEN_PLAY ? COLORS.bad : COLORS.hudText;
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(fmtTime(state.timeLeft), CENTER_X, 40);
    ctx.fillStyle = '#b8c0cc';
    ctx.font = '13px sans-serif';
    ctx.fillText('TIME LEFT', CENTER_X, 70);
    ctx.textAlign = 'right';
    ctx.fillStyle = COLORS.hudText;
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`Score ${state.score}`, CANVAS_W - 24, 30);
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#b8c0cc';
    ctx.fillText(`Best ${state.best}`, CANVAS_W - 24, 60);
    ctx.textAlign = 'left';
  }

  function drawPanels(state, now) {
    const level = LEVELS[state.levelIndex];
    const rngA = createRandom(1000 + state.levelIndex);
    const rngB = createRandom(1000 + state.levelIndex);
    ctx.save();
    ctx.translate(PANEL_LEFT_X, PANEL_Y);
    drawScene(ctx, state.levelIndex, 'A', rngA);
    ctx.restore();
    ctx.save();
    ctx.translate(PANEL_RIGHT_X, PANEL_Y);
    drawScene(ctx, state.levelIndex, 'B', rngB);
    ctx.restore();
    for (const x of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
      ctx.strokeStyle = COLORS.panelBorder;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, PANEL_Y, SCENE_W, SCENE_H);
    }
    ctx.fillStyle = COLORS.panelLabel;
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('PICTURE A  —  click a difference in either picture', PANEL_LEFT_X + 4, PANEL_Y - 8);
    ctx.fillText('PICTURE B', PANEL_RIGHT_X + 4, PANEL_Y - 8);
    // Found markers on both panels.
    for (const diff of level.diffs) {
      if (!state.found.has(diff.id)) continue;
      const recent = state.foundAnim[diff.id] && now - state.foundAnim[diff.id] < FOUND_RING_MS;
      const pulse = recent ? 1 + 0.25 * Math.sin(((now - state.foundAnim[diff.id]) / FOUND_RING_MS) * Math.PI) : 1;
      for (const side of ['A', 'B']) {
        const px = panelX(side) + diff.x;
        const py = PANEL_Y + diff.y;
        ring(ctx, px, py, diff.r * pulse, COLORS.good, 4);
        ctx.fillStyle = COLORS.good;
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓', px, py + 1);
      }
    }
    // Hint pulse on one unfound difference.
    if (state.hintDiff && now < state.hintUntil) {
      const alpha = 0.55 + 0.45 * Math.sin(now / 90);
      ctx.save();
      ctx.globalAlpha = alpha;
      for (const side of ['A', 'B']) {
        ring(ctx, panelX(side) + state.hintDiff.x, PANEL_Y + state.hintDiff.y, state.hintDiff.r + 6, COLORS.accent, 4);
      }
      ctx.restore();
    }
    // Wrong-click flash.
    if (state.wrongFlash && now < state.wrongFlash.until) {
      const px = panelX(state.wrongFlash.side) + state.wrongFlash.x;
      const py = PANEL_Y + state.wrongFlash.y;
      ctx.strokeStyle = COLORS.bad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(px - 12, py - 12); ctx.lineTo(px + 12, py + 12);
      ctx.moveTo(px + 12, py - 12); ctx.lineTo(px - 12, py + 12);
      ctx.stroke();
    }
    // Centre column: how many are left.
    const left = level.diffs.length - state.found.size;
    ctx.fillStyle = '#1c2637';
    roundRect(ctx, 592, PANEL_Y + 120, 96, 180, 12);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.accent;
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText(String(left), CENTER_X, PANEL_Y + 190);
    ctx.fillStyle = COLORS.hudText;
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(left === 1 ? 'LEFT' : 'LEFT', CENTER_X, PANEL_Y + 230);
    ctx.fillStyle = '#b8c0cc';
    ctx.font = '13px sans-serif';
    ctx.fillText(`of ${level.diffs.length}`, CENTER_X, PANEL_Y + 256);
    ctx.fillStyle = '#b8c0cc';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('STREAK', CENTER_X, PANEL_Y + 330);
    ctx.fillStyle = COLORS.hudText;
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`×${state.streak}`, CENTER_X, PANEL_Y + 360);
  }

  function drawBottomBar(state) {
    const level = LEVELS[state.levelIndex];
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 556, CANVAS_W, CANVAS_H - 556);
    // Found chips.
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#b8c0cc';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('FOUND:', 24, 580);
    let cx = 96;
    for (const diff of level.diffs) {
      if (!state.found.has(diff.id)) continue;
      ctx.font = '14px sans-serif';
      const w = ctx.measureText(diff.label).width + 18;
      ctx.fillStyle = '#1d5c38';
      roundRect(ctx, cx, 566, w, 28, 14);
      ctx.fill();
      ctx.fillStyle = '#d9f7e3';
      ctx.fillText(diff.label, cx + 9, 581);
      cx += w + 8;
    }
    ctx.fillStyle = '#8a94a6';
    ctx.font = '13px sans-serif';
    ctx.fillText('Click a difference in either picture. Wrong clicks cost 10 points. H costs a hint, P pauses, M mutes.', 24, 622);
    ctx.fillText(`Mistakes: ${state.mistakes}   ·   Hints left: ${state.hintsLeft}   ·   Level ${state.levelIndex + 1} has ${level.diffs.length} differences`, 24, 650);
    const buttons = [];
    buttons.push(button(ctx, 'hint', 880, 596, 120, `Hint (${state.hintsLeft})`, state.hintsLeft > 0 ? COLORS.accent : '#5a6474', state.hintsLeft > 0 ? '#101828' : '#d7dce3'));
    buttons.push(button(ctx, 'pause', 1012, 596, 110, state.screen === SCREEN_PAUSED ? 'Resume' : 'Pause (P)', '#e8e2d0'));
    buttons.push(button(ctx, 'sound', 1134, 596, 122, state.muted ? 'Sound off' : 'Sound on', '#e8e2d0'));
    return buttons;
  }

  function overlay(title, lines, buttons) {
    ctx.fillStyle = 'rgba(8, 12, 22, 0.78)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#f5f1e6';
    roundRect(ctx, 340, 130, 600, 440, 18);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#101828';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(title, CENTER_X, 195);
    ctx.font = '17px sans-serif';
    ctx.fillStyle = '#374151';
    let y = 245;
    for (const lineText of lines) {
      ctx.fillText(lineText, CENTER_X, y);
      y += 30;
    }
    const out = [];
    const totalW = buttons.reduce((s, b) => s + b.w + 16, -16);
    let bx = CENTER_X - totalW / 2;
    for (const b of buttons) {
      out.push(button(ctx, b.id, bx, 470, b.w, b.label, b.fill ?? COLORS.accent));
      bx += b.w + 16;
    }
    return out;
  }

  function draw(state, now) {
    ctx.fillStyle = '#101828';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    let buttons = [];
    if (state.screen === SCREEN_TITLE) {
      drawHud({ ...state, timeLeft: LEVELS[0].time });
      drawPanels({ ...state, levelIndex: 0, found: new Set(), foundAnim: {}, streak: 0, hintDiff: null, wrongFlash: null }, now);
      buttons = overlay('TWO HARBOURS', [
        'Spot the Difference — five hand-drawn scenes,',
        'two pictures side by side, a few small changes.',
        '',
        'Click every difference in either picture.',
        'Find them all before the clock runs out.',
        'Wrong clicks cost 10 points. Hints cost 50.',
        '',
        `Best score so far: ${state.best}`,
      ], [{ id: 'start', label: 'Start playing', w: 200 }]);
      return buttons;
    }
    drawHud(state);
    drawPanels(state, now);
    buttons = drawBottomBar(state);
    if (state.screen === SCREEN_PAUSED) {
      buttons = buttons.concat(overlay('PAUSED', [
        `${LEVELS[state.levelIndex].name} — ${state.found.size} of ${LEVELS[state.levelIndex].diffs.length} found.`,
        'Take a breath. The clock is stopped.',
      ], [
        { id: 'pause', label: 'Resume', w: 150 },
        { id: 'retry', label: 'Restart level', w: 170 },
        { id: 'menu', label: 'Quit to menu', w: 170 },
      ]));
    } else if (state.screen === SCREEN_LEVELCLEAR) {
      const level = LEVELS[state.levelIndex];
      const lines = [
        `${level.name} — all ${level.diffs.length} differences found!`,
        `Time bonus: +${state.levelBonus} points (${Math.ceil(state.timeLeft)} seconds left).`,
        `Score so far: ${state.score}.`,
      ];
      if (state.levelIndex + 1 < LEVELS.length) {
        lines.push(`Next up: ${LEVELS[state.levelIndex + 1].name} — ${LEVELS[state.levelIndex + 1].diffs.length} differences.`);
        buttons = buttons.concat(overlay('LEVEL CLEAR!', lines, [{ id: 'next', label: 'Next level', w: 180 }]));
      }
    } else if (state.screen === SCREEN_OVER) {
      buttons = buttons.concat(overlay(state.overReason === 'time' ? "TIME'S UP!" : 'GAME OVER', [
        `${LEVELS[state.levelIndex].name} — you found ${state.found.size} of ${LEVELS[state.levelIndex].diffs.length} differences.`,
        `Score: ${state.score}   ·   Best: ${state.best}`,
        state.overReason === 'time' ? 'The clock ran out before the last difference.' : '',
      ].filter(Boolean), [
        { id: 'retry', label: 'Retry level', w: 160 },
        { id: 'menu', label: 'Menu', w: 120 },
      ]));
    } else if (state.screen === SCREEN_WIN) {
      buttons = buttons.concat(overlay('YOU FOUND THEM ALL!', [
        `All ${LEVELS.reduce((s, l) => s + l.diffs.length, 0)} differences across 5 scenes.`,
        `Final score: ${state.score}   ·   Best: ${state.best}`,
        state.score >= state.best && state.score > 0 ? 'A new best score!' : 'Play again to beat your best.',
      ], [
        { id: 'again', label: 'Play again', w: 180 },
        { id: 'menu', label: 'Menu', w: 120 },
      ]));
    }
    return buttons;
  }

  return { draw };
}
