import { connect } from "@/dbConfig/dbConfig";
import { PageView } from "@/Model/analyticsModel";
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

    // Average load times
    const loadTimes = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
          loadTime: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          avgLoadTime: { $avg: "$loadTime" },
          avgFirstPaint: { $avg: "$firstPaint" },
          avgFirstContentfulPaint: { $avg: "$firstContentfulPaint" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Performance by connection type
    const connectionPerformance = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
          connectionType: { $exists: true, $ne: null },
          loadTime: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$connectionType",
          avgLoadTime: { $avg: "$loadTime" },
          avgBandwidth: { $avg: "$effectiveBandwidth" },
        },
      },
    ]);

    return NextResponse.json({
      loadTimes,
      connectionPerformance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch performance metrics" },
      { status: 500 }
    );
  }
}
