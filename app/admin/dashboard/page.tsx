import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserPlus, Settings, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"
import ShipmentCard from "@/components/shipment-card"
import Link from "next/link"

export default function AdminDashboard() {
  // Sample shipment data
  const shipments = [
    {
      id: "SHP-001",
      title: "Electronics Shipment",
      supplier: "Tech Supplies Ltd.",
      status: {
        cargoLoading: 100,
        importCustom: 75,
        deliveryInventory: 50,
        accounts: 25,
      },
      date: "2023-04-15",
      totalValue: "$45,000",
      containers: ["CONT-12345", "CONT-12346"],
    },
    {
      id: "SHP-002",
      title: "Clothing Merchandise",
      supplier: "Fashion Exports Inc.",
      status: {
        cargoLoading: 100,
        importCustom: 100,
        deliveryInventory: 80,
        accounts: 60,
      },
      date: "2023-04-10",
      totalValue: "$32,000",
      containers: ["CONT-54321"],
    },
    {
      id: "SHP-003",
      title: "Home Goods",
      supplier: "Home Essentials Co.",
      status: {
        cargoLoading: 100,
        importCustom: 100,
        deliveryInventory: 100,
        accounts: 90,
      },
      date: "2023-03-28",
      totalValue: "$28,500",
      containers: ["CONT-98765", "CONT-98766", "CONT-98767"],
    },
  ]

  // Sample users for admin view
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Inventory Manager" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Accounts Manager" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Shipping Coordinator" },
  ]

  return (
    <DashboardLayout isAdmin={true}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/users/create">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+1 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$245,000</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="shipments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="shipments" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Shipments</h2>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search shipments..." className="w-full pl-8" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shipments.map((shipment) => (
                <ShipmentCard key={shipment.id} shipment={shipment} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">System Users</h2>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search users..." className="w-full pl-8" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{user.email}</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Permissions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Available Reports</h2>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate New Report
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipment Summary</CardTitle>
                  <CardDescription>Monthly overview of all shipments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Last generated: April 15, 2023</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Financial Report</CardTitle>
                  <CardDescription>Quarterly financial summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Last generated: March 31, 2023</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>Current inventory levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Last generated: April 18, 2023</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
