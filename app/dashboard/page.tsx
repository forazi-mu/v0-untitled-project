"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/dashboard-layout"
import ShipmentCard from "@/components/shipment-card"
import AIAssistant from "@/components/ai-assistant"
import { usePreferences } from "@/contexts/preferences-context"

export default function Dashboard() {
  const { preferences } = usePreferences()

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

  // Sample shipment context for AI assistant
  const shipmentContext = `
    Current shipments:
    - SHP-001: Electronics Shipment from Tech Supplies Ltd., $45,000, In Progress
    - SHP-002: Clothing Merchandise from Fashion Exports Inc., $32,000, Almost Complete
    - SHP-003: Home Goods from Home Essentials Co., $28,500, Completed
    
    Recent activities:
    - Cargo loading completed for SHP-001
    - Import documentation in progress for SHP-001
    - Delivery started for SHP-002
    - All processes completed for SHP-003
  `

  // Get layout class based on preferences
  const getLayoutClass = () => {
    switch (preferences.layout) {
      case "compact":
        return "gap-3"
      case "spacious":
        return "gap-8"
      default:
        return "gap-6" // comfortable
    }
  }

  // Get card size class based on preferences
  const getCardSizeClass = () => {
    switch (preferences.cardSize) {
      case "small":
        return "grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
      case "large":
        return "grid-cols-1 md:grid-cols-1 lg:grid-cols-2"
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" // medium
    }
  }

  return (
    <DashboardLayout>
      <div className={`flex flex-col ${getLayoutClass()}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search shipments..." className="w-full pl-8" />
          </div>
        </div>

        <Tabs defaultValue={preferences.defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Shipments</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className={`grid ${getCardSizeClass()} ${getLayoutClass()}`}>
              {shipments.map((shipment) => (
                <ShipmentCard key={shipment.id} shipment={shipment} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="active">
            <div className={`grid ${getCardSizeClass()} ${getLayoutClass()}`}>
              {shipments
                .filter(
                  (s) => Object.values(s.status).some((v) => v < 100) && Object.values(s.status).some((v) => v > 0),
                )
                .map((shipment) => (
                  <ShipmentCard key={shipment.id} shipment={shipment} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="pending">
            <div className={`grid ${getCardSizeClass()} ${getLayoutClass()}`}>
              {shipments
                .filter((s) => Object.values(s.status).some((v) => v === 0))
                .map((shipment) => (
                  <ShipmentCard key={shipment.id} shipment={shipment} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className={`grid ${getCardSizeClass()} ${getLayoutClass()}`}>
              {shipments
                .filter((s) => Object.values(s.status).every((v) => v === 100))
                .map((shipment) => (
                  <ShipmentCard key={shipment.id} shipment={shipment} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {preferences.visibleWidgets.includes("stats") && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${getLayoutClass()}`}>
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
                <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">-1 from last month</p>
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
        )}

        {/* Conditionally render other widgets based on preferences */}
        {preferences.visibleWidgets.includes("activity") && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Search className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">New shipment created</p>
                    <p className="text-sm text-muted-foreground">SHP-004 was created by John Doe</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-2">
                    <Search className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Document uploaded</p>
                    <p className="text-sm text-muted-foreground">Invoice #12345 was uploaded to SHP-001</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Assistant */}
      <AIAssistant shipmentContext={shipmentContext} />
    </DashboardLayout>
  )
}
