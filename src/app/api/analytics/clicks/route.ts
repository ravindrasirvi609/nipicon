// app/api/analytics/clicks/route.ts
import { connect } from "@/dbConfig/dbConfig";
import { PageView, UserClick } from "@/Model/analyticsModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

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

    const clicks = await UserClick.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $lookup: {
          from: "pageviews",
          localField: "pageViewId",
          foreignField: "_id",
          as: "pageView",
        },
      },
      {
        $unwind: "$pageView",
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          elementId: 1,
          elementClass: 1,
          elementText: 1,
          xPosition: 1,
          yPosition: 1,
          timestamp: 1,
          page: "$pageView.page",
        },
      },
    ]);

    const total = await UserClick.countDocuments({
      timestamp: { $gte: startDate },
    });

    return NextResponse.json({
      clicks,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user clicks" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    await connect();
    const body = await request.json();

    // Validate pageViewId exists
    const pageViewExists = await PageView.findById(body.pageViewId);
    if (!pageViewExists) {
      return NextResponse.json(
        { error: "PageView not found" },
        { status: 404 }
      );
    }

    const userClick = new UserClick({
      ...body,
      timestamp: new Date(),
    });

    await userClick.save();
    return NextResponse.json(userClick, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save user click" },
      { status: 500 }
    );
  }
}
