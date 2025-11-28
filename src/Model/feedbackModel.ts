import { Schema, model, models } from "mongoose";

const feedbackSchema = new Schema({
  // User Identification (linked to registration)
  registrationId: {
    type: Schema.Types.ObjectId,
    ref: "Registration",
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },

  // Overall Conference Experience
  overallSatisfaction: {
    type: Number,

    min: 1,
    max: 5,
    comment: "1=Very Dissatisfied, 5=Very Satisfied",
  },
  wouldRecommend: {
    type: Number,

    min: 0,
    max: 10,
    comment: "Net Promoter Score: 0-10",
  },

  // Conference Content Feedback
  sessionQuality: {
    type: Number,

    min: 1,
    max: 5,
  },
  keynoteSpeakers: {
    type: Number,

    min: 1,
    max: 5,
  },
  panelDiscussions: {
    type: Number,
    min: 1,
    max: 5,
  },
  workshopsAttended: [
    {
      workshopName: { type: String },
      workshopRating: { type: Number, min: 1, max: 5 },
      workshopComments: { type: String },
    },
  ],
  mostValuableSessions: [{ type: String }],
  leastValuableSessions: [{ type: String }],

  // Logistics Feedback
  venueRating: {
    type: Number,

    min: 1,
    max: 5,
  },
  accommodationRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  foodAndBeverageRating: {
    type: Number,

    min: 1,
    max: 5,
  },
  registrationProcessRating: {
    type: Number,

    min: 1,
    max: 5,
  },
  technicalSupportRating: {
    type: Number,
    min: 1,
    max: 5,
  },

  // If they attended gala dinner
  galaDinnerAttended: {
    type: Boolean,
    default: false,
  },
  galaDinnerRating: {
    type: Number,
    min: 1,
    max: 5,
  },

  // Networking Opportunities
  networkingOpportunitiesRating: {
    type: Number,

    min: 1,
    max: 5,
  },
  connectionsMade: {
    type: Number,
    comment: "Estimated number of new connections made",
  },

  // Detailed Feedback
  highlightsOfConference: {
    type: String,
    maxlength: 1000,
  },
  suggestionsForImprovement: {
    type: String,
    maxlength: 1000,
  },
  topicsForFutureConferences: [
    {
      type: String,
    },
  ],

  // Technical Experience
  mobileAppRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  websiteRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  technicalIssuesExperienced: {
    type: String,
  },

  // Accessibility and Inclusion
  accessibilityRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  specialAssistanceProvided: {
    type: Boolean,
  },
  specialAssistanceRating: {
    type: Number,
    min: 1,
    max: 5,
  },

  // Value Assessment
  valueForMoneyRating: {
    type: Number,

    min: 1,
    max: 5,
  },

  // Future Participation
  intendToAttendNextYear: {
    type: String,
    enum: [
      "Definitely",
      "Probably",
      "Unsure",
      "Probably Not",
      "Definitely Not",
    ],
  },

  // Source Information
  howHeardAboutConference: {
    type: String,
    enum: [
      "Email",
      "Social Media",
      "Colleague",
      "Website",
      "Professional Organization",
      "Other",
    ],
  },

  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now,
  },

  // Optional: Feedback Status for Administrative Purposes
  feedbackStatus: {
    type: String,
    enum: ["Submitted", "Reviewed", "Addressed"],
    default: "Submitted",
  },

  // Optional: For internal notes on the feedback
  adminNotes: {
    type: String,
  },
});

// Calculate overall feedback score (average of key ratings)
feedbackSchema.virtual("overallScore").get(function () {
  const ratings = [
    this.overallSatisfaction,
    this.sessionQuality,
    this.keynoteSpeakers,
    this.venueRating,
    this.foodAndBeverageRating,
    this.networkingOpportunitiesRating,
    this.valueForMoneyRating,
  ].filter((rating) => rating !== undefined);

  if (ratings.length === 0) return null;
  return Number(
    ratings
      .filter((rating) => rating !== null)
      .reduce((sum, rating) => sum + rating, 0) / ratings.length
  ).toFixed(2);
});

// Ensure virtuals are included when converting document to JSON
feedbackSchema.set("toJSON", { virtuals: true });

// Index for quick lookups by email and registration
feedbackSchema.index({ email: 1 });
feedbackSchema.index({ registrationId: 1 });

const FeedbackModel = models.Feedback || model("Feedback", feedbackSchema);

export default FeedbackModel;
