import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateSixDigitOtp, hashOtpWithSecret } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';

// Simple in-memory rate limit by IP (per runtime instance)
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 min
const RATE_MAX = 10;
const ipHits: Record<string, { count: number; windowStart: number }> = {};

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = ipHits[ip];
  if (!rec || now - rec.windowStart > RATE_WINDOW_MS) {
    ipHits[ip] = { count: 1, windowStart: now };
    return true;
  }
  if (rec.count >= RATE_MAX) return false;
  rec.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    await connectDB();
    const { email } = await req.json();
    const normalizedEmail = String(email || '').toLowerCase().trim();
    if (!normalizedEmail) return NextResponse.json({ message: 'If an account exists, an OTP has been sent.' });

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // always generic
      return NextResponse.json({ message: 'If an account exists, an OTP has been sent.' });
    }

    const otp = generateSixDigitOtp();
    const otpHash = hashOtpWithSecret(otp, normalizedEmail);
    user.passwordResetOtpHash = otpHash;
    user.passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    user.passwordResetOtpAttempts = 0;
    await user.save();

    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (e) {
      console.warn('Failed to send OTP email:', e);
    }

    return NextResponse.json({ message: 'If an account exists, an OTP has been sent.' });
  } catch (error) {
    return NextResponse.json({ message: 'If an account exists, an OTP has been sent.' });
  }
}


