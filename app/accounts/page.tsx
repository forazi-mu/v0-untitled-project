import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, FileText, Download } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

export default function AccountsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Accounts</h1>
          <div className="flex gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </div>
        </div>

        <Tabs defaultValue="goods-memo" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="goods-memo">Memo for Goods</TabsTrigger>
            <TabsTrigger value="order-quotation">Order Quotation</TabsTrigger>
            <TabsTrigger value="service-bills">Bills for Services</TabsTrigger>
            <TabsTrigger value="payments">Payments & Transfers</TabsTrigger>
          </TabsList>

          <TabsContent value="goods-memo" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Memo for Goods</CardTitle>
                <CardDescription>Create and manage credit vouchers for goods purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="search" placeholder="Search memos..." className="w-full pl-8" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
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
                      <TableHead>Memo ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">MG-001</TableCell>
                      <TableCell>Tech Supplies Ltd.</TableCell>
                      <TableCell>2023-04-15</TableCell>
                      <TableCell>45,000</TableCell>
                      <TableCell>USD</TableCell>
                      <TableCell>Paid</TableCell>
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
                      <TableCell className="font-medium">MG-002</TableCell>
                      <TableCell>Fashion Exports Inc.</TableCell>
                      <TableCell>2023-04-10</TableCell>
                      <TableCell>32,000</TableCell>
                      <TableCell>USD</TableCell>
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
                    <TableRow>
                      <TableCell className="font-medium">MG-003</TableCell>
                      <TableCell>Home Essentials Co.</TableCell>
                      <TableCell>2023-03-28</TableCell>
                      <TableCell>28,500</TableCell>
                      <TableCell>USD</TableCell>
                      <TableCell>Partial</TableCell>
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

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payments & Transfers</CardTitle>
                <CardDescription>Record payments to suppliers and transfers between accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="transaction-type">Transaction Type</Label>
                      <Select defaultValue="payment">
                        <SelectTrigger id="transaction-type">
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-date">Transaction Date</Label>
                      <Input id="transaction-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from-account">From Account</Label>
                      <Select>
                        <SelectTrigger id="from-account">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank-1">Bank Account 1</SelectItem>
                          <SelectItem value="bank-2">Bank Account 2</SelectItem>
                          <SelectItem value="cash">Cash Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to-account">To Account/Supplier</Label>
                      <Select>
                        <SelectTrigger id="to-account">
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="supplier-1">Tech Supplies Ltd.</SelectItem>
                          <SelectItem value="supplier-2">Fashion Exports Inc.</SelectItem>
                          <SelectItem value="bank-1">Bank Account 1</SelectItem>
                          <SelectItem value="bank-2">Bank Account 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input id="amount" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="bdt">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bdt">BDT</SelectItem>
                          <SelectItem value="usd">USD</SelectItem>
                          <SelectItem value="rmb">RMB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exchange-rate">Exchange Rate (if applicable)</Label>
                      <Input id="exchange-rate" type="number" placeholder="1.00" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference/Memo Number</Label>
                    <Input id="reference" placeholder="Enter reference or memo number" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Enter transaction description" />
                  </div>

                  <div className="space-y-2">
                    <Label>Attach Documents</Label>
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <FileText className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Attach payment receipts, invoices, or other relevant documents
                      </p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Select Files
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Record Transaction</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="order-quotation" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Quotation</CardTitle>
                <CardDescription>Create and manage order quotations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="search" placeholder="Search quotations..." className="w-full pl-8" />
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Quotation
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">QT-001</TableCell>
                      <TableCell>Tech Supplies Ltd.</TableCell>
                      <TableCell>2023-04-15</TableCell>
                      <TableCell>$45,000</TableCell>
                      <TableCell>Approved</TableCell>
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
                      <TableCell className="font-medium">QT-002</TableCell>
                      <TableCell>Fashion Exports Inc.</TableCell>
                      <TableCell>2023-04-10</TableCell>
                      <TableCell>$32,000</TableCell>
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
                    <TableRow>
                      <TableCell className="font-medium">QT-003</TableCell>
                      <TableCell>Home Essentials Co.</TableCell>
                      <TableCell>2023-03-28</TableCell>
                      <TableCell>$28,500</TableCell>
                      <TableCell>Rejected</TableCell>
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

          <TabsContent value="service-bills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Bills for Services</CardTitle>
                <CardDescription>Create and manage bills for services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="search" placeholder="Search bills..." className="w-full pl-8" />
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Service Bill
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill ID</TableHead>
                      <TableHead>Service Provider</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">SB-001</TableCell>
                      <TableCell>Shipping Co.</TableCell>
                      <TableCell>Freight</TableCell>
                      <TableCell>2023-04-15</TableCell>
                      <TableCell>$12,000</TableCell>
                      <TableCell>Paid</TableCell>
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
                      <TableCell className="font-medium">SB-002</TableCell>
                      <TableCell>Customs Agency</TableCell>
                      <TableCell>Customs Clearance</TableCell>
                      <TableCell>2023-04-10</TableCell>
                      <TableCell>$3,500</TableCell>
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
                    <TableRow>
                      <TableCell className="font-medium">SB-003</TableCell>
                      <TableCell>Insurance Ltd.</TableCell>
                      <TableCell>Cargo Insurance</TableCell>
                      <TableCell>2023-03-28</TableCell>
                      <TableCell>$2,800</TableCell>
                      <TableCell>Paid</TableCell>
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
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
