"use server"

import { sql } from "@/lib/db"
import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { UserProfileFormData } from "@/types/user"

// Get user profile by user ID
export async function getUserProfile(userId: string) {
  try {
    const profiles = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId}
    `

    return {
      success: true,
      profile: profiles.length > 0 ? profiles[0] : null,
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return {
      success: false,
      error: "Failed to fetch user profile",
    }
  }
}

// Create or update user profile
export async function updateUserProfile(userId: string, data: UserProfileFormData) {
  try {
    // Check if profile exists
    const { profile } = await getUserProfile(userId)

    if (profile) {
      // Update existing profile
      await sql`
        UPDATE user_profiles
        SET
          full_name = ${data.full_name},
          job_title = ${data.job_title},
          department = ${data.department},
          phone_number = ${data.phone_number},
          bio = ${data.bio}
        WHERE user_id = ${userId}
      `
    } else {
      // Create new profile
      await sql`
        INSERT INTO user_profiles (
          user_id,
          full_name,
          job_title,
          department,
          phone_number,
          bio
        ) VALUES (
          ${userId},
          ${data.full_name},
          ${data.job_title},
          ${data.department},
          ${data.phone_number},
          ${data.bio}
        )
      `
    }

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return {
      success: false,
      error: "Failed to update user profile",
    }
  }
}

// Update profile image
export async function updateProfileImage(userId: string, imageUrl: string) {
  try {
    await sql`
      UPDATE user_profiles
      SET profile_image_url = ${imageUrl}
      WHERE user_id = ${userId}
    `

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating profile image:", error)
    return {
      success: false,
      error: "Failed to update profile image",
    }
  }
}

// Get current user with profile
export async function getCurrentUser() {
  const supabase = getSupabaseServerClient()

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return { user: null, profile: null }
    }

    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { user: null, profile: null }
    }

    // Get user profile
    const { profile } = await getUserProfile(user.user.id)

    return { user: user.user, profile }
  } catch (error) {
    console.error("Error getting current user:", error)
    return { user: null, profile: null }
  }
}
