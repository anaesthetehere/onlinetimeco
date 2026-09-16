// Web Audio API ambient sound generator for Focus / Pomodoro Mode

export type AmbientSoundType = 'none' | 'rain' | 'white_noise' | 'pink_noise' | 'binaural_alpha' | 'deep_cafe';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'none';
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private isPlaying = false;
  private currentVolume = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playAmbient(type: AmbientSoundType, volume = 0.35) {
    this.stopAmbient();
    if (type === 'none') return;

    this.initContext();
    if (!this.ctx) return;

    this.currentType = type;
    this.currentVolume = volume;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (type === 'white_noise' || type === 'rain' || type === 'pink_noise') {
      this.startNoise(type);
    } else if (type === 'binaural_alpha') {
      this.startBinaural(200, 210); // 10Hz Alpha differential for flow-state
    } else if (type === 'deep_cafe') {
      this.startCafe();
    }

    this.isPlaying = true;
  }

  private startNoise(type: 'white_noise' | 'rain' | 'pink_noise') {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'pink_noise' || type === 'rain') {
        // Paul Kellet's filtered pink noise algorithm
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        output[i] = white * 0.12;
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    if (type === 'rain') {
      // Bandpass / Lowpass filter with subtle modulation for rain shower feel
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      this.noiseNode = filter;
    } else {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'pink_noise' ? 1200 : 3500, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      this.noiseNode = filter;
    }

    whiteNoise.start(0);
  }

  private startBinaural(freqLeft: number, freqRight: number) {
    if (!this.ctx || !this.gainNode) return;

    const merger = this.ctx.createChannelMerger(2);

    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sine';
    this.osc1.frequency.setValueAtTime(freqLeft, this.ctx.currentTime);

    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'sine';
    this.osc2.frequency.setValueAtTime(freqRight, this.ctx.currentTime);

    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain2.gain.setValueAtTime(0.15, this.ctx.currentTime);

    this.osc1.connect(gain1);
    this.osc2.connect(gain2);

    gain1.connect(merger, 0, 0); // Left ear
    gain2.connect(merger, 0, 1); // Right ear

    merger.connect(this.gainNode);

    this.osc1.start();
    this.osc2.start();
  }

  private startCafe() {
    if (!this.ctx || !this.gainNode) return;
    // Cafe ambient hum: low hum + randomized soft clicks
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'triangle';
    this.osc1.frequency.setValueAtTime(130, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);

    const humGain = this.ctx.createGain();
    humGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.osc1.connect(filter);
    filter.connect(humGain);
    humGain.connect(this.gainNode);
    this.osc1.start();

    // Layer subtle pink noise
    this.startNoise('pink_noise');
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.05);
    }
  }

  public stopAmbient() {
    try {
      if (this.osc1) {
        this.osc1.stop();
        this.osc1.disconnect();
        this.osc1 = null;
      }
      if (this.osc2) {
        this.osc2.stop();
        this.osc2.disconnect();
        this.osc2 = null;
      }
      if (this.noiseNode) {
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    } catch {
      // ignore cleanup errors
    }
    this.isPlaying = false;
    this.currentType = 'none';
  }

  public playChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch (err) {
      console.warn('Audio chime could not play:', err);
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      type: this.currentType,
      volume: this.currentVolume
    };
  }
}

export const ambientSoundEngine = new AudioSynthesizer();
