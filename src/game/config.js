// All scene coordinates live in one 1200 x 675 SVG "world".
export const VIEW = { w: 1200, h: 675 };
export const GROUND_Y = 575;

export const TARGET = { x: 950, baseY: 320 };
export const BOW = { x: 250 };
export const ARROW = { startX: 300, length: 150, flightMs: 620 };
export const AIM = { mid: 320, amp: 185, min: 110, max: 530 };

export const ARC = 34; // how high the arrow lobs during flight (px)
export const WIND_PX = 42; // max vertical drift caused by wind (px)
export const TOTAL_ARROWS = 10;

// Elliptical rings, outer -> inner (same layout as the sketch: 7, 8, 9, 10).
export const RINGS = [
  { score: 7, rx: 110, ry: 170, fill: '#2f6fb3', ink: '#ffffff' },
  { score: 8, rx: 80, ry: 128, fill: '#d64545', ink: '#ffffff' },
  { score: 9, rx: 52, ry: 86, fill: '#f08a24', ink: '#ffffff' },
  { score: 10, rx: 22, ry: 44, fill: '#f7d046', ink: '#4a3200' },
];

export const DIFFICULTY = {
  easy: {
    label: 'Easy',
    blurb: 'Still target, aim guide, no wind',
    aimSpeed: 1.5,
    targetAmp: 0,
    targetSpeed: 0,
    wind: 0,
    jitter: 0,
    sway: 0,
    guide: true,
  },
  medium: {
    label: 'Medium',
    blurb: 'Drifting target, hand sway, light wind',
    aimSpeed: 2.3,
    targetAmp: 45,
    targetSpeed: 1.1,
    wind: 0.5,
    jitter: 3,
    sway: 9,
    guide: false,
  },
  hard: {
    label: 'Hard',
    blurb: 'Fast target, shaky aim, strong wind',
    aimSpeed: 3.2,
    targetAmp: 80,
    targetSpeed: 1.8,
    wind: 1,
    jitter: 6,
    sway: 20,
    guide: false,
  },
};
