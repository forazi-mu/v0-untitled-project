import { put, list, del } from "@vercel/blob"

// Upload a file to Vercel Blob
export async function uploadFile(file: File, folder: string): Promise<string> {
  try {
    // Create a path with folder structure
    const path = `${folder}/${Date.now()}-${file.name}`

    // Upload to Vercel Blob
    const { url } = await put(path, file, {
      access: "public",
    })

    return url
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Failed to upload file")
  }
}

// List files in a folder
export async function listFiles(folder: string) {
  try {
    const { blobs } = await list({ prefix: folder })
    return blobs
  } catch (error) {
    console.error("Error listing files:", error)
    throw new Error("Failed to list files")
  }
}

// Delete a file
export async function deleteFile(url: string) {
  try {
    await del(url)
    return true
  } catch (error) {
    console.error("Error deleting file:", error)
    throw new Error("Failed to delete file")
  }
}
