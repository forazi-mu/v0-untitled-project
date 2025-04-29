"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { uploadFile } from "@/lib/blob"
import { updateProfileImage } from "@/app/actions/user-actions"

interface ProfileImageUploadProps {
  userId: string
  currentImageUrl: string | null
}

export default function ProfileImageUpload({ userId, currentImageUrl }: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(currentImageUrl)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Upload to Vercel Blob
      const folder = `users/${userId}/profile`
      const uploadedUrl = await uploadFile(file, folder)

      // Update user profile with new image URL
      const result = await updateProfileImage(userId, uploadedUrl)

      if (result.success) {
        setImageUrl(uploadedUrl)
        toast({
          title: "Profile Image Updated",
          description: "Your profile image has been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Get initials from user ID for avatar fallback
  const getInitials = () => {
    return userId.substring(0, 2).toUpperCase()
  }

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage src={imageUrl || undefined} alt="Profile" />
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <input
        type="file"
        id="profile-image"
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isUploading}
      />
      <label htmlFor="profile-image" className="absolute bottom-0 right-0 rounded-full bg-primary p-2 cursor-pointer">
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        ) : (
          <Camera className="h-4 w-4 text-white" />
        )}
      </label>
    </div>
  )
}
