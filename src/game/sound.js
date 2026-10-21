// Tiny Web Audio synth: no audio files needed.
let ctx = null;
let muted = false;

function audio() {
  if (muted) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(c, { type = 'sine', from, to = from, dur = 0.2, gain = 0.2, delay = 0 }) {
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

function noise(c, { dur = 0.15, gain = 0.15, freq = 1500, q = 0.8, delay = 0 }) {
  const t = c.currentTime + delay;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(f).connect(g).connect(c.destination);
  src.start(t);
}

export function setMuted(value) {
  muted = value;
}

export const sfx = {
  release() {
    const c = audio();
    if (!c) return;
    tone(c, { type: 'triangle', from: 280, to: 90, dur: 0.18, gain: 0.18 });
    noise(c, { dur: 0.5, gain: 0.1, freq: 2600, delay: 0.04 });
  },
  hit(score) {
    const c = audio();
    if (!c) return;
    noise(c, { dur: 0.12, gain: 0.35, freq: 500, q: 0.6 });
    tone(c, { type: 'sine', from: 160, to: 55, dur: 0.16, gain: 0.3 });
    if (score >= 9) tone(c, { type: 'triangle', from: 660, to: 880, dur: 0.18, gain: 0.12, delay: 0.08 });
  },
  bullseye() {
    const c = audio();
    if (!c) return;
    noise(c, { dur: 0.12, gain: 0.35, freq: 500, q: 0.6 });
    tone(c, { type: 'sine', from: 160, to: 55, dur: 0.16, gain: 0.3 });
    [523, 659, 784, 1047].forEach((f, i) =>
      tone(c, { type: 'triangle', from: f, to: f, dur: 0.22, gain: 0.14, delay: 0.1 + i * 0.08 })
    );
  },
  miss() {
    const c = audio();
    if (!c) return;
    noise(c, { dur: 0.25, gain: 0.12, freq: 900, q: 0.5 });
    tone(c, { type: 'sawtooth', from: 220, to: 70, dur: 0.28, gain: 0.1 });
  },
  finish(total) {
    const c = audio();
    if (!c) return;
    const notes = total >= 55 ? [392, 523, 659, 784] : [330, 294, 262];
    notes.forEach((f, i) =>
      tone(c, { type: 'triangle', from: f, to: f, dur: 0.28, gain: 0.15, delay: i * 0.14 })
    );
  },
};
