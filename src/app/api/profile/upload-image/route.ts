import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import multer from "multer";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Multer setup for Next.js API routes
const uploadDir = path.join(process.cwd(), "public/profile-images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage: storage });

// Helper to run multer in Next.js API route
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Use new route segment config
// export const routeSegmentConfig = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req: Request) {
  await connectDB();
  // Parse form data
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const email = formData.get("email") as string;
  if (!file || !email) {
    return NextResponse.json(
      { error: "Missing file or email" },
      { status: 400 }
    );
  }

  // Save file to disk
  const buffer: any = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  // Update user profileImage in DB
  const imageUrl = `/profile-images/${fileName}`;
  const user = await User.findOneAndUpdate(
    { email },
    { profileImage: imageUrl },
    { new: true }
  );
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ imageUrl });
}
