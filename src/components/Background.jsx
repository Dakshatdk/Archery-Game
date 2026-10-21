import { memo } from 'react';
import { GROUND_Y, VIEW } from '../game/config';

function Pine({ x, y, s = 1, shade = 0 }) {
  const greens = ['#2f7a45', '#286b3c', '#215c34'];
  const c = greens[shade % greens.length];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-5} y={-12} width={10} height={22} fill="#5a3a1c" />
      <polygon points="0,-110 -34,-50 34,-50" fill={c} />
      <polygon points="0,-82 -42,-22 42,-22" fill={c} />
      <polygon points="0,-52 -50,8 50,8" fill={c} />
    </g>
  );
}

function Cloud({ y, scale = 1, duration, delay }) {
  return (
    <g className="cloud" style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
      <g transform={`translate(0 ${y}) scale(${scale})`} fill="#ffffff" opacity={0.92}>
        <ellipse cx={0} cy={0} rx={62} ry={22} />
        <ellipse cx={-36} cy={6} rx={38} ry={18} />
        <ellipse cx={42} cy={8} rx={42} ry={17} />
        <ellipse cx={6} cy={-14} rx={34} ry={20} />
      </g>
    </g>
  );
}

const tufts = [60, 190, 330, 470, 610, 760, 880, 1010, 1130, 270, 700, 1090].map((x, i) => ({
  x,
  y: GROUND_Y + 28 + (i % 4) * 20,
}));
const tuftPath = (x, y) => `M${x} ${y} q-3 -14 -7 -16 q6 4 7 16 q2 -12 9 -14 q-6 6 -9 14 q4 -10 11 -10 q-7 4 -11 10`;

function Background() {
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fb4ea" />
          <stop offset="0.7" stopColor="#bfe6f8" />
          <stop offset="1" stopColor="#e9f7fb" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0" stopColor="#fff6c2" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff6c2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#66b552" />
          <stop offset="1" stopColor="#3b8439" />
        </linearGradient>
      </defs>

      <rect width={VIEW.w} height={VIEW.h} fill="url(#sky)" />
      <circle cx={170} cy={120} r={150} fill="url(#sunGlow)" />
      <circle cx={170} cy={120} r={46} fill="#fff3b0" />

      <Cloud y={90} scale={1.1} duration={140} delay={-30} />
      <Cloud y={170} scale={0.8} duration={180} delay={-110} />
      <Cloud y={60} scale={0.7} duration={160} delay={-75} />

      <path
        d="M0 470 L120 360 L220 430 L340 330 L480 450 L560 400 L700 470 L820 380 L950 460 L1080 350 L1200 430 L1200 580 L0 580 Z"
        fill="#9dbdd2"
      />
      <path d="M340 330 L372 362 L350 358 L340 372 L322 356 L312 362 Z" fill="#f4fbff" opacity={0.9} />
      <path d="M1080 350 L1110 380 L1090 376 L1080 390 L1062 374 L1050 380 Z" fill="#f4fbff" opacity={0.9} />

      <path d="M0 520 Q200 440 420 510 T800 500 T1200 490 L1200 580 L0 580 Z" fill="#7fb877" />
      <path d="M0 548 Q300 500 600 540 T1200 530 L1200 580 L0 580 Z" fill="#62a35c" />

      {[420, 470, 525, 690, 745, 800].map((x, i) => (
        <Pine key={x} x={x} y={512 + (i % 2) * 6} s={0.5} shade={i} />
      ))}
      {[40, 100, 160].map((x, i) => (
        <Pine key={x} x={x} y={548} s={0.9 + (i % 2) * 0.15} shade={i} />
      ))}
      {[1125, 1172].map((x, i) => (
        <Pine key={x} x={x} y={552} s={0.95 + i * 0.1} shade={i + 1} />
      ))}

      <g fill="#b78a55">
        <rect x={0} y={GROUND_Y - 24} width={VIEW.w} height={5} />
        <rect x={0} y={GROUND_Y - 10} width={VIEW.w} height={5} />
        {Array.from({ length: 21 }, (_, i) => (
          <rect key={i} x={i * 60 + 12} y={GROUND_Y - 32} width={9} height={32} rx={2} />
        ))}
      </g>

      <rect y={GROUND_Y} width={VIEW.w} height={VIEW.h - GROUND_Y} fill="url(#grass)" />
      {[0, 1, 2].map((i) => (
        <rect key={i} y={GROUND_Y + 14 + i * 28} width={VIEW.w} height={12} fill="#ffffff" opacity={0.06} />
      ))}
      {tufts.map((t, i) => (
        <path key={i} d={tuftPath(t.x, t.y)} fill="none" stroke="#2f7330" strokeWidth={2.5} strokeLinecap="round" />
      ))}
    </g>
  );
}

export default memo(Background);
