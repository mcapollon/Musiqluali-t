import { forwardRef } from 'react'
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonClass'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

/** Form/action button. For navigation, put buttonClass() on a Link instead. */
export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClass({ variant, size, className })} {...rest} />
})
