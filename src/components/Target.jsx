import { GROUND_Y, RINGS, TARGET } from '../game/config';
import { StuckArrow } from './Arrow';

const outer = RINGS[0];

const strawLines = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  const r1 = 1.0;
  const r2 = 1.0 + 12 / outer.rx;
  return {
    x1: Math.cos(a) * (outer.rx + 2) * r1,
    y1: Math.sin(a) * (outer.ry + 2) * r1,
    x2: Math.cos(a) * (outer.rx + 14) * r2 * 0.93,
    y2: Math.sin(a) * (outer.ry + 14) * r2 * 0.93,
  };
});

export default function Target({ cy, stuck }) {
  const postH = Math.max(0, GROUND_Y + 10 - cy);

  return (
    <g>
      <ellipse cx={TARGET.x} cy={GROUND_Y + 8} rx={84} ry={11} fill="rgba(0,0,0,.25)" />
      <g transform={`translate(${TARGET.x} ${cy})`}>
        <rect x={-9} y={0} width={18} height={postH} fill="#7a4e24" />
        <rect x={-9} y={0} width={5} height={postH} fill="#98642f" />

        <ellipse rx={outer.rx + 16} ry={outer.ry + 16} fill="#d9b36a" stroke="#9a722f" strokeWidth={4} />
        {strawLines.map((l, i) => (
          <line key={i} {...l} stroke="#b98a3f" strokeWidth={2.5} strokeLinecap="round" />
        ))}

        {RINGS.map((r) => (
          <ellipse
            key={r.score}
            rx={r.rx}
            ry={r.ry}
            fill={r.fill}
            stroke="#ffffff"
            strokeOpacity={0.9}
            strokeWidth={3}
          />
        ))}

        {RINGS.map((r, i) => {
          const inner = RINGS[i + 1];
          const y = inner ? -(r.ry + inner.ry) / 2 : 0;
          return (
            <text
              key={r.score}
              x={0}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={r.score === 10 ? 20 : 24}
              fontWeight={800}
              fill={r.ink}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {r.score}
            </text>
          );
        })}

        {stuck.map((a) => (
          <g key={a.id} transform={`translate(${a.dx} ${a.dy}) rotate(${a.angle})`}>
            <StuckArrow />
          </g>
        ))}
      </g>
    </g>
  );
}
