// Scene art for Two Harbours: every picture is drawn from code (no image files),
// so the two panels are the same drawing with a few deliberate changes.
// drawScene(ctx, levelIndex, variant, rng) paints one panel in scene space
// (560x420). Variant 'A' is the left picture; 'B' applies that level's
// differences. A difference the B picture drops is painted over with a patch
// of the local background colour.
import { SCENE_W, SCENE_H } from './config.js';

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function star4(ctx, x, y, r, color) {
  poly(ctx, [[x, y - r], [x + r * 0.28, y - r * 0.28], [x + r, y], [x + r * 0.28, y + r * 0.28], [x, y + r], [x - r * 0.28, y + r * 0.28], [x - r, y], [x - r * 0.28, y - r * 0.28]], color);
}

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 260);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_W, 260);
}

function scatter(ctx, rng, n, x0, y0, x1, y1, color, r0, r1) {
  for (let i = 0; i < n; i += 1) {
    const x = x0 + rng() * (x1 - x0);
    const y = y0 + rng() * (y1 - y0);
    circle(ctx, x, y, r0 + rng() * (r1 - r0), color);
  }
}

function gull(ctx, x, y) {
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x - 9, y, 9, Math.PI * 1.15, Math.PI * 1.85);
  ctx.arc(x + 9, y, 9, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

function pine(ctx, x, y, s, color) {
  poly(ctx, [[x, y - 46 * s], [x - 26 * s, y + 6 * s], [x + 26 * s, y + 6 * s]], color);
  poly(ctx, [[x, y - 70 * s], [x - 20 * s, y - 22 * s], [x + 20 * s, y - 22 * s]], color);
  rect(ctx, x - 4 * s, y + 6 * s, 8 * s, 12 * s, '#5b3a1e');
}

// ---- Level 1: Sunny Harbour ----
function drawHarbour(ctx, variant, rng) {
  sky(ctx, '#6ec1f5', '#dff3ff');
  circle(ctx, 480, 70, 30, '#ffd93b');
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    line(ctx, 480 + Math.cos(a) * 36, 70 + Math.sin(a) * 36, 480 + Math.cos(a) * 46, 70 + Math.sin(a) * 46, '#ffd93b', 3);
  }
  ellipse(ctx, 130, 66, 46, 14, '#ffffff');
  ellipse(ctx, 300, 48, 56, 16, '#ffffff');
  if (variant !== 'B') gull(ctx, 92, 62);
  gull(ctx, 210, 90);
  const sea = ctx.createLinearGradient(0, 230, 0, 360);
  sea.addColorStop(0, '#2a7fc2');
  sea.addColorStop(1, '#1b5f9e');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 230, SCENE_W, 130);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  for (const wy of [258, 292, 326]) {
    ctx.beginPath();
    for (let x = 0; x <= SCENE_W; x += 20) ctx.lineTo(x, wy + Math.sin(x / 40) * 3);
    ctx.stroke();
  }
  rect(ctx, 0, 360, SCENE_W, 60, '#f2d8a0');
  scatter(ctx, rng, 14, 10, 372, 550, 412, '#d9b878', 2, 4);
  // Lighthouse (right).
  rect(ctx, 448, 110, 48, 150, '#f8f4ec');
  rect(ctx, 448, 150, 48, 18, '#e05252');
  rect(ctx, 448, 200, 48, 18, '#e05252');
  rect(ctx, 442, 92, 60, 20, '#334155');
  circle(ctx, 472, 122, 9, '#ffd93b');
  line(ctx, 472, 92, 472, 78, '#334155', 3);
  circle(ctx, 472, 76, 4, '#e05252');
  // Sailboat (middle).
  poly(ctx, [[262, 252], [300, 252], [282, 238]], '#7a4a21');
  rect(ctx, 262, 250, 40, 8, '#8b5a2b');
  poly(ctx, [[298, 248], [298, 176], [268, 248]], '#ffffff');
  line(ctx, 300, 176, 300, 250, '#5b3a1e', 3);
  poly(ctx, [[300, 148], [322, 156], [300, 164]], '#e05252');
  // Buoy.
  circle(ctx, 432, 302, 14, '#e05252');
  rect(ctx, 418, 296, 28, 8, '#ffffff');
  line(ctx, 432, 288, 432, 280, '#334155', 3);
  // Crab on the sand (only in picture A).
  if (variant !== 'B') {
    circle(ctx, 122, 362, 12, '#e8734a');
    circle(ctx, 110, 352, 4, '#e8734a');
    circle(ctx, 134, 352, 4, '#e8734a');
    line(ctx, 108, 366, 96, 372, '#e8734a', 2);
    line(ctx, 136, 366, 148, 372, '#e8734a', 2);
  }
  if (variant !== 'B') return;
  // B picture changes.
  poly(ctx, [[300, 148], [322, 156], [300, 164]], '#3b82f6'); // blue flag
  circle(ctx, 472, 122, 9, '#334155'); // lamp dark
  circle(ctx, 432, 302, 14, '#ffd23e'); // yellow buoy
  rect(ctx, 418, 296, 28, 8, '#ffd23e');
}

