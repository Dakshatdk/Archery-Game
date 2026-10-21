export default function Controls({
  canShoot,
  playing,
  paused,
  muted,
  aimMode,
  onAimMode,
  onShoot,
  onPause,
  onMute,
  onRestart,
  onMenu,
}) {
  return (
    <div className="controls">
      <button className="btn primary shoot" onClick={onShoot} disabled={!canShoot}>
        Shoot arrow
      </button>
      <button className="btn" onClick={onPause} disabled={!playing}>
        {paused ? 'Resume' : 'Pause'}
      </button>
      <button
        className="btn"
        onClick={() => onAimMode(aimMode === 'manual' ? 'sweep' : 'manual')}
        title="Switch between aiming with the mouse and the automatic sweeping bow (A)"
      >
        Aim: {aimMode === 'manual' ? 'Mouse' : 'Sweep'}
      </button>
      <button className="btn" onClick={onMute} aria-pressed={muted}>
        Sound: {muted ? 'Off' : 'On'}
      </button>
      <button className="btn" onClick={onRestart} disabled={!playing}>
        Restart
      </button>
      <button className="btn" onClick={onMenu}>
        Menu
      </button>
    </div>
  );
}
