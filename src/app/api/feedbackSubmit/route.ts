import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"; // Assuming you have a DB config
import RegistrationModel from "@/Model/RegistrationModel"; // For validation
import FeedbackModel from "@/Model/feedbackModel";

connect();

// TypeScript interface for the feedback request body
interface IFeedbackRequest {
  registrationId?: string;
  email?: string;
  name?: string;
  overallSatisfaction: number;
  wouldRecommend: number;
  sessionQuality: number;
  keynoteSpeakers: number;
  panelDiscussions: number;
  workshopsAttended?: Array<{
    workshopName: string;
    workshopRating: number;
    workshopComments?: string;
  }>;
  mostValuableSessions?: string[];
  leastValuableSessions?: string[];
  venueRating: number;
  accommodationRating?: number;
  foodAndBeverageRating: number;
  registrationProcessRating: number;
  technicalSupportRating?: number;
  galaDinnerAttended?: boolean;
  galaDinnerRating?: number;
  networkingOpportunitiesRating: number;
  connectionsMade?: number;
  highlightsOfConference?: string;
  suggestionsForImprovement?: string;
  topicsForFutureConferences?: string[];
  mobileAppRating?: number;
  websiteRating?: number;
  technicalIssuesExperienced?: string;
  accessibilityRating?: number;
  specialAssistanceProvided?: boolean;
  specialAssistanceRating?: number;
  valueForMoneyRating: number;
  intendToAttendNextYear:
    | "Definitely"
    | "Probably"
    | "Unsure"
    | "Probably Not"
    | "Definitely Not";
  howHeardAboutConference:
    | "Email"
    | "Social Media"
    | "Colleague"
    | "Website"
    | "Professional Organization"
    | "Other";
}

export async function POST(req: NextRequest) {
  try {
    const body: IFeedbackRequest = await req.json();

    // Validate required fields
    if (!body.email && !body.registrationId) {
      return NextResponse.json(
        { message: "Either email or registrationId is required" },
        { status: 400 }
      );
    }

    // Validate registration if registrationId is provided
    if (body.registrationId) {
      const registration = await RegistrationModel.findById(
        body.registrationId
      );
      if (!registration) {
        return NextResponse.json(
          { message: "Invalid registration ID" },
          { status: 404 }
        );
      }
      // If email is provided, ensure it matches the registration
      if (body.email && registration.email !== body.email) {
        return NextResponse.json(
          { message: "Email does not match registration" },
          { status: 400 }
        );
      }
    }

    // Create new feedback instance
    const newFeedback = new FeedbackModel({
      registrationId: body.registrationId,
      email: body.email,
      name: body.name,
      overallSatisfaction: body.overallSatisfaction,
      wouldRecommend: body.wouldRecommend,
      sessionQuality: body.sessionQuality,
      keynoteSpeakers: body.keynoteSpeakers,
      panelDiscussions: body.panelDiscussions,
      workshopsAttended: body.workshopsAttended,
      mostValuableSessions: body.mostValuableSessions,
      leastValuableSessions: body.leastValuableSessions,
      venueRating: body.venueRating,
      accommodationRating: body.accommodationRating,
      foodAndBeverageRating: body.foodAndBeverageRating,
      registrationProcessRating: body.registrationProcessRating,
      technicalSupportRating: body.technicalSupportRating,
      galaDinnerAttended: body.galaDinnerAttended ?? false,
      galaDinnerRating: body.galaDinnerRating,
      networkingOpportunitiesRating: body.networkingOpportunitiesRating,
      connectionsMade: body.connectionsMade,
      highlightsOfConference: body.highlightsOfConference,
      suggestionsForImprovement: body.suggestionsForImprovement,
      topicsForFutureConferences: body.topicsForFutureConferences,
      mobileAppRating: body.mobileAppRating,
      websiteRating: body.websiteRating,
      technicalIssuesExperienced: body.technicalIssuesExperienced,
      accessibilityRating: body.accessibilityRating,
      specialAssistanceProvided: body.specialAssistanceProvided,
      specialAssistanceRating: body.specialAssistanceRating,
      valueForMoneyRating: body.valueForMoneyRating,
      intendToAttendNextYear: body.intendToAttendNextYear,
      howHeardAboutConference: body.howHeardAboutConference,
      submittedAt: new Date(),
      feedbackStatus: "Submitted",
    });

    // Save the feedback
    const savedFeedback = await newFeedback.save();

    return NextResponse.json(
      {
        message: "Feedback submitted successfully",
        feedback: savedFeedback,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      {
        message: "Error submitting feedback",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Optional: Add input validation middleware if needed
function validateFeedbackInput(body: IFeedbackRequest): string | null {
  // Required fields validation
  const requiredFields = [
    "overallSatisfaction",
    "wouldRecommend",
    "sessionQuality",
    "keynoteSpeakers",
    "panelDiscussions",
    "venueRating",
    "foodAndBeverageRating",
    "registrationProcessRating",
    "networkingOpportunitiesRating",
    "valueForMoneyRating",
    "intendToAttendNextYear",
    "howHeardAboutConference",
  ];

  for (const field of requiredFields) {
    if (body[field as keyof IFeedbackRequest] === undefined) {
      return `Missing required field: ${field}`;
    }
  }

  // Rating range validation
  const ratingFields = [
    "overallSatisfaction",
    "sessionQuality",
    "keynoteSpeakers",
    "panelDiscussions",
    "venueRating",
    "foodAndBeverageRating",
    "registrationProcessRating",
    "networkingOpportunitiesRating",
    "valueForMoneyRating",
  ];

  for (const field of ratingFields) {
    const value = body[field as keyof IFeedbackRequest] as number;
    if (value < 1 || value > 5) {
      return `${field} must be between 1 and 5`;
    }
  }

  if (body.wouldRecommend < 0 || body.wouldRecommend > 10) {
    return "wouldRecommend must be between 0 and 10";
  }

  return null;
}
