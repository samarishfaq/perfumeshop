import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const product = await Product.findById(params.id).lean();
    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Fetch error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const updated = await Product.findByIdAndUpdate(
      params.id,
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: deleted }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Delete error" }, { status: 500 });
  }
}
