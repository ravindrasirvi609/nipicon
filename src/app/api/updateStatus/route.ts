import AbstractModel from "@/Model/AbstractModel";
import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PATCH(req: NextRequest) {
  try {
    const { status, _id, comment, presentationType } = await req.json();

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
          presentationType
        );
        abstract.AbstractCode = abstractCode;
      }
      abstract.presentationType = presentationType;
    }

    await abstract.save();

    await sendEmail({
      _id: abstract._id,
      emailType: "UPDATE_STATUS",
    });

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
  presentationType: string
): Promise<string> {
  const subjectCodes: { [key: string]: string } = {
    pharmaceuticalTechnology: "PT",
    medChem: "PC",
    pharmacognosy: "PG",
    pharmacologyToxicology: "PH",
    pharmaceuticalAnalysis: "PA",
    biopharmaceutics: "BP",
    biotechnology: "BT",
    clinicalPharmacy: "CP",
    pharmaceuticalEducation: "PE",
    drugRegulatoryAffairs: "DR",
    pharmacoeconomics: "EEC",
    aiBioinformatics: "AI",
  };

  const subjectCode = subjectCodes[subject] || "XX";
  const presentationPrefix = presentationType === "Oral" ? "O" : "E";

  const lastAbstract = await AbstractModel.findOne({
    subject: subject,
    presentationType: presentationType,
    AbstractCode: { $regex: `^${presentationPrefix}${subjectCode}` },
  }).sort({ AbstractCode: -1 });

  let sequenceNumber = 1;

  if (lastAbstract && lastAbstract.AbstractCode) {
    const lastSequence = parseInt(lastAbstract.AbstractCode.slice(-3), 10);
    sequenceNumber = lastSequence + 1;
  }

  const paddedSequence = sequenceNumber.toString().padStart(3, "0");

  return `${presentationPrefix}${subjectCode}${paddedSequence}`;
}
