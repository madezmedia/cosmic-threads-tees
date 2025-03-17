"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, AlertCircle, CheckCircle } from "lucide-react"
import type { GenerationStatus } from "@/hooks/use-image-generation"

interface GenerationNotificationProps {
  status: GenerationStatus
  message: string
  visible: boolean
  onClose: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export default function GenerationNotification({
  status,
  message,
  visible,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}: GenerationNotificationProps) {
  const [isVisible, setIsVisible] = useState(visible)

  useEffect(() => {
    setIsVisible(visible)

    if (visible && autoClose && (status === "completed" || status === "failed")) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [visible, status, autoClose, autoCloseDelay, onClose])

  const getStatusIcon = () => {
    switch (status) {
      case "preparing":
      case "queued":
      case "generating":
      case "finalizing":
        return <Sparkles className="h-5 w-5 text-purple-400" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "preparing":
      case "queued":
      case "generating":
      case "finalizing":
        return "border-purple-500/30 bg-purple-500/10"
      case "completed":
        return "border-green-500/30 bg-green-500/10"
      case "failed":
        return "border-red-500/30 bg-red-500/10"
      default:
        return "border-white/10 bg-black/50"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 max-w-md"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`rounded-lg border p-4 shadow-lg backdrop-blur-md ${getStatusColor()}`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">{getStatusIcon()}</div>
              <div className="flex-1">
                <h4 className="font-medium text-white">
                  {status === "completed"
                    ? "Generation Complete"
                    : status === "failed"
                      ? "Generation Failed"
                      : "Generating Image"}
                </h4>
                <p className="mt-1 text-sm text-white/70">{message}</p>
              </div>
              <button
                onClick={() => {
                  setIsVisible(false)
                  onClose()
                }}
                className="flex-shrink-0 rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(status === "generating" || status === "finalizing") && (
              <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: status === "generating" ? 15 : 5,
                    ease: "linear",
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

