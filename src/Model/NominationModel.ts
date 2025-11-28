import { Schema, model, models } from "mongoose";

const NominationSchema = new Schema(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    aadharNumber: { type: String, required: true, unique: true },
    organization: { type: String, required: true },
    position: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    whatsappNumber: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    nominatorName: { type: String },
    nominatorContact: { type: String },
    membershipNumber: { type: String },
    professionalAchievements: { type: String, required: true },
    challenges: { type: String },
    impact: { type: String },
    innovations: { type: String },
    contribution: { type: String },
    transformation: { type: String },
    leadership: { type: String },
    mentorship: { type: String },
    awards: { type: String },
    recognitionExcellence: { type: String },
    socialResponsibility: { type: String },
    diversityEfforts: { type: String },
    supportingDocuments: [{ type: String }],
    additionalMaterials: { type: String },
    nominationStatement: { type: String, required: true },
    uniqueQualities: { type: String },
    additionalInfo: { type: String },
  },
  {
    timestamps: true,
  }
);

const NominationModel =
  models.Nomination || model("Nomination", NominationSchema);

export default NominationModel;
