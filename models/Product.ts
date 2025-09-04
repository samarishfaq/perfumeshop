import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    buyingPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    profit: { type: Number }, // optional
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
