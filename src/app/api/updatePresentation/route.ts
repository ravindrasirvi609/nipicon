import AbstractModel from "@/Model/AbstractModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PATCH(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { _id, presentationFileUrl } = body;

    // Validate input
    if (!_id || !presentationFileUrl) {
      console.error(
        "Missing _id or presentationFileUrl in the request body:",
        body
      );
      return NextResponse.json(
        { message: "Missing _id or presentationFileUrl" },
        { status: 400 }
      );
    }

    // Find the abstract
    const abstract = await AbstractModel.findById(_id);
    if (!abstract) {
      console.error(`Abstract not found with _id: ${_id}`);
      return NextResponse.json(
        { message: "Abstract not found" },
        { status: 404 }
      );
    }

    // Update the abstract with presentation file URL and status
    abstract.presentationFileUrl = presentationFileUrl;
    abstract.presentationFileStatus = "InReview"; // Set initial status
    abstract.updatedAt = new Date();

    // Save the changes
    const updatedAbstract = await abstract.save();

    console.log(`Presentation file updated successfully. _id: ${_id}`);

    return NextResponse.json({
      message: "Presentation file updated successfully",
      abstract: updatedAbstract,
    });
  } catch (error: any) {
    console.error("Error updating presentation file:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
