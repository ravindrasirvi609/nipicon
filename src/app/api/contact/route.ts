import Contact from "@/Model/contactModel";
import { connect } from "@/dbConfig/dbConfig";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

connect();

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const { name, email, message, mobile } = await req.json();

    // Generate a unique registration ID
    const registrationId = new mongoose.Types.ObjectId().toString();

    // Create a unique URL for the student
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/Contact/${registrationId}`;

    const qrCodeUrl = await QRCode.toDataURL(url);

    const student = new Contact({
      name,
      email,
      message,
      registrationId,
      qrCodeUrl,
      mobile,
    });

    await student.save();

    const apiKey = process.env.RESEND_API_KEY;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "psc@pharmanecia.org",
        to: "info@pharmanecia.org",
        subject: "New Contact Received",
        html: `A new contact has been received from ${name} with email ${email} and mobile ${mobile}. The message is: ${message}`,
      }),
    });

    return NextResponse.json({ registrationId, url, qrCodeUrl });
  } else {
    return NextResponse.json({ message: "Method not allowed" });
  }
}
