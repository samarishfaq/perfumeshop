import { NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/mongoose";
import Other from "@/models/Other";

export async function GET() {
  await connectToDatabase();
  const data = await Other.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const item = await Other.create(body);
  return NextResponse.json({ success: true, data: item });
}
