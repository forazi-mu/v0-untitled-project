import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <Image src="/placeholder.svg?height=80&width=80" alt="Logo" width={80} height={80} className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Merchandise Management System</CardTitle>
          <CardDescription>Track shipments, inventory, and costs in one place</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-gray-600">
            A comprehensive solution for merchandise shipment tracking, inventory management, and cost data entry.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login">Proceed to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
