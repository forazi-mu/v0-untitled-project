import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, FileText, DollarSign, ArrowLeft } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import DocumentUpload from "@/components/document-upload"
import DocumentList from "@/components/document-list"
import DocumentAnalysis from "@/components/document-analysis"
import ShipmentInsights from "@/components/shipment-insights"
import AIAssistant from "@/components/ai-assistant"

// This would normally come from your database
const getShipmentById = async (id: string) => {
  // Sample shipment data
  const shipments = [
    {
      id: "SHP-001",
      shipment_number: "SHP-001",
      title: "Electronics Shipment",
      supplier_name: "Tech Supplies Ltd.",
      supplier_id: 1,
      status: {
        cargoLoading: 100,
        importCustom: 75,
        deliveryInventory: 50,
        accounts: 25,
      },
      status_text: "In Progress",
      date: "2023-04-15",
      total_value: 45000,
      currency: "USD",
      containers: ["CONT-12345", "CONT-12346"],
    },
    {
      id: "SHP-002",
      shipment_number: "SHP-002",
      title: "Clothing Merchandise",
      supplier_name: "Fashion Exports Inc.",
      supplier_id: 2,
      status: {
        cargoLoading: 100,
        importCustom: 100,
        deliveryInventory: 80,
        accounts: 60,
      },
      status_text: "Almost Complete",
      date: "2023-04-10",
      total_value: 32000,
      currency: "USD",
      containers: ["CONT-54321"],
    },
    {
      id: "SHP-003",
      shipment_number: "SHP-003",
      title: "Home Goods",
      supplier_name: "Home Essentials Co.",
      supplier_id: 3,
      status: {
        cargoLoading: 100,
        importCustom: 100,
        deliveryInventory: 100,
        accounts: 90,
      },
      status_text: "Completed",
      date: "2023-03-28",
      total_value: 28500,
      currency: "USD",
      containers: ["CONT-98765", "CONT-98766", "CONT-98767"],
    },
  ]

  const shipment = shipments.find((s) => s.id === id)
  return shipment || null
}

export default async function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const shipment = await getShipmentById(params.id)

  if (!shipment) {
    notFound()
  }

  // Create context for AI assistant
  const shipmentContext = `
    Shipment ID: ${shipment.shipment_number}
    Title: ${shipment.title}
    Supplier: ${shipment.supplier_name}
    Value: $${shipment.total_value} ${shipment.currency}
    Status: ${shipment.status_text}
    Date: ${shipment.date}
    
    Progress:
    - Cargo Loading: ${shipment.status.cargoLoading}%
    - Import & Custom: ${shipment.status.importCustom}%
    - Delivery & Inventory: ${shipment.status.deliveryInventory}%
    - Accounts: ${shipment.status.accounts}%
    
    Containers: ${shipment.containers.join(", ")}
  `

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{shipment.title}</h1>
            <Badge
              className={`ml-2 ${
                shipment.status_text === "Completed"
                  ? "bg-green-500"
                  : shipment.status_text === "Almost Complete"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
              }`}
            >
              {shipment.status_text}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Details</CardTitle>
                <CardDescription>Overview of shipment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Shipment ID</h3>
                    <p className="text-lg">{shipment.shipment_number}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                    <p className="text-lg">{shipment.supplier_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date</h3>
                    <p className="text-lg">{shipment.date}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
                    <p className="text-lg">
                      ${shipment.total_value.toLocaleString()} {shipment.currency}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Containers</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {shipment.containers.map((container) => (
                        <Badge key={container} variant="outline">
                          {container}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium text-gray-500">Progress</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        <span>Cargo Loading</span>
                      </div>
                      <span>{shipment.status.cargoLoading}%</span>
                    </div>
                    <Progress value={shipment.status.cargoLoading} className="h-1.5" />

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>Import & Custom</span>
                      </div>
                      <span>{shipment.status.importCustom}%</span>
                    </div>
                    <Progress value={shipment.status.importCustom} className="h-1.5" />

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>Delivery & Inventory</span>
                      </div>
                      <span>{shipment.status.deliveryInventory}%</span>
                    </div>
                    <Progress value={shipment.status.deliveryInventory} className="h-1.5" />

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>Accounts</span>
                      </div>
                      <span>{shipment.status.accounts}%</span>
                    </div>
                    <Progress value={shipment.status.accounts} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="analysis">Document Analysis</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Manage documents related to this shipment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="view" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="view">View Documents</TabsTrigger>
                        <TabsTrigger value="upload">Upload Document</TabsTrigger>
                      </TabsList>

                      <TabsContent value="view" className="mt-4">
                        <DocumentList
                          entityType="shipment"
                          entityId={Number.parseInt(shipment.id.replace("SHP-", ""))}
                        />
                      </TabsContent>

                      <TabsContent value="upload" className="mt-4">
                        <DocumentUpload
                          entityType="shipment"
                          entityId={Number.parseInt(shipment.id.replace("SHP-", ""))}
                          onUploadComplete={(fileUrl, fileName, fileType) => {
                            console.log("Document uploaded:", { fileUrl, fileName, fileType })
                            // In a real app, you would save this to the database
                          }}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <DocumentAnalysis />
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>Financial transactions related to this shipment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-8 text-gray-500">No transactions found for this shipment</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>History</CardTitle>
                    <CardDescription>Status history and activity log</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-8 text-gray-500">No history records found for this shipment</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <ShipmentInsights shipment={shipment} />

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/reports">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Link>
                </Button>
                <Button className="w-full" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Update Inventory
                </Button>
                <Button className="w-full" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Record Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant shipmentContext={shipmentContext} />
    </DashboardLayout>
  )
}
