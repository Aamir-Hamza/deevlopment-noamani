import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { hashOtpWithSecret, constantTimeEqual } from '@/lib/otp';

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  const payload = await verifyAdminRequest(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { code } = await request.json();
  if (typeof code !== 'string' || !code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  await connectDB();
  const admin = await Admin.findById(payload.id);
  if (!admin || !admin.phone || !admin.twoFactorOtpHash) {
    return NextResponse.json({ error: 'Start setup first' }, { status: 400 });
  }

  if (admin.twoFactorAttempts >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: 'Too many attempts. Start setup again.' }, { status: 429 });
  }

  const notExpired = !!admin.twoFactorOtpExpires && admin.twoFactorOtpExpires.getTime() > Date.now();
  const isValid = notExpired && constantTimeEqual(hashOtpWithSecret(code, admin.email), admin.twoFactorOtpHash);

  if (!isValid) {
    admin.twoFactorAttempts += 1;
    await admin.save();
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
  }

  admin.twoFactorMethod = 'sms';
  admin.twoFactorOtpHash = null;
  admin.twoFactorOtpExpires = null;
  admin.twoFactorAttempts = 0;
  await admin.save();

  return NextResponse.json({ success: true });
}
