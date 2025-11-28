import { connect } from "@/dbConfig/dbConfig";
import RegistrationModel from "@/Model/RegistrationModel";
import { NextResponse } from "next/server";

connect();

export async function GET() {
  try {
    const registrations = await RegistrationModel.find({}).sort({
      createdAt: -1,
    });

    const response = NextResponse.json(registrations);
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
