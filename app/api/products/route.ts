import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "DB error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, buyingPrice, sellingPrice, profit } = body;

    if (!name || !company || buyingPrice == null || sellingPrice == null) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();
    const created = await Product.create({
      name,
      company,
      buyingPrice: Number(buyingPrice),
      sellingPrice: Number(sellingPrice),
      profit: profit != null ? Number(profit) : undefined,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Create error" }, { status: 500 });
  }
}
