"use client"

import { useState, useEffect } from "react"

interface ImageDebugProps {
  src: string
  alt?: string
  className?: string
}

export default function ImageDebug({ src, alt = "Image", className = "" }: ImageDebugProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Reset state when src changes
    setStatus("loading")
    setDimensions(null)
    setErrorMessage(null)

    if (!src) {
      setStatus("error")
      setErrorMessage("No source provided")
      return
    }

    const img = new Image()
    img.onload = () => {
      setStatus("success")
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }

    img.onerror = (e) => {
      setStatus("error")
      setErrorMessage(`Failed to load image: ${e}`)
    }

    img.src = src
  }, [src])

  return (
    <div className="relative">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-sm">Loading image...</div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 p-4">
          <div className="text-red-400 text-sm mb-2">Error loading image</div>
          {errorMessage && <div className="text-red-300 text-xs text-center">{errorMessage}</div>}
        </div>
      )}

      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={className}
        onLoad={() => console.log(`Image loaded successfully: ${src}`)}
        onError={(e) => console.error(`Image failed to load: ${src}`, e)}
      />

      {status === "success" && dimensions && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {dimensions.width}×{dimensions.height}
        </div>
      )}
    </div>
  )
}

