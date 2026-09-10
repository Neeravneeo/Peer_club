import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-[24px] border border-border bg-pure-white px-5 py-3 text-base text-carbon-ink placeholder:text-ash focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-true-black focus-visible:border-true-black disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
