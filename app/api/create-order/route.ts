import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    
    const options = {
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
    };
    
    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({
      order_id: order.id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}