import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  productName: string;
  productPrice: number;
  remainingPayment?: number;
  paymentMethod?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    remainingPayment: { type: Number },
    paymentMethod: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
