import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';

// One-time bootstrap endpoint for creating the first admin account.
// Requires a private setup token plus credentials from environment
// variables — nothing here is hardcoded or guessable.
export async function POST(request: Request) {
  try {
    const setupToken = process.env.ADMIN_SETUP_TOKEN;
    const adminEmail = process.env.ADMIN_SETUP_EMAIL;
    const adminPassword = process.env.ADMIN_SETUP_PASSWORD;

    if (!setupToken || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: 'Admin setup is not configured' },
        { status: 500 }
      );
    }

    const { token } = await request.json().catch(() => ({ token: undefined }));
    if (token !== setupToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (adminExists) {
      return NextResponse.json(
        { error: 'Admin account already exists' },
        { status: 400 }
      );
    }

    // Create admin account
    const admin = new Admin({
      email: adminEmail,
      password: adminPassword, // This will be hashed by the model
      name: 'Admin',
      role: 'admin',
    });

    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
    });
  } catch (error) {
    console.error('Admin Setup Error:', error);
    return NextResponse.json(
      { error: 'Error creating admin account' },
      { status: 500 }
    );
  }
}
