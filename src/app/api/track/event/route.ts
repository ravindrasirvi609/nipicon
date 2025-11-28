import { connect } from "@/dbConfig/dbConfig";
import { PageView, UserEvent } from "@/Model/analyticsModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const eventData = await req.json();

    const userEvent = await UserEvent.create(eventData);
    return NextResponse.json({ success: true, id: userEvent._id });
  } catch (error) {
    console.error("Event tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track event" },
      { status: 500 }
    );
  }
}
