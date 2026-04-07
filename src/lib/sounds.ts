/**
 * Minimal sound effects using Web Audio API — no audio files needed.
 * Each sound is a short synthesized tone.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.15) {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(g);
    g.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch {
    // Audio not supported — silent fail
  }
}

/** Card flip — subtle click */
export function playFlip() {
  playTone(800, 0.06, "square", 0.08);
}

/** Green match — pleasant ding */
export function playGreen() {
  playTone(880, 0.15, "sine", 0.12);
}

/** Win — ascending chord */
export function playWin() {
  playTone(523, 0.3, "sine", 0.12);
  setTimeout(() => playTone(659, 0.3, "sine", 0.12), 100);
  setTimeout(() => playTone(784, 0.3, "sine", 0.12), 200);
  setTimeout(() => playTone(1047, 0.5, "sine", 0.15), 300);
}

/** Loss — descending tone */
export function playLoss() {
  playTone(400, 0.3, "triangle", 0.1);
  setTimeout(() => playTone(300, 0.4, "triangle", 0.1), 150);
}

/** Hint used — soft blip */
export function playHint() {
  playTone(600, 0.1, "sine", 0.1);
  setTimeout(() => playTone(900, 0.1, "sine", 0.1), 80);
}
