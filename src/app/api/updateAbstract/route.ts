import AbstractModel from "@/Model/AbstractModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PATCH(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { _id, abstractFileUrl } = body;

    // Validate input
    if (!_id || !abstractFileUrl) {
      console.error(
        "Missing _id or abstractFileUrl in the request body:",
        body
      );
      return NextResponse.json(
        { message: "Missing _id or abstractFileUrl" },
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

    // Update the abstract
    abstract.Status = "InReview";
    abstract.abstractFileUrl = abstractFileUrl;
    abstract.updatedAt = new Date(); // Update the timestamp

    // Save the changes
    const updatedAbstract = await abstract.save();

    console.log(`Abstract updated successfully. _id: ${_id}`);

    return NextResponse.json({
      message: "Abstract updated successfully",
      abstract: updatedAbstract,
    });
  } catch (error: any) {
    console.error("Error updating abstract:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
