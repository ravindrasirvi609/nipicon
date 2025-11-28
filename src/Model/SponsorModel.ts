// models/Student.js
import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  company: { type: String },
  category: { type: String },
  SponsorshipAmount: { type: String },

  message: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Sponsor =
  mongoose.models.Sponsor || mongoose.model("Sponsor", sponsorSchema);

export default Sponsor;
