'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forwardRef } from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon: React.ReactNode
  error?: string | undefined
  id: string
}
export const LinkInput = forwardRef<HTMLInputElement, Props>(function LinkInput(
  { label, icon, error, id, ...rest },
  ref,
) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Input id={id} ref={ref} placeholder="https://" {...rest} aria-invalid={!!error} />
      {error && (
        <p role="alert" className="text-err text-sm">
          {error}
        </p>
      )}
    </div>
  )
})
