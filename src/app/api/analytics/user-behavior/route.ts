import { connect } from "@/dbConfig/dbConfig";
import { PageView, UserClick, UserEvent } from "@/Model/analyticsModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";

    const now = new Date();
    const periodMap: { [key: string]: number } = {
      "24h": 1,
      "7d": 7,
      "30d": 30,
      "90d": 90,
    };

    const startDate = new Date(
      now.setDate(now.getDate() - (periodMap[period] || 7))
    );

    // Most visited pages
    const topPages = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$page",
          visits: { $sum: 1 },
        },
      },
      {
        $sort: { visits: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Click heatmap data
    const clickData = await UserClick.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            x: { $round: ["$xPosition", -1] },
            y: { $round: ["$yPosition", -1] },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // User events summary
    const eventsSummary = await UserEvent.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            type: "$eventType",
            category: "$eventCategory",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      topPages,
      clickData,
      eventsSummary,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user behavior data" },
      { status: 500 }
    );
  }
}
