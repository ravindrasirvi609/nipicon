import { connect } from "@/dbConfig/dbConfig";
import { uploadQRCodeToFirebase } from "@/lib/firebase";
import AbstractModel from "@/Model/AbstractModel";
import RegistrationModel from "@/Model/RegistrationModel";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { sendEmail } from "@/lib/mailer";

connect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      Salutations,
      dob,
      institute,
      gender,
      email,
      whatsappNumber,
      name,
      firstName,
      lastName,
      affiliation,
      designation,
      imageUrl,
      address,
      city,
      state,
      pincode,
      country,
      registrationType,
      applyingAs,
      registeringAs,
      idCardUrl,
      abstractSubmitted,
      abstractId,
      memberId,
      paymentAmount,
      transactionId,
      bankName,
      branchName,
      paymentDate,
      paymentProofUrl,
    } = body;

    const newRegistration = new RegistrationModel({
      Salutations,
      dob,
      institute,
      gender,
      email,
      whatsappNumber,
      name,
      firstName,
      lastName,
      affiliation,
      designation,
      imageUrl,
      address,
      city,
      state,
      pincode,
      country,
      registrationType,
      applyingAs,
      registeringAs,
      idCardUrl,
      abstractSubmitted,
      abstractId,
      memberId,
      paymentAmount,
      transactionId,
      bankName,
      branchName,
      paymentDate,
      paymentProofUrl,
      paymentStatus: "Pending", // Payment will be confirmed by admin
    });

    const savedRegistration = await newRegistration.save();

    let qrCodeUrl = "";
    if (!abstractId) {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/abstractForm/${savedRegistration._id}`;
      const qrCodeBuffer = await QRCode.toBuffer(url);
      qrCodeUrl = await uploadQRCodeToFirebase(
        qrCodeBuffer,
        `${savedRegistration._id}.png`
      );
    }

    // Search for the email in the abstract model
    const abstract = await AbstractModel.findOne({ email: email });

    let foundAbstractId = null;
    if (abstract) {
      foundAbstractId = abstract._id;
    }

    // Update the registration with the abstract ID if found
    const registrationUpdate = {
      qrCodeUrl,
      ...(foundAbstractId && { abstractId: foundAbstractId }),
    };

    // Use findByIdAndUpdate with the `new` option to return the updated document
    const updatedRegistration = await RegistrationModel.findByIdAndUpdate(
      savedRegistration._id,
      registrationUpdate,
      { new: true }
    );

    // Sync back to Abstract if found
    if (foundAbstractId) {
      const abstractUpdates: any = {
        registrationCode: updatedRegistration.registrationCode,
      };

      if (updatedRegistration.paymentStatus === "Completed") {
        abstractUpdates.registrationCompleted = true;
      }

      await AbstractModel.findByIdAndUpdate(foundAbstractId, abstractUpdates);
    }

    // Send confirmation email
    try {
      await sendEmail({
        _id: savedRegistration._id.toString(),
        emailType: "REGISTRATION_SUCCESS",
      });
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
      {
        message: "Registration saved successfully",
        registration: updatedRegistration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration save error:", error);
    return NextResponse.json(
      { message: "Error saving registration", error: error.message },
      { status: 500 }
    );
  }
}
