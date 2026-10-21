import { ARROW, TARGET, VIEW } from '../game/config';
import Background from './Background';
import Target from './Target';
import Bow from './Bow';
import { ArrowShape } from './Arrow';

function Popup({ popup }) {
  const label = popup.pts === 0 ? 'Miss' : popup.pts === 10 ? 'Bullseye! +10' : `+${popup.pts}`;
  const color = popup.pts === 0 ? '#ffd0d0' : popup.pts === 10 ? '#ffe46b' : '#ffffff';
  return (
    <g>
      <circle className="burst" cx={popup.x} cy={popup.y} r={26} fill="none" stroke={color} strokeWidth={4} />
      <text className="popup" x={popup.x} y={popup.y - 30} textAnchor="middle" fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function Scene({ view, phase, stuck, popup, guide }) {
  const { aimY, targetY, pose } = view;
  const nocked = phase === 'aiming' || phase === 'menu';

  return (
    <svg
      className="scene"
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Archery range: a bow on the left and an elliptical target with rings 7, 8, 9 and 10 on the right"
    >
      <Background />

      {guide && phase === 'aiming' && (
        <line className="guide" x1={ARROW.startX} y1={aimY} x2={TARGET.x} y2={aimY} />
      )}

      <Target cy={targetY} stuck={stuck} />
      <Bow y={aimY} pulled={nocked} />

      {nocked && (
        <g transform={`translate(${ARROW.startX} ${aimY})`}>
          <ArrowShape />
        </g>
      )}
      {pose && (
        <g transform={`translate(${pose.x} ${pose.y}) rotate(${pose.angle})`}>
          <ArrowShape />
        </g>
      )}

      {popup && <Popup key={popup.id} popup={popup} />}
    </svg>
  );
}
