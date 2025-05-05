"use server"
import { revalidatePath } from "next/cache"
import type { AdminUserListItem, UserStatus } from "@/types/admin"

// Get all users with pagination and filtering
export async function getUsers({
  page = 1,
  limit = 10,
  search = "",
  role = "",
  status = "",
  sortBy = "created_at",
  sortOrder = "desc",
}: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}) {
  try {
    const offset = (page - 1) * limit

    // Build the query based on filters
    let query = `
      SELECT 
        au.id,
        au.email,
        au.role,
        au.created_at,
        au.last_sign_in_at,
        au.status,
        up.full_name,
        up.department
      FROM 
        auth_users au
      LEFT JOIN 
        user_profiles up ON au.id = up.user_id
      WHERE 1=1
    `

    const queryParams: any[] = []
    let paramIndex = 1

    if (search) {
      query += ` AND (au.email ILIKE $${paramIndex} OR up.full_name ILIKE $${paramIndex})`
      queryParams.push(`%${search}%`)
      paramIndex++
    }

    if (role) {
      query += ` AND au.role = $${paramIndex}`
      queryParams.push(role)
      paramIndex++
    }

    if (status) {
      query += ` AND au.status = $${paramIndex}`
      queryParams.push(status)
      paramIndex++
    }

    // Add sorting
    query += ` ORDER BY ${sortBy} ${sortOrder}`

    // Add pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    queryParams.push(limit, offset)

    // Count total users matching the filter
    let countQuery = `
      SELECT 
        COUNT(*) as total
      FROM 
        auth_users au
      LEFT JOIN 
        user_profiles up ON au.id = up.user_id
      WHERE 1=1
    `

    if (search) {
      countQuery += ` AND (au.email ILIKE $1 OR up.full_name ILIKE $1)`
    }

    if (role) {
      countQuery += ` AND au.role = $${search ? 2 : 1}`
    }

    if (status) {
      const statusParamIndex = 1 + (search ? 1 : 0) + (role ? 1 : 0)
      countQuery += ` AND au.status = $${statusParamIndex}`
    }

    // For demonstration purposes, we'll mock this data since we don't have direct access to auth_users
    // In a real implementation, you would execute these queries against your database

    // Mock data for demonstration
    const mockUsers: AdminUserListItem[] = [
      {
        id: "1",
        email: "admin@example.com",
        full_name: "Admin User",
        role: "admin",
        department: "Management",
        last_sign_in_at: new Date().toISOString(),
        created_at: "2023-01-01T00:00:00Z",
        status: "active",
      },
      {
        id: "2",
        email: "john@example.com",
        full_name: "John Doe",
        role: "manager",
        department: "Logistics",
        last_sign_in_at: new Date().toISOString(),
        created_at: "2023-01-15T00:00:00Z",
        status: "active",
      },
      {
        id: "3",
        email: "jane@example.com",
        full_name: "Jane Smith",
        role: "user",
        department: "Procurement",
        last_sign_in_at: new Date().toISOString(),
        created_at: "2023-02-01T00:00:00Z",
        status: "active",
      },
      {
        id: "4",
        email: "bob@example.com",
        full_name: "Bob Johnson",
        role: "user",
        department: "Accounts",
        last_sign_in_at: null,
        created_at: "2023-03-01T00:00:00Z",
        status: "pending",
      },
      {
        id: "5",
        email: "alice@example.com",
        full_name: "Alice Brown",
        role: "user",
        department: "Inventory",
        last_sign_in_at: "2023-04-01T00:00:00Z",
        created_at: "2023-03-15T00:00:00Z",
        status: "inactive",
      },
    ]

    // Filter mock data based on search parameters
    let filteredUsers = mockUsers

    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(searchLower) ||
          (user.full_name && user.full_name.toLowerCase().includes(searchLower)),
      )
    }

    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    if (status) {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    // Sort the data
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy as keyof AdminUserListItem]
      const bValue = b[sortBy as keyof AdminUserListItem]

      if (aValue === null) return sortOrder === "asc" ? -1 : 1
      if (bValue === null) return sortOrder === "asc" ? 1 : -1

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    // Apply pagination
    const paginatedUsers = filteredUsers.slice(offset, offset + limit)
    const total = filteredUsers.length

    return {
      success: true,
      users: paginatedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      success: false,
      error: "Failed to fetch users",
    }
  }
}

