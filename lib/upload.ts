import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function uploadImageToStorage(file: File, bucket: string, path: string): Promise<string> {
  const supabase = createServerSupabaseClient()

  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`)
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return publicUrl
}

