import { DIFFICULTY, TOTAL_ARROWS } from '../game/config';
import { ratingFor } from '../game/scoring';

export function StartScreen({ difficulty, best, aimMode, onAimMode, onChoose, onStart }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="start-title">
      <div className="panel">
        <p className="eyebrow">Target practice</p>
        <h2 id="start-title">Archery Game</h2>
        <p className="lead">
          Aim the bow at the target and shoot. You get {TOTAL_ARROWS} arrows, and the rings score
          7, 8, 9 or 10 (10 is the small centre). Missing the board scores 0.
        </p>

        <div className="levels" role="radiogroup" aria-label="Difficulty">
          {Object.entries(DIFFICULTY).map(([key, d]) => (
            <button
              key={key}
              role="radio"
              aria-checked={difficulty === key}
              className={`level${difficulty === key ? ' on' : ''}`}
              onClick={() => onChoose(key)}
            >
              <b>{d.label}</b>
              <span>{d.blurb}</span>
            </button>
          ))}
        </div>

        <div className="levels two" role="radiogroup" aria-label="Aiming style">
          <button
            role="radio"
            aria-checked={aimMode === 'manual'}
            className={`level${aimMode === 'manual' ? ' on' : ''}`}
            onClick={() => onAimMode('manual')}
          >
            <b>Mouse / touch aim</b>
            <span>Move to aim, click to shoot</span>
          </button>
          <button
            role="radio"
            aria-checked={aimMode === 'sweep'}
            className={`level${aimMode === 'sweep' ? ' on' : ''}`}
            onClick={() => onAimMode('sweep')}
          >
            <b>Timing mode</b>
            <span>Bow sweeps up and down, time your shot</span>
          </button>
        </div>

        <p className="best-line">
          Best on {DIFFICULTY[difficulty].label}: <b>{best}</b> / {TOTAL_ARROWS * 10}
        </p>

        <button className="btn primary big" onClick={() => onStart(difficulty)} autoFocus>
          Start game
        </button>

        <ul className="keys">
          <li>
            <kbd>Click</kbd> / <kbd>Space</kbd> shoot
          </li>
          <li>
            <kbd>A</kbd> aim mode
          </li>
          <li>
            <kbd>P</kbd> pause
          </li>
          <li>
            <kbd>M</kbd> sound
          </li>
          <li>
            <kbd>R</kbd> restart
          </li>
        </ul>
      </div>
    </div>
  );
}

export function PauseScreen({ onResume }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div className="panel small">
        <h2 id="pause-title">Paused</h2>
        <p className="lead">Take a breath. The target will wait for you.</p>
        <button className="btn primary big" onClick={onResume} autoFocus>
          Resume
        </button>
      </div>
    </div>
  );
}

export function GameOver({ score, history, best, newBest, difficulty, onAgain, onMenu }) {
  const bullseyes = history.filter((s) => s === 10).length;
  const hits = history.filter((s) => s > 0).length;
  const avg = history.length ? (score / history.length).toFixed(1) : '0.0';

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="over-title">
      <div className="panel">
        <p className="eyebrow">Round complete</p>
        <h2 id="over-title">{ratingFor(score)}</h2>
        <div className="final">
          <strong>{score}</strong>
          <span>/ {TOTAL_ARROWS * 10}</span>
        </div>
        {newBest && <p className="badge">New best score!</p>}

        <div className="results">
          <div>
            <b>{bullseyes}</b>
            <span>Bullseyes</span>
          </div>
          <div>
            <b>
              {hits}/{history.length}
            </b>
            <span>On target</span>
          </div>
          <div>
            <b>{avg}</b>
            <span>Avg / arrow</span>
          </div>
          <div>
            <b>{best}</b>
            <span>Best ({DIFFICULTY[difficulty].label})</span>
          </div>
        </div>

        <div className="history center">
          {history.map((v, i) => (
            <span key={i} className={`chip s${v}`}>
              {v === 0 ? '×' : v}
            </span>
          ))}
        </div>

        <div className="row">
          <button className="btn primary big" onClick={onAgain} autoFocus>
            Play again
          </button>
          <button className="btn big" onClick={onMenu}>
            Change mode
          </button>
        </div>
      </div>
    </div>
  );
}
