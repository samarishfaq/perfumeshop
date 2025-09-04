import { NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/mongoose";
import Other from "@/models/Other";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const body = await req.json();
  const updated = await Other.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await Other.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
