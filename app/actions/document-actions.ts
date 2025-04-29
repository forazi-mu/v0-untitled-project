"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function saveDocumentMetadata(
  documentType: string,
  documentName: string,
  documentNumber: string | null,
  documentDate: string | null,
  amount: number | null,
  valueUnit: string | null,
  filePath: string,
  fileType: string,
  relatedEntityType: string,
  relatedEntityId: number,
  userId: string,
) {
  try {
    const result = await sql`
      INSERT INTO documents (
        document_type, 
        document_name, 
        document_number, 
        document_date, 
        amount, 
        value_unit, 
        file_path, 
        file_type, 
        related_entity_type, 
        related_entity_id, 
        created_by
      )
      VALUES (
        ${documentType}, 
        ${documentName}, 
        ${documentNumber}, 
        ${documentDate ? new Date(documentDate) : null}, 
        ${amount}, 
        ${valueUnit}, 
        ${filePath}, 
        ${fileType}, 
        ${relatedEntityType}, 
        ${relatedEntityId}, 
        ${userId}
      )
      RETURNING id
    `

    // Revalidate the documents page for the entity
    revalidatePath(`/${relatedEntityType}/${relatedEntityId}`)

    return { success: true, documentId: result[0].id }
  } catch (error) {
    console.error("Error saving document metadata:", error)
    return { success: false, error: "Failed to save document metadata" }
  }
}

export async function getDocumentsByEntity(entityType: string, entityId: number) {
  try {
    const documents = await sql`
      SELECT 
        d.*,
        u.full_name as uploaded_by
      FROM 
        documents d
      LEFT JOIN
        users u ON d.created_by = u.id
      WHERE 
        d.related_entity_type = ${entityType}
        AND d.related_entity_id = ${entityId}
      ORDER BY 
        d.created_at DESC
    `

    return { success: true, documents }
  } catch (error) {
    console.error("Error fetching documents:", error)
    return { success: false, error: "Failed to fetch documents" }
  }
}

export async function deleteDocument(documentId: number) {
  try {
    // Get document info first to get the file path
    const document = await sql`
      SELECT * FROM documents WHERE id = ${documentId}
    `

    if (document.length === 0) {
      return { success: false, error: "Document not found" }
    }

    // Delete from database
    await sql`
      DELETE FROM documents WHERE id = ${documentId}
    `

    // Note: We would also delete from Vercel Blob here, but we'll handle that separately

    // Revalidate the documents page for the entity
    revalidatePath(`/${document[0].related_entity_type}/${document[0].related_entity_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting document:", error)
    return { success: false, error: "Failed to delete document" }
  }
}
