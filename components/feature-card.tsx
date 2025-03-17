import { Shirt, Sparkles, Palette, Rocket, Atom, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  color: string
  step: string
}

export default function FeatureCard({ title, description, icon, color, step }: FeatureCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "shirt":
        return <Shirt className={`h-6 w-6 text-${color}`} />
      case "sparkles":
        return <Sparkles className={`h-6 w-6 text-${color}`} />
      case "palette":
        return <Palette className={`h-6 w-6 text-${color}`} />
      case "rocket":
        return <Rocket className={`h-6 w-6 text-${color}`} />
      case "atom":
        return <Atom className={`h-6 w-6 text-${color}`} />
      case "shield":
        return <Shield className={`h-6 w-6 text-${color}`} />
      default:
        return <Sparkles className={`h-6 w-6 text-${color}`} />
    }
  }

  return (
    <div className="group relative">
      <div
        className={cn(
          "absolute -inset-0.5 bg-gradient-to-r opacity-50 blur-sm transition-all duration-300 group-hover:opacity-100",
          color === "magenta"
            ? "from-magenta to-magenta/50"
            : color === "teal"
              ? "from-teal to-teal/50"
              : "from-chrome to-chrome/50",
        )}
      ></div>
      <div className="relative bg-black border border-chrome/20 p-6 h-full transition-transform duration-300 group-hover:-translate-y-1">
        <div className="absolute top-4 right-4 font-mono text-sm text-chrome/40">{step}</div>
        <div className="mb-4">
          <div
            className={cn(
              "w-12 h-12 flex items-center justify-center border",
              color === "magenta"
                ? "border-magenta/30 bg-magenta/10"
                : color === "teal"
                  ? "border-teal/30 bg-teal/10"
                  : "border-chrome/30 bg-chrome/10",
            )}
          >
            {getIcon()}
          </div>
        </div>
        <h3 className="font-display text-xl font-bold mb-2 text-chrome">{title}</h3>
        <p className="text-chrome/70">{description}</p>
        <div className="mt-6 flex items-center">
          <span
            className={cn(
              "font-mono text-xs uppercase tracking-wider",
              color === "magenta" ? "text-magenta" : color === "teal" ? "text-teal" : "text-chrome",
            )}
          >
            Learn More
          </span>
          <div
            className={cn(
              "ml-2 w-4 h-px",
              color === "magenta" ? "bg-magenta" : color === "teal" ? "bg-teal" : "bg-chrome",
            )}
          ></div>
        </div>
      </div>
    </div>
  )
}

