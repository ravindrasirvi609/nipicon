import AbstractModel from "@/Model/AbstractModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PATCH(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { _id, abstractFileUrl, declarationFormUrl, briefProfileUrl } = body;

    // Validate input
    if (!_id) {
      console.error("Missing _id in the request body:", body);
      return NextResponse.json({ message: "Missing _id" }, { status: 400 });
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
    if (abstractFileUrl) {
      abstract.abstractFileUrl = abstractFileUrl;
      abstract.isAbstractRevisionRequested = false;
    }
    if (declarationFormUrl) {
      abstract.declarationFormUrl = declarationFormUrl;
      abstract.isDeclarationRevisionRequested = false;
    }
    if (briefProfileUrl) {
      abstract.briefProfileUrl = briefProfileUrl;
      abstract.isProfileRevisionRequested = false;
    }

    // Only set to InReview if NO MORE revisions are requested
    if (
      !abstract.isAbstractRevisionRequested &&
      !abstract.isDeclarationRevisionRequested &&
      !abstract.isProfileRevisionRequested
    ) {
      abstract.Status = "InReview";
    }

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
