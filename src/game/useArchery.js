import { useCallback, useEffect, useRef, useState } from 'react';
import { AIM, ARC, ARROW, DIFFICULTY, TARGET, TOTAL_ARROWS, WIND_PX } from './config';
import { scoreFor } from './scoring';
import { setMuted, sfx } from './sound';

const bestKey = (d) => `archery-best-${d}`;

function readBest(d) {
  try {
    return Number(window.localStorage.getItem(bestKey(d))) || 0;
  } catch {
    return 0;
  }
}

function saveBest(d, value) {
  try {
    window.localStorage.setItem(bestKey(d), String(value));
  } catch {
    /* storage unavailable: ignore */
  }
}

const newWind = (d) => +((Math.random() * 2 - 1) * DIFFICULTY[d].wind).toFixed(2);

/** Position + rotation of an arrow in flight (origin = arrow tip). */
export function arrowPose(f, elapsed = f?.elapsed ?? 0) {
  if (!f) return null;
  const p = Math.min(elapsed / ARROW.flightMs, 1);
  const endX = TARGET.x + f.jitterX;
  const dyTotal = f.finalY - f.startY;
  const x = ARROW.startX + (endX - ARROW.startX) * p;
  const y = f.startY + dyTotal * p - ARC * Math.sin(Math.PI * p);
  const vx = endX - ARROW.startX;
  const vy = dyTotal - ARC * Math.PI * Math.cos(Math.PI * p);
  return { x, y, angle: (Math.atan2(vy, vx) * 180) / Math.PI };
}

