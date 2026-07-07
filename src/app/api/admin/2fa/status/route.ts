import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { maskPhone } from '@/lib/sms';

export async function GET(request: Request) {
  const payload = await verifyAdminRequest(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const admin = await Admin.findById(payload.id);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    method: admin.twoFactorMethod,
    maskedPhone: admin.phone ? maskPhone(admin.phone) : null,
  });
}
