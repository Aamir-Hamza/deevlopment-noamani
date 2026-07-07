import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function GET(request: Request) {
  try {
    const payload = await verifyAdminRequest(request);
    if (!payload) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }
    return NextResponse.json({ isAuthenticated: true });
  } catch (error) {
    console.error('Auth Check Error:', error);
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 500 }
    );
  }
}
