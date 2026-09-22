import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5e6ad2] disabled:pointer-events-none disabled:opacity-40 rounded-[8px] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#5e6ad2] to-[#4e5ac0] hover:from-[#6875db] hover:to-[#5561cb] text-white shadow-[0_0_20px_rgba(94,106,210,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] border border-[#717de0]/40 font-medium tracking-[-0.015em]",
        secondary:
          "bg-white/[0.06] hover:bg-white/[0.1] text-white/90 border border-white/[0.1] shadow-sm tracking-[-0.015em]",
        outline:
          "border border-white/[0.12] text-white/90 bg-transparent hover:bg-white/[0.06] hover:border-white/[0.25] tracking-[-0.015em]",
        ghost:
          "text-[#8a8f98] hover:text-white hover:bg-white/[0.06] tracking-[-0.015em]",
        link:
          "text-[#5e6ad2] underline-offset-4 hover:underline",
        lime:
          "bg-voltage-lime text-true-black font-semibold hover:brightness-95 shadow-[0_0_20px_rgba(211,251,82,0.25)] tracking-[-0.015em]",
        dark:
          "bg-[#15161b] text-white border border-white/[0.08] hover:bg-[#1c1d24]",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
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