// ---- Level 2: Forest Camp ----
function drawCamp(ctx, variant, rng) {
  sky(ctx, '#2c2a55', '#8a5f8f');
  scatter(ctx, rng, 26, 10, 10, 550, 180, '#ffffff', 1, 2.2);
  if (variant !== 'B') star4(ctx, 202, 52, 9, '#fff7c0');
  circle(ctx, 80, 60, 22, '#f5ead0');
  circle(ctx, 72, 54, 6, '#e2d3ae');
  circle(ctx, 88, 66, 5, '#e2d3ae');
  for (const [tx, ty, s] of [[40, 250, 1.2], [520, 240, 1.1], [90, 260, 0.9], [470, 270, 0.9]]) pine(ctx, tx, ty, s, '#123524');
  rect(ctx, 0, 300, SCENE_W, 120, '#1e4632');
  line(ctx, 420, 108, 500, 96, '#3a2a18', 5);
  if (variant !== 'B') {
    circle(ctx, 452, 92, 8, '#5b7fa6');
    poly(ctx, [[460, 90], [468, 86], [460, 96]], '#f2a541');
  }
  // Tent.
  poly(ctx, [[100, 330], [150, 232], [200, 330]], '#d94f3d');
  poly(ctx, [[138, 330], [150, 296], [162, 330]], '#5b2a1e');
  line(ctx, 150, 232, 150, 330, '#b23a2c', 2);
  // Campfire: a big flame in A, a small one in B.
  rect(ctx, 282, 336, 44, 8, '#5b3a1e');
  rect(ctx, 286, 328, 36, 7, '#7a4a21');
  if (variant === 'B') {
    poly(ctx, [[296, 328], [302, 312], [310, 328]], '#ff8c1a');
  } else {
    poly(ctx, [[288, 328], [302, 292], [316, 328]], '#ff8c1a');
    poly(ctx, [[296, 328], [302, 306], [310, 328]], '#ffd93b');
  }
  // Mushroom (only in picture A).
  if (variant !== 'B') {
    rect(ctx, 478, 352, 8, 14, '#f5ead0');
    poly(ctx, [[466, 354], [482, 336], [498, 354]], '#d94f3d');
    circle(ctx, 476, 346, 2.5, '#ffffff');
    circle(ctx, 488, 342, 2.5, '#ffffff');
  }
  // Backpack.
  rect(ctx, 366, 348, 32, 26, '#3d8b4f');
  rect(ctx, 374, 340, 16, 10, '#3d8b4f');
  line(ctx, 374, 352, 390, 352, '#2c6b3c', 3);
  if (variant !== 'B') return;
  poly(ctx, [[100, 330], [150, 232], [200, 330]], '#3b82f6'); // blue tent
  poly(ctx, [[138, 330], [150, 296], [162, 330]], '#5b2a1e');
  rect(ctx, 366, 348, 32, 26, '#e8732a'); // orange pack
  rect(ctx, 374, 340, 16, 10, '#e8732a');
}

