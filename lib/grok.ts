import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

// Function to generate shipment insights using Grok
export async function generateShipmentInsights(shipmentData: any) {
  try {
    const { text } = await generateText({
      model: xai("grok-1"),
      prompt: `
        Analyze this shipment data and provide insights:
        
        Shipment ID: ${shipmentData.id}
        Title: ${shipmentData.title}
        Supplier: ${shipmentData.supplier}
        Value: ${shipmentData.totalValue}
        Status: ${calculateStatus(shipmentData.status)}
        
        Please provide:
        1. A summary of the shipment status
        2. Potential risks or issues to watch for
        3. Recommendations for optimizing this shipment
        4. Cost-saving opportunities
        
        Format the response in clear sections with bullet points where appropriate.
      `,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return text
  } catch (error) {
    console.error("Error generating insights:", error)
    return "Unable to generate insights at this time."
  }
}

// Function to analyze documents using Grok
export async function analyzeDocument(documentText: string, documentType: string) {
  try {
    const { text } = await generateText({
      model: xai("grok-1"),
      prompt: `
        Analyze the following ${documentType} document text:
        
        ${documentText}
        
        Please extract and provide:
        1. Key information (dates, amounts, parties involved)
        2. Important terms and conditions
        3. Action items or deadlines
        4. Any potential issues or discrepancies
        
        Format the response in clear sections with bullet points where appropriate.
      `,
      temperature: 0.5,
      maxTokens: 800,
    })

    return text
  } catch (error) {
    console.error("Error analyzing document:", error)
    return "Unable to analyze document at this time."
  }
}

// Function to generate reports using Grok
export async function generateReport(reportType: string, data: any) {
  try {
    const { text } = await generateText({
      model: xai("grok-1"),
      prompt: `
        Generate a ${reportType} report based on the following data:
        
        ${JSON.stringify(data, null, 2)}
        
        The report should include:
        1. Executive summary
        2. Key metrics and their analysis
        3. Trends and patterns
        4. Recommendations
        
        Format the report in a professional manner with clear sections and bullet points where appropriate.
      `,
      temperature: 0.3,
      maxTokens: 1500,
    })

    return text
  } catch (error) {
    console.error("Error generating report:", error)
    return "Unable to generate report at this time."
  }
}

// Function to answer questions about shipments using Grok
export async function answerShipmentQuestion(question: string, context: string) {
  try {
    const { text } = await generateText({
      model: xai("grok-1"),
      prompt: `
        Context about shipments:
        ${context}
        
        Question: ${question}
        
        Please provide a helpful, accurate answer based on the context provided.
      `,
      temperature: 0.3,
      maxTokens: 800,
    })

    return text
  } catch (error) {
    console.error("Error answering question:", error)
    return "Unable to answer the question at this time."
  }
}

// Helper function to calculate overall status text
function calculateStatus(status: {
  cargoLoading: number
  importCustom: number
  deliveryInventory: number
  accounts: number
}) {
  const overallProgress = (status.cargoLoading + status.importCustom + status.deliveryInventory + status.accounts) / 4

  if (overallProgress === 100) return "Completed"
  if (overallProgress === 0) return "Not Started"
  if (overallProgress < 50) return "In Progress"
  return "Almost Complete"
}
