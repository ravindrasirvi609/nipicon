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
      if (!presentationType) {
        return NextResponse.json(
          { message: "Presentation type is required for accepted abstracts" },
          { status: 400 }
        );
      }
      if (!abstract.AbstractCode) {
        const abstractCode = await generateAbstractCode(
          abstract.subject,
          abstract.isPharmaInnovatorAward,
          presentationType
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
  isPharmaInnovatorAward: boolean,
  presentationType: string
): Promise<string> {
  let trackCode = "NIP";

  if (isPharmaInnovatorAward) {
    trackCode = "PI";
  } else {
    // Use getTrackCode from data.ts to get the prefix (e.g., NA, PC)
    trackCode = getTrackCode(subject);
  }

  // Get presentation type indicator: O for Oral, P for Poster
  const typeIndicator = presentationType === "Oral" ? "O" : "P";

  // The full prefix is TRACKCODE + TYPE (e.g., PAO, PAP, PIO, PIP)
  const fullPrefix = `${trackCode}${typeIndicator}`;

  // Find the max sequence number used for this presentation type across ALL tracks
  // Pattern: Any 2 chars + typeIndicator + 3 digits (e.g. ..O123)
  const aggregationResult = await AbstractModel.aggregate([
    {
      $match: {
        AbstractCode: { $regex: `^..${typeIndicator}\\d{3}$` },
        Status: "Accepted",
      },
    },
    {
      $project: {
        // Extract the last 3 characters as integer
        sequence: {
          $toInt: { $substr: ["$AbstractCode", 3, 3] }, // offset 3, length 3
        },
      },
    },
    { $sort: { sequence: -1 } },
    { $limit: 1 },
  ]);

  let sequenceNumber = 1;

  if (aggregationResult.length > 0 && !isNaN(aggregationResult[0].sequence)) {
    sequenceNumber = aggregationResult[0].sequence + 1;
  }

  const paddedSequence = sequenceNumber.toString().padStart(3, "0");

  return `${fullPrefix}${paddedSequence}`;
}
