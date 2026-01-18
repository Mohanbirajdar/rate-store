import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get counts from database
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    // Calculate average rating
    const avgRatingResult = await prisma.rating.aggregate({
      _avg: {
        value: true,
      },
    });

    const averageRating = avgRatingResult._avg.value || 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
        averageRating: Number(averageRating.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
