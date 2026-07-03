import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('Payment Verification Error: RAZORPAY_KEY_SECRET is not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (
      typeof razorpay_order_id !== 'string' ||
      typeof razorpay_payment_id !== 'string' ||
      typeof razorpay_signature !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    const isAuthentic = signature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json(
      { error: 'Error verifying payment' },
      { status: 500 }
    );
  }
}
