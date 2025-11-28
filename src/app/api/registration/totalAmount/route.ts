import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import RegistrationModel from "@/Model/RegistrationModel";

connect();

export async function GET(req: NextRequest) {
  try {
    // Get total amount from completed payments
    const result = await RegistrationModel.aggregate([
      {
        $match: {
          paymentStatus: "Completed",
          paymentAmount: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$paymentAmount" },
          totalRegistrations: { $sum: 1 },
          registrationTypes: {
            $push: {
              type: "$registrationType",
              amount: "$paymentAmount",
            },
          },
        },
      },
    ]);

    // Get summary by registration type
    const typeWiseSummary = await RegistrationModel.aggregate([
      {
        $match: {
          paymentStatus: "Completed",
          paymentAmount: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$registrationType",
          count: { $sum: 1 },
          amount: { $sum: "$paymentAmount" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalAmount: result[0]?.totalAmount || 0,
        totalCompletedRegistrations: result[0]?.totalRegistrations || 0,
        typeWiseSummary,
      },
    });
  } catch (error: any) {
    console.error("Error calculating total amount:", error);
    return NextResponse.json(
      { error: "Failed to calculate total amount" },
      { status: 500 }
    );
  }
}
