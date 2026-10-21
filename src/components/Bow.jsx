import { ARROW, BOW } from '../game/config';

const HALF = 92; // half the height of the bow
const TIP_X = BOW.x - 45;

/** Side-view bow. `pulled` draws the string back to the arrow's nock. */
export default function Bow({ y, pulled }) {
  const nockX = ARROW.startX - ARROW.length - 3;
  const stringPath = pulled
    ? `M${TIP_X} ${y - HALF} L${nockX} ${y} L${TIP_X} ${y + HALF}`
    : `M${TIP_X} ${y - HALF} L${TIP_X} ${y + HALF}`;
  const limb = `M${TIP_X} ${y - HALF} Q${BOW.x + 45} ${y} ${TIP_X} ${y + HALF}`;

  return (
    <g strokeLinecap="round" fill="none">
      <path d={limb} stroke="#4a2c12" strokeWidth={11} />
      <path d={limb} stroke="#9a6a35" strokeWidth={5} />
      <path d={stringPath} stroke="#f3ead2" strokeWidth={2} />
      <rect x={BOW.x - 5} y={y - 16} width={10} height={32} rx={4} fill="#2b2118" stroke="none" />
    </g>
  );
}
