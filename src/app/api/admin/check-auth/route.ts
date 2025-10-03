import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token');

    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    try {
      // Verify the token
      jwt.verify(token.value, JWT_SECRET);
      return NextResponse.json({ isAuthenticated: true });
    } catch (error) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth Check Error:', error);
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 500 }
    );
  }
} 