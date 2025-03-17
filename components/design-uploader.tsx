"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, Check, AlertCircle } from "lucide-react"

interface DesignUploaderProps {
  onUploadComplete: (fileUrl: string) => void
}

export default function DesignUploader({ onUploadComplete }: DesignUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a JPG, PNG, or SVG file.")
      return
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return newProgress
        })
      }, 300)

      // In a real app, you would upload the file to your server
      // which would then upload it to Printful
      // For this example, we'll simulate the upload
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate a response from the server
      const mockFileUrl = URL.createObjectURL(file)
      setUploadedFileUrl(mockFileUrl)
      onUploadComplete(mockFileUrl)

      clearInterval(progressInterval)
      setUploadProgress(100)
    } catch (error) {
      console.error("Error uploading file:", error)
      setError("Failed to upload file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="bg-black border-chrome/20">
      <CardContent className="pt-6">
        <h3 className="text-lg font-mono uppercase tracking-wider text-chrome mb-4">Upload Your Design</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center text-red-400">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="border-2 border-dashed border-chrome/30 rounded-lg p-6 text-center">
            {uploadedFileUrl ? (
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4">
                  <img
                    src={uploadedFileUrl || "/placeholder.svg"}
                    alt="Uploaded design"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center text-teal">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Upload complete</span>
                </div>
              </div>
            ) : isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-magenta animate-spin mb-4" />
                <p className="text-chrome/60 mb-2">Uploading your design...</p>
                <div className="w-full max-w-xs h-2 bg-chrome/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-magenta"
                    style={{ width: `${uploadProgress}%`, transition: "width 0.3s ease-in-out" }}
                  ></div>
                </div>
                <p className="text-sm text-chrome/60 mt-2">{uploadProgress}%</p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto mb-4 text-chrome/40" />
                <p className="text-chrome/60 mb-4">Drag and drop your design file here, or click to browse</p>
                <Label
                  htmlFor="design-file"
                  className="inline-block bg-teal text-black px-4 py-2 rounded cursor-pointer hover:bg-teal/80 transition-colors"
                >
                  Select File
                </Label>
                <input
                  type="file"
                  id="design-file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <p className="text-xs text-chrome/40 mt-4">Supported formats: JPG, PNG, SVG. Max file size: 5MB.</p>
              </>
            )}
          </div>

          {uploadedFileUrl && (
            <Button
              variant="outline"
              className="w-full border-chrome/30 text-chrome hover:bg-chrome/10"
              onClick={() => {
                setUploadedFileUrl(null)
                setUploadProgress(0)
              }}
            >
              Upload a Different Design
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

