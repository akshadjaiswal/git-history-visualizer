import { cn } from '@/lib/utils'

type RuleThickness = 1 | 2 | 4 | 8

export interface HorizontalRuleProps {
  thickness?: RuleThickness
  className?: string
}

export function HorizontalRule({
  thickness = 2,
  className
}: HorizontalRuleProps) {
  return (
    <hr
      className={cn(
        'w-full border-0 bg-black',
        thickness === 1 && 'h-[1px]',
        thickness === 2 && 'h-[2px]',
        thickness === 4 && 'h-[4px]',
        thickness === 8 && 'h-[8px]',
        className
      )}
      aria-hidden="true"
    />
  )
}
