import Sponsor from "@/Model/SponsorModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
    });
  }

  try {
    const { name, email, phone, category, message, company } = await req.json();

    if (!name || !email || !phone || !category || !message || !company) {
      return new NextResponse(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const sponsor = new Sponsor({
      name,
      email,
      phone,
      category,
      message,
      company,
    });

    const newSponsor = await sponsor.save();

    return new NextResponse(
      JSON.stringify({
        message: "Sponsorship request submitted successfully",
        newSponsor,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
