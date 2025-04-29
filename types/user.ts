export interface UserProfile {
  id: number
  user_id: string
  full_name: string | null
  job_title: string | null
  department: string | null
  phone_number: string | null
  profile_image_url: string | null
  bio: string | null
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserProfileFormData {
  full_name: string
  job_title: string
  department: string
  phone_number: string
  bio: string
}
