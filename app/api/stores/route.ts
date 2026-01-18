import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      include: {
        _count: {
          select: { ratings: true },
        },
        ratings: {
          select: { value: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average rating for each store
    const storesWithRating = stores.map((store: typeof stores[number]) => {
      const avgRating =
        store.ratings.length > 0
          ? store.ratings.reduce((sum: number, r: { value: number }) => sum + r.value, 0) / store.ratings.length
          : 0;

      const { ratings, ...rest } = store;
      return {
        ...rest,
        averageRating: avgRating,
      };
    });

    return NextResponse.json({ stores: storesWithRating });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}
