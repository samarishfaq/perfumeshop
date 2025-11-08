import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Other from "@/models/Other";

// ✅ PUT (Update Other product)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();

    const body = await request.json();
    const { name, description, price } = body;

    // Validation to ensure required fields exist
    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: "Name and price are required" },
        { status: 400 }
      );
    }

    const updated = await Other.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Update error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE (Remove Other product)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();

    await Other.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Delete error" },
      { status: 500 }
    );
  }
}
