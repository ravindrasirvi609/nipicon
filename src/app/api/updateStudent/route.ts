import { connect } from "@/dbConfig/dbConfig";
import Contact from "@/Model/contactModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  const {
    id,
    kitTaken,
    idCardTaken,
    breakfastTaken,
    lunchTaken,
    certificateTaken,
  } = await req.json();

  try {
    const student = await Contact.findOneAndUpdate(
      { registrationId: id },
      {
        kitTaken,
        idCardTaken,
        breakfastTaken,
        lunchTaken,
        certificateTaken,
      },
      { new: true }
    ).lean();

    if (!student) {
      return NextResponse.json({ message: "Student not found" });
    }

    return NextResponse.json({ student });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", error });
  }
}
