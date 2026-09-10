import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[-0.015em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-surface-elevated text-carbon-ink",
        lime:
          "bg-voltage-lime text-true-black border-transparent font-bold",
        secondary:
          "border border-border bg-surface-subtle text-ash",
        destructive:
          "border-transparent bg-accent-red/10 text-accent-red border border-accent-red/20",
        success:
          "border-transparent bg-accent-green/10 text-accent-green border border-accent-green/20",
        warning:
          "border-transparent bg-accent-amber/10 text-accent-amber border border-accent-amber/20",
        outline:
          "text-carbon-ink border border-carbon-ink bg-transparent",
        dark:
          "bg-mid-abyss text-pure-white border-transparent"
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
