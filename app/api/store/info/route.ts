import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Verify store owner role
    const session = await requireRole("STORE_OWNER");

    const store = await prisma.store.findUnique({
      where: { ownerId: session.userId as string },
      include: {
        _count: {
          select: { ratings: true },
        },
        ratings: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const allRatings = await prisma.rating.findMany({
      where: { storeId: store.id },
      select: { value: true },
    });

    const averageRating =
      allRatings.length > 0
        ? allRatings.reduce((sum: number, r: { value: number }) => sum + r.value, 0) / allRatings.length
        : 0;

    return NextResponse.json({
      store: {
        ...store,
        averageRating: Math.round(averageRating * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Error fetching store info:", error);
    return NextResponse.json(
      { error: "Failed to fetch store information" },
      { status: error instanceof Error && error.message === "Forbidden" ? 403 : 500 }
    );
  }
}
