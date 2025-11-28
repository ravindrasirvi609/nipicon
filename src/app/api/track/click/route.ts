import { connect } from "@/dbConfig/dbConfig";
import { UserClick } from "@/Model/analyticsModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const clickData = await req.json();

    const userClick = await UserClick.create(clickData);
    return NextResponse.json({ success: true, id: userClick._id });
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track click" },
      { status: 500 }
    );
  }
}