// ---- Level 3: Space Station ----
function drawSpace(ctx, variant, rng) {
  rect(ctx, 0, 0, SCENE_W, SCENE_H, '#050514');
  scatter(ctx, rng, 60, 10, 10, 550, 330, '#ffffff', 1, 2);
  if (variant !== 'B') star4(ctx, 522, 62, 10, '#fff7c0');
  // Ringed planet (rings only in picture A).
  circle(ctx, 112, 92, 38, '#4fb3a9');
  if (variant !== 'B') {
    ctx.strokeStyle = '#c9f2ec';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(112, 92, 58, 12, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Moon surface.
  rect(ctx, 0, 350, SCENE_W, 70, '#b8b8c0');
  circle(ctx, 90, 385, 12, '#9d9da8');
  circle(ctx, 480, 395, 16, '#9d9da8');
  circle(ctx, 350, 380, 8, '#9d9da8');
  // Rocket on the moon (flame only in picture A).
  poly(ctx, [[168, 332], [182, 286], [196, 332]], '#e8e8f0');
  circle(ctx, 182, 312, 6, '#3b82f6');
  if (variant !== 'B') {
    poly(ctx, [[172, 332], [182, 352], [192, 332]], '#ff8c1a');
    poly(ctx, [[176, 332], [182, 344], [188, 332]], '#ffd93b');
  }
  line(ctx, 168, 332, 158, 344, '#94a3b8', 3);
  line(ctx, 196, 332, 206, 344, '#94a3b8', 3);
  // Moon flag.
  line(ctx, 252, 362, 252, 330, '#e8e8f0', 3);
  poly(ctx, [[252, 330], [276, 337], [252, 344]], '#e05252');
  // Station module.
  rect(ctx, 330, 238, 150, 52, '#c7ccd6');
  rect(ctx, 330, 238, 150, 10, '#9aa1af');
  circle(ctx, 382, 262, 10, '#ffd93b');
  circle(ctx, 430, 262, 10, '#3b82f6');
  rect(ctx, 480, 252, 26, 24, '#8b93a3');
  // Satellite dish: pointing left in A, right in B.
  line(ctx, 472, 142, 472, 180, '#c7ccd6', 4);
  ctx.strokeStyle = '#e8e8f0';
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (variant === 'B') {
    ctx.arc(486, 138, 18, Math.PI * 1.5, Math.PI * 2.4);
  } else {
    ctx.arc(458, 138, 18, Math.PI * 0.6, Math.PI * 1.5);
  }
  ctx.stroke();
  line(ctx, variant === 'B' ? 486 : 458, 138, variant === 'B' ? 502 : 442, 128, '#e8e8f0', 3);
  // Astronaut.
  circle(ctx, 302, 202, 26, '#f1f5f9');
  circle(ctx, 302, 202, 17, '#3b82f6');
  rect(ctx, 292, 226, 20, 26, '#f1f5f9');
  line(ctx, 292, 234, 278, 244, '#f1f5f9', 6);
  line(ctx, 312, 234, 326, 244, '#f1f5f9', 6);
  if (variant !== 'B') return;
  circle(ctx, 302, 202, 17, '#f2b705'); // gold visor
  circle(ctx, 382, 262, 10, '#334155'); // window dark
  poly(ctx, [[252, 330], [276, 337], [252, 344]], '#3b82f6'); // blue flag
}

// ---- Level 4: Market Morning ----
function drawMarket(ctx, variant, rng) {
  sky(ctx, '#ffe9b8', '#fff6dd');
  circle(ctx, 500, 60, 26, '#ffd93b');
  ellipse(ctx, 82, 82, 16, 20, '#e05252');
  poly(ctx, [[82, 102], [78, 116], [86, 116]], '#e05252');
  line(ctx, 82, 116, 82, 130, '#94a3b8', 2);
  rect(ctx, 0, 340, SCENE_W, 80, '#c9b18a');
  scatter(ctx, rng, 12, 10, 350, 550, 410, '#a98f66', 2, 4);
  // Left stall with awning.
  for (let i = 0; i < 6; i += 1) rect(ctx, 60 + i * 22, 70, 22, 34, i % 2 ? '#ffffff' : '#e05252');
  rect(ctx, 60, 104, 132, 6, '#7a4a21');
  rect(ctx, 66, 110, 120, 90, '#8b5a2b');
  circle(ctx, 100, 150, 12, '#e05252');
  circle(ctx, 140, 150, 12, '#f2a541');
  circle(ctx, 170, 150, 12, '#7fb069');
  // Bird on the awning (only in picture A).
  if (variant !== 'B') {
    circle(ctx, 302, 62, 7, '#5b7fa6');
    poly(ctx, [[309, 60], [316, 57], [309, 65]], '#f2a541');
  }
  // Price sign.
  rect(ctx, 330, 100, 46, 42, '#f8f4ec');
  rect(ctx, 330, 100, 46, 42, '#f8f4ec');
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('$5', 353, 122);
  line(ctx, 330, 142, 330, 170, '#7a4a21', 4);
  line(ctx, 376, 142, 376, 170, '#7a4a21', 4);
  // Apple basket.
  poly(ctx, [[232, 292], [292, 292], [284, 318], [240, 318]], '#b07a3a');
  circle(ctx, 248, 286, 9, '#e05252');
  circle(ctx, 262, 292, 9, '#e05252');
  circle(ctx, 278, 286, 9, '#e05252');
  // Flower pot.
  poly(ctx, [[168, 362], [196, 362], [190, 386], [174, 386]], '#b5651d');
  line(ctx, 182, 362, 182, 336, '#3d8b4f', 3);
  circle(ctx, 182, 330, 10, '#ffd93b');
  circle(ctx, 182, 330, 4, '#8a5a00');
  // Crates and cat (the cat only in picture A).
  rect(ctx, 430, 330, 60, 40, '#a9803e');
  line(ctx, 430, 350, 490, 350, '#8b6a2e', 2);
  if (variant !== 'B') {
    ellipse(ctx, 462, 322, 16, 12, '#94a3b8');
    circle(ctx, 474, 308, 8, '#94a3b8');
    poly(ctx, [[470, 302], [473, 294], [476, 302]], '#94a3b8');
    line(ctx, 478, 322, 494, 314, '#94a3b8', 3);
  }
  // Bicycle.
  circle(ctx, 470, 386, 14, '#334155');
  circle(ctx, 530, 386, 14, '#334155');
  line(ctx, 470, 386, 500, 360, '#334155', 3);
  line(ctx, 530, 386, 500, 360, '#334155', 3);
  line(ctx, 500, 360, 516, 360, '#334155', 3);
  if (variant !== 'B') rect(ctx, 494, 366, 18, 14, '#b07a3a'); // bike basket
  if (variant !== 'B') return;
  for (let i = 0; i < 6; i += 1) rect(ctx, 60 + i * 22, 70, 22, 34, i % 2 ? '#ffffff' : '#3d8b4f'); // green awning
  circle(ctx, 262, 292, 9, '#7fb069'); // green apple
  ctx.fillStyle = '#f8f4ec';
  ctx.fillRect(330, 100, 46, 42); // price sign redrawn
  ctx.fillStyle = '#1f2937';
  ctx.fillText('$8', 353, 122);
  ellipse(ctx, 82, 82, 16, 20, '#ffd93b'); // yellow balloon
  poly(ctx, [[82, 102], [78, 116], [86, 116]], '#ffd93b');
  circle(ctx, 182, 330, 10, '#f472b6'); // pink flower
  circle(ctx, 182, 330, 4, '#9d174d');
}

// ---- Level 5: Snowy Cabin ----
function drawCabin(ctx, variant, rng) {
  sky(ctx, '#bcd6ea', '#eef4fa');
  scatter(ctx, rng, 40, 10, 10, 550, 200, '#ffffff', 1.5, 3);
  rect(ctx, 0, 300, SCENE_W, 120, '#f4f8fc');
  // Pine with lights.
  pine(ctx, 482, 250, 1.4, '#1d5c38');
  circle(ctx, 468, 196, 4, '#ffd93b');
  circle(ctx, 494, 214, 4, '#ff5d5d');
  circle(ctx, 478, 236, 4, '#3b82f6');
  // Birdhouse (only in picture A).
  if (variant !== 'B') {
    line(ctx, 522, 122, 522, 180, '#7a4a21', 4);
    rect(ctx, 508, 100, 28, 24, '#b5651d');
    poly(ctx, [[504, 100], [522, 86], [540, 100]], '#8b3a2b');
    circle(ctx, 522, 114, 4, '#1f2937');
  }
  // Cabin.
  rect(ctx, 200, 150, 160, 150, '#8b5a2b');
  poly(ctx, [[186, 152], [280, 96], [374, 152]], '#f4f8fc');
  poly(ctx, [[186, 152], [280, 96], [374, 152]], 'rgba(244,248,252,0.9)');
  rect(ctx, 400, 60, 30, 90, '#6b4423');
  if (variant !== 'B') {
    circle(ctx, 415, 52, 12, '#d9dee6');
    circle(ctx, 424, 68, 9, '#d9dee6');
    circle(ctx, 432, 82, 7, '#d9dee6');
  }
  // Door + wreath (the wreath only in picture A), window + curtains.
  rect(ctx, 268, 210, 34, 90, '#5b3a1e');
  if (variant !== 'B') {
    circle(ctx, 285, 222, 13, '#1d5c38');
    circle(ctx, 285, 222, 7, '#5b3a1e');
    circle(ctx, 278, 214, 2.5, '#e05252');
    circle(ctx, 292, 230, 2.5, '#e05252');
  }
  rect(ctx, 222, 168, 36, 30, '#ffd93b');
  rect(ctx, 222, 168, 8, 30, '#e8a13a');
  rect(ctx, 250, 168, 8, 30, '#e8a13a');
  // Icicle under the roof (only in picture A).
  if (variant !== 'B') poly(ctx, [[328, 142], [336, 142], [332, 164]], '#cfe8f5');
  // Snowman.
  circle(ctx, 152, 332, 26, '#ffffff');
  circle(ctx, 152, 288, 20, '#ffffff');
  circle(ctx, 152, 252, 15, '#ffffff');
  circle(ctx, 146, 248, 2.5, '#1f2937');
  circle(ctx, 158, 248, 2.5, '#1f2937');
  poly(ctx, [[152, 254], [164, 258], [152, 262]], '#e8732a');
  rect(ctx, 138, 232, 28, 6, '#1f2937');
  rect(ctx, 142, 214, 20, 20, '#1f2937');
  rect(ctx, 132, 296, 40, 10, '#e05252');
  // Lantern.
  line(ctx, 92, 342, 92, 306, '#334155', 3);
  rect(ctx, 82, 306, 20, 22, '#334155');
  circle(ctx, 92, 317, 6, '#ffd93b');
  // Skis (only in picture A).
  if (variant !== 'B') {
    line(ctx, 366, 348, 398, 378, '#8b3a2b', 4);
    line(ctx, 366, 378, 398, 348, '#8b3a2b', 4);
  }
  if (variant !== 'B') return;
  rect(ctx, 132, 296, 40, 10, '#3b82f6'); // blue scarf
  circle(ctx, 468, 196, 4, '#9aa1af'); // lights off
  circle(ctx, 494, 214, 4, '#9aa1af');
  circle(ctx, 478, 236, 4, '#9aa1af');
  circle(ctx, 92, 317, 6, '#334155'); // lantern dark
  rect(ctx, 142, 214, 20, 20, '#e05252'); // red hat
  rect(ctx, 138, 232, 28, 6, '#e05252');
  rect(ctx, 222, 168, 36, 30, '#334155'); // curtains off
}

const DRAWERS = [drawHarbour, drawCamp, drawSpace, drawMarket, drawCabin];

/** Paint one panel of `levelIndex` (0-based), variant 'A' or 'B'. */
export function drawScene(ctx, levelIndex, variant, rng) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, SCENE_W, SCENE_H);
  ctx.clip();
  DRAWERS[levelIndex](ctx, variant, rng);
  ctx.restore();
}
