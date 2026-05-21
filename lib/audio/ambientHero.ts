// Source: https://archive.org/download/charleston1925/charleston1925_vbr.mp3
// Title: Charleston (Fox Trot) — archive.org item "charleston1925" (1925 recording)
// License: Public Domain (http://creativecommons.org/licenses/publicdomain/)

type Engine = {
  start: () => void
  stop: () => void
  setMuted: (m: boolean) => void
  destroy: () => void
  getAnalyser: () => AnalyserNode | null
}

export function createAmbientHero(src = '/audio/hero-jazz.mp3'): Engine {
  let audio: HTMLAudioElement | null = null
  let ctx: AudioContext | null = null
  let source: MediaElementAudioSourceNode | null = null
  let gain: GainNode | null = null
  let analyser: AnalyserNode | null = null
  let muted = false

  const ensure = (): void => {
    if (audio && ctx) return
    audio = new Audio(src)
    audio.loop = true
    audio.crossOrigin = 'anonymous'
    audio.preload = 'auto'
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
    source = ctx.createMediaElementSource(audio)
    gain = ctx.createGain()
    gain.gain.value = muted ? 0 : 0.6
    analyser = ctx.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.75
    source.connect(gain)
    gain.connect(analyser)
    analyser.connect(ctx.destination)
  }

  const start = (): void => {
    ensure()
    if (!audio || !ctx) return
    if (ctx.state === 'suspended') void ctx.resume()
    void audio.play().catch(() => {
      /* autoplay blocked */
    })
  }

  const stop = (): void => {
    if (!audio) return
    audio.pause()
  }

  const setMuted = (m: boolean): void => {
    muted = m
    if (gain && ctx) {
      const now = ctx.currentTime
      gain.gain.cancelScheduledValues(now)
      gain.gain.linearRampToValueAtTime(m ? 0 : 0.6, now + 0.3)
    }
  }

  const destroy = (): void => {
    stop()
    if (audio) {
      audio.src = ''
      audio = null
    }
    if (ctx) {
      void ctx.close()
      ctx = null
      source = null
      gain = null
      analyser = null
    }
  }

  const getAnalyser = (): AnalyserNode | null => analyser

  return { start, stop, setMuted, destroy, getAnalyser }
}
