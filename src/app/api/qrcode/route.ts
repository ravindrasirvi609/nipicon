import AbstractModel from "@/Model/AbstractModel";
import RegistrationModel from "@/Model/RegistrationModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import mongoose from "mongoose";

connect();

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { id } = await req.json();

    let abstract: any = null;
    let registration: any = null;

    // Check if id is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      // Try to find in AbstractModel
      abstract = await AbstractModel.findById(id).lean();
      console.log("abstract----1", abstract);

      // If not found in AbstractModel, try RegistrationModel
      if (!abstract) {
        registration = await RegistrationModel.findById(id).lean();
        console.log("registration----1", registration);
      }
    }

    // If not found by _id, try with temporaryAbstractCode or registrationCode
    if (!abstract && !registration) {
      abstract = await AbstractModel.findOne({
        temporyAbstractCode: id,
      }).lean();
      console.log("abstract----2", abstract);
      if (!abstract) {
        registration = await RegistrationModel.findOne({
          registrationCode: id,
        }).lean();
        console.log("registration----2", registration);
      }
    }

    // If we found a registration but not an abstract, try to find the corresponding abstract
    if (registration && registration.registrationCode && !abstract) {
      abstract = await AbstractModel.findOne({
        registrationCode: registration.registrationCode,
      }).lean();
      console.log("abstract----3", abstract);
    }

    // If we found an abstract but not a registration, try to find the corresponding registration

    if (abstract && !registration && abstract.registrationCode) {
      registration = await RegistrationModel.findOne({
        registrationCode: abstract.registrationCode,
      }).lean();
      console.log("registration----3", registration);
    }

    if (!abstract && !registration) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json({
      props: {
        abstract: abstract || null,
        registration: registration || null,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
