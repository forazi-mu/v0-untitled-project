"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  getUserById,
  updateUserRole,
  updateUserStatus,
  getAvailableRoles,
  deleteUser,
} from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2, Shield, Activity, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import type { AdminUserDetails, UserRoleOption } from "@/types/admin"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const userId = params.id

  const [user, setUser] = useState<AdminUserDetails | null>(null)
  const [roles, setRoles] = useState<UserRoleOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load user details and roles
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load user details
        const userResult = await getUserById(userId)
        if (userResult.success) {
          setUser(userResult.user)
        } else {
          toast({
            title: "Error",
            description: userResult.error || "Failed to load user details",
            variant: "destructive",
          })
        }

        // Load roles
        const rolesResult = await getAvailableRoles()
        if (rolesResult.success) {
          setRoles(rolesResult.roles)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId])

  // Handle role change
  const handleRoleChange = async (role: string) => {
    if (!user) return

    setIsUpdating(true)
    try {
      const result = await updateUserRole(userId, role)
      if (result.success) {
        setUser({ ...user, role })
        toast({
          title: "Success",
          description: "User role updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update user role",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating role:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle status change
  const handleStatusChange = async (status: "active" | "inactive" | "pending") => {
    if (!user) return

    setIsUpdating(true)
    try {
      const result = await updateUserStatus(userId, status)
      if (result.success) {
        setUser({ ...user, status })
        toast({
          title: "Success",
          description: `User ${status === "active" ? "activated" : "deactivated"} successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${status === "active" ? "activate" : "deactivate"} user`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!user) return

    setIsDeleting(true)
    try {
      const result = await deleteUser(userId)
      if (result.success) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        router.push("/admin/users")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <DashboardLayout isAdmin={true}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Users
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : user ? (
          <>
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="md:w-1/3">
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.profile?.profile_image_url || ""} alt={user.full_name || user.email} />
                    <AvatarFallback>{(user.full_name || user.email).substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{user.full_name || "No Name"}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="mt-2">{getStatusBadge(user.status)}</div>

                  <div className="w-full mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Role</span>
                      <Select value={user.role} onValueChange={handleRoleChange} disabled={isUpdating}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Select value={user.status} onValueChange={handleStatusChange} disabled={isUpdating}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Department</span>
                      <span>{user.profile?.department || "Not set"}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Job Title</span>
                      <span>{user.profile?.job_title || "Not set"}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the user account and remove their
                          data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>

              <div className="flex-1">
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Details</CardTitle>
                        <CardDescription>Detailed information about this user</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Account Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">User ID</p>
                              <p className="font-mono text-xs">{user.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Created</p>
                              <p>{formatDate(user.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Last Sign In</p>
                              <p>{formatDate(user.last_sign_in_at)}</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p>{user.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Phone</p>
                              <p>{user.profile?.phone_number || "Not provided"}</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="text-sm font-medium mb-2">Profile</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Bio</p>
                              <p>{user.profile?.bio || "No bio provided"}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Activity Log</CardTitle>
                        <CardDescription>Recent user activity</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {user.activity_logs && user.activity_logs.length > 0 ? (
                          <div className="space-y-4">
                            {user.activity_logs.map((log) => (
                              <div key={log.id} className="flex items-start gap-4">
                                <div className="rounded-full bg-blue-100 p-2">
                                  <Activity className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium capitalize">{log.action.replace(/_/g, " ")}</p>
                                  <p className="text-sm text-muted-foreground">{JSON.stringify(log.details)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(log.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-8 text-muted-foreground">No activity logs found</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="permissions" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Permissions</CardTitle>
                        <CardDescription>User role and permissions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Current Role</h4>
                            <div className="flex items-center gap-2">
                              <Shield className="h-5 w-5 text-primary" />
                              <span className="font-medium capitalize">{user.role}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {roles.find((r) => r.id === user.role)?.description || "No description available"}
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="text-sm font-medium mb-2">Role Permissions</h4>
                            <div className="space-y-2">
                              {user.role === "admin" && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span>Full system access</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span>User management</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span>System configuration</span>
                                  </div>
                                </>
                              )}

                              {user.role === "manager" && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span>Manage shipments</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span>View reports</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <span>User management</span>
                                  </div>
                                </>
                              )}

                              {user.role === "user" && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span>View shipments</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <span>Manage shipments</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <span>View reports</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">User not found</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/admin/users">Back to Users</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
