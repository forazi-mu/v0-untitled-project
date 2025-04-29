"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { analyzeDocument } from "@/lib/grok"
import { toast } from "@/components/ui/use-toast"

export default function DocumentAnalysis() {
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<string>("invoice")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to analyze",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      // Read the file content
      const text = await readFileAsText(file)

      // Analyze the document
      const analysis = await analyzeDocument(text, documentType)

      setAnalysisResult(analysis)
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: "Error",
        description: "Failed to analyze document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Analysis</CardTitle>
        <CardDescription>Upload and analyze documents using AI</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Document</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisResult}>
              Analysis Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="packing-list">Packing List</SelectItem>
                  <SelectItem value="bill-of-lading">Bill of Lading</SelectItem>
                  <SelectItem value="commercial-invoice">Commercial Invoice</SelectItem>
                  <SelectItem value="letter-of-credit">Letter of Credit</SelectItem>
                  <SelectItem value="customs-declaration">Customs Declaration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Document</Label>
              {!file ? (
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or click to select files</p>
                  <p className="mt-1 text-xs text-gray-500">Supports: PDF, TXT, DOC</p>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.doc,.docx"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Select File
                  </Button>
                </div>
              ) : (
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                      Change
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {analysisResult && (
              <div className="border rounded-md p-4 bg-muted/50">
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, "<br />") }} />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setFile(null)
            setAnalysisResult(null)
          }}
        >
          Reset
        </Button>
        <Button onClick={handleAnalyze} disabled={!file || isAnalyzing}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Analyze Document
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
