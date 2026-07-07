import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function POST(request: Request) {
  const payload = await verifyAdminRequest(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();
  if (typeof currentPassword !== 'string' || !currentPassword) {
    return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
  }
  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
  }

  await connectDB();
  const admin = await Admin.findById(payload.id);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
  }

  admin.password = newPassword;
  await admin.save();

  return NextResponse.json({ success: true });
}
