type Engine = {
  start: () => void
  stop: () => void
  setMuted: (m: boolean) => void
  destroy: () => void
  getAnalyser: () => AnalyserNode | null
}

type Chord = {
  root: number
  voicing: readonly [number, number, number, number]
}

// Cmaj7, Am7, Dm7, G7 — voicings (Hz)
const CHORDS: ReadonlyArray<Chord> = [
  { root: 130.81, voicing: [261.63, 329.63, 392.0, 493.88] }, // Cmaj7
  { root: 110.0, voicing: [220.0, 261.63, 329.63, 392.0] }, // Am7
  { root: 146.83, voicing: [220.0, 293.66, 349.23, 440.0] }, // Dm7
  { root: 98.0, voicing: [196.0, 246.94, 293.66, 392.0] }, // G7
]
const C_MINOR_PENT: ReadonlyArray<number> = [261.63, 311.13, 349.23, 392.0, 466.16, 523.25]
const BEAT_S = 0.6 // 100 bpm
const BEATS_PER_CHORD = 4

export function createAmbientHero(): Engine {
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let analyser: AnalyserNode | null = null
  let scheduler: ReturnType<typeof setInterval> | null = null
  let nextNoteTime = 0
  let beatIdx = 0
  let muted = false

  const ensureCtx = (): AudioContext => {
    if (ctx) return ctx
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const newCtx = new AC()
    ctx = newCtx
    master = newCtx.createGain()
    master.gain.value = muted ? 0 : 0.1
    const filter = newCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 2200
    const delay = newCtx.createDelay(1.0)
    delay.delayTime.value = 0.28
    const feedback = newCtx.createGain()
    feedback.gain.value = 0.18
    const wet = newCtx.createGain()
    wet.gain.value = 0.25
    master.connect(filter)
    filter.connect(delay)
    delay.connect(feedback)
    feedback.connect(delay)
    delay.connect(wet)
    analyser = newCtx.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.75
    filter.connect(analyser)
    wet.connect(analyser)
    filter.connect(newCtx.destination)
    wet.connect(newCtx.destination)
    return newCtx
  }

  const playNote = (
    freq: number,
    when: number,
    dur: number,
    kind: 'bass' | 'pad' | 'lead',
  ): void => {
    if (!ctx || !master) return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    if (kind === 'bass') {
      osc.type = 'triangle'
      g.gain.setValueAtTime(0, when)
      g.gain.linearRampToValueAtTime(0.25, when + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, when + dur)
    } else if (kind === 'lead') {
      osc.type = 'triangle'
      g.gain.setValueAtTime(0, when)
      g.gain.linearRampToValueAtTime(0.08, when + 0.04)
      g.gain.exponentialRampToValueAtTime(0.001, when + dur)
    } else {
      osc.type = 'sine'
      g.gain.setValueAtTime(0, when)
      g.gain.linearRampToValueAtTime(0.045, when + 0.4)
      g.gain.setValueAtTime(0.045, when + dur - 0.4)
      g.gain.linearRampToValueAtTime(0, when + dur)
    }
    osc.frequency.value = freq
    osc.connect(g)
    g.connect(master)
    osc.start(when)
    osc.stop(when + dur + 0.1)
  }

  const scheduleNext = (): void => {
    if (!ctx) return
    while (nextNoteTime < ctx.currentTime + 0.3) {
      const chordIdx = Math.floor(beatIdx / BEATS_PER_CHORD) % CHORDS.length
      const chord = CHORDS[chordIdx]
      if (!chord) {
        nextNoteTime += BEAT_S
        beatIdx++
        continue
      }
      const beatInChord = beatIdx % BEATS_PER_CHORD
      const swingOffset = beatInChord % 2 === 0 ? 0 : 0.04

      // Bass: walking line — root, 3rd, 5th, 7th-ish
      const bassNotes: ReadonlyArray<number> = [
        chord.root,
        chord.voicing[0],
        chord.root * 1.5,
        chord.voicing[1],
      ]
      const bassFreq = bassNotes[beatInChord]
      if (bassFreq !== undefined) {
        playNote(bassFreq, nextNoteTime + swingOffset, BEAT_S * 0.85, 'bass')
      }

      // Pad: trigger on beat 0 of each chord
      if (beatInChord === 0) {
        chord.voicing.forEach((v) => playNote(v, nextNoteTime, BEAT_S * BEATS_PER_CHORD - 0.1, 'pad'))
      }

      // Lead: sparse pentatonic, swung 8ths, ~50% probability per beat
      if (Math.random() > 0.5) {
        const note = C_MINOR_PENT[Math.floor(Math.random() * C_MINOR_PENT.length)]
        if (note !== undefined) {
          playNote(note, nextNoteTime + swingOffset + BEAT_S * 0.5, BEAT_S * 0.4, 'lead')
        }
      }

      nextNoteTime += BEAT_S
      beatIdx++
    }
  }

  const start = (): void => {
    const audioCtx = ensureCtx()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    nextNoteTime = audioCtx.currentTime + 0.1
    beatIdx = 0
    scheduleNext()
    scheduler = setInterval(scheduleNext, 100)
  }

  const stop = (): void => {
    if (scheduler) {
      clearInterval(scheduler)
      scheduler = null
    }
  }

  const setMuted = (m: boolean): void => {
    muted = m
    if (master && ctx) {
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.linearRampToValueAtTime(m ? 0 : 0.1, now + 0.3)
    }
  }

  const destroy = (): void => {
    stop()
    if (ctx) {
      void ctx.close()
      ctx = null
      master = null
      analyser = null
    }
  }

  const getAnalyser = (): AnalyserNode | null => analyser

  return { start, stop, setMuted, destroy, getAnalyser }
}
