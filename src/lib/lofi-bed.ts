/** Original Star Wars lofi bed. Space-cantina / hyperspace lounge.
 *  Generated on intent. Not a reproduction of any film cue. */

const BPM = 74;
const LOOKAHEAD = 0.12;
const SIXTEENTH = 60 / BPM / 4;
const MASTER = 0.78;

const CHAPTER_SHIFT: Record<string, number> = {
  open: 0,
  method: 2,
  systems: -3,
  lightsaber: 5,
  role: 3,
  tour: -5,
  shown: 1,
  parallax: 7,
  solo: 4,
  broadcast: -2,
  architect: 3,
  fleet: -1,
  answer: 5,
};

/** Fm9 · C7 · Abmaj7 · Eb — original lounge cycle, not a film theme. */
const CHORDS = [
  [0, 3, 7, 10, 14],
  [7, 11, 14, 17],
  [3, 7, 10, 14],
  [10, 14, 17, 21],
];

const HARP = [0, 7, 10, 14, 10, 7];

function midi(n: number) {
  return 440 * Math.pow(2, (n - 69) / 12);
}

function noiseBuffer(ctx: AudioContext, seconds = 1.6) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export type LofiBed = {
  start: () => Promise<void>;
  stop: () => void;
  setMuted: (muted: boolean) => void;
  setChapter: (id: string) => void;
  dispose: () => void;
};

