// Level data: the one source of truth for every difference.
// Each difference lives in scene coordinates (560x420, shared by both panels).
// `kind` tells scenes.js what the right-hand picture changes; `label` is the
// short name shown in the found-list and in the level-clear recap.
export const LEVELS = [
  {
    name: 'Sunny Harbour',
    sub: 'Boats, gulls and a lighthouse',
    time: 90,
    diffs: [
      { id: 'gull', x: 92, y: 62, r: 26, label: 'Seagull', kind: 'absent' },
      { id: 'flag', x: 302, y: 148, r: 20, label: 'Boat flag', kind: 'flag-blue' },
      { id: 'lamp', x: 472, y: 122, r: 18, label: 'Lighthouse lamp', kind: 'lamp-dark' },
      { id: 'crab', x: 122, y: 362, r: 22, label: 'Crab', kind: 'absent' },
      { id: 'buoy', x: 432, y: 302, r: 22, label: 'Buoy', kind: 'buoy-yellow' },
    ],
  },
  {
    name: 'Forest Camp',
    sub: 'A tent under the pines at dusk',
    time: 90,
    diffs: [
      { id: 'tent', x: 150, y: 282, r: 30, label: 'Tent', kind: 'tent-blue' },
      { id: 'flame', x: 302, y: 322, r: 24, label: 'Campfire flame', kind: 'flame-small' },
      { id: 'mushroom', x: 482, y: 352, r: 20, label: 'Mushroom', kind: 'absent' },
      { id: 'bird', x: 452, y: 92, r: 20, label: 'Bird on branch', kind: 'absent' },
      { id: 'star', x: 202, y: 52, r: 18, label: 'Star', kind: 'absent' },
      { id: 'pack', x: 382, y: 362, r: 22, label: 'Backpack', kind: 'pack-orange' },
    ],
  },
  {
    name: 'Space Station',
    sub: 'Orbiting above a ringed planet',
    time: 100,
    diffs: [
      { id: 'rings', x: 112, y: 92, r: 30, label: 'Planet rings', kind: 'rings-off' },
      { id: 'visor', x: 302, y: 202, r: 22, label: 'Visor', kind: 'visor-gold' },
      { id: 'dish', x: 472, y: 142, r: 24, label: 'Satellite dish', kind: 'dish-right' },
      { id: 'flame', x: 182, y: 332, r: 22, label: 'Rocket flame', kind: 'absent' },
      { id: 'window', x: 382, y: 262, r: 18, label: 'Station window', kind: 'lamp-dark' },
      { id: 'star', x: 522, y: 62, r: 16, label: 'Bright star', kind: 'absent' },
      { id: 'flag', x: 252, y: 362, r: 20, label: 'Moon flag', kind: 'flag-blue' },
    ],
  },
  {
    name: 'Market Morning',
    sub: 'Fruit stalls and a sleepy cat',
    time: 110,
    diffs: [
      { id: 'awning', x: 122, y: 92, r: 28, label: 'Awning', kind: 'awning-green' },
      { id: 'apple', x: 262, y: 292, r: 18, label: 'Apple', kind: 'apple-green' },
      { id: 'cat', x: 462, y: 332, r: 24, label: 'Cat', kind: 'absent' },
      { id: 'price', x: 352, y: 122, r: 20, label: 'Price sign', kind: 'price-8' },
      { id: 'balloon', x: 82, y: 82, r: 20, label: 'Balloon', kind: 'balloon-yellow' },
      { id: 'basket', x: 502, y: 382, r: 22, label: 'Bike basket', kind: 'absent' },
      { id: 'flower', x: 182, y: 362, r: 20, label: 'Flower', kind: 'flower-pink' },
      { id: 'bird', x: 302, y: 62, r: 18, label: 'Bird on awning', kind: 'absent' },
    ],
  },
  {
    name: 'Snowy Cabin',
    sub: 'Smoke, snow and a snowman',
    time: 120,
    diffs: [
      { id: 'smoke', x: 422, y: 72, r: 24, label: 'Chimney smoke', kind: 'absent' },
      { id: 'scarf', x: 152, y: 302, r: 22, label: 'Snowman scarf', kind: 'scarf-blue' },
      { id: 'wreath', x: 282, y: 222, r: 20, label: 'Door wreath', kind: 'absent' },
      { id: 'lights', x: 482, y: 202, r: 24, label: 'Tree lights', kind: 'lights-off' },
      { id: 'skis', x: 382, y: 362, r: 22, label: 'Skis', kind: 'absent' },
      { id: 'lantern', x: 92, y: 342, r: 18, label: 'Lantern', kind: 'lamp-dark' },
      { id: 'icicle', x: 332, y: 142, r: 18, label: 'Icicle', kind: 'absent' },
      { id: 'birdhouse', x: 522, y: 122, r: 18, label: 'Birdhouse', kind: 'absent' },
      { id: 'hat', x: 152, y: 242, r: 20, label: 'Snowman hat', kind: 'hat-red' },
      { id: 'curtain', x: 242, y: 182, r: 20, label: 'Cabin window', kind: 'curtain-off' },
    ],
  },
];

export function totalDifferences() {
  return LEVELS.reduce((sum, level) => sum + level.diffs.length, 0);
}
