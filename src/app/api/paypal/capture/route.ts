import { NextRequest, NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderID } = body as { orderID: string };

    if (!orderID || typeof orderID !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid orderID" },
        { status: 400 }
      );
    }

    const result = await captureOrder(orderID);

    if (result.status === "COMPLETED") {
      return NextResponse.json({
        success: true,
        orderID: result.id,
        status: result.status,
      });
    }

    return NextResponse.json(
      { error: `Order capture returned status: ${result.status}` },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("PayPal capture error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
