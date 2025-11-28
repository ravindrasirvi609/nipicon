import { connect } from "@/dbConfig/dbConfig";
import { PageView } from "@/Model/analyticsModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const totalPageViews = await PageView.countDocuments();

    const uniqueVisitors = await PageView.distinct(
      "sessionId"
    ).countDocuments();

    // Get average time on page
    const avgTimeAggregation = await PageView.aggregate([
      {
        $match: {
          timeOnPage: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          averageTime: { $avg: "$timeOnPage" },
        },
      },
    ]);

    const averageTimeOnPage = avgTimeAggregation[0]?.averageTime || 0;

    // Get bounce rate (sessions with only one page view)
    const bounceRateAggregation = await PageView.aggregate([
      {
        $group: {
          _id: "$sessionId",
          pageCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          bounceSessions: {
            $sum: { $cond: [{ $eq: ["$pageCount", 1] }, 1, 0] },
          },
        },
      },
    ]);

    const bounceRate = bounceRateAggregation[0]
      ? (bounceRateAggregation[0].bounceSessions /
          bounceRateAggregation[0].totalSessions) *
        100
      : 0;

    return NextResponse.json({
      totalPageViews,
      uniqueVisitors,
      averageTimeOnPage,
      bounceRate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics overview" },
      { status: 500 }
    );
  }
}
