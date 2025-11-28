import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { PageView } from "@/Model/analyticsModel";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const data = await req.json();
    const headersList = await headers();
    console.log("data", data);

    const pageView = await PageView.create({
      ...data,
      ip: headersList.get("x-forwarded-for") || headersList.get("x-real-ip"),
      country: headersList.get("x-vercel-ip-country"),
      language: headersList.get("accept-language"),
    });

    return NextResponse.json({ success: true, id: pageView._id });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track" },
      { status: 500 }
    );
  }
}
