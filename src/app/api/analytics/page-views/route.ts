import { connect } from "@/dbConfig/dbConfig";
import { PageView } from "@/Model/analyticsModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d"; // default to 7 days

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

    const pageViews = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return NextResponse.json(pageViews);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch page views" },
      { status: 500 }
    );
  }
}
