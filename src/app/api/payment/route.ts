import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error('Payment Error: Razorpay keys are not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const { amount } = await request.json();

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: 'order_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: amount,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Payment Error:', error);
    return NextResponse.json(
      { error: 'Error creating payment order' },
      { status: 500 }
    );
  }
} 