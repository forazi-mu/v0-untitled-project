"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { getUsers, getAvailableRoles } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Search, UserPlus, Filter, ArrowUpDown } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { toast } from "@/components/ui/use-toast"
import type { AdminUserListItem, UserRoleOption } from "@/types/admin"
import CreateUserDialog from "@/components/admin/create-user-dialog"

export default function AdminUsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse search params
  const currentPage = Number(searchParams.get("page") || "1")
  const currentLimit = Number(searchParams.get("limit") || "10")
  const currentSearch = searchParams.get("search") || ""
  const currentRole = searchParams.get("role") || ""
  const currentStatus = searchParams.get("status") || ""
  const currentSortBy = searchParams.get("sortBy") || "created_at"
  const currentSortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc"

  // State
  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [roles, setRoles] = useState<UserRoleOption[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: currentPage,
    limit: currentLimit,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(currentSearch)
  const [selectedRole, setSelectedRole] = useState(currentRole)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [sortBy, setSortBy] = useState(currentSortBy)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(currentSortOrder)
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)

  // Load users and roles
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load users
        const usersResult = await getUsers({
          page: currentPage,
          limit: currentLimit,
          search: currentSearch,
          role: currentRole,
          status: currentStatus,
          sortBy: currentSortBy,
          sortOrder: currentSortOrder,
        })

        if (usersResult.success) {
          setUsers(usersResult.users)
          setPagination(usersResult.pagination)
        } else {
          toast({
            title: "Error",
            description: usersResult.error || "Failed to load users",
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
  }, [currentPage, currentLimit, currentSearch, currentRole, currentStatus, currentSortBy, currentSortOrder])

  // Update URL with filters
  const updateUrlWithFilters = ({
    page = pagination.page,
    search = searchTerm,
    role = selectedRole,
    status = selectedStatus,
    sortByParam = sortBy,
    sortOrderParam = sortOrder,
  }) => {
    const params = new URLSearchParams()

    if (page > 1) params.set("page", page.toString())
    if (search) params.set("search", search)
    if (role) params.set("role", role)
    if (status) params.set("status", status)
    if (sortByParam !== "created_at") params.set("sortBy", sortByParam)
    if (sortOrderParam !== "desc") params.set("sortOrder", sortOrderParam)

    const queryString = params.toString()
    router.push(`/admin/users${queryString ? `?${queryString}` : ""}`)
  }

  // Handle search
  const handleSearch = () => {
    updateUrlWithFilters({ page: 1 })
  }

  // Handle role filter change
  const handleRoleChange = (value: string) => {
    setSelectedRole(value)
    updateUrlWithFilters({ role: value, page: 1 })
  }

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    updateUrlWithFilters({ status: value, page: 1 })
  }

  // Handle sort
  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc"
    setSortBy(column)
    setSortOrder(newSortOrder)
    updateUrlWithFilters({ sortByParam: column, sortOrderParam: newSortOrder })
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    updateUrlWithFilters({ page })
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

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <DashboardLayout isAdmin={true}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Button onClick={() => setIsCreateUserOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage system users and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by email or name..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="flex gap-2">
                <div className="w-40">
                  <Select value={selectedRole} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon" onClick={handleSearch}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("email")}>
                            Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("full_name")}>
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSort("last_sign_in_at")}
                          >
                            Last Login
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center cursor-pointer" onClick={() => handleSort("created_at")}>
                            Created
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.email}</TableCell>
                            <TableCell>{user.full_name || "-"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.department || "-"}</TableCell>
                            <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                            <TableCell>{formatDate(user.created_at)}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/users/${user.id}`}>View</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (pagination.page > 1) {
                                handlePageChange(pagination.page - 1)
                              }
                            }}
                            className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>

                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            // Show first page, last page, and pages around current page
                            return page === 1 || page === pagination.totalPages || Math.abs(page - pagination.page) <= 1
                          })
                          .map((page, index, array) => {
                            // Add ellipsis if there are gaps
                            if (index > 0 && page - array[index - 1] > 1) {
                              return (
                                <PaginationItem key={`ellipsis-${page}`}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )
                            }

                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(page)
                                  }}
                                  isActive={page === pagination.page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (pagination.page < pagination.totalPages) {
                                handlePageChange(pagination.page + 1)
                              }
                            }}
                            className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateUserDialog
        open={isCreateUserOpen}
        onOpenChange={setIsCreateUserOpen}
        roles={roles}
        onSuccess={() => {
          // Refresh the user list
          updateUrlWithFilters({})
        }}
      />
    </DashboardLayout>
  )
}
