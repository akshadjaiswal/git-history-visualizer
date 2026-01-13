import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full bg-transparent px-0 py-3 text-base font-body',
          'border-b-2 border-black',
          'focus-visible:border-b-4 focus-visible:outline-none',
          'placeholder:text-gray-400 placeholder:italic',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-fast',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
