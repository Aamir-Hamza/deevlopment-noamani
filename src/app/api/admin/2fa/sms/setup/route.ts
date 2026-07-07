import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { generateSixDigitOtp, hashOtpWithSecret } from '@/lib/otp';
import { sendSmsOtp, maskPhone } from '@/lib/sms';

const E164_REGEX = /^\+[1-9]\d{7,14}$/;

export async function POST(request: Request) {
  const payload = await verifyAdminRequest(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { phone } = await request.json();
  if (typeof phone !== 'string' || !E164_REGEX.test(phone)) {
    return NextResponse.json(
      { error: 'Enter a valid phone number in international format, e.g. +14155552671' },
      { status: 400 }
    );
  }

  await connectDB();
  const admin = await Admin.findById(payload.id);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  admin.phone = phone;
  const otp = generateSixDigitOtp();
  admin.twoFactorOtpHash = hashOtpWithSecret(otp, admin.email);
  admin.twoFactorOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  admin.twoFactorAttempts = 0;
  await admin.save();
  await sendSmsOtp(phone, otp);

  return NextResponse.json({ success: true, maskedPhone: maskPhone(phone) });
}
