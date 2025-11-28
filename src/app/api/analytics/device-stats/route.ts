import { connect } from "@/dbConfig/dbConfig";
import { PageView } from "@/Model/analyticsModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    const now = new Date();
    const periodMap: { [key: string]: number } = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
    };

    const startDate = new Date(
      now.setDate(now.getDate() - (periodMap[period] || 30))
    );

    // Device types distribution
    const deviceTypes = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$deviceType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Browser usage
    const browsers = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 },
        },
      },
    ]);

    // Operating systems
    const operatingSystems = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$os",
          count: { $sum: 1 },
        },
      },
    ]);

    // Screen resolutions
    const screenResolutions = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$screenResolution",
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      deviceTypes,
      browsers,
      operatingSystems,
      screenResolutions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch device statistics" },
      { status: 500 }
    );
  }
}
