// Tiny Web Audio synth: retro UI sounds, no asset files.
let ctx
let on = (() => { try { return localStorage.getItem('sound') !== 'off' } catch { return true } })()

export const isOn = () => on
export function setOn(v) {
  on = v
  try { localStorage.setItem('sound', v ? 'on' : 'off') } catch {}
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
  click: (c, t) => { noise(c, t, 0.05, 0.3, 2200); tone(c, t, { f: 600, to: 300, d: 0.06, v: 0.06 }) },
  hover: (c, t) => tone(c, t, { f: 1400, to: 1000, d: 0.025, v: 0.025 }),
  pop: (c, t) => tone(c, t, { f: 300, to: 900, d: 0.09, type: 'sine', v: 0.15 }),
  levelup: (c, t) => [523, 659, 784, 1047].forEach((f, i) =>
    tone(c, t + i * 0.09, { f, d: 0.18, type: 'triangle', v: 0.12 })),
}

export function play(name) {
  if (!on) return
  try { const c = ac(); SOUNDS[name]?.(c, c.currentTime) } catch {}
}
