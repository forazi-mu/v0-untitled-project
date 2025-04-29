import { getCurrentUser } from "@/app/actions/user-actions"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/profile/profile-form"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">User Profile</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} initialProfile={profile} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
