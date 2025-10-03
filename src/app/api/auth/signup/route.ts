import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";

async function sendWelcomeEmail(to: string, name: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "user@example.com",
      pass: process.env.SMTP_PASS || "password",
    },
  });

  await transporter.sendMail({
    from: "Noamani Perfume <no-reply@noamaniperfume.com>",
    to,
    subject: "Welcome to Noamani Perfume!",
    html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;background:#fffbe6;border-radius:12px;border:1px solid #ffd700;">
      <h2 style="color:#bfa14a;">Welcome, ${name || "Valued Customer"}!</h2>
      <p>Thank you for registering at <b>Noamani Perfume</b>. Your account was created successfully.</p>
      <p>We're excited to have you as part of our fragrance family. Explore our collection and enjoy a world of luxury scents!</p>
      <p style="margin-top:32px;font-size:14px;color:#888;">If you did not create this account, please ignore this email.</p>
      <div style="margin-top:24px;text-align:center;"><img src="https://noamaniperfume.com/logo.png" alt="Noamani Perfume" style="height:48px;" /></div>
    </div>`,
  });
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      authType: "local",
    });

    // Remove sensitive fields
    const userWithoutSensitive = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (e) {
      console.error("Failed to send welcome email:", e);
    }

    return NextResponse.json(
      {
        message: "Signup successful",
        user: userWithoutSensitive,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
