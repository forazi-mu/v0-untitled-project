"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Upload, X, File, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { uploadFile } from "@/lib/blob"

interface DocumentUploadProps {
  entityType: string
  entityId: number
  onUploadComplete: (fileUrl: string, fileName: string, fileType: string) => void
  documentTypes?: string[]
}

export default function DocumentUpload({
  entityType,
  entityId,
  onUploadComplete,
  documentTypes = ["Invoice", "Packing List", "Bill of Lading", "Commercial Invoice", "Letter of Credit", "Other"],
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<string>("")
  const [documentName, setDocumentName] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Auto-fill document name from file name if empty
      if (!documentName) {
        const fileName = selectedFile.name.split(".")[0]
        setDocumentName(fileName)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    if (!documentType) {
      toast({
        title: "Error",
        description: "Please select a document type",
        variant: "destructive",
      })
      return
    }

    if (!documentName) {
      toast({
        title: "Error",
        description: "Please enter a document name",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create folder path based on entity type and ID
      const folder = `${entityType}/${entityId}`

      // Upload file to Vercel Blob
      const fileUrl = await uploadFile(file, folder)

      // Call the callback with file details
      onUploadComplete(fileUrl, documentName, file.type)

      // Reset form
      setFile(null)
      setDocumentName("")

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document-type">Document Type</Label>
        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger id="document-type">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {documentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="document-name">Document Name</Label>
        <Input
          id="document-name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Enter document name"
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Document</Label>
        {!file ? (
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or click to select files</p>
            <p className="mt-1 text-xs text-gray-500">Supports: PDF, Excel, Images</p>
            <Input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
              accept=".pdf,.xls,.xlsx,.doc,.docx,.jpg,.jpeg,.png"
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
                <File className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Button
        className="w-full"
        onClick={handleUpload}
        disabled={!file || !documentType || !documentName || isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Upload Document
          </>
        )}
      </Button>
    </div>
  )
}
