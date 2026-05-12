const LS_KEY = 'stackpulse-sound-enabled';

let audioCtx: AudioContext | null = null;

export function getSoundEnabled(): boolean {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v === null ? true : v === 'true';
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean) {
  localStorage.setItem(LS_KEY, String(enabled));
}

export function playNotificationSound() {
  if (!getSoundEnabled()) return;

  try {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    const ctx = audioCtx;
    const now = ctx.currentTime;

    // Two-tone chime: C5 then E5
    const frequencies = [523.25, 659.25];
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.2);
    });
  } catch {
    // Audio not available
  }
}
