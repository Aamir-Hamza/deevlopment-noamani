import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { issueAdminSession, signTwoFactorPendingToken, TWO_FACTOR_PENDING_COOKIE } from '@/lib/adminAuth';
import { generateSixDigitOtp, hashOtpWithSecret } from '@/lib/otp';
import { sendSmsOtp, maskPhone } from '@/lib/sms';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (admin.twoFactorMethod === 'none') {
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
        maxAge: 86400, // 1 day
      });
      return response;
    }

    // 2FA is enabled — issue a short-lived pending token instead of a real
    // session, and require a second step before granting access.
    if (admin.twoFactorMethod === 'sms') {
      const otp = generateSixDigitOtp();
      admin.twoFactorOtpHash = hashOtpWithSecret(otp, admin.email);
      admin.twoFactorOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
      admin.twoFactorAttempts = 0;
      await admin.save();
      await sendSmsOtp(admin.phone, otp);
    }

    const pendingToken = signTwoFactorPendingToken(admin._id.toString());
    const response = NextResponse.json({
      success: true,
      requires2FA: true,
      method: admin.twoFactorMethod,
      ...(admin.twoFactorMethod === 'sms' ? { maskedPhone: maskPhone(admin.phone) } : {}),
    });
    response.cookies.set(TWO_FACTOR_PENDING_COOKIE, pendingToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60, // 10 minutes
    });
    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Error during login' },
      { status: 500 }
    );
  }
}
