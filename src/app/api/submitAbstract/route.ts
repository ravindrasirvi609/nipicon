import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import AbstractModel from "@/Model/AbstractModel";
import RegistrationModel from "@/Model/RegistrationModel";
import QRCode from "qrcode";
import { uploadQRCodeToFirebase } from "@/lib/firebase";
import { sendEmail } from "@/lib/mailer";

connect();

export async function POST(req: NextRequest) {
  try {
    // Check if deadline has passed
    if (new Date() > new Date("2026-01-01T00:00:00")) {
      return NextResponse.json(
        { message: "Abstract submission deadline has passed (31st Dec 2025). New submissions are no longer accepted." },
        { status: 403 }
      );
    }
    const formData = await req.formData();
    const file = formData.get("abstractFile") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Abstract file is required" },
        { status: 400 }
      );
    }

    const email = formData.get("email") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;
    const name = formData.get("name") as string;
    const designation = formData.get("designation") as string;
    const affiliation = formData.get("affiliation") as string;
    const coAuthor = formData.get("coAuthor") as string;
    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const pincode = formData.get("pincode") as string;
    const paperType = formData.get("paperType") as string;
    const presentationType = formData.get("presentationType") as string;
    const isForeignDelegate = formData.get("isForeignDelegate") === "true";
    const declarationAccepted = formData.get("declarationAccepted") === "true";

    // Pharma Innovator Award Fields
    const isPharmaInnovatorAward =
      formData.get("isPharmaInnovatorAward") === "true";
    const supervisorName = formData.get("supervisorName") as string;
    const supervisorDesignation = formData.get(
      "supervisorDesignation"
    ) as string;
    const supervisorAffiliation = formData.get(
      "supervisorAffiliation"
    ) as string;
    const supervisorAddress = formData.get("supervisorAddress") as string;
    const supervisorEmail = formData.get("supervisorEmail") as string;
    const supervisorContact = formData.get("supervisorContact") as string;
    const declarationFormUrl = formData.get("declarationFormUrl") as string; // Assuming file upload handled on client or separate logic needed if file passed here
    const briefProfileUrl = formData.get("briefProfileUrl") as string;

    if (
      !email ||
      !whatsappNumber ||
      !name ||
      !affiliation ||
      !title ||
      (!subject && !isPharmaInnovatorAward) ||
      !file ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !paperType ||
      !presentationType
    ) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Check if an abstract with this email already exists
    const existingAbstract = await AbstractModel.findOne({ email });
    if (existingAbstract) {
      return NextResponse.json(
        { message: "An abstract with this email already exists" },
        { status: 409 }
      );
    }

    let temporyAbstractCode = "";
    temporyAbstractCode = await abstractCodeGeneration(
      isPharmaInnovatorAward
    );

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/abstractForm/${temporyAbstractCode}`;
    const qrCodeBuffer = await QRCode.toBuffer(url);

    const abstractData = {
      email,
      whatsappNumber,
      name,
      affiliation,
      coAuthor,
      designation,
      title,
      subject: isPharmaInnovatorAward ? "Pharma Innovator Award" : subject,
      abstractFileUrl: file,
      address,
      city,
      state,
      pincode,
      temporyAbstractCode,
      paperType,
      presentationType,
      isForeignDelegate,
      declarationAccepted,
      isPharmaInnovatorAward,
      supervisorName,
      supervisorDesignation,
      supervisorAffiliation,
      supervisorAddress,
      supervisorEmail,
      supervisorContact,
      declarationFormUrl,
      briefProfileUrl,
    };

    const newAbstract = new AbstractModel(abstractData);
    await newAbstract.save();

    const registration = await RegistrationModel.findOne({ email });
    let updatedAbstract = newAbstract;

    if (registration) {
      // Update the registration
      registration.abstractSubmitted = true;
      registration.abstractId = newAbstract._id;
      await registration.save();

      // Only update the abstract if registration exists and payment is completed
      if (registration.paymentStatus === "Completed") {
        updatedAbstract = await AbstractModel.findOneAndUpdate(
          { email },
          {
            registrationCompleted: true,
            registrationCode: registration.registrationCode,
          },
          { new: true }
        );
      }
    } else {
      console.log(`No registration found for email: ${email}`);
    }

    // Send confirmation email
    try {
      await sendEmail({
        _id: newAbstract._id.toString(),
        emailType: "SUBMITTED",
      });
    } catch (emailError) {
      console.error("Failed to send abstract submission email:", emailError);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json({
      message: "Abstract submitted successfully",
      abstract: updatedAbstract,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

import { getTrackCode } from "@/data";

async function abstractCodeGeneration(
  isPharmaInnovatorAward: boolean
): Promise<string> {
  if (isPharmaInnovatorAward) {
    const prefix = "PIA";
    // Find last PIA code
    const lastPIA = await AbstractModel.findOne({
      temporyAbstractCode: { $regex: `^${prefix}` },
    }).sort({ createdAt: -1 });

    let sequence = 1;
    if (lastPIA && lastPIA.temporyAbstractCode) {
      // Format: PIA01
      const codePart = lastPIA.temporyAbstractCode.slice(prefix.length);
      const lastSeq = parseInt(codePart, 10);
      if (!isNaN(lastSeq)) sequence = lastSeq + 1;
    }
    return `${prefix}${sequence.toString().padStart(2, "0")}`;
  } else {
    const prefix = "NIP";
    const year = new Date().getFullYear().toString().slice(-2);
    // Find last NIP code
    // Format: NIP00125 (Prefix + Seq + Year)
    // We search for codes starting with NIP
    const lastAbstract = await AbstractModel.findOne({
      temporyAbstractCode: { $regex: `^${prefix}` },
    }).sort({ createdAt: -1 });

    let sequenceNumber = 1;
    if (lastAbstract && lastAbstract.temporyAbstractCode) {
      // Format: NIP00125
      // Extract sequence (chars 3 to 6)
      const lastSequence = parseInt(
        lastAbstract.temporyAbstractCode.slice(3, 6),
        10
      );
      if (!isNaN(lastSequence)) {
        sequenceNumber = lastSequence + 1;
      }
    }
    return `${prefix}${sequenceNumber.toString().padStart(3, "0")}${year}`;
  }
}
