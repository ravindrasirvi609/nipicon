import { Schema, model, models } from "mongoose";

const abstractSchema = new Schema({
  email: { type: String, required: true, unique: true },
  whatsappNumber: { type: String },
  name: { type: String },
  affiliation: { type: String },
  coAuthor: { type: String },
  designation: { type: String },
  title: { type: String },
  subject: { type: String }, // Paper Track
  paperType: { type: String, enum: ["Review", "Research"] },
  abstractFileUrl: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  qrCodeUrl: { type: String },
  temporyAbstractCode: { type: String },
  AbstractCode: { type: String },
  rejectionComment: { type: String },
  Status: { type: String, default: "InReview" },
  registrationCompleted: { type: Boolean, default: false },
  registrationCode: { type: String },
  presentationType: {
    type: String,
    enum: ["Oral", "Poster"],
    default: null,
  },
  isForeignDelegate: { type: Boolean, default: false },
  declarationAccepted: { type: Boolean, default: false },

  // Pharma Innovator Award Fields
  isPharmaInnovatorAward: { type: Boolean, default: false },
  supervisorName: { type: String },
  supervisorDesignation: { type: String },
  supervisorAffiliation: { type: String },
  supervisorAddress: { type: String },
  supervisorEmail: { type: String },
  supervisorContact: { type: String },
  declarationFormUrl: { type: String },
  briefProfileUrl: { type: String },

  presentationFileUrl: { type: String },
  presentationFileStatus: { type: String, default: "Pending" },
  presentationRejectionComment: { type: String },

  // Revision Request Flags
  isAbstractRevisionRequested: { type: Boolean, default: false },
  isDeclarationRevisionRequested: { type: Boolean, default: false },
  isProfileRevisionRequested: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AbstractModel = models.Abstract || model("Abstract", abstractSchema);

export default AbstractModel;
