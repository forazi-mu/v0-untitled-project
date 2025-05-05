import type { User } from "@supabase/supabase-js"
import type { UserProfile } from "./user"

export interface AdminUserListItem {
  id: string
  email: string
  full_name: string | null
  role: string
  department: string | null
  last_sign_in_at: string | null
  created_at: string
  status: "active" | "inactive" | "pending"
}

export interface AdminUserDetails extends AdminUserListItem {
  profile: UserProfile | null
  auth_user: User
  activity_logs: UserActivityLog[]
}

export interface UserActivityLog {
  id: number
  user_id: string
  action: string
  details: Record<string, any>
  ip_address: string | null
  created_at: string
}

export interface UserRoleOption {
  id: string
  name: string
  description: string
}

export type UserStatus = "active" | "inactive" | "pending"
