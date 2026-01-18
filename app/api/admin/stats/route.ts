import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    // Verify admin role
    await requireRole("SYSTEM_ADMIN");

    const [totalUsers, totalStores, totalRatings, ratings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
      prisma.rating.findMany({ select: { value: true } }),
    ]);

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum: number, r: { value: number }) => sum + r.value, 0) / ratings.length
        : 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
        averageRating: Math.round(averageRating * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    
    // Handle authentication/authorization errors properly
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
