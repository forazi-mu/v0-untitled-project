import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Package, FileText, DollarSign, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ShipmentStatus {
  cargoLoading: number
  importCustom: number
  deliveryInventory: number
  accounts: number
}

interface ShipmentProps {
  id: string
  title: string
  supplier: string
  status: ShipmentStatus
  date: string
  totalValue: string
  containers: string[]
}

export default function ShipmentCard({ shipment }: { shipment: ShipmentProps }) {
  const { id, title, supplier, status, date, totalValue, containers } = shipment

  // Calculate overall progress
  const overallProgress = Object.values(status).reduce((sum, value) => sum + value, 0) / 4

  // Determine status badge
  let statusBadge
  if (overallProgress === 100) {
    statusBadge = <Badge className="bg-green-500">Completed</Badge>
  } else if (overallProgress === 0) {
    statusBadge = <Badge variant="outline">Not Started</Badge>
  } else if (overallProgress < 50) {
    statusBadge = <Badge className="bg-yellow-500">In Progress</Badge>
  } else {
    statusBadge = <Badge className="bg-blue-500">Almost Complete</Badge>
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{supplier}</CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Shipment ID:</span>
            <span className="font-medium">{id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Date:</span>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Value:</span>
            <span className="font-medium">{totalValue}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Containers:</span>
            <div className="flex flex-wrap justify-end gap-1">
              {containers.map((container) => (
                <Badge key={container} variant="outline" className="text-xs">
                  {container}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <Truck className="h-4 w-4" />
                <span>Cargo Loading</span>
              </div>
              <span>{status.cargoLoading}%</span>
            </div>
            <Progress value={status.cargoLoading} className="h-1.5" />

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Import & Custom</span>
              </div>
              <span>{status.importCustom}%</span>
            </div>
            <Progress value={status.importCustom} className="h-1.5" />

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span>Delivery & Inventory</span>
              </div>
              <span>{status.deliveryInventory}%</span>
            </div>
            <Progress value={status.deliveryInventory} className="h-1.5" />

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>Accounts</span>
              </div>
              <span>{status.accounts}%</span>
            </div>
            <Progress value={status.accounts} className="h-1.5" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/shipments/${id}`}>
            <span>View Details</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
