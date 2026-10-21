import { useEffect, useRef } from 'react';
import { DIFFICULTY, VIEW } from './game/config';
import { useArchery } from './game/useArchery';
import Scene from './components/Scene';
import { Hud, InfoBar } from './components/Hud';
import Controls from './components/Controls';
import { GameOver, PauseScreen, StartScreen } from './components/Modals';

export default function App() {
  const g = useArchery();
  const ref = useRef(g);
  ref.current = g;

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const game = ref.current;
      const key = e.key.toLowerCase();

      if (key === 'arrowup' || key === 'arrowdown') {
        e.preventDefault();
        game.nudgeAim(key === 'arrowup' ? -14 : 14);
      } else if ((key === ' ' || key === 'enter' || key === 'arrowright') && game.phase === 'aiming') {
        e.preventDefault();
        document.activeElement?.blur?.();
        game.fire();
      } else if (key === 'a') {
        game.setAimMode(game.aimMode === 'manual' ? 'sweep' : 'manual');
      } else if (key === 'p' || key === 'escape') {
        game.togglePause();
      } else if (key === 'm') {
        game.toggleMute();
      } else if (key === 'r' && game.phase !== 'menu') {
        game.start(game.difficulty);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Auto-pause when the tab is hidden
  useEffect(() => {
    const onHide = () => {
      const game = ref.current;
      if (document.hidden && !game.paused && ['aiming', 'flying'].includes(game.phase)) {
        game.togglePause();
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, []);

  // Pointer aiming: move to aim, click (mouse) or lift your finger (touch) to shoot.
  const stageRef = useRef(null);
  const pointerY = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    return ((e.clientY - r.top) / r.height) * VIEW.h;
  };
  const onPointerMove = (e) => g.aimAt(pointerY(e));
  const onPointerDown = (e) => {
    if (e.pointerType === 'touch') g.aimAt(pointerY(e));
  };
  const onPointerUp = (e) => {
    if (g.aimMode !== 'manual' || g.phase !== 'aiming') return;
    if (e.pointerType === 'touch') {
      g.aimAt(pointerY(e));
    }
    g.fire();
  };
  const onStageClickSweep = () => {
    if (g.aimMode === 'sweep') g.fire();
  };

  const playing = ['aiming', 'flying', 'settling'].includes(g.phase);
  const bullseyeShake = g.popup?.pts === 10;

  return (
    <main className="app">
      <div
        className={`stage${g.aimMode === 'manual' && g.phase === 'aiming' ? ' crosshair' : ''}`}
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={onStageClickSweep}
      >
        <div key={bullseyeShake ? g.popup.id : 'steady'} className={`stage-inner${bullseyeShake ? ' shake' : ''}`}>
          <Scene
            view={g.view}
            phase={g.phase}
            stuck={g.stuck}
            popup={g.popup}
            guide={DIFFICULTY[g.difficulty].guide}
          />
        </div>
        <Hud score={g.score} remaining={g.remaining} />
      </div>

      <InfoBar
        difficulty={g.difficulty}
        best={g.best}
        wind={g.wind}
        history={g.history}
        remaining={g.remaining}
      />

      <Controls
        canShoot={g.phase === 'aiming' && !g.paused}
        playing={playing}
        paused={g.paused}
        muted={g.muted}
        aimMode={g.aimMode}
        onAimMode={g.setAimMode}
        onShoot={g.fire}
        onPause={g.togglePause}
        onMute={g.toggleMute}
        onRestart={() => g.start(g.difficulty)}
        onMenu={g.toMenu}
      />

      <p className="tips">
        {g.aimMode === 'manual' ? (
          <>
            Move your mouse (or drag your finger) to aim, then <b>click</b> or press <kbd>Space</kbd> to
            shoot. <kbd>↑</kbd> <kbd>↓</kbd> fine-tune the aim.
          </>
        ) : (
          <>
            The bow sweeps up and down. Press <kbd>Space</kbd> or click to release the arrow.
          </>
        )}{' '}
        Lead a moving target and watch the wind.
      </p>

      {g.phase === 'menu' && (
        <StartScreen
          difficulty={g.difficulty}
          best={g.best}
          aimMode={g.aimMode}
          onAimMode={g.setAimMode}
          onChoose={g.chooseDifficulty}
          onStart={g.start}
        />
      )}
      {g.paused && playing && <PauseScreen onResume={g.togglePause} />}
      {g.phase === 'over' && (
        <GameOver
          score={g.score}
          history={g.history}
          best={g.best}
          newBest={g.newBest}
          difficulty={g.difficulty}
          onAgain={() => g.start(g.difficulty)}
          onMenu={g.toMenu}
        />
      )}
    </main>
  );
}
