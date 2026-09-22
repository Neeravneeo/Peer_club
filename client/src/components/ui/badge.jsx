import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-[-0.015em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-white/[0.1] bg-white/[0.05] text-white/90 shadow-sm",
        purple:
          "border border-[#5e6ad2]/40 bg-[#5e6ad2]/15 text-[#8f9bff] shadow-[0_0_12px_rgba(94,106,210,0.25)]",
        lime:
          "bg-voltage-lime/15 text-voltage-lime border border-voltage-lime/30 font-semibold",
        secondary:
          "border border-white/[0.08] bg-white/[0.03] text-[#8a8f98]",
        destructive:
          "border border-red-500/30 bg-red-500/10 text-red-400",
        success:
          "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        warning:
          "border border-amber-500/30 bg-amber-500/10 text-amber-300",
        outline:
          "text-white/80 border border-white/[0.15] bg-transparent",
        dark:
          "bg-[#15161b] text-white border border-white/[0.1]"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
