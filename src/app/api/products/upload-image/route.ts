import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import multer from "multer";

const uploadDir = path.join(process.cwd(), "public/product-images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file found" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = uniqueSuffix + "-" + file.name.replace(/\s+/g, "_");
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  const imageUrl = `/product-images/${fileName}`;

  return NextResponse.json({ imageUrl });
} 