export function useArchery() {
  const [phase, setPhase] = useState('menu'); // menu | aiming | flying | settling | over
  const [paused, setPaused] = useState(false);
  const [difficulty, setDifficultyState] = useState('medium');
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [stuck, setStuck] = useState([]);
  const [popup, setPopup] = useState(null);
  const [wind, setWind] = useState(0);
  const [best, setBest] = useState(() => readBest('medium'));
  const [newBest, setNewBest] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [aimMode, setAimModeState] = useState('manual'); // manual (pointer) | sweep (auto)
  const [, setFrame] = useState(0);

  const sim = useRef({
    aimT: 0,
    targetT: 0,
    aimY: AIM.mid,
    manualY: AIM.mid,
    targetY: TARGET.baseY,
    flight: null,
    last: 0,
  });
  const stats = useRef({ score: 0, shots: 0 });
  const idRef = useRef(0);
  const timer = useRef(null);
  const live = useRef({});
  live.current = { phase, paused, difficulty, wind, aimMode };

  const resolveRef = useRef();
  resolveRef.current = (f) => {
    const s = sim.current;
    const { difficulty: d } = live.current;
    const dx = f.jitterX;
    const dy = f.finalY - s.targetY;
    const pts = scoreFor(dx, dy);
    const angle = arrowPose(f, ARROW.flightMs).angle;
    s.flight = null;

    stats.current.shots += 1;
    stats.current.score += pts;
    setScore(stats.current.score);
    setHistory((h) => [...h, pts]);
    setStuck((a) => [...a, { id: f.id, dx, dy, angle }]);
    setPopup({ id: f.id, pts, x: TARGET.x + dx, y: Math.max(70, s.targetY + dy) });

    if (pts === 10) sfx.bullseye();
    else if (pts > 0) sfx.hit(pts);
    else sfx.miss();

    if (stats.current.shots >= TOTAL_ARROWS) {
      live.current.phase = 'settling';
      setPhase('settling');
      timer.current = setTimeout(() => {
        const total = stats.current.score;
        if (total > readBest(d)) {
          saveBest(d, total);
          setBest(total);
          setNewBest(true);
        }
        setPhase('over');
        sfx.finish(total);
      }, 1100);
    } else {
      setWind(newWind(d));
      live.current.phase = 'aiming';
      setPhase('aiming');
    }
  };

  // Main animation loop
  useEffect(() => {
    let raf;
    const step = (ts) => {
      const s = sim.current;
      const L = live.current;
      const dt = s.last ? Math.min((ts - s.last) / 1000, 0.05) : 0;
      s.last = ts;

      if (!L.paused && L.phase !== 'over') {
        const cfg = DIFFICULTY[L.difficulty];
        s.targetT += dt * cfg.targetSpeed;
        s.targetY = TARGET.baseY + Math.sin(s.targetT) * cfg.targetAmp;
        if (L.phase === 'aiming' || L.phase === 'menu') {
          s.aimT += dt * (L.aimMode === 'sweep' ? cfg.aimSpeed : 1);
          if (L.aimMode === 'sweep') {
            s.aimY = AIM.mid + Math.sin(s.aimT) * AIM.amp;
          } else {
            // manual: your pointer sets the aim, plus a little hand sway on harder modes
            const sway = cfg.sway * (Math.sin(s.aimT * 2.3) * 0.7 + Math.sin(s.aimT * 5.1) * 0.3);
            s.aimY = Math.min(AIM.max, Math.max(AIM.min, s.manualY + sway));
          }
        }
        if (s.flight) {
          s.flight.elapsed += dt * 1000;
          if (s.flight.elapsed >= ARROW.flightMs) resolveRef.current(s.flight);
        }
      }
      setFrame((n) => (n + 1) % 1e9);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  const start = useCallback((d) => {
    clearTimeout(timer.current);
    const level = d ?? live.current.difficulty;
    const s = sim.current;
    s.flight = null;
    stats.current = { score: 0, shots: 0 };
    setDifficultyState(level);
    setScore(0);
    setHistory([]);
    setStuck([]);
    setPopup(null);
    setNewBest(false);
    setBest(readBest(level));
    setWind(newWind(level));
    setPaused(false);
    live.current.phase = 'aiming';
    live.current.difficulty = level;
    setPhase('aiming');
  }, []);

  const fire = useCallback(() => {
    const L = live.current;
    const s = sim.current;
    if (L.phase !== 'aiming' || L.paused) return;
    const cfg = DIFFICULTY[L.difficulty];
    const drift = L.wind * WIND_PX;
    const jy = (Math.random() * 2 - 1) * cfg.jitter;
    s.flight = {
      id: ++idRef.current,
      elapsed: 0,
      startY: s.aimY,
      finalY: s.aimY + drift + jy,
      jitterX: (Math.random() * 2 - 1) * 10,
    };
    live.current.phase = 'flying';
    setPhase('flying');
    sfx.release();
  }, []);

  const togglePause = useCallback(() => {
    const p = live.current.phase;
    if (p === 'menu' || p === 'over') return;
    setPaused((v) => !v);
  }, []);

  const toMenu = useCallback(() => {
    clearTimeout(timer.current);
    sim.current.flight = null;
    setPaused(false);
    live.current.phase = 'menu';
    setPhase('menu');
  }, []);

  const chooseDifficulty = useCallback((d) => {
    setDifficultyState(d);
    live.current.difficulty = d;
    setBest(readBest(d));
  }, []);

  const toggleMute = useCallback(() => setMutedState((m) => !m), []);

  const setAimMode = useCallback((m) => {
    live.current.aimMode = m;
    setAimModeState(m);
  }, []);

  /** Set the aim height from a pointer (SVG units). Only used in manual mode. */
  const aimAt = useCallback((y) => {
    const L = live.current;
    if (L.aimMode !== 'manual' || (L.phase !== 'aiming' && L.phase !== 'menu') || L.paused) return;
    sim.current.manualY = Math.min(AIM.max, Math.max(AIM.min, y));
  }, []);

  const nudgeAim = useCallback((dy) => {
    const L = live.current;
    if (L.aimMode !== 'manual') return;
    const s = sim.current;
    s.manualY = Math.min(AIM.max, Math.max(AIM.min, s.manualY + dy));
  }, []);

  const s = sim.current;
  const view = {
    aimY: s.aimY,
    targetY: s.targetY,
    pose: arrowPose(s.flight),
  };

  return {
    phase,
    paused,
    difficulty,
    score,
    history,
    stuck,
    popup,
    wind,
    best,
    newBest,
    muted,
    aimMode,
    view,
    remaining: TOTAL_ARROWS - history.length - (phase === 'flying' ? 1 : 0),
    start,
    fire,
    togglePause,
    toMenu,
    chooseDifficulty,
    toggleMute,
    setAimMode,
    aimAt,
    nudgeAim,
  };
}
