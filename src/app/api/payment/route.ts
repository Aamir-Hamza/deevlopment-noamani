import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_Y1SVuHN3IsyjgD',
  key_secret: 'JLzuhoxBn82XUjZTJxqLsZ6r',
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

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