import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";

// ✅ GET product by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();

    const product = await Product.findById(id).lean();
    if (!product)
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// ✅ PUT update product
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();

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

    const updated = await Product.findByIdAndUpdate(
      id,
      { name, description, variants },
      { new: true }
    );

    if (!updated)
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Update error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE product
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: deleted }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Delete error" },
      { status: 500 }
    );
  }
}
