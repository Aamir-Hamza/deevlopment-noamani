import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashOtpWithSecret, constantTimeEqual } from '@/lib/otp';
import bcrypt from 'bcryptjs';
import { sendResetSuccessEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp, newPassword } = await req.json();

    const normalizedEmail = String(email || '').toLowerCase().trim();
    const code = String(otp || '').trim();
    const pwd = String(newPassword || '');

    if (!normalizedEmail || !code || !pwd) {
      return NextResponse.json({ message: 'Email, OTP and new password are required' }, { status: 400 });
    }
    if (pwd.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpires) {
      return NextResponse.json({ message: 'Invalid OTP or expired' }, { status: 400 });
    }

    if (user.passwordResetOtpAttempts >= 5) {
      user.passwordResetOtpHash = undefined as any;
      user.passwordResetOtpExpires = undefined as any;
      user.passwordResetOtpAttempts = 0;
      await user.save();
      return NextResponse.json({ message: 'Too many attempts. Please request a new OTP.' }, { status: 400 });
    }

    if (user.passwordResetOtpExpires < new Date()) {
      user.passwordResetOtpHash = undefined as any;
      user.passwordResetOtpExpires = undefined as any;
      user.passwordResetOtpAttempts = 0;
      await user.save();
      return NextResponse.json({ message: 'OTP expired. Please request a new OTP.' }, { status: 400 });
    }

    const providedHash = hashOtpWithSecret(code, normalizedEmail);
    const valid = constantTimeEqual(providedHash, user.passwordResetOtpHash);
    if (!valid) {
      user.passwordResetOtpAttempts += 1;
      await user.save();
      return NextResponse.json({ message: 'Invalid OTP', attemptsRemaining: Math.max(0, 5 - user.passwordResetOtpAttempts) }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(pwd, salt);
    user.passwordResetOtpHash = undefined as any;
    user.passwordResetOtpExpires = undefined as any;
    user.passwordResetOtpAttempts = 0;
    await user.save();

    try { await sendResetSuccessEmail(normalizedEmail); } catch {}

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


