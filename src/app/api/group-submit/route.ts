import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/lib/mailer";
import { uploadQRCodeToFirebase } from "@/lib/firebase";
import QRCode from "qrcode";
import RegistrationModel from "@/Model/RegistrationModel";
import AbstractModel from "@/Model/AbstractModel";

connect();
interface IRegistration {
  registrationCode: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      groupCode,
      Salutations,
      dob,
      AadharNumber,
      gender,
      email,
      whatsappNumber,
      name,
      affiliation,
      designation,
      imageUrl,
      address,
      city,
      state,
      pincode,
      country,
      needAccommodation,
    } = body;

    const registrationCode = await getNextRegistrationCode();
    console.log("registrationCode---", registrationCode);

    const newGroupRegistration = new RegistrationModel({
      groupCode,
      Salutations,
      dob,
      AadharNumber,
      gender,
      email,
      whatsappNumber,
      name,
      affiliation,
      designation,
      imageUrl,
      address,
      city,
      state,
      pincode,
      country,
      needAccommodation,
      registrationCode: registrationCode,
      registrationStatus: "Confirmed",
      registrationType: "Group",
      paymentStatus: "Completed",
    });

    const savedGroupRegistration = await newGroupRegistration.save();

    // Generate QR Code
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/abstractForm/${savedGroupRegistration._id}`;
    const qrCodeBuffer = await QRCode.toBuffer(url);
    const qrCodeUrl = await uploadQRCodeToFirebase(
      qrCodeBuffer,
      `group_${savedGroupRegistration._id}.png`
    );
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
    const updatedGroupRegistration = await RegistrationModel.findByIdAndUpdate(
      savedGroupRegistration._id,
      registrationUpdate,
      { new: true }
    );

    console.log("updatedGroupRegistration---", updatedGroupRegistration);

    if (abstract) {
      try {
        await AbstractModel.findByIdAndUpdate(
          updatedGroupRegistration.abstractId,
          {
            registrationCompleted: true,
            registrationCode: updatedGroupRegistration.registrationCode,
          }
        );
      } catch (error) {
        console.error("Failed to update Abstract Model:", error);
        return NextResponse.json(
          { error: "Failed to update Abstract" },
          { status: 500 }
        );
      }
    }

    // Send confirmation email
    sendEmail({
      emailType: "REGISTRATION_SUCCESS",
      _id: updatedGroupRegistration._id,
    });

    return NextResponse.json(
      {
        message: "Group Registration saved successfully",
        registration: updatedGroupRegistration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Group Registration save error:", error);
    return NextResponse.json(
      { message: "Error saving group registration", error: error.message },
      { status: 500 }
    );
  }
}

async function getNextRegistrationCode(): Promise<string> {
  const registrations = (await RegistrationModel.find(
    {},
    {
      registrationCode: 1,
    }
  )
    .lean()
    .exec()) as unknown as (Document & IRegistration)[];

  let maxNumber = 1000;

  for (const registration of registrations) {
    if (
      registration.registrationCode &&
      registration.registrationCode.startsWith("G")
    ) {
      const number = parseInt(registration.registrationCode.slice(1), 10);
      if (!isNaN(number) && number > maxNumber) {
        maxNumber = number;
      }
    }
  }

  const nextNumber = maxNumber + 1;
  return `G${nextNumber.toString().padStart(4, "0")}`;
}
