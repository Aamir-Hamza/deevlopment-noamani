import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function POST(request: Request) {
  const payload = await verifyAdminRequest(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { password } = await request.json();
  if (typeof password !== 'string' || !password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  await connectDB();
  const admin = await Admin.findById(payload.id);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  admin.twoFactorMethod = 'none';
  // The TOTP secret is sensitive; require a fresh QR scan to re-enable.
  admin.totpSecret = null;
  admin.twoFactorOtpHash = null;
  admin.twoFactorOtpExpires = null;
  admin.twoFactorAttempts = 0;
  await admin.save();

  return NextResponse.json({ success: true });
}
