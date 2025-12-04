import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import RegistrationModel from "@/Model/RegistrationModel";
import { getCategoryCode } from "@/data";
import { sendEmail } from "@/lib/mailer";

connect();

// Generate registration code based on category
async function generateRegistrationCode(
  registrationType: string
): Promise<string> {
  const categoryCode = getCategoryCode(registrationType);

  // Count existing registrations with this category code
  const existingCount = await RegistrationModel.countDocuments({
    registrationCode: { $regex: `^R${categoryCode}` },
  });

  // Generate next sequence number
  const sequenceNumber = (existingCount + 1).toString().padStart(3, "0");

  return `R${categoryCode}${sequenceNumber}`;
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, action, rejectionReason } = body;

    if (!registrationId || !action) {
      return NextResponse.json(
        { error: "Registration ID and action are required" },
        { status: 400 }
      );
    }

    if (!["confirm", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'confirm' or 'reject'" },
        { status: 400 }
      );
    }

    const registration = await RegistrationModel.findById(registrationId);

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    if (action === "confirm") {
      // Generate registration code if not already assigned
      if (!registration.registrationCode) {
        const registrationCode = await generateRegistrationCode(
          registration.registrationType
        );
        registration.registrationCode = registrationCode;
      }

      registration.paymentStatus = "Completed";
      registration.registrationStatus = "Confirmed";
      registration.updatedAt = new Date();

      await registration.save();

      // Send confirmation email
      try {
        await sendEmail({
          _id: registration._id.toString(),
          emailType: "REGISTRATION_SUCCESS",
        });
      } catch (emailError) {
        console.error("Failed to send registration confirmation email:", emailError);
        // Don't fail the request if email fails, but log it
      }

      return NextResponse.json({
        success: true,
        message: "Registration confirmed successfully",
        registrationCode: registration.registrationCode,
        registration,
      });
    } else if (action === "reject") {
      registration.paymentStatus = "Failed";
      registration.registrationStatus = "Pending";
      registration.updatedAt = new Date();

      // Store rejection reason if provided
      if (rejectionReason) {
        registration.rejectionReason = rejectionReason;
      }

      await registration.save();

      // TODO: Add email sending functionality

      return NextResponse.json({
        success: true,
        message: "Registration rejected",
        registration,
      });
    }
  } catch (error) {
    console.error("Error updating registration status:", error);
    return NextResponse.json(
      { error: "Failed to update registration status" },
      { status: 500 }
    );
  }
}
