import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-voltage-lime disabled:pointer-events-none disabled:opacity-40 rounded-[8px] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-voltage-lime text-true-black font-semibold hover:brightness-95 tracking-[-0.015em]",
        secondary:
          "bg-surface-elevated text-carbon-ink hover:bg-surface-subtle border border-border tracking-[-0.015em]",
        outline:
          "border border-true-black text-true-black bg-transparent hover:bg-voltage-lime/10 tracking-[-0.015em]",
        ghost:
          "text-carbon-ink hover:bg-surface-elevated tracking-[-0.015em]",
        link:
          "text-carbon-ink underline-offset-4 hover:underline",
        dark:
          "bg-mid-abyss text-pure-white hover:bg-mid-abyss/90",
        destructive:
          "bg-accent-red text-pure-white hover:bg-accent-red/90"
      },
      size: {
        default: "h-11 px-4 py-2 text-sm",
        sm: "h-9 rounded-[8px] px-3 text-xs",
        lg: "h-13 rounded-[8px] px-6 text-base font-semibold",
        icon: "h-9 w-9 rounded-[8px]",
        pill: "h-8 px-4 text-xs font-semibold rounded-[8px]"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
