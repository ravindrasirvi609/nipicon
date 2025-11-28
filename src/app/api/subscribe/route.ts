import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Subscribe from "@/Model/SubscribeModel";

connect();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Check if email already exists
    const existingSubscription = await Subscribe.findOne({ email });
    if (existingSubscription) {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 400 }
      );
    }

    // Create new subscription
    const newSubscription = new Subscribe({ email });
    await newSubscription.save();

    return NextResponse.json(
      { message: "Subscription successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { message: "Error subscribing to the newsletter" },
      { status: 500 }
    );
  }
}
