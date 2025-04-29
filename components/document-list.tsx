"use client"

import { useState, useEffect } from "react"
import { FileText, Download, Trash2, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { getDocumentsByEntity, deleteDocument } from "@/app/actions/document-actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Document {
  id: number
  document_type: string
  document_name: string
  document_number: string | null
  document_date: string | null
  amount: number | null
  value_unit: string | null
  file_path: string
  file_type: string
  uploaded_by: string
  created_at: string
}

interface DocumentListProps {
  entityType: string
  entityId: number
  onRefresh?: () => void
}

export default function DocumentList({ entityType, entityId, onRefresh }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const { success, documents, error } = await getDocumentsByEntity(entityType, entityId)

      if (success && documents) {
        setDocuments(documents)
        setFilteredDocuments(documents)
      } else {
        toast({
          title: "Error",
          description: error || "Failed to fetch documents",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [entityType, entityId])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDocuments(documents)
    } else {
      const filtered = documents.filter(
        (doc) =>
          doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.document_number && doc.document_number.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredDocuments(filtered)
    }
  }, [searchTerm, documents])

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setIsDeleting(id)
      try {
        const { success, error } = await deleteDocument(id)

        if (success) {
          toast({
            title: "Success",
            description: "Document deleted successfully",
          })
          fetchDocuments()
          if (onRefresh) onRefresh()
        } else {
          toast({
            title: "Error",
            description: error || "Failed to delete document",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting document:", error)
        toast({
          title: "Error",
          description: "Failed to delete document",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "pdf"
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "excel"
    if (fileType.includes("word") || fileType.includes("document")) return "word"
    if (fileType.includes("image")) return "image"
    return "file"
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const handlePreview = (url: string) => {
    setPreviewUrl(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents</h3>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 border border-dashed rounded-lg">
          <FileText className="h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No documents found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Badge variant="outline">{doc.document_type}</Badge>
                </TableCell>
                <TableCell className="font-medium">{doc.document_name}</TableCell>
                <TableCell>{doc.document_number || "N/A"}</TableCell>
                <TableCell>{formatDate(doc.document_date)}</TableCell>
                <TableCell>{doc.amount ? `${doc.amount} ${doc.value_unit || ""}` : "N/A"}</TableCell>
                <TableCell>{doc.uploaded_by}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handlePreview(doc.file_path)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={doc.file_path} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    disabled={isDeleting === doc.id}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-md">
              <iframe src={previewUrl} className="h-full w-full" title="Document Preview" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
