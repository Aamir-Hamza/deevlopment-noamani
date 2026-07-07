import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';

export async function POST(request: Request) {
  try {
    const payload = await verifyAdminRequest(request);
    if (payload) {
      await connectDB();
      await Admin.findByIdAndUpdate(payload.id, { activeSessionId: null });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', '', { httpOnly: true, maxAge: 0 });
    return response;
  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json({ error: 'Error during logout' }, { status: 500 });
  }
}
