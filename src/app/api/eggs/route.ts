import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude, hint1, hint2, hint3 } = body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    const id = nanoid(12);
    
    await db.createEgg({
      id,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hint1: hint1?.trim() || null,
      hint2: hint2?.trim() || null,
      hint3: hint3?.trim() || null,
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Error creating egg:", error);
    return NextResponse.json(
      { error: "Failed to create egg" },
      { status: 500 }
    );
  }
}
