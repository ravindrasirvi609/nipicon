import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import RegistrationModel from "@/Model/RegistrationModel";
import { getCategoryCode } from "@/data";
import { sendEmail } from "@/lib/mailer";
import AbstractModel from "@/Model/AbstractModel";

connect();

// Generate registration code based on category
async function generateRegistrationCode(
  registrationType: string
): Promise<string> {
  const categoryCode = getCategoryCode(registrationType);

  // Find the last registration with this category code to determine the next sequence number
  const lastRegistration = await RegistrationModel.findOne({
    registrationCode: { $regex: `^R${categoryCode}` },
  })
    .sort({ registrationCode: -1 }) // Sort descending to get the latest
    .select("registrationCode");

  let nextSequence = 1;

  if (lastRegistration && lastRegistration.registrationCode) {
    // Extract the numeric part
    const currentSequenceStr = lastRegistration.registrationCode.replace(
      `R${categoryCode}`,
      ""
    );
    const currentSequence = parseInt(currentSequenceStr, 10);

    if (!isNaN(currentSequence)) {
      nextSequence = currentSequence + 1;
    }
  }

  // Generate next sequence number
  const sequenceNumber = nextSequence.toString().padStart(3, "0");

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


    let updatedAbstract = null;

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

      // Update associated Abstract if exists
      // Try to find abstract by abstractId invalid in registration or by email
      let abstractToUpdate = null;
      if (registration.abstractId) {
        abstractToUpdate = await AbstractModel.findById(
          registration.abstractId
        );
      } else if (registration.email) {
        abstractToUpdate = await AbstractModel.findOne({
          email: registration.email,
        });
      }

      if (abstractToUpdate) {
        abstractToUpdate.registrationCompleted = true;
        abstractToUpdate.registrationCode = registration.registrationCode;
        updatedAbstract = await abstractToUpdate.save();

        // Ensure registration links back to this abstract if not already
        if (
          !registration.abstractId ||
          registration.abstractId.toString() !== abstractToUpdate._id.toString()
        ) {
          registration.abstractId = abstractToUpdate._id;
          registration.abstractSubmitted = true;
          await registration.save();
        }
      }

      // Send confirmation email
      try {
        await sendEmail({
          _id: registration._id.toString(),
          emailType: "REGISTRATION_SUCCESS",
        });
      } catch (emailError) {
        console.error(
          "Failed to send registration confirmation email:",
          emailError
        );
        // Don't fail the request if email fails, but log it
      }

      return NextResponse.json({
        success: true,
        message: "Registration confirmed successfully",
        registrationCode: registration.registrationCode,
        registration,
        abstract: updatedAbstract,
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

      // If there is an abstract, we might want to untag it? 
      // Current requirement doesn't explicitly say to untag, but it's safe to leave 'registrationCompleted' 
      // as false if we were to revert it, but 'Pending' registration usually implies not complete.
      // However, usually 'registrationCompleted' flag on Abstract acts as a gate. 
      // If we reject, we should probably set it to false.

      let abstractToUpdate = null;
      if (registration.abstractId) {
        abstractToUpdate = await AbstractModel.findById(registration.abstractId);
      } else if (registration.email) {
        abstractToUpdate = await AbstractModel.findOne({ email: registration.email });
      }

      if (abstractToUpdate) {
        abstractToUpdate.registrationCompleted = false;
        abstractToUpdate.registrationCode = undefined; // Remove code
        updatedAbstract = await abstractToUpdate.save();
      }

      // TODO: Add email sending functionality

      return NextResponse.json({
        success: true,
        message: "Registration rejected",
        registration,
        abstract: updatedAbstract
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
