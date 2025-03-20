import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Cosmic Threads custom variants
        cosmic: "border-cosmicPurple/30 bg-cosmicPurple/20 text-cosmicPurple hover:bg-cosmicPurple/30",
        neon: "border-neonTeal/30 bg-neonTeal/20 text-neonTeal hover:bg-neonTeal/30",
        chrome: "border-silverChrome/30 bg-silverChrome/20 text-silverChrome hover:bg-silverChrome/30",
        magenta: "border-magentaGlow/30 bg-magentaGlow/20 text-magentaGlow hover:bg-magentaGlow/30",
        gradient: "border-transparent bg-gradient-to-r from-cosmicPurple to-magentaGlow text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
