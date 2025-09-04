import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  await connectToDatabase();
  const order = await Order.findById(id);
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const body = await request.json();
  await connectToDatabase();
  const updatedOrder = await Order.findByIdAndUpdate(id, body, { new: true });
  if (!updatedOrder) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(updatedOrder, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  await connectToDatabase();
  const deletedOrder = await Order.findByIdAndDelete(id);
  if (!deletedOrder) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
}
