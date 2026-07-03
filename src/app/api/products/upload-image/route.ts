import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { verifyAdminRequest } from "@/lib/adminAuth";

const uploadDir = path.join(process.cwd(), "public/product-images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file found" }, { status: 400 });
  }

  const extension = ALLOWED_MIME_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Unsupported file type. Only JPEG, PNG, WEBP and GIF images are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File is too large (max 5MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Filename is fully server-generated — the client-supplied name is never
  // used for the path, which rules out path traversal / arbitrary write.
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = `${uniqueSuffix}.${extension}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  const imageUrl = `/product-images/${fileName}`;

  return NextResponse.json({ imageUrl });
}
