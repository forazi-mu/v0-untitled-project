import { neon } from "@neondatabase/serverless"

// Create a reusable SQL client
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to format dates for SQL
export const formatDate = (date: Date): string => {
  return date.toISOString()
}

// Helper function to generate unique IDs for various entities
export const generateUniqueId = (prefix: string): string => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}${randomStr}`.toUpperCase()
}

// Helper to safely parse numeric values
export const safeParseFloat = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === "") return null
  const parsed = Number.parseFloat(String(value))
  return isNaN(parsed) ? null : parsed
}
