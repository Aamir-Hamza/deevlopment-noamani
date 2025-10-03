import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';

export async function POST(request: Request) {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: 'admin@perfume.com' });
    if (adminExists) {
      return NextResponse.json(
        { error: 'Admin account already exists' },
        { status: 400 }
      );
    }

    // Create admin account
    const admin = new Admin({
      email: 'admin@perfume.com',
      password: 'admin123',  // This will be hashed by the model
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