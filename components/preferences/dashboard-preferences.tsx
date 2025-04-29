"use client"

import { useState } from "react"
import { usePreferences, type DashboardPreferences } from "@/contexts/preferences-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Loader2, RotateCcw } from "lucide-react"

export default function DashboardPreferences() {
  const { preferences, isLoading, updateMultiplePreferences, resetPreferences } = usePreferences()
  const [isSaving, setIsSaving] = useState(false)
  const [localPreferences, setLocalPreferences] = useState<DashboardPreferences>({ ...preferences })

  // Update local preferences
  const handleChange = <K extends keyof DashboardPreferences>(key: K, value: DashboardPreferences[K]) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Handle widget visibility toggle
  const toggleWidget = (widgetId: string) => {
    const currentWidgets = [...localPreferences.visibleWidgets]

    if (currentWidgets.includes(widgetId)) {
      handleChange(
        "visibleWidgets",
        currentWidgets.filter((id) => id !== widgetId),
      )
    } else {
      handleChange("visibleWidgets", [...currentWidgets, widgetId])
    }
  }

  // Save all preferences
  const savePreferences = async () => {
    setIsSaving(true)
    try {
      await updateMultiplePreferences(localPreferences)
      toast({
        title: "Preferences Saved",
        description: "Your dashboard preferences have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Reset to defaults
  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all preferences to default?")) {
      setIsSaving(true)
      try {
        await resetPreferences()
        setLocalPreferences({ ...preferences })
        toast({
          title: "Preferences Reset",
          description: "Your dashboard preferences have been reset to default.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reset preferences. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <RadioGroup
              value={localPreferences.theme}
              onValueChange={(value) => handleChange("theme", value as DashboardPreferences["theme"])}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">System</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Card Size</Label>
            <RadioGroup
              value={localPreferences.cardSize}
              onValueChange={(value) => handleChange("cardSize", value as DashboardPreferences["cardSize"])}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="card-small" />
                <Label htmlFor="card-small">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="card-medium" />
                <Label htmlFor="card-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="card-large" />
                <Label htmlFor="card-large">Large</Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Layout Density</Label>
            <RadioGroup
              value={localPreferences.layout}
              onValueChange={(value) => handleChange("layout", value as DashboardPreferences["layout"])}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="layout-compact" />
                <Label htmlFor="layout-compact">Compact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="layout-comfortable" />
                <Label htmlFor="layout-comfortable">Comfortable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spacious" id="layout-spacious" />
                <Label htmlFor="layout-spacious">Spacious</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sidebar-collapsed">Collapsed Sidebar</Label>
            <Switch
              id="sidebar-collapsed"
              checked={localPreferences.sidebarCollapsed}
              onCheckedChange={(checked) => handleChange("sidebarCollapsed", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Default Tab</Label>
            <RadioGroup
              value={localPreferences.defaultTab}
              onValueChange={(value) => handleChange("defaultTab", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="tab-all" />
                <Label htmlFor="tab-all">All Shipments</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="tab-active" />
                <Label htmlFor="tab-active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="tab-pending" />
                <Label htmlFor="tab-pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="tab-completed" />
                <Label htmlFor="tab-completed">Completed</Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-base">Visible Widgets</Label>
            <p className="text-sm text-muted-foreground">Select which widgets to display on your dashboard</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="widget-shipments"
                  checked={localPreferences.visibleWidgets.includes("shipments")}
                  onCheckedChange={() => toggleWidget("shipments")}
                />
                <Label htmlFor="widget-shipments">Recent Shipments</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="widget-stats"
                  checked={localPreferences.visibleWidgets.includes("stats")}
                  onCheckedChange={() => toggleWidget("stats")}
                />
                <Label htmlFor="widget-stats">Statistics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="widget-activity"
                  checked={localPreferences.visibleWidgets.includes("activity")}
                  onCheckedChange={() => toggleWidget("activity")}
                />
                <Label htmlFor="widget-activity">Activity Feed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="widget-calendar"
                  checked={localPreferences.visibleWidgets.includes("calendar")}
                  onCheckedChange={() => toggleWidget("calendar")}
                />
                <Label htmlFor="widget-calendar">Calendar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="widget-tasks"
                  checked={localPreferences.visibleWidgets.includes("tasks")}
                  onCheckedChange={() => toggleWidget("tasks")}
                />
                <Label htmlFor="widget-tasks">Tasks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="widget-notifications"
                  checked={localPreferences.visibleWidgets.includes("notifications")}
                  onCheckedChange={() => toggleWidget("notifications")}
                />
                <Label htmlFor="widget-notifications">Notifications</Label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleReset} disabled={isSaving}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
        <Button onClick={savePreferences} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  )
}
