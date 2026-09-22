import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3.5 py-2 text-sm text-[#f7f8f8] placeholder:text-[#8a8f98] focus-visible:outline-none focus-visible:border-[#5e6ad2] focus-visible:ring-1 focus-visible:ring-[#5e6ad2] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
