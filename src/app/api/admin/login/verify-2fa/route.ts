import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { issueAdminSession, verifyTwoFactorPendingToken, TWO_FACTOR_PENDING_COOKIE } from '@/lib/adminAuth';
import { hashOtpWithSecret, constantTimeEqual } from '@/lib/otp';
import { verifyTotpToken } from '@/lib/totp';

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const adminId = verifyTwoFactorPendingToken(request);
    if (!adminId) {
      return NextResponse.json({ error: 'Login session expired, please sign in again' }, { status: 401 });
    }

    const { code } = await request.json();
    if (typeof code !== 'string' || !code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    await connectDB();
    const admin = await Admin.findById(adminId);
    if (!admin || admin.twoFactorMethod === 'none') {
      return NextResponse.json({ error: 'Login session expired, please sign in again' }, { status: 401 });
    }

    if (admin.twoFactorAttempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: 'Too many attempts. Please sign in again.' },
        { status: 429 }
      );
    }

    let isValid = false;
    if (admin.twoFactorMethod === 'totp') {
      isValid = !!admin.totpSecret && verifyTotpToken(admin.totpSecret, code);
    } else if (admin.twoFactorMethod === 'sms') {
      const notExpired = !!admin.twoFactorOtpExpires && admin.twoFactorOtpExpires.getTime() > Date.now();
      isValid = notExpired && !!admin.twoFactorOtpHash &&
        constantTimeEqual(hashOtpWithSecret(code, admin.email), admin.twoFactorOtpHash);
    }

    if (!isValid) {
      admin.twoFactorAttempts += 1;
      await admin.save();
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
    }

    // Clear any pending SMS challenge state
    admin.twoFactorOtpHash = null;
    admin.twoFactorOtpExpires = null;
    admin.twoFactorAttempts = 0;

    const token = await issueAdminSession(admin);
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
    });
    response.cookies.set(TWO_FACTOR_PENDING_COOKIE, '', { httpOnly: true, maxAge: 0 });
    return response;
  } catch (error) {
    console.error('2FA Verify Error:', error);
    return NextResponse.json({ error: 'Error verifying code' }, { status: 500 });
  }
}
