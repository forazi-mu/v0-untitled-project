"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { FileText, Download, Loader2, BarChart, PieChart, TrendingUp } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { generateReport } from "@/lib/grok"
import { toast } from "@/components/ui/use-toast"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("shipment-summary")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportContent, setReportContent] = useState<string | null>(null)

  // Sample data for demonstration
  const sampleData = {
    shipments: [
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
    ],
    financials: {
      totalValue: "$105,500",
      paidAmount: "$78,200",
      pendingAmount: "$27,300",
      expenses: {
        freight: "$15,000",
        customs: "$8,500",
        insurance: "$4,200",
        other: "$3,800",
      },
    },
    inventory: {
      totalItems: 1250,
      inStock: 980,
      allocated: 270,
      categories: {
        electronics: 450,
        clothing: 520,
        homeGoods: 280,
      },
    },
  }

  const handleGenerateReport = async () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Please select a report type",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setReportContent(null)

    try {
      // Add date range to the data if selected
      const dataWithDates = {
        ...sampleData,
        dateRange: {
          startDate: startDate ? startDate.toISOString().split("T")[0] : undefined,
          endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
        },
      }

      const report = await generateReport(getReportTypeName(reportType), dataWithDates)
      setReportContent(report)
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getReportTypeName = (type: string) => {
    switch (type) {
      case "shipment-summary":
        return "Shipment Summary"
      case "financial":
        return "Financial Analysis"
      case "inventory":
        return "Inventory Status"
      default:
        return "Custom Report"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Reports</h1>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Report</CardTitle>
                <CardDescription>Select parameters for your report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shipment-summary">Shipment Summary</SelectItem>
                      <SelectItem value="financial">Financial Analysis</SelectItem>
                      <SelectItem value="inventory">Inventory Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start-date" className="text-xs">
                        Start Date
                      </Label>
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div>
                      <Label htmlFor="end-date" className="text-xs">
                        End Date
                      </Label>
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>Your previously generated reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="border rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Shipment Summary</p>
                    <p className="text-xs text-muted-foreground">Generated on April 15, 2023</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
                <div className="border rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Financial Analysis</p>
                    <p className="text-xs text-muted-foreground">Generated on March 31, 2023</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
                <div className="border rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Inventory Status</p>
                    <p className="text-xs text-muted-foreground">Generated on April 18, 2023</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  {reportContent
                    ? `${getReportTypeName(reportType)} - Generated ${new Date().toLocaleDateString()}`
                    : "Generate a report to see preview"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : reportContent ? (
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: reportContent.replace(/\n/g, "<br />") }} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                    <FileText className="h-16 w-16 mb-4" />
                    <p>Select report parameters and click "Generate Report" to create a new report</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                    Shipment Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <PieChart className="h-4 w-4 mr-2 text-green-500" />
                    Cost Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
                    Value Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
