import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).populate('items.productId');
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