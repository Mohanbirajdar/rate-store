import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storeId } = await params;
    const session = await getSession();

    // Check if store exists
    if (!storeId) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        owner: {
          select: { name: true },
        },
        _count: {
          select: { ratings: true },
        },
        ratings: {
          select: { value: true },
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
    const averageRating =
      store.ratings.length > 0
        ? store.ratings.reduce((sum: number, r: { value: number }) => sum + r.value, 0) / store.ratings.length
        : 0;

    // Get user's rating if logged in
    let userRating: number | null = null;
    if (session?.userId) {
      const userRatingRecord = await prisma.rating.findUnique({
        where: {
          userId_storeId: {
            userId: session.userId as string,
            storeId: storeId,
          },
        },
      });
      userRating = userRatingRecord?.value || null;
    }

    const { ratings, ...storeData } = store;

    return NextResponse.json({
      store: {
        ...storeData,
        averageRating: Math.round(averageRating * 100) / 100,
        userRating,
      },
    });
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Failed to fetch store details" },
      { status: 500 }
    );
  }
}
