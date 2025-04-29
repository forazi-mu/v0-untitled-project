"use client"

import { useState, useEffect } from "react"
import { Lightbulb, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { generateShipmentInsights } from "@/lib/grok"
import { toast } from "@/components/ui/use-toast"

interface ShipmentInsightsProps {
  shipment: any
}

export default function ShipmentInsights({ shipment }: ShipmentInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchInsights()
  }, [shipment])

  const fetchInsights = async () => {
    setIsLoading(true)
    try {
      const result = await generateShipmentInsights(shipment)
      setInsights(result)
    } catch (error) {
      console.error("Error fetching insights:", error)
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          AI Insights
        </CardTitle>
        <CardDescription>AI-generated analysis of this shipment</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : insights ? (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, "<br />") }} />
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No insights available</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="ml-auto" onClick={fetchInsights} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Insights
        </Button>
      </CardFooter>
    </Card>
  )
}
