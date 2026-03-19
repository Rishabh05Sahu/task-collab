import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authenticate } from "@/middleware/auth";
import { getAnalyticsSummary } from "@/modules/analytics/analytics.service";

export async function GET() {
  try {
    await connectDB();

    // any authenticated user can view analytics
    await authenticate();

    const data = await getAnalyticsSummary();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 400 }
    );
  }
}