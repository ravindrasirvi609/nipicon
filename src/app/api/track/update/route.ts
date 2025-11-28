import { connect } from "@/dbConfig/dbConfig";
import { PageView } from "@/Model/analyticsModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { id, timeOnPage, scrollDepth, exitPage } = await req.json();

    const pageView = await PageView.findByIdAndUpdate(
      id,
      { timeOnPage, scrollDepth, exitPage },
      { new: true }
    );

    return NextResponse.json({ success: true, pageView });
  } catch (error) {
    console.error("Update tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tracking" },
      { status: 500 }
    );
  }
}
