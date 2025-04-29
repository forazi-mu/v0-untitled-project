import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Function to generate shipment insights using Groq
export async function generateShipmentInsights(shipmentData: any) {
  try {
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: `
        Analyze this shipment data and provide insights:
        
        Shipment ID: ${shipmentData.shipment_number}
        Title: ${shipmentData.title}
        Supplier: ${shipmentData.supplier_name}
        Value: ${shipmentData.total_value} ${shipmentData.currency}
        Status: ${shipmentData.status}
        
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

// Function to generate document summary using Groq
export async function generateDocumentSummary(documentText: string) {
  try {
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: `
        Summarize the following document text concisely:
        
        ${documentText}
        
        Provide a brief summary highlighting the key information, dates, amounts, and any action items.
      `,
      temperature: 0.5,
      maxTokens: 500,
    })

    return text
  } catch (error) {
    console.error("Error generating document summary:", error)
    return "Unable to generate summary at this time."
  }
}

// Function to answer questions about shipments using Groq
export async function answerShipmentQuestion(question: string, context: string) {
  try {
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
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
