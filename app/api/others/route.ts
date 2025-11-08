import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Other from "@/models/Other";

// ✅ GET — fetch all "Other" products
export async function GET() {
  try {
    await dbConnect ();
    const data = await Other.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// ✅ POST — create new "Other" product
export async function POST(req: Request) {
  try {
    await dbConnect ();
    const body = await req.json();
    const { name, description, price } = body;

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: "Name and price are required" },
        { status: 400 }
      );
    }

    const item = await Other.create({ name, description, price });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create item" },
      { status: 500 }
    );
  }
}
