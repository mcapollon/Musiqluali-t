import { create } from 'zustand'
import type { PlayerState, Track } from './types'

type Actions = {
  play: (track: Track, queue?: Track[]) => void
  toggle: () => void
  next: () => void
  prev: () => void
  setProgress: (p: number) => void
  close: () => void
}

type AmbientState = {
  ambientAnalyser: AnalyserNode | null
  ambientPlaying: boolean
  setAmbientAnalyser: (a: AnalyserNode | null) => void
  setAmbientPlaying: (p: boolean) => void
}

export const useAudioStore = create<PlayerState & Actions & AmbientState>((set, get) => ({
  current: null,
  isPlaying: false,
  queue: [],
  progress: 0,
  visible: false,
  ambientAnalyser: null,
  ambientPlaying: false,
  play: (track, queue) =>
    set({
      current: track,
      queue: queue ?? [track],
      isPlaying: true,
      visible: true,
      progress: 0,
    }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  next: () => {
    const { current, queue } = get()
    if (!current) return
    const i = queue.findIndex((t) => t.id === current.id)
    const nextTrack = queue[(i + 1) % queue.length]
    set({ current: nextTrack ?? current, progress: 0, isPlaying: true })
  },
  prev: () => {
    const { current, queue } = get()
    if (!current) return
    const i = queue.findIndex((t) => t.id === current.id)
    const prevTrack = queue[(i - 1 + queue.length) % queue.length]
    set({ current: prevTrack ?? current, progress: 0, isPlaying: true })
  },
  setProgress: (p) => set({ progress: p }),
  close: () => set({ visible: false, isPlaying: false }),
  setAmbientAnalyser: (a) => set({ ambientAnalyser: a }),
  setAmbientPlaying: (p) => set({ ambientPlaying: p }),
}))
