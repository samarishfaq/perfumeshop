import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";

// ✅ GET all products
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Database error" },
      { status: 500 }
    );
  }
}

// ✅ POST create new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, variants } = body;

    // Basic validation
    if (!name || !Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product name and at least one variant are required",
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const created = await Product.create({
      name,
      description,
      variants,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Create error" },
      { status: 500 }
    );
  }
}
