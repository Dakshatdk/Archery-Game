import { ARROW } from '../game/config';

const L = ARROW.length;

/** Full arrow. Origin (0,0) is the arrow tip, the shaft extends to the left. */
export function ArrowShape() {
  return (
    <g>
      <line x1={-L} y1={0} x2={-18} y2={0} stroke="#7a4e24" strokeWidth={4.5} strokeLinecap="round" />
      <line x1={-L + 10} y1={-1} x2={-22} y2={-1} stroke="#c28a47" strokeWidth={1.4} strokeLinecap="round" />
      <polygon
        points="0,0 -26,-8.5 -20,0 -26,8.5"
        fill="#dfe5ea"
        stroke="#475569"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <polygon
        points={`${-L},0 ${-L - 6},-14 ${-L + 26},-14 ${-L + 40},0`}
        fill="#e54848"
        stroke="#8f2323"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <polygon
        points={`${-L},0 ${-L - 6},14 ${-L + 26},14 ${-L + 40},0`}
        fill="#c93b3b"
        stroke="#8f2323"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <circle cx={-L - 3} cy={0} r={3.2} fill="#2b2118" />
    </g>
  );
}

const S = 88;

/** Arrow stuck in the board: the head is buried, only the shaft and feathers show. */
export function StuckArrow() {
  return (
    <g>
      <ellipse cx={1} cy={1} rx={4} ry={3} fill="rgba(0,0,0,.45)" />
      <line x1={-S} y1={0} x2={0} y2={0} stroke="#7a4e24" strokeWidth={4.5} strokeLinecap="round" />
      <line x1={-S + 10} y1={-1} x2={-6} y2={-1} stroke="#c28a47" strokeWidth={1.4} strokeLinecap="round" />
      <polygon
        points={`${-S},0 ${-S - 6},-13 ${-S + 24},-13 ${-S + 38},0`}
        fill="#e54848"
        stroke="#8f2323"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <polygon
        points={`${-S},0 ${-S - 6},13 ${-S + 24},13 ${-S + 38},0`}
        fill="#c93b3b"
        stroke="#8f2323"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <circle cx={-S - 3} cy={0} r={3} fill="#2b2118" />
    </g>
  );
}
