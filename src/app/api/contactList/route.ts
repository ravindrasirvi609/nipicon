import Contact from "@/Model/contactModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest) {
  try {
    const cacheBuster = Date.now();
    const contacts = await Contact.find();

    return NextResponse.json({ success: true, contacts, cacheBuster });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
}
