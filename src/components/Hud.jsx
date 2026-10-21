import { DIFFICULTY, TOTAL_ARROWS } from '../game/config';

function MiniArrow({ used }) {
  return (
    <svg className={`mini-arrow${used ? ' used' : ''}`} viewBox="0 0 40 12" aria-hidden="true">
      <line x1="4" y1="6" x2="32" y2="6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <polygon points="40,6 31,1.5 31,10.5" fill="currentColor" />
      <polygon points="2,6 0,1 7,1 10,6 7,11 0,11" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** Overlay drawn on top of the scene: arrows left, title, "Your score". */
export function Hud({ score, remaining }) {
  return (
    <div className="hud">
      <div className="pill hud-left" role="img" aria-label={`${Math.max(remaining, 0)} arrows left`}>
        {Array.from({ length: TOTAL_ARROWS }, (_, i) => (
          <MiniArrow key={i} used={i >= remaining} />
        ))}
      </div>
      <h1 className="hud-title">Archery Game</h1>
      <div className="pill hud-score" aria-live="polite">
        Your score - <strong>{score}</strong>
      </div>
    </div>
  );
}

/** Stat row shown below the scene. */
export function InfoBar({ difficulty, best, wind, history, remaining }) {
  const last = history[history.length - 1];
  const windText = wind === 0 ? 'Calm' : `${wind > 0 ? '↓' : '↑'} ${Math.round(Math.abs(wind) * 20)} km/h`;

  return (
    <section className="infobar" aria-label="Round details">
      <div className="stat">
        <span>Mode</span>
        <b>{DIFFICULTY[difficulty].label}</b>
      </div>
      <div className="stat">
        <span>Arrows left</span>
        <b>
          {Math.max(remaining, 0)} / {TOTAL_ARROWS}
        </b>
      </div>
      <div className="stat">
        <span>Wind</span>
        <b>{windText}</b>
      </div>
      <div className="stat">
        <span>Last shot</span>
        <b>{last === undefined ? '-' : last === 0 ? 'Miss' : last}</b>
      </div>
      <div className="stat">
        <span>Best ({DIFFICULTY[difficulty].label})</span>
        <b>{best}</b>
      </div>

      <div className="history" aria-label="Shot history">
        {Array.from({ length: TOTAL_ARROWS }, (_, i) => {
          const v = history[i];
          return (
            <span key={i} className={`chip ${v === undefined ? 'empty' : `s${v}`}`}>
              {v === undefined ? '' : v === 0 ? '×' : v}
            </span>
          );
        })}
      </div>
    </section>
  );
}
