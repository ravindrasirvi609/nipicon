import { Schema, model, models } from "mongoose";

const registrationSchema = new Schema({
  // Personal Information
  groupCode: { type: String },
  email: { type: String, required: true },
  whatsappNumber: {
    type: String,
  },
  Salutations: { type: String, enum: ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."] },
  firstName: { type: String },
  lastName: { type: String },
  name: { type: String, required: true }, // Full Name for Certificate
  affiliation: { type: String },
  designation: { type: String },
  imageUrl: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dob: { type: Date },

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
  applyingAs: { type: String, enum: ["Individual", "Group"] },
  registeringAs: { type: String, enum: ["Delegate", "Delegate as Presenter"] },
  idCardUrl: { type: String }, // For Student categories

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
  bankName: { type: String },
  branchName: { type: String },
  utrNumber: { type: String },
  paymentProofUrl: { type: String },
  memberId: { type: String },
  feesReceiptUrl: { type: String },

  // Registration Status
  registrationStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Rejected"],
    default: "Pending",
  },
  registrationCode: { type: String },
  rejectionReason: { type: String },
  includeGalaDinner: { type: Boolean, default: false },

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
