import { Schema, model, models } from "mongoose";

const SubscribeSchema = new Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Subscribe = models.Subscribe || model("Subscribe", SubscribeSchema);

export default Subscribe;
