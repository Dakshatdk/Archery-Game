# Archery Game (React + Vite)

A target-practice game built from the sketch: **Archery Game** title at the top, **Your score** at the
top right, the **arrow/bow** on the left and the **elliptical 7 / 8 / 9 / 10 target** on the right, all on
a matching sky, mountains, pine trees and grass background.

## Play right now (no install)

Open **`play/index.html`** in Chrome, Edge, Firefox or Safari (double-click it). That's a ready-built copy of the game.

## Run the React project

```bash
npm install
npm run dev        # opens http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

Requires Node 18+.

## How to play

- **Mouse / touch aim (default):** move the mouse (or drag a finger) up and down to aim the bow, then click (or lift your finger) to shoot. Arrow keys nudge the aim.
- **Timing mode:** press `A` or use the "Aim" button. The bow sweeps up and down by itself; release when it lines up.
- You have **10 arrows**. The rings score **7, 8, 9, 10** (10 is the small centre). Missing the board scores 0.
- Maximum score is 100.

| Key / button | Action |
| --- | --- |
| Click / `Space` (or **Shoot arrow**) | Release the arrow |
| `↑` / `↓` | Fine-tune the aim |
| `A` | Switch mouse aim / timing mode |
| `P` / `Esc` | Pause / resume |
| `M` | Sound on / off |
| `R` | Restart the round |

## Extra features

- Three difficulty levels: **Easy** (still target, dotted aim guide, no wind), **Medium** (drifting target, hand sway, light wind), **Hard** (fast target, shaky aim, strong wind).
- Wind that changes after every shot (pushes the arrow up or down), so you have to compensate.
- Moving targets: the arrow takes time to fly, so lead the shot.
- Arrows stay stuck in the board, floating score popups, a bullseye burst and screen shake.
- Shot history chips, arrows-left counter, last-shot display.
- **Best score saved per difficulty** (localStorage) and a "New best" badge.
- Round summary: rating, bullseyes, accuracy, average per arrow.
- Sound effects generated in the browser (no audio files), with a mute toggle.
- Pause menu; the game auto-pauses when you switch tabs.
- Responsive layout, keyboard and touch friendly, respects reduced-motion settings.

## Project structure

```
src/
  App.jsx                 layout + keyboard shortcuts
  styles.css              all styling
  game/
    config.js             sizes, ring geometry, difficulty settings
    scoring.js            ellipse hit test + rating
    sound.js              Web Audio sound effects
    useArchery.js         game loop and state (React hook)
  components/
    Scene.jsx             SVG scene
    Background.jsx        sky, mountains, trees, fence, grass
    Target.jsx            elliptical target, labels, stuck arrows
    Bow.jsx, Arrow.jsx    bow and arrow artwork
    Hud.jsx               title, score, arrows left, info bar
    Controls.jsx          buttons
    Modals.jsx            start, pause and game-over screens
```

## Tweaking

Open `src/game/config.js` to change the number of arrows, ring sizes, difficulty speeds, wind strength
and target position.
