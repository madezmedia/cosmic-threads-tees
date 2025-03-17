"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { User, ArrowLeft, Upload } from "lucide-react"
import { useApp } from "@/context/app-context"
import AppLayout from "@/components/app-layout"
import { createClientSupabaseClient } from "@/lib/supabase/client"

// Validation schema for profile update
const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  avatarUrl: z.string().url({ message: "Must be a valid URL" }).optional().nullable(),
})

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useApp()
  const [isUpdating, setIsUpdating] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.full_name || "",
      avatarUrl: user?.avatar_url || null,
    },
  })

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Set form values when user data is available
    if (user) {
      form.reset({
        fullName: user.full_name || "",
        avatarUrl: user.avatar_url || null,
      })

      if (user.avatar_url) {
        setAvatarPreview(user.avatar_url)
      }
    }
  }, [user, isAuthenticated, isLoading, router, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)

      // Create a preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      setIsUpdating(true)

      // If there's a new avatar file, upload it
      let avatarUrl = data.avatarUrl
      if (avatarFile) {
        const fileName = `avatar-${Date.now()}.${avatarFile.name.split(".").pop()}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile)

        if (uploadError) throw uploadError

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(uploadData.path)

        avatarUrl = publicUrl
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
          avatar_url: avatarUrl,
        },
      })

      if (updateError) throw updateError

      // Also update the profile in the database
      const { error: profileError } = await supabase
        .from("users")
        .update({
          full_name: data.fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user!.id)

      if (profileError) throw profileError

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-lg text-white/70">Loading...</div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <Button
          variant="outline"
          className="mb-6 border-white/20 text-white hover:bg-white/10"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>Manage your personal information and account settings</CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 mb-4 relative group">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview || "/placeholder.svg"}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-10 w-10 text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <input type="file" id="avatar" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => document.getElementById("avatar")?.click()}
                  >
                    Change Avatar
                  </Button>
                </div>

                <Separator className="bg-white/10" />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          className="bg-black/50 border-white/20 text-white"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-black/50 border-white/20 text-white/70"
                  />
                  <p className="text-xs text-white/60 mt-1">Email address cannot be changed</p>
                </div>
              </CardContent>

              <CardFooter className="border-t border-white/10 pt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </AppLayout>
  )
}