export function createLofiBed(): LofiBed {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let padFilter: BiquadFilterNode | null = null;
  let padGain: GainNode | null = null;
  let crackle: AudioBufferSourceNode | null = null;
  let engine: OscillatorNode | null = null;
  let timer = 0;
  let nextTime = 0;
  let step = 0;
  let running = false;
  let muted = false;
  let shift = 0;
  let chord = 0;
  let harpI = 0;
  let noise: AudioBuffer | null = null;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 10;
    compressor.ratio.value = 2.2;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.22;
    master.connect(compressor);
    compressor.connect(ctx.destination);

    padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 720;
    padFilter.Q.value = 0.5;
    padGain = ctx.createGain();
    padGain.gain.value = 0.2;
    padGain.connect(padFilter);
    padFilter.connect(master);

    noise = noiseBuffer(ctx);
    crackle = ctx.createBufferSource();
    crackle.buffer = noise;
    crackle.loop = true;
    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = "bandpass";
    crackleFilter.frequency.value = 2400;
    crackleFilter.Q.value = 0.6;
    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0.035;
    crackle.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(master);
    crackle.start();

    engine = ctx.createOscillator();
    engine.type = "sine";
    engine.frequency.value = 42;
    const engineFilter = ctx.createBiquadFilter();
    engineFilter.type = "lowpass";
    engineFilter.frequency.value = 90;
    const engineGain = ctx.createGain();
    engineGain.gain.value = 0.06;
    engine.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(master);
    engine.start();
    return ctx;
  }

  function env(node: AudioParam, t: number, peak: number, attack: number, release: number) {
    node.cancelScheduledValues(t);
    node.setValueAtTime(0.0001, t);
    node.exponentialRampToValueAtTime(peak, t + attack);
    node.exponentialRampToValueAtTime(0.0001, t + attack + release);
  }

  function kick(t: number) {
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(78, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.18);
    env(gain.gain, t, 0.92, 0.004, 0.28);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.34);
  }

  function rim(t: number) {
    if (!ctx || !master || !noise) return;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2100;
    filter.Q.value = 2.4;
    const gain = ctx.createGain();
    env(gain.gain, t, 0.28, 0.002, 0.07);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(t);
    src.stop(t + 0.1);
  }

  function hat(t: number, open = false) {
    if (!ctx || !master || !noise) return;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = open ? 6200 : 8800;
    const gain = ctx.createGain();
    env(gain.gain, t, open ? 0.12 : 0.07, 0.002, open ? 0.16 : 0.035);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(t);
    src.stop(t + (open ? 0.2 : 0.05));
  }

  function bass(t: number, degree: number) {
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const fifth = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "triangle";
    fifth.type = "sine";
    osc.frequency.value = midi(29 + shift + degree);
    fifth.frequency.value = midi(36 + shift + degree);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(220, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + 0.28);
    env(gain.gain, t, 0.48, 0.012, 0.34);
    osc.connect(filter);
    fifth.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(t);
    fifth.start(t);
    osc.stop(t + 0.42);
    fifth.stop(t + 0.42);
  }

  function brass(t: number, degree: number) {
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = midi(52 + shift + degree);
    osc.detune.value = -8;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(480, t);
    filter.frequency.exponentialRampToValueAtTime(220, t + 0.4);
    env(gain.gain, t, 0.09, 0.04, 0.55);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.7);
  }

  function harp(t: number) {
    if (!ctx || !master) return;
    const degree = HARP[harpI % HARP.length] ?? 0;
    harpI += 1;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = midi(72 + shift + degree);
    filter.type = "lowpass";
    filter.frequency.value = 2400;
    env(gain.gain, t, 0.11, 0.006, 0.42);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  function chordHit(t: number) {
    if (!ctx || !padGain) return;
    const tones = CHORDS[chord % CHORDS.length] ?? CHORDS[0];
    for (const [i, degree] of tones.entries()) {
      const osc = ctx.createOscillator();
      const twin = ctx.createOscillator();
      osc.type = i % 2 ? "triangle" : "sine";
      twin.type = "sine";
      osc.frequency.value = midi(55 + shift + degree) * (i === 0 ? 0.5 : 1);
      twin.frequency.value = osc.frequency.value;
      osc.detune.value = -6;
      twin.detune.value = 7;
      const g = ctx.createGain();
      g.gain.value = 0.38 / tones.length;
      osc.connect(g);
      twin.connect(g);
      g.connect(padGain);
      osc.start(t);
      twin.start(t);
      osc.stop(t + (60 / BPM) * 4 + 0.08);
      twin.stop(t + (60 / BPM) * 4 + 0.08);
    }
    if (padFilter) {
      const open = 640 + (chord % 4) * 80 + Math.abs(shift) * 8;
      padFilter.frequency.setTargetAtTime(open, t, 0.5);
    }
  }

  function schedule(beat: number, t: number) {
    const swung = beat % 2 === 1 ? t + SIXTEENTH * 0.28 : t;
    if (beat === 0 || beat === 8) kick(t);
    if (beat === 4 || beat === 12) rim(swung);
    if (beat % 2 === 0) hat(swung, beat === 14);
    if (beat === 3 || beat === 11) hat(swung, false);
    if (beat === 0 || beat === 8) bass(t, CHORDS[chord % CHORDS.length]?.[0] ?? 0);
    if (beat === 6) bass(swung, (CHORDS[chord % CHORDS.length]?.[2] ?? 7));
    if (beat === 10) brass(swung, CHORDS[chord % CHORDS.length]?.[1] ?? 3);
    if (beat === 2 || beat === 7 || beat === 13) harp(swung);
    if (beat === 0) {
      chordHit(t);
      chord = (chord + 1) % CHORDS.length;
    }
  }

  function tick() {
    if (!ctx || !running) return;
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      schedule(step, nextTime);
      nextTime += SIXTEENTH;
      step = (step + 1) % 16;
    }
    timer = window.setTimeout(tick, 25);
  }

  return {
    async start() {
      const ac = ensure();
      if (ac.state === "suspended") await ac.resume();
      if (running) return;
      running = true;
      step = 0;
      chord = 0;
      harpI = 0;
      nextTime = ac.currentTime + 0.05;
      tick();
    },
    stop() {
      running = false;
      window.clearTimeout(timer);
      if (ctx && padGain) {
        padGain.gain.cancelScheduledValues(ctx.currentTime);
        padGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
      }
    },
    setMuted(next) {
      muted = next;
      if (master && ctx) master.gain.setTargetAtTime(next ? 0 : MASTER, ctx.currentTime, 0.04);
    },
    setChapter(id) {
      shift = CHAPTER_SHIFT[id] ?? 0;
    },
    dispose() {
      running = false;
      window.clearTimeout(timer);
      try {
        crackle?.stop();
        engine?.stop();
      } catch {
        /* already stopped */
      }
      void ctx?.close();
      ctx = null;
      master = null;
      padFilter = null;
      padGain = null;
      crackle = null;
      engine = null;
    },
  };
}
