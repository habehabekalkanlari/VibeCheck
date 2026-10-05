// Web Audio API Synthesizer for ambient music preview and tactile haptic feedback

class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentPreset: string | null = null;
  private loopIntervalId: number | null = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play subtle haptic-like UI sound
  playClickSound(frequency = 440, type: OscillatorType = 'sine', duration = 0.04) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  playDropSphereChime() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(this.ctx!.currentTime + i * 0.08);
        osc.stop(this.ctx!.currentTime + i * 0.08 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // Generate music preview loop for a genre
  startPreview(preset: 'indie' | 'techno' | 'lofi' | 'rock' | 'synthwave', bpm = 110) {
    this.stopPreview();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.currentPreset = preset;

    const intervalMs = (60 / bpm) * 1000;
    let step = 0;

    // Presets with chord note frequencies in Hz
    const progressions: Record<string, number[][]> = {
      lofi: [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ],
      indie: [
        [293.66, 369.99, 440.00], // D
        [220.00, 277.18, 329.63], // A
        [246.94, 293.66, 369.99], // Bm
        [196.00, 246.94, 293.66], // G
      ],
      techno: [
        [130.81, 196.00], // C3, G3
        [123.47, 185.00], // B2, F#3
        [116.54, 174.61], // Bb2, F3
        [110.00, 164.81], // A2, E3
      ],
      synthwave: [
        [220.00, 329.63, 440.00], // Am
        [174.61, 261.63, 349.23], // F
        [261.63, 329.63, 392.00], // C
        [196.00, 293.66, 392.00], // G
      ],
      rock: [
        [164.81, 246.94, 329.63], // E
        [220.00, 329.63, 440.00], // A
        [196.00, 293.66, 392.00], // G
        [146.83, 220.00, 293.66], // D
      ]
    };

    const chords = progressions[preset] || progressions.lofi;

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const chord = chords[step % chords.length];
      const now = this.ctx.currentTime;

      // Play soft pad chord
      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        filter.type = preset === 'techno' ? 'bandpass' : 'lowpass';
        filter.frequency.setValueAtTime(preset === 'lofi' ? 600 : 1200, now);

        osc.type = preset === 'synthwave' ? 'sawtooth' : preset === 'techno' ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 0.95);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + (intervalMs / 1000));
      });

      // Sub-bass kick on step
      if (preset === 'techno' || step % 2 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(preset === 'techno' ? 120 : 90, now);
        kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.15);
        kickGain.gain.setValueAtTime(0.15, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        kickOsc.connect(kickGain);
        kickGain.connect(this.masterGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.2);
      }

      step++;
    };

    playChordStep();
    this.loopIntervalId = window.setInterval(playChordStep, intervalMs);
  }

  stopPreview() {
    this.isPlaying = false;
    this.currentPreset = null;
    if (this.loopIntervalId !== null) {
      clearInterval(this.loopIntervalId);
      this.loopIntervalId = null;
    }
  }

  togglePreview(preset: 'indie' | 'techno' | 'lofi' | 'rock' | 'synthwave', bpm = 110): boolean {
    if (this.isPlaying && this.currentPreset === preset) {
      this.stopPreview();
      return false;
    } else {
      this.startPreview(preset, bpm);
      return true;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentPreset(): string | null {
    return this.currentPreset;
  }
}

export const audioSynth = new AudioSynthEngine();
