import { connect } from "@/dbConfig/dbConfig";
import NominationModel from "@/Model/NominationModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connect();

    // Parse the request body
    const formData = await req.json();

    // Validate required fields
    const requiredFields = [
      "fullName",
      "dateOfBirth",
      "aadharNumber",
      "organization",
      "position",
      "email",
      "whatsappNumber",
      "category",
      "subCategory",
      "professionalAchievements",
      "innovations",
      "nominationStatement",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create a new nomination document
    const nomination = new NominationModel(formData);

    // Save the nomination to the database
    await nomination.save();

    return NextResponse.json(
      { message: "Nomination submitted successfully", id: nomination._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting nomination:", error);

    if (error instanceof Error) {
      // Handle specific error types
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { message: "Validation error", details: error.message },
          { status: 400 }
        );
      } else if (
        error.name === "MongoServerError" &&
        (error as any).code === 11000
      ) {
        return NextResponse.json(
          {
            message: "Duplicate entry error",
            details:
              "A nomination with this Aadhar number or email already exists",
          },
          { status: 409 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { message: "An error occurred while submitting the nomination" },
      { status: 500 }
    );
  }
}
