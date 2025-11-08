import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

// ✅ GET all orders
export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders", error },
      { status: 500 }
    );
  }
}

// ✅ POST create order
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newOrder = await Order.create(body);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating order", error },
      { status: 500 }
    );
  }
}
