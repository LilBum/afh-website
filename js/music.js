// A&D Home Care & Aging with Grace AFH — calming background music
// Generative ambient pad via Web Audio (no audio file, nothing copyrighted).
// To use a recorded track instead, set MUSIC_FILE to e.g. 'assets/audio/ambient.mp3'.

(function () {
  const MUSIC_FILE = null;
  const PREF_KEY = 'afh-music';
  const MASTER_LEVEL = 0.14;

  let ctx = null;
  let master = null;
  let audioEl = null;
  let playing = false;
  let chordTimer = null;
  let sparkleTimer = null;
  let chordIndex = 0;

  // Warm, slow progression: Cmaj7 — Am7 — Fmaj7 — G6 (low-mid voicings, Hz)
  const CHORDS = [
    [130.81, 196.00, 246.94, 329.63], // C3  G3  B3  E4
    [110.00, 164.81, 261.63, 329.63], // A2  E3  C4  E4
    [87.31, 174.61, 220.00, 329.63],  // F2  F3  A3  E4
    [98.00, 196.00, 293.66, 329.63],  // G2  G3  D4  E4
  ];
  // C-major pentatonic, one octave up, for occasional soft "chimes"
  const SPARKLES = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

  function makeReverb(c) {
    const len = Math.floor(c.sampleRate * 2.5);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
      }
    }
    const conv = c.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  let padInput = null; // voices connect here (filter -> dry/wet -> master)

  function buildGraph() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 950;
    filter.Q.value = 0.4;

    // slow filter drift for gentle movement
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.035;
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    const dry = ctx.createGain();
    dry.gain.value = 0.55;
    const reverb = makeReverb(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.5;

    filter.connect(dry).connect(master);
    filter.connect(reverb).connect(wet).connect(master);
    padInput = filter;
  }

  function playNote(freq, when, attack, hold, release, level, type) {
    const osc = ctx.createOscillator();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(level, when + attack);
    g.gain.setValueAtTime(level, when + attack + hold);
    g.gain.linearRampToValueAtTime(0.0001, when + attack + hold + release);
    osc.connect(g).connect(padInput);
    osc.start(when);
    osc.stop(when + attack + hold + release + 0.1);
  }

  function scheduleChord() {
    if (!playing) return;
    const chord = CHORDS[chordIndex % CHORDS.length];
    chordIndex++;
    const now = ctx.currentTime + 0.05;
    chord.forEach((freq, i) => {
      // sine body + faint detuned triangle an octave up for warmth
      playNote(freq, now + i * 0.35, 4.5, 7, 6, 0.055, 'sine');
      playNote(freq * 2.003, now + i * 0.35, 5.5, 5.5, 6, 0.012, 'triangle');
    });
    chordTimer = setTimeout(scheduleChord, 14000);
  }

  function scheduleSparkle() {
    if (!playing) return;
    const freq = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
    playNote(freq, ctx.currentTime + 0.05, 0.08, 0.1, 4.5, 0.028, 'sine');
    sparkleTimer = setTimeout(scheduleSparkle, 5000 + Math.random() * 6000);
  }

  function start() {
    if (MUSIC_FILE) {
      if (!audioEl) {
        audioEl = new Audio(MUSIC_FILE);
        audioEl.loop = true;
        audioEl.volume = 0.25;
      }
      audioEl.play().catch(() => {});
      playing = true;
      return;
    }
    if (!ctx) buildGraph();
    if (ctx.state === 'suspended') ctx.resume();
    playing = true;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(MASTER_LEVEL, now + 2.5);
    scheduleChord();
    sparkleTimer = setTimeout(scheduleSparkle, 6000);
  }

  function stop() {
    playing = false;
    if (MUSIC_FILE && audioEl) { audioEl.pause(); return; }
    if (!ctx) return;
    clearTimeout(chordTimer);
    clearTimeout(sparkleTimer);
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0.0001, now + 1.2);
  }

  // ---- floating toggle button ----
  const NOTE_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="18" r="3"/><circle cx="17" cy="16" r="3"/><path d="M10 18V5l10-2v13"/></svg>';
  const PAUSE_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><line x1="9" y1="5" x2="9" y2="19"/><line x1="15" y1="5" x2="15" y2="19"/></svg>';

  const btn = document.createElement('button');
  btn.className = 'music-toggle';
  btn.type = 'button';
  btn.innerHTML = NOTE_ICON;
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-label', 'Play calming background music');
  btn.title = 'Play calming background music';

  function render() {
    btn.innerHTML = playing ? PAUSE_ICON : NOTE_ICON;
    btn.classList.toggle('playing', playing);
    btn.setAttribute('aria-pressed', String(playing));
    const label = playing ? 'Pause background music' : 'Play calming background music';
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }

  btn.addEventListener('click', () => {
    if (playing) { stop(); } else { start(); }
    try { localStorage.setItem(PREF_KEY, playing ? 'on' : 'off'); } catch (e) {}
    render();
  });

  document.body.appendChild(btn);

  // If music was on during a previous visit, resume on the first interaction
  // (browsers require a user gesture before audio can start).
  let pref = null;
  try { pref = localStorage.getItem(PREF_KEY); } catch (e) {}
  if (pref === 'on') {
    const resume = () => {
      if (!playing) { start(); render(); }
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('keydown', resume);
    };
    document.addEventListener('pointerdown', resume, { once: true });
    document.addEventListener('keydown', resume, { once: true });
  }
})();
