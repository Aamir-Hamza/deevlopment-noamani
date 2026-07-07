import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { verifyTwoFactorPendingToken } from '@/lib/adminAuth';
import { generateSixDigitOtp, hashOtpWithSecret } from '@/lib/otp';
import { sendSmsOtp, maskPhone } from '@/lib/sms';

export async function POST(request: Request) {
  try {
    const adminId = verifyTwoFactorPendingToken(request);
    if (!adminId) {
      return NextResponse.json({ error: 'Login session expired, please sign in again' }, { status: 401 });
    }

    await connectDB();
    const admin = await Admin.findById(adminId);
    if (!admin || admin.twoFactorMethod !== 'sms') {
      return NextResponse.json({ error: 'Not applicable for this account' }, { status: 400 });
    }

    const otp = generateSixDigitOtp();
    admin.twoFactorOtpHash = hashOtpWithSecret(otp, admin.email);
    admin.twoFactorOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    admin.twoFactorAttempts = 0;
    await admin.save();
    await sendSmsOtp(admin.phone, otp);

    return NextResponse.json({ success: true, maskedPhone: maskPhone(admin.phone) });
  } catch (error) {
    console.error('2FA Resend Error:', error);
    return NextResponse.json({ error: 'Error resending code' }, { status: 500 });
  }
}
