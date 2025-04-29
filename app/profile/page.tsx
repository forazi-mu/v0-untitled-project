import { getCurrentUser } from "@/app/actions/user-actions"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/profile/profile-form"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardPreferences from "@/components/preferences/dashboard-preferences"

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { user, profile } = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Get the tab from query params or default to "profile"
  const tab = searchParams.tab === "preferences" ? "preferences" : "profile"

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">User Profile</h1>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue={tab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="preferences">Dashboard Preferences</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={tab} className="w-full">
              <TabsContent value="profile">
                <ProfileForm user={user} initialProfile={profile} />
              </TabsContent>
              <TabsContent value="preferences">
                <DashboardPreferences />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
