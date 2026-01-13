import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-body font-normal transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest',
  {
    variants: {
      variant: {
        primary: 'bg-black text-white border-2 border-black hover:bg-gray-900 duration-fast',
        secondary: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white duration-fast',
        ghost: 'border-2 border-transparent hover:bg-black hover:text-white duration-fast hover:underline',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
