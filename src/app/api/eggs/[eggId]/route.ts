import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { eggId: string } }
) {
  try {
    const { eggId } = params;
    const egg = await db.getEggById(eggId);

    if (!egg) {
      return NextResponse.json(
        { error: "Egg not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: egg.id,
      latitude: parseFloat(egg.latitude),
      longitude: parseFloat(egg.longitude),
      hint1: egg.hint1,
      hint2: egg.hint2,
      hint3: egg.hint3,
    });
  } catch (error) {
    console.error("Error fetching egg:", error);
    return NextResponse.json(
      { error: "Failed to fetch egg" },
      { status: 500 }
    );
  }
}
