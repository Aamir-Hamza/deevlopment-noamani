import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { verifyTotpToken } from '@/lib/totp';

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
  if (!admin || !admin.totpSecret) {
    return NextResponse.json({ error: 'Start setup first' }, { status: 400 });
  }

  if (!verifyTotpToken(admin.totpSecret, code)) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  admin.twoFactorMethod = 'totp';
  await admin.save();

  return NextResponse.json({ success: true });
}
