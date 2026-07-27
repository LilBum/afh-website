// Generative ambient pad via Web Audio (no audio file, nothing copyrighted).
// Ported from the original js/music.js into a small reusable engine that the
// <MusicToggle> React component drives. Warm, slow Cmaj7 → Am7 → Fmaj7 → G6
// progression with occasional soft pentatonic "chimes".

const MASTER_LEVEL = 0.14

// Low-mid chord voicings (Hz): C3 G3 B3 E4 / A2 E3 C4 E4 / F2 F3 A3 E4 / G2 G3 D4 E4
const CHORDS = [
  [130.81, 196.0, 246.94, 329.63],
  [110.0, 164.81, 261.63, 329.63],
  [87.31, 174.61, 220.0, 329.63],
  [98.0, 196.0, 293.66, 329.63],
]
// C-major pentatonic, one octave up, for occasional soft chimes.
const SPARKLES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]

type AudioCtor = typeof AudioContext

export class AmbientMusic {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private padInput: BiquadFilterNode | null = null
  private playing = false
  private chordTimer: number | undefined
  private sparkleTimer: number | undefined
  private chordIndex = 0

  get isPlaying(): boolean {
    return this.playing
  }

  private buildGraph(): void {
    const AudioCtx: AudioCtor | undefined =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: AudioCtor }).webkitAudioContext
    if (!AudioCtx) return

    const ctx = new AudioCtx()
    this.ctx = ctx

    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    this.master = master

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 950
    filter.Q.value = 0.4

    // Slow filter drift for gentle movement.
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.035
    lfoGain.gain.value = 220
    lfo.connect(lfoGain).connect(filter.frequency)
    lfo.start()

    const dry = ctx.createGain()
    dry.gain.value = 0.55
    const reverb = this.makeReverb(ctx)
    const wet = ctx.createGain()
    wet.gain.value = 0.5

    filter.connect(dry).connect(master)
    filter.connect(reverb).connect(wet).connect(master)
    this.padInput = filter
  }

  private makeReverb(ctx: AudioContext): ConvolverNode {
    const len = Math.floor(ctx.sampleRate * 2.5)
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch)
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8)
      }
    }
    const conv = ctx.createConvolver()
    conv.buffer = buf
    return conv
  }

  private playNote(
    freq: number,
    when: number,
    attack: number,
    hold: number,
    release: number,
    level: number,
    type: OscillatorType,
  ): void {
    if (!this.ctx || !this.padInput) return
    const osc = this.ctx.createOscillator()
    osc.type = type
    osc.frequency.value = freq
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0, when)
    g.gain.linearRampToValueAtTime(level, when + attack)
    g.gain.setValueAtTime(level, when + attack + hold)
    g.gain.linearRampToValueAtTime(0.0001, when + attack + hold + release)
    osc.connect(g).connect(this.padInput)
    osc.start(when)
    osc.stop(when + attack + hold + release + 0.1)
  }

  private scheduleChord = (): void => {
    if (!this.playing || !this.ctx) return
    const chord = CHORDS[this.chordIndex % CHORDS.length]
    this.chordIndex++
    const now = this.ctx.currentTime + 0.05
    chord.forEach((freq, i) => {
      // Sine body + faint detuned triangle an octave up for warmth.
      this.playNote(freq, now + i * 0.35, 4.5, 7, 6, 0.055, 'sine')
      this.playNote(freq * 2.003, now + i * 0.35, 5.5, 5.5, 6, 0.012, 'triangle')
    })
    this.chordTimer = window.setTimeout(this.scheduleChord, 14000)
  }

  private scheduleSparkle = (): void => {
    if (!this.playing || !this.ctx) return
    const freq = SPARKLES[Math.floor(Math.random() * SPARKLES.length)]
    this.playNote(freq, this.ctx.currentTime + 0.05, 0.08, 0.1, 4.5, 0.028, 'sine')
    this.sparkleTimer = window.setTimeout(this.scheduleSparkle, 5000 + Math.random() * 6000)
  }

  /** Resolves false when the browser is still blocking audio (needs a user gesture first). */
  async start(): Promise<boolean> {
    if (!this.ctx) this.buildGraph()
    if (!this.ctx || !this.master) return false
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume()
      } catch {
        /* autoplay blocked until the visitor interacts */
      }
    }
    if (this.ctx.state !== 'running') return false
    this.playing = true
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(MASTER_LEVEL, now + 2.5)
    this.scheduleChord()
    this.sparkleTimer = window.setTimeout(this.scheduleSparkle, 6000)
    return true
  }

  stop(): void {
    this.playing = false
    if (!this.ctx || !this.master) return
    window.clearTimeout(this.chordTimer)
    window.clearTimeout(this.sparkleTimer)
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0.0001, now + 1.2)
  }
}
