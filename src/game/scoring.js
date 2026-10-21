import { RINGS } from './config';

const innerFirst = [...RINGS].sort((a, b) => b.score - a.score);

/**
 * Score for an arrow that lands at (dx, dy) relative to the target centre.
 * A point is inside a ring when (dx/rx)^2 + (dy/ry)^2 <= 1.
 * Returns 7-10, or 0 for a miss.
 */
export function scoreFor(dx, dy) {
  for (const ring of innerFirst) {
    if ((dx / ring.rx) ** 2 + (dy / ring.ry) ** 2 <= 1) return ring.score;
  }
  return 0;
}

export function ratingFor(total) {
  if (total >= 90) return 'Legendary archer';
  if (total >= 75) return 'Sharpshooter';
  if (total >= 55) return 'Skilled archer';
  if (total >= 30) return 'Apprentice';
  return 'Keep practising';
}
