export type Track = {
  id: string
  artistId: string
  artistName: string
  title: string
  src: string
  duration: number
}

export type PlayerState = {
  current: Track | null
  isPlaying: boolean
  queue: Track[]
  progress: number
  visible: boolean
}
