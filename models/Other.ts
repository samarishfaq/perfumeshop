import mongoose, { Schema, model, models } from "mongoose";

const OtherSchema = new Schema(
  {
    name: { type: String, required: true },
    buyingPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    profit: { type: Number },
  },
  { timestamps: true }
);

const Other = models.Other || model("Other", OtherSchema);
export default Other;
