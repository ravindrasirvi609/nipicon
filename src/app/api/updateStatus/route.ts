import AbstractModel from "@/Model/AbstractModel";
import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";
import { getTrackCode } from "@/data";

connect();

export async function PATCH(req: NextRequest) {
  try {
    const { status, _id, comment, presentationType, revisions } =
      await req.json();

    if (!_id || !status) {
      console.error("Missing _id or status in the request");
      return NextResponse.json(
        { message: "Missing id or status" },
        { status: 400 }
      );
    }

    const abstract = await AbstractModel.findById(_id);

    if (!abstract) {
      console.error("Abstract not found with _id:", _id);
      return NextResponse.json(
        { message: "Abstract not found" },
        { status: 404 }
      );
    }

    // Update the status
    abstract.Status = status;

    // Add comment if status is Revision
    if (status === "Revision") {
      abstract.rejectionComment = comment;
      if (revisions) {
        abstract.isAbstractRevisionRequested = !!revisions.abstract;
        abstract.isDeclarationRevisionRequested = !!revisions.declaration;
        abstract.isProfileRevisionRequested = !!revisions.profile;
      }
    }

    if (status === "Accepted") {
      if (!abstract.AbstractCode) {
        if (!presentationType) {
          return NextResponse.json(
            { message: "Presentation type is required for accepted abstracts" },
            { status: 400 }
          );
        }
        const abstractCode = await generateAbstractCode(
          abstract.subject,
          abstract.isPharmaInnovatorAward
        );
        abstract.AbstractCode = abstractCode;
      }
      abstract.presentationType = presentationType;
    }

    await abstract.save();

    // Send status update email
    try {
      await sendEmail({
        _id: abstract._id.toString(),
        emailType: "UPDATE_STATUS",
      });
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json({
      message: "Status updated successfully",
      abstract,
    });
  } catch (error: any) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.toString() },
      { status: 500 }
    );
  }
}
async function generateAbstractCode(
  subject: string,
  isPharmaInnovatorAward: boolean
): Promise<string> {
  let prefix = "NIP";

  if (isPharmaInnovatorAward) {
    prefix = "PIA";
  } else {
    // Use getTrackCode from data.ts to get the prefix (e.g., NA, PC)
    prefix = getTrackCode(subject);
  }

  // Find the last abstract that has a Final AbstractCode starting with this prefix
  const lastAbstract = await AbstractModel.findOne({
    AbstractCode: { $regex: `^${prefix}` },
  }).sort({ AbstractCode: -1 });

  let sequenceNumber = 1;

  if (lastAbstract && lastAbstract.AbstractCode) {
    // Extract sequence number
    // Format is likely PREFIX + 3 digits (e.g., NA001)
    // We slice off the prefix length
    const codePart = lastAbstract.AbstractCode.slice(prefix.length);
    const lastSequence = parseInt(codePart, 10);

    if (!isNaN(lastSequence)) {
      sequenceNumber = lastSequence + 1;
    }
  }

  const paddedSequence = sequenceNumber.toString().padStart(3, "0");

  return `${prefix}${paddedSequence}`;
}
