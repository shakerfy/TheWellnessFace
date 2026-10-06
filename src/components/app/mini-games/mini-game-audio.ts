// Pure native Web Audio API tone synthesis and safe haptic feedback
// Zero external .mp3 dependencies (<1 KB total footprint)

class MiniGameAudioManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx || this.ctx.state === "closed") {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playTone(freq: number, durationSec = 0.18, type: OscillatorType = "sine", gainVal = 0.08) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch {
      // Audio playback fails silently if user has not interacted
    }
  }

  playSuccessChime() {
    // Soft bell chord C5 (523Hz) -> E5 (659Hz)
    this.playTone(523.25, 0.15, "sine", 0.07);
    setTimeout(() => {
      this.playTone(659.25, 0.25, "sine", 0.06);
    }, 90);
  }

  playSnapChime() {
    // Crisp light snap (784Hz)
    this.playTone(783.99, 0.08, "sine", 0.05);
  }

  playWarmInsightChime() {
    // Warm deep insight tone (440Hz)
    this.playTone(440, 0.22, "sine", 0.06);
  }

  playTick() {
    // Subtle tick for dials and reels (320Hz)
    this.playTone(320, 0.04, "sine", 0.03);
  }

  triggerHaptic(pattern: number | number[] = 18) {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignored if browser prevents vibration
      }
    }
  }
}

export const miniGameAudio = new MiniGameAudioManager();
