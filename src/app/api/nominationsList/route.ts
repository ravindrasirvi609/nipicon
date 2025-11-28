import { connect } from "@/dbConfig/dbConfig";
import NominationModel from "@/Model/NominationModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connect();

    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch nominations with pagination
    const nominations = await NominationModel.find({})
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count of nominations
    const totalCount = await NominationModel.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        nominations,
        currentPage: page,
        totalPages,
        totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching nominations:", error);

    return NextResponse.json(
      { message: "An error occurred while fetching nominations" },
      { status: 500 }
    );
  }
}
