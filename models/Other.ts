import mongoose, { Schema, model, models } from "mongoose";

const OtherSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Other = models.Other || model("Other", OtherSchema);

export default Other;
