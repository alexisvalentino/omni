/**
 * Haptic-like sound effects using Web Audio API.
 * Generates short, subtle tones to simulate tactile feedback.
 * No external audio files needed.
 */

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  volume: number = 0.08,
  type: OscillatorType = 'sine',
) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail — audio isn't critical
  }
}

/** Short, soft tap sound — like pressing a button */
export function tapSound() {
  playTone(800, 0.05, 0.06, 'sine');
}

/** Step completion tick — slightly higher pitch */
export function tickSound() {
  playTone(1200, 0.06, 0.05, 'sine');
}

/** Success confirmation — pleasant two-tone chord */
export function successSound() {
  playTone(660, 0.15, 0.07, 'sine');
  setTimeout(() => playTone(880, 0.2, 0.06, 'sine'), 80);
}

/** Workspace open — subtle low sweep */
export function openSound() {
  playTone(400, 0.12, 0.05, 'sine');
  setTimeout(() => playTone(600, 0.1, 0.04, 'sine'), 60);
}

/** Error / warning — soft low tone */
export function errorSound() {
  playTone(280, 0.15, 0.06, 'sine');
}
