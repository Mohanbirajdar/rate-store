import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { storeId, value } = body;

    // Validate input
    if (!storeId || !value) {
      return NextResponse.json(
        { error: "Store ID and rating value are required" },
        { status: 400 }
      );
    }

    if (value < 1 || value > 5 || !Number.isInteger(value)) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    // Upsert rating (create or update)
    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: session.userId as string,
          storeId: storeId,
        },
      },
      update: {
        value,
      },
      create: {
        value,
        userId: session.userId as string,
        storeId: storeId,
      },
    });

    return NextResponse.json(
      {
        message: "Rating submitted successfully",
        rating,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Rating submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
