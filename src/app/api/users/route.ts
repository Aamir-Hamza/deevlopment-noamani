import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const users = await User.find({}).select(
      "-password -passwordResetToken -passwordResetExpires -passwordResetOtpHash -passwordResetOtpExpires"
    );
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
