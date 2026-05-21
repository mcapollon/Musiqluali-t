'use client'
import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'

type Props = {
  accept: string
  label: string
  multiple?: boolean | undefined
  maxBytes?: number | undefined
  onPick: (files: File[]) => void
  previewSrc?: string | undefined
}
export function DropZone({ accept, label, multiple, maxBytes, onPick, previewSrc }: Props) {
  const [drag, setDrag] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const handle = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files).filter((f) => !maxBytes || f.size <= maxBytes)
    onPick(arr)
  }
  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        handle(e.dataTransfer.files)
      }}
      className={`flex flex-col items-center justify-center gap-3 w-full rounded-lg border-2 border-dashed p-8 text-center ${drag ? 'border-saffron bg-saffron/10' : 'border-[color:var(--color-rule)]'}`}
    >
      {previewSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewSrc} alt="" className="size-24 rounded-full object-cover" />
      ) : (
        <Upload className="size-6 text-bone-mute" />
      )}
      <p className="text-bone-mute">{label}</p>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handle(e.target.files)}
      />
    </button>
  )
}
