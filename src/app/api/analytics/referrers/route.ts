import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { PageView } from "@/Model/analyticsModel";

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

    const referrers = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
          referrer: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    return NextResponse.json(referrers);
  } catch (error) {
    console.error("Error fetching referrers:", error);
    return NextResponse.json(
      { error: "Failed to fetch referrer details" },
      { status: 500 }
    );
  }
}
