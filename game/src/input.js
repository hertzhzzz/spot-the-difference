// Mouse + keyboard input: converts canvas pixels to scene coordinates and
// reports clicks as either a UI button press or a panel guess.
// Buttons are rectangles the renderer publishes each frame via setButtons().
import { PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_Y, SCENE_W, SCENE_H } from './config.js';

export function createInput(canvas, handlers) {
  let buttons = [];
  let enabled = true;

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function hitButton(point) {
    for (const b of buttons) {
      if (point.x >= b.x && point.x <= b.x + b.w && point.y >= b.y && point.y <= b.y + b.h) return b.id;
    }
    return null;
  }

  function panelAt(point) {
    if (point.y < PANEL_Y || point.y > PANEL_Y + SCENE_H) return null;
    if (point.x >= PANEL_LEFT_X && point.x <= PANEL_LEFT_X + SCENE_W) {
      return { side: 'A', x: point.x - PANEL_LEFT_X, y: point.y - PANEL_Y };
    }
    if (point.x >= PANEL_RIGHT_X && point.x <= PANEL_RIGHT_X + SCENE_W) {
      return { side: 'B', x: point.x - PANEL_RIGHT_X, y: point.y - PANEL_Y };
    }
    return null;
  }

  canvas.addEventListener('pointerdown', (event) => {
    if (!enabled) return;
    const point = canvasPoint(event);
    const button = hitButton(point);
    if (button) {
      handlers.onButton(button);
      return;
    }
    const panel = panelAt(point);
    if (panel) handlers.onPanel(panel.x, panel.y, panel.side);
  });

  window.addEventListener('keydown', (event) => {
    if (!enabled) return;
    const key = event.key.toLowerCase();
    if (key === 'h') handlers.onButton('hint');
    else if (key === 'p' || key === 'escape') handlers.onButton('pause');
    else if (key === 'm') handlers.onButton('sound');
    else if (key === 'r') handlers.onButton('retry');
    else if (key === 'enter' || key === ' ') handlers.onButton('confirm');
  });

  return {
    setButtons(list) { buttons = list; },
    setEnabled(value) { enabled = value; },
  };
}
