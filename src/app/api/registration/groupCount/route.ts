import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import RegistrationModel from "@/Model/RegistrationModel";

connect();

export async function GET(req: NextRequest) {
  try {
    const groupCounts = await RegistrationModel.aggregate([
      {
        $match: {
          groupCode: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$groupCode",
          count: { $sum: 1 },
          totalAmount: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", "Completed"] },
                { $ifNull: ["$paymentAmount", 0] },
                0,
              ],
            },
          },
          completedPayments: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "Completed"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: groupCounts,
    });
  } catch (error: any) {
    console.error("Error fetching group counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch group counts" },
      { status: 500 }
    );
  }
}
