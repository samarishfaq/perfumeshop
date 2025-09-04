import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Other from "@/models/Other";

// ✅ PUT update
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // 👈 await
    await connectToDatabase();
    const body = await request.json();
    const updated = await Other.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Update error" }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // 👈 await
    await connectToDatabase();
    await Other.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Delete error" }, { status: 500 });
  }
}
