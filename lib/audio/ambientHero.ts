type Engine = {
  start: () => void
  stop: () => void
  setMuted: (m: boolean) => void
  destroy: () => void
}

const PROGRESSION_HZ: ReadonlyArray<ReadonlyArray<number>> = [
  [261.63, 329.63, 392.0], // C major
  [220.0, 261.63, 329.63], // A minor
  [174.61, 220.0, 261.63], // F major
  [196.0, 246.94, 293.66], // G major
]
const STEP_SECONDS = 8

export function createAmbientHero(): Engine {
  let ctx: AudioContext | null = null
  let masterGain: GainNode | null = null
  let oscs: OscillatorNode[] = []
  let stepTimer: ReturnType<typeof setInterval> | null = null
  let stepIdx = 0
  let muted = false

  const ensureCtx = (): AudioContext => {
    if (ctx) return ctx
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.gain.value = muted ? 0 : 0.12
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1200
    masterGain.connect(filter)
    filter.connect(ctx.destination)
    return ctx
  }

  const playChord = (hz: ReadonlyArray<number>) => {
    if (!ctx || !masterGain) return
    const now = ctx.currentTime
    oscs.forEach((o) => {
      try {
        o.stop(now + 0.6)
      } catch {
        /* osc already stopped */
      }
    })
    oscs = []
    hz.forEach((freq) => {
      if (!ctx || !masterGain) return
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(1 / hz.length, now + 1.2)
      g.gain.setValueAtTime(1 / hz.length, now + STEP_SECONDS - 1.2)
      g.gain.linearRampToValueAtTime(0, now + STEP_SECONDS + 0.4)
      osc.connect(g)
      g.connect(masterGain)
      osc.start(now)
      osc.stop(now + STEP_SECONDS + 0.6)
      oscs.push(osc)
    })
  }

  const start = () => {
    ensureCtx()
    if (ctx && ctx.state === 'suspended') void ctx.resume()
    stepIdx = 0
    const first = PROGRESSION_HZ[0]
    if (first) playChord(first)
    stepTimer = setInterval(() => {
      stepIdx = (stepIdx + 1) % PROGRESSION_HZ.length
      const chord = PROGRESSION_HZ[stepIdx]
      if (chord) playChord(chord)
    }, STEP_SECONDS * 1000)
  }

  const stop = () => {
    if (stepTimer) {
      clearInterval(stepTimer)
      stepTimer = null
    }
    if (ctx) {
      const now = ctx.currentTime
      oscs.forEach((o) => {
        try {
          o.stop(now + 0.4)
        } catch {
          /* osc already stopped */
        }
      })
      oscs = []
    }
  }

  const setMuted = (m: boolean) => {
    muted = m
    if (masterGain && ctx) {
      const now = ctx.currentTime
      masterGain.gain.cancelScheduledValues(now)
      masterGain.gain.linearRampToValueAtTime(m ? 0 : 0.12, now + 0.3)
    }
  }

  const destroy = () => {
    stop()
    if (ctx) {
      void ctx.close()
      ctx = null
      masterGain = null
    }
  }

  return { start, stop, setMuted, destroy }
}
