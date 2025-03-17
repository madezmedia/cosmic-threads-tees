"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle, Clock, Sparkles, Zap, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { GenerationStatus, GenerationProgress } from "@/hooks/use-image-generation"

interface GenerationProgressProps {
  progress: GenerationProgress
  onCancel?: () => void
}

export default function GenerationProgress({ progress, onCancel }: GenerationProgressProps) {
  const getStatusIcon = (status: GenerationStatus) => {
    switch (status) {
      case "preparing":
        return <Zap className="h-5 w-5 text-blue-400 animate-pulse" />
      case "queued":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "generating":
        return <Sparkles className="h-5 w-5 text-purple-400" />
      case "finalizing":
        return <Loader2 className="h-5 w-5 text-green-400 animate-spin" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: GenerationStatus) => {
    switch (status) {
      case "preparing":
        return "bg-blue-500"
      case "queued":
        return "bg-yellow-500"
      case "generating":
        return "bg-purple-500"
      case "finalizing":
        return "bg-green-500"
      case "completed":
        return "bg-green-600"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: GenerationStatus) => {
    switch (status) {
      case "preparing":
        return "Preparing"
      case "queued":
        return "In Queue"
      case "generating":
        return "Generating"
      case "finalizing":
        return "Finalizing"
      case "completed":
        return "Completed"
      case "failed":
        return "Failed"
      default:
        return "Idle"
    }
  }

  return (
    <div className="space-y-4 p-4 bg-black/30 border border-white/10 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(progress.status)}
          <span className="font-medium text-white">{progress.message}</span>
        </div>

        <Badge
          variant="outline"
          className={`${progress.status !== "idle" ? getStatusColor(progress.status) : ""} text-white`}
        >
          {getStatusText(progress.status)}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-white/60">
          <span>Progress</span>
          <span>{Math.round(progress.progress)}%</span>
        </div>
        <Progress
          value={progress.progress}
          className="h-2 bg-white/10"
          indicatorClassName={getStatusColor(progress.status)}
        />
      </div>

      {progress.status !== "completed" && progress.status !== "idle" && progress.status !== "failed" && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-white/70 border-white/20 hover:bg-white/10"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      )}

      {progress.status === "generating" && (
        <motion.div
          className="mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {["Analyzing prompt", "Crafting composition", "Adding details", "Refining colors", "Applying style"].map(
              (step, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`bg-black/50 text-white/70 border-white/10 ${
                    progress.progress > index * 20 ? "border-purple-500/50 text-purple-300" : ""
                  }`}
                >
                  {step}
                </Badge>
              ),
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

