"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { getUserPreferences, updateUserPreferences } from "@/app/actions/user-actions"

export interface DashboardPreferences {
  theme: "light" | "dark" | "system"
  layout: "compact" | "comfortable" | "spacious"
  sidebarCollapsed: boolean
  visibleWidgets: string[]
  defaultTab: string
  cardSize: "small" | "medium" | "large"
}

export const defaultPreferences: DashboardPreferences = {
  theme: "system",
  layout: "comfortable",
  sidebarCollapsed: false,
  visibleWidgets: ["shipments", "stats", "activity", "calendar"],
  defaultTab: "all",
  cardSize: "medium",
}

interface PreferencesContextType {
  preferences: DashboardPreferences
  isLoading: boolean
  updatePreference: <K extends keyof DashboardPreferences>(key: K, value: DashboardPreferences[K]) => Promise<void>
  updateMultiplePreferences: (newPreferences: Partial<DashboardPreferences>) => Promise<void>
  resetPreferences: () => Promise<void>
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<DashboardPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)

  // Load user preferences on mount or when user changes
  useEffect(() => {
    async function loadPreferences() {
      if (!user) {
        setPreferences(defaultPreferences)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const result = await getUserPreferences(user.id)
        if (result.success && result.preferences) {
          // Merge with default preferences to ensure all fields exist
          setPreferences({
            ...defaultPreferences,
            ...result.preferences,
          })
        } else {
          setPreferences(defaultPreferences)
        }
      } catch (error) {
        console.error("Error loading preferences:", error)
        setPreferences(defaultPreferences)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [user])

  // Update a single preference
  const updatePreference = async <K extends keyof DashboardPreferences>(key: K, value: DashboardPreferences[K]) => {
    if (!user) return

    // Update locally first for immediate feedback
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))

    // Then update on the server
    try {
      await updateUserPreferences(user.id, {
        ...preferences,
        [key]: value,
      })
    } catch (error) {
      console.error(`Error updating preference ${key}:`, error)
      // Revert on error
      setPreferences((prev) => ({
        ...prev,
        [key]: preferences[key],
      }))
    }
  }

  // Update multiple preferences at once
  const updateMultiplePreferences = async (newPreferences: Partial<DashboardPreferences>) => {
    if (!user) return

    // Update locally first
    const updatedPreferences = {
      ...preferences,
      ...newPreferences,
    }
    setPreferences(updatedPreferences)

    // Then update on the server
    try {
      await updateUserPreferences(user.id, updatedPreferences)
    } catch (error) {
      console.error("Error updating multiple preferences:", error)
      // Revert on error
      setPreferences(preferences)
    }
  }

  // Reset preferences to defaults
  const resetPreferences = async () => {
    if (!user) return

    setPreferences(defaultPreferences)
    try {
      await updateUserPreferences(user.id, defaultPreferences)
    } catch (error) {
      console.error("Error resetting preferences:", error)
    }
  }

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        updatePreference,
        updateMultiplePreferences,
        resetPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider")
  }
  return context
}
