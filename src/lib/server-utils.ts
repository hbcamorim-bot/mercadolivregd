import path from "path";
import fs from "fs/promises";

export async function saveUploadedFile(
  file: File,
  prefix: string
): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = file.name.split(".").pop() || "bin";
  const filename = `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;
  const filepath = path.join(uploadsDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}
