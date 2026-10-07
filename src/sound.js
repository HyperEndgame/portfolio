// Web Audio synth: UI sounds + an original generative ambient piano loop. No asset files.
let ctx
let on = (() => { try { return localStorage.getItem('sound') !== 'off' } catch { return true } })()

export const isOn = () => on
export function setOn(v) {
  on = v
  try { localStorage.setItem('sound', v ? 'on' : 'off') } catch {}
  v ? music.start() : music.stop()
}

function ac() {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(c, t, { f, to = f, d, type = 'square', v = 0.08 }) {
  const o = c.createOscillator(), g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(f, t)
  o.frequency.exponentialRampToValueAtTime(to, t + d)
  g.gain.setValueAtTime(v, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + d)
  o.connect(g).connect(c.destination)
  o.start(t); o.stop(t + d)
}

function noise(c, t, d, v, hz) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * d), c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain()
  src.buffer = buf
  f.type = 'lowpass'; f.frequency.value = hz
  g.gain.setValueAtTime(v, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + d)
  src.connect(f).connect(g).connect(c.destination)
  src.start(t)
}

const SOUNDS = {
  click: (c, t) => { noise(c, t, 0.035, 0.35, 3200); tone(c, t, { f: 1100, to: 700, d: 0.04, type: 'triangle', v: 0.07 }) },
  hover: (c, t) => tone(c, t, { f: 1800, to: 1500, d: 0.02, type: 'triangle', v: 0.02 }),
  pop: (c, t) => tone(c, t, { f: 300, to: 900, d: 0.09, type: 'sine', v: 0.15 }),
  levelup: (c, t) => [523, 659, 784, 1047].forEach((f, i) =>
    tone(c, t + i * 0.09, { f, d: 0.18, type: 'triangle', v: 0.12 })),
}

export function play(name) {
  if (!on) return
  try { const c = ac(); SOUNDS[name]?.(c, c.currentTime) } catch {}
}

// ---- ambient piano: random soft notes from a calm scale through a feedback delay.
// ponytail: generative, so nothing to download or license; swap for an <audio> loop if you get CC0 music.
const SCALE = [261.6, 293.7, 329.6, 392, 440, 523.3, 587.3, 659.3, 784, 880] // C major pentatonic, 2 octaves

function key(c, out, f, t, v) {
  const g = c.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(v, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5)
  g.connect(out)
  ;[[1, 'triangle', 1], [2, 'sine', 0.35], [3, 'sine', 0.12]].forEach(([mul, type, amp]) => {
    const o = c.createOscillator(), a = c.createGain()
    o.type = type; o.frequency.value = f * mul; a.gain.value = amp
    o.connect(a).connect(g)
    o.start(t); o.stop(t + 3.6)
  })
}

export const music = {
  timer: 0, bus: null,
  start() {
    if (!on || this.timer) return
    try {
      const c = ac()
      if (!this.bus) {
        const master = c.createGain(), delay = c.createDelay(), fb = c.createGain(), lp = c.createBiquadFilter()
        master.gain.value = 0.05
        delay.delayTime.value = 0.42; fb.gain.value = 0.45; lp.type = 'lowpass'; lp.frequency.value = 1800
        master.connect(c.destination)
        master.connect(delay).connect(lp).connect(fb).connect(delay)
        lp.connect(c.destination)
        this.bus = master
      }
      const tick = () => {
        const t = c.currentTime + 0.05
        const n = Math.random() < 0.25 ? 3 : 1
        for (let i = 0; i < n; i++) key(c, this.bus, SCALE[(Math.random() * SCALE.length) | 0] / (i ? 2 : 1), t + i * 0.08, 0.5)
        this.timer = setTimeout(tick, 1600 + Math.random() * 2600)
      }
      tick()
    } catch {}
  },
  stop() { clearTimeout(this.timer); this.timer = 0 },
}

// browsers block audio until the first gesture
if (typeof window !== 'undefined') {
  const kick = () => { music.start(); removeEventListener('pointerdown', kick); removeEventListener('keydown', kick) }
  addEventListener('pointerdown', kick)
  addEventListener('keydown', kick)
}
