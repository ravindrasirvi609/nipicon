import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import AbstractModel from "@/Model/AbstractModel";
import RegistrationModel from "@/Model/RegistrationModel";
import QRCode from "qrcode";
import { sendEmail } from "@/lib/mailer";
import { uploadQRCodeToFirebase } from "@/lib/firebase";

connect();

export async function POST(req: NextRequest) {
  try {
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
    const articleType = formData.get("articleType") as string;

    if (
      !email ||
      !whatsappNumber ||
      !name ||
      !affiliation ||
      !title ||
      !subject ||
      !file ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !articleType
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

    const temporyAbstractCode = await abstractCodeGeneration();
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/abstractForm/${temporyAbstractCode}`;
    const qrCodeBuffer = await QRCode.toBuffer(url);
    const qrCodeUrl = await uploadQRCodeToFirebase(
      qrCodeBuffer,
      `${temporyAbstractCode}.png`
    );

    const abstractData = {
      email,
      whatsappNumber,
      name,
      affiliation,
      coAuthor,
      designation,
      title,
      subject,
      abstractFileUrl: file,
      address,
      city,
      state,
      pincode,
      qrCodeUrl,
      temporyAbstractCode,
      articleType,
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

    await sendEmail({
      _id: newAbstract._id,
      emailType: "SUBMITTED",
    });

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

async function abstractCodeGeneration(): Promise<string> {
  const opfPrefix = "OPF";
  const year = new Date().getFullYear().toString().slice(-2);

  // Find the last abstract and get its sequence number
  const lastAbstract = await AbstractModel.findOne().sort({
    temporyAbstractCode: -1,
  });

  let sequenceNumber;
  if (lastAbstract && lastAbstract.temporyAbstractCode) {
    // Extract the sequence number from the last abstract code
    const lastSequence = parseInt(
      lastAbstract.temporyAbstractCode.slice(3, 6),
      10
    );
    sequenceNumber = (lastSequence + 1).toString().padStart(3, "0");
  } else {
    // If no abstracts exist, start from 001
    sequenceNumber = "001";
  }

  return `${opfPrefix}${sequenceNumber}${year}`;
}
