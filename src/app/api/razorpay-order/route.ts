import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { amount } = await req.json();

    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Initialize Razorpay object
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY!,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // Create an order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise and ensure it's an integer
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1,
    };

    const response = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } }
  );
}
