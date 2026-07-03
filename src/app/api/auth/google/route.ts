import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyFirebaseIdToken } from "@/lib/verifyFirebaseToken";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { idToken } = await req.json();

    // Identity must come from a verified Firebase ID token — never trust
    // client-submitted email/name fields directly, or anyone could POST
    // an arbitrary email here and be treated as that user.
    const verified = await verifyFirebaseIdToken(idToken);
    if (!verified) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { email, name, picture } = verified;

    let user = await User.findOne({ email });

    // If user does not exist, create one (signup)
    if (!user) {
      user = await User.create({
        name,
        email,
        profilePic: picture,
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
