import { NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/mongoose";
import Order from "@/models/Order";

interface Params {
  params: { id: string };
}

// ✅ GET one order by ID
export async function GET(req: Request, { params }: Params) {
  try {
    await connectToDatabase();
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching order", error },
      { status: 500 }
    );
  }
}

// ✅ PUT update order
export async function PUT(req: Request, { params }: Params) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const updatedOrder = await Order.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating order", error },
      { status: 500 }
    );
  }
}

// ✅ DELETE order
export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectToDatabase();
    const deletedOrder = await Order.findByIdAndDelete(params.id);

    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting order", error },
      { status: 500 }
    );
  }
}
