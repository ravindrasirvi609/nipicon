import { Schema, model, models } from "mongoose";

const registrationSchema = new Schema({
  // Personal Information
  groupCode: { type: String },
  email: { type: String, required: true },
  whatsappNumber: {
    type: String,
  },
  Salutations: { type: String, enum: ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."] },
  name: { type: String, required: true },
  affiliation: { type: String },
  designation: { type: String },
  imageUrl: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dob: { type: Date },
  AadharNumber: { type: Number },

  // Address Information
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  country: { type: String },
  institute: { type: String },
  qrCodeUrl: { type: String },

  // Conference-specific Information
  registrationType: {
    type: String,
  },

  abstractSubmitted: { type: Boolean, default: false },
  abstractId: { type: Schema.Types.ObjectId, ref: "Abstract" },

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  paymentAmount: { type: Number },
  paymentDate: { type: Date },
  transactionId: { type: String },
  memberId: { type: String },
  feesReceiptUrl: { type: String },

  // Additional Conference Options
  needAccommodation: { type: Boolean, default: false },
  dietaryRequirements: { type: String },
  specialAssistance: { type: String },
  includeGalaDinner: { type: Boolean, default: false },

  // Registration Status
  registrationStatus: {
    type: String,
    enum: ["Pending", "Confirmed"],
    default: "Pending",
  },
  registrationCode: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Virtual field for full address
registrationSchema.virtual("fullAddress").get(function () {
  return `${this.address}, ${this.city}, ${this.state}, ${this.pincode}, ${this.country}`;
});

// Ensure virtuals are included when converting document to JSON
registrationSchema.set("toJSON", { virtuals: true });

const RegistrationModel =
  models.Registration || model("Registration", registrationSchema);

export default RegistrationModel;
