import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    variants: [
      {
        size: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
