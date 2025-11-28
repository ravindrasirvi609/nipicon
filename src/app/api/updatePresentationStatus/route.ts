import AbstractModel from "@/Model/AbstractModel";
import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const { status, comment } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const abstract = await AbstractModel.findById(id);
    if (!abstract) {
      return NextResponse.json(
        { message: "Abstract not found" },
        { status: 404 }
      );
    }

    abstract.presentationFileStatus = status;
    if (comment) {
      abstract.presentationRejectionComment = comment;
    }
    abstract.updatedAt = new Date();

    await abstract.save();
    await sendEmail({
      _id: abstract._id,
      emailType: "UPDATE_PERSENTATION_STATUS",
    });
    return NextResponse.json({
      message: "Presentation status updated successfully",
      abstract,
    });
  } catch (error: any) {
    console.error("Error updating presentation status:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
