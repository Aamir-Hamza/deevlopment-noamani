import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET() {
  try {
    await connectDB();

    // Fetch all orders with payment info
    const transactions = await Order.find({
      'paymentInfo.razorpayPaymentId': { $exists: true }
    }).sort({ createdAt: -1 });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Error fetching transactions' },
      { status: 500 }
    );
  }
} 