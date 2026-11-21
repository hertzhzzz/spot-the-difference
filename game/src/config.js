// Two Harbours — Spot the Difference: shared constants.
// The game canvas is 1280x720. Two scene panels (560x420 each) sit side by side
// under a HUD bar; the middle column holds the remaining counter.
export const CANVAS_W = 1280;
export const CANVAS_H = 720;
export const SCENE_W = 560;
export const SCENE_H = 420;
export const PANEL_Y = 118;
export const PANEL_LEFT_X = 20;
export const PANEL_RIGHT_X = 700;
export const HUD_H = 96;
export const BEST_KEY = 'two-harbours-best';

// Click tolerance: a click counts when it lands within a difference's radius
// plus this slack, so small targets stay fair on a trackpad.
export const CLICK_SLACK = 8;
export const WRONG_PENALTY = 10;
export const FOUND_POINTS = 100;
export const HINT_COST = 50;
export const HINTS_PER_GAME = 3;
export const TIME_BONUS_PER_SECOND = 10;
export const WRONG_FLASH_MS = 350;
export const HINT_FLASH_MS = 1600;
export const FOUND_RING_MS = 900;

export const COLORS = {
  hud: '#101828',
  hudText: '#f5f1e6',
  accent: '#ffd166',
  good: '#3ddc84',
  bad: '#ff5d5d',
  panelBorder: '#2a3446',
  panelLabel: '#e8e2d0',
};
