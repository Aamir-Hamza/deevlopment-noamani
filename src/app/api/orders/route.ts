import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    // Customer-facing requests pass userEmail and must only see their own
    // orders. Admin views omit it and intentionally get everything.
    const query = userEmail ? { 'paymentInfo.email': userEmail } : {};
    const orders = await Order.find(query).populate('items.productId');
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Ensure database connection
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.DATABASE_URL || '');
    }

    const orderData = await request.json();
    
    // Create new order
    const order = new Order(orderData);
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order Creation Error:', error);
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    );
  }
} 