import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    // Customer-facing requests pass userEmail and must only see their own
    // orders. Omitting it returns every order, so that path is admin-only.
    if (!userEmail && !verifyAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // This endpoint is only ever called after a Razorpay payment succeeds.
    // Re-verify the signature server-side here — the client cannot be
    // trusted to only call this after actually paying, so without this
    // check anyone could POST a fabricated "completed" order for free.
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = orderData.paymentInfo || {};
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      console.error('Order Creation Error: RAZORPAY_KEY_SECRET is not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (
      typeof razorpayOrderId !== 'string' ||
      typeof razorpayPaymentId !== 'string' ||
      typeof razorpaySignature !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Missing payment verification details' },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

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
