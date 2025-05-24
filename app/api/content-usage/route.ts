import { db } from "@/utils/db";
import { AIOutput } from "@/utils/Schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    // Check if user is authenticated
    if (!user || !user.primaryEmailAddressId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated or missing email ID" },
        { status: 401 }
      );
    }

    const userId = user.primaryEmailAddressId;

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    console.log("[API] Received request with:", { userId, startDate, endDate });

    const conditions = [eq(AIOutput.createdBy, userId)];
    if (startDate) conditions.push(gte(AIOutput.createdAt, startDate));
    if (endDate) conditions.push(lte(AIOutput.createdAt, endDate));

    console.log("[API] Query conditions:", conditions);

    const result = await db
      .select()
      .from(AIOutput)
      .where(and(...conditions));

    console.log("[API] Query successful, found:", result.length, "records");

    return NextResponse.json({
      success: true,
      totalGenerated: result.length,
      records: result,
    });
  } catch (error) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch usage data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
