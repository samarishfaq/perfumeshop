import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";

// ✅ GET product by ID
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // 👈 await required
    await connectToDatabase();
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Fetch error" }, { status: 500 });
  }
}

// ✅ PUT update product
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // 👈 await required
    const body = await request.json();
    await connectToDatabase();
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name: body.name,
        company: body.company,
        buyingPrice: Number(body.buyingPrice),
        sellingPrice: Number(body.sellingPrice),
        profit: body.profit != null ? Number(body.profit) : undefined,
      },
      { new: true }
    );
    if (!updated) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Update error" }, { status: 500 });
  }
}

// ✅ DELETE product
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // 👈 await required
    await connectToDatabase();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: deleted }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Delete error" }, { status: 500 });
  }
}
