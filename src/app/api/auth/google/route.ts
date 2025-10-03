import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, name, profilePic } = await req.json(); // data you get from Google

    let user = await User.findOne({ email });

    // If user does not exist, create one (signup)
    if (!user) {
      user = await User.create({
        name,
        email,
        profilePic,
        authType: "google",
        password: "", // optional: skip password or mark as social login
      });
    }

    // Send response
    const userWithoutSensitive = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      authType: user.authType,
    };

    return NextResponse.json(
      {
        message: "Google login success",
        user: userWithoutSensitive,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json({ error: "Google login failed" }, { status: 500 });
  }
}
