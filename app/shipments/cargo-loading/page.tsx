import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Upload, Download, Search } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

export default function CargoLoadingPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Cargo Loading</h1>
          <div className="flex gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Loading List
            </Button>
          </div>
        </div>

        <Tabs defaultValue="loading-list" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="loading-list">Supplier Packing List</TabsTrigger>
            <TabsTrigger value="loading-weight">Loading Weight</TabsTrigger>
            <TabsTrigger value="cargo-adjustment">Cargo Adjustment</TabsTrigger>
          </TabsList>

          <TabsContent value="loading-list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Packing List</CardTitle>
                <CardDescription>Create and manage supplier packing lists for shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="search" placeholder="Search lists..." className="w-full pl-8" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>List ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">PL-001</TableCell>
                      <TableCell>Tech Supplies Ltd.</TableCell>
                      <TableCell>2023-04-15</TableCell>
                      <TableCell>24</TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">PL-002</TableCell>
                      <TableCell>Fashion Exports Inc.</TableCell>
                      <TableCell>2023-04-10</TableCell>
                      <TableCell>36</TableCell>
                      <TableCell>In Progress</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">PL-003</TableCell>
                      <TableCell>Home Essentials Co.</TableCell>
                      <TableCell>2023-03-28</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>Pending</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loading-weight" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Loading Weight</CardTitle>
                <CardDescription>Record and manage loading weights for shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="shipment-id">Shipment ID</Label>
                      <Input id="shipment-id" placeholder="Enter shipment ID" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="container-number">Container Number</Label>
                      <Input id="container-number" placeholder="Enter container number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gross-weight">Gross Weight (KG)</Label>
                      <Input id="gross-weight" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="net-weight">Net Weight (KG)</Label>
                      <Input id="net-weight" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cbm">CBM</Label>
                      <Input id="cbm" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carton-count">Carton Count</Label>
                      <Input id="carton-count" type="number" placeholder="0" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Enter any additional notes" />
                  </div>

                  <div className="space-y-2">
                    <Label>Attach Documents</Label>
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or click to select files</p>
                      <p className="mt-1 text-xs text-gray-500">Supports: PDF, Excel, Images</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Select Files
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Loading Weight</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cargo-adjustment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cargo Adjustment</CardTitle>
                <CardDescription>Make adjustments to cargo details after loading</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="adjustment-shipment-id">Shipment ID</Label>
                      <Input id="adjustment-shipment-id" placeholder="Enter shipment ID" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adjustment-container-number">Container Number</Label>
                      <Input id="adjustment-container-number" placeholder="Enter container number" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Adjustment Details</Label>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Original Qty</TableHead>
                          <TableHead>Adjusted Qty</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Item A</TableCell>
                          <TableCell>100</TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="95" className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Input placeholder="Reason for adjustment" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Item B</TableCell>
                          <TableCell>50</TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="52" className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Input placeholder="Reason for adjustment" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Button variant="outline" size="sm" className="w-full">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Item
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adjustment-notes">Notes</Label>
                    <Textarea id="adjustment-notes" placeholder="Enter any additional notes" />
                  </div>

                  <div className="space-y-2">
                    <Label>Attach Documents</Label>
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or click to select files</p>
                      <p className="mt-1 text-xs text-gray-500">Supports: PDF, Excel, Images</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Select Files
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Adjustments</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
