import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import RegistrationModel from "@/Model/RegistrationModel";
import AbstractModel from "@/Model/AbstractModel";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connect();

    // Parse the request body
    const body = await req.json();
    const { startDate, endDate } = body;

    // Fetch data from your database
    const registrations = await RegistrationModel.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ createdAt: -1 });

    const abstracts = await AbstractModel.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ createdAt: -1 });

    // Calculate statistics
    const totalRegistrations = registrations.length;
    const totalAbstracts = abstracts.length;
    const completedPayments = registrations.filter(
      (r) => r.paymentStatus === "Completed"
    ).length;
    const pendingPayments = registrations.filter(
      (r) => r.paymentStatus === "Pending"
    ).length;

    // Prepare data for charts
    const chartData = {
      paymentStatus: {
        completed: completedPayments,
        pending: pendingPayments,
        failed: registrations.filter((r) => r.paymentStatus === "Failed")
          .length,
      },
      abstractStatus: {
        Pending: abstracts.filter((a) => a.Status === "Pending").length,
        InReview: abstracts.filter((a) => a.Status === "InReview").length,
        Revision: abstracts.filter((a) => a.Status === "Revision").length,
        Accepted: abstracts.filter((a) => a.Status === "Accepted").length,
      },
      registrationTypes: registrations.reduce((acc, reg) => {
        acc[reg.registrationType] = (acc[reg.registrationType] || 0) + 1;
        return acc;
      }, {}),
      monthlyRegistrations: registrations.reduce((acc, reg) => {
        const month = new Date(reg.createdAt).toLocaleString("default", {
          month: "short",
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {}),
    };

    // Prepare the response data
    const responseData = {
      stats: {
        totalRegistrations,
        totalAbstracts,
        completedPayments,
        pendingPayments,
      },
      chartData,
      recentRegistrations: registrations.slice(0, 5).map((reg) => ({
        id: reg._id,
        name: reg.name,
        email: reg.email,
        registrationType: reg.registrationType,
        registrationStatus: reg.registrationStatus,
      })),
    };

    // Return the response
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
