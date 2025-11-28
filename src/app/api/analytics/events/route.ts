import { connect } from "@/dbConfig/dbConfig";
import { PageView, UserEvent } from "@/Model/analyticsModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const eventType = searchParams.get("eventType");
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

    const matchQuery: any = {
      timestamp: { $gte: startDate },
    };

    if (eventType) {
      matchQuery.eventType = eventType;
    }

    const events = await UserEvent.aggregate([
      {
        $match: matchQuery,
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
          eventType: 1,
          eventCategory: 1,
          eventAction: 1,
          eventLabel: 1,
          eventValue: 1,
          timestamp: 1,
          page: "$pageView.page",
        },
      },
    ]);

    const total = await UserEvent.countDocuments(matchQuery);

    return NextResponse.json({
      events,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user events" },
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

    const userEvent = new UserEvent({
      ...body,
      timestamp: new Date(),
    });

    await userEvent.save();
    return NextResponse.json(userEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save user event" },
      { status: 500 }
    );
  }
}
