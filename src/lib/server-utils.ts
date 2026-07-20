import { randomUUID } from "crypto"
import fs from "fs/promises"
import path from "path"

const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
}

const privateUploadsDirectory = path.join(process.cwd(), ".data", "uploads")

export async function saveUploadedFile(file: File, prefix: string): Promise<string> {
  const extension = ALLOWED_TYPES[file.type]
  if (!extension) throw new Error("Tipo de arquivo não permitido. Envie PDF, JPG ou PNG.")
  if (file.size <= 0 || file.size > MAX_FILE_SIZE) throw new Error("O arquivo deve ter no máximo 8 MB.")

  await fs.mkdir(privateUploadsDirectory, { recursive: true })
  const safePrefix = prefix.replace(/[^a-z0-9_-]/gi, "").slice(0, 24) || "file"
  const filename = `${safePrefix}_${randomUUID()}.${extension}`
  await fs.writeFile(path.join(privateUploadsDirectory, filename), Buffer.from(await file.arrayBuffer()), {
    flag: "wx",
    mode: 0o600,
  })

  return `/api/admin/files/${filename}`
}

export function resolvePrivateUpload(filename: string) {
  const safeName = path.basename(filename)
  if (safeName !== filename || !/^[a-z0-9_-]+\.(pdf|jpg|png)$/i.test(safeName)) {
    throw new Error("Nome de arquivo inválido.")
  }
  return path.join(privateUploadsDirectory, safeName)
}

export async function deleteStoredFile(fileUrl: string | null) {
  if (!fileUrl) return
  try {
    if (fileUrl.startsWith("/api/admin/files/")) {
      await fs.unlink(resolvePrivateUpload(fileUrl.slice("/api/admin/files/".length)))
      return
    }
    if (fileUrl.startsWith("/uploads/")) {
      await fs.unlink(path.join(process.cwd(), "public", "uploads", path.basename(fileUrl)))
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
  }
}