// Get user details by ID
export async function getUserById(userId: string) {
  try {
    // In a real implementation, you would fetch this from your database
    // For demonstration, we'll return mock data
    return {
      success: true,
      user: {
        id: userId,
        email: "john@example.com",
        full_name: "John Doe",
        role: "manager",
        department: "Logistics",
        last_sign_in_at: new Date().toISOString(),
        created_at: "2023-01-15T00:00:00Z",
        status: "active",
        profile: {
          id: 1,
          user_id: userId,
          full_name: "John Doe",
          job_title: "Logistics Manager",
          department: "Logistics",
          phone_number: "+1234567890",
          profile_image_url: null,
          bio: "Experienced logistics professional",
          preferences: {},
          created_at: "2023-01-15T00:00:00Z",
          updated_at: "2023-04-01T00:00:00Z",
        },
        auth_user: {
          id: userId,
          email: "john@example.com",
          created_at: "2023-01-15T00:00:00Z",
        },
        activity_logs: [
          {
            id: 1,
            user_id: userId,
            action: "login",
            details: { ip: "192.168.1.1" },
            ip_address: "192.168.1.1",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            user_id: userId,
            action: "update_profile",
            details: { fields: ["job_title", "bio"] },
            ip_address: "192.168.1.1",
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
        ],
      },
    }
  } catch (error) {
    console.error("Error fetching user details:", error)
    return {
      success: false,
      error: "Failed to fetch user details",
    }
  }
}

// Update user role
export async function updateUserRole(userId: string, role: string) {
  try {
    // In a real implementation, you would update the user's role in your database
    // For demonstration, we'll just return success

    // Example of how you might implement this with Supabase
    // const supabase = getSupabaseServerClient()
    // const { error } = await supabase.auth.admin.updateUserById(userId, { role })
    // if (error) throw error

    revalidatePath("/admin/users")
    revalidatePath(`/admin/users/${userId}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating user role:", error)
    return {
      success: false,
      error: "Failed to update user role",
    }
  }
}

// Update user status
export async function updateUserStatus(userId: string, status: UserStatus) {
  try {
    // In a real implementation, you would update the user's status in your database
    // For demonstration, we'll just return success

    // Example of how you might implement this with Supabase
    // const supabase = getSupabaseServerClient()
    // if (status === "inactive") {
    //   const { error } = await supabase.auth.admin.deleteUser(userId)
    //   if (error) throw error
    // } else if (status === "active") {
    //   // Reactivate user logic
    // }

    revalidatePath("/admin/users")
    revalidatePath(`/admin/users/${userId}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating user status:", error)
    return {
      success: false,
      error: "Failed to update user status",
    }
  }
}

// Get available roles
export async function getAvailableRoles() {
  try {
    // In a real implementation, you would fetch this from your database
    // For demonstration, we'll return mock data
    return {
      success: true,
      roles: [
        {
          id: "admin",
          name: "Administrator",
          description: "Full access to all system features",
        },
        {
          id: "manager",
          name: "Manager",
          description: "Can manage shipments and view reports",
        },
        {
          id: "user",
          name: "User",
          description: "Basic access to shipment tracking",
        },
      ],
    }
  } catch (error) {
    console.error("Error fetching roles:", error)
    return {
      success: false,
      error: "Failed to fetch roles",
    }
  }
}

// Create a new user
export async function createUser({
  email,
  role,
  sendInvite = true,
}: {
  email: string
  role: string
  sendInvite?: boolean
}) {
  try {
    // In a real implementation, you would create a new user in your auth system
    // For demonstration, we'll just return success

    // Example of how you might implement this with Supabase
    // const supabase = getSupabaseServerClient()
    // const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    //   data: { role },
    // })
    // if (error) throw error

    revalidatePath("/admin/users")

    return {
      success: true,
      userId: "new-user-id", // In a real implementation, this would be the actual user ID
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      error: "Failed to create user",
    }
  }
}

// Delete a user
export async function deleteUser(userId: string) {
  try {
    // In a real implementation, you would delete the user from your auth system
    // For demonstration, we'll just return success

    // Example of how you might implement this with Supabase
    // const supabase = getSupabaseServerClient()
    // const { error } = await supabase.auth.admin.deleteUser(userId)
    // if (error) throw error

    revalidatePath("/admin/users")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      success: false,
      error: "Failed to delete user",
    }
  }
}
