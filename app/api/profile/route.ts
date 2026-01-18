import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, address } = await request.json();

    // Validate input
    if (!name || !address) {
      return NextResponse.json(
        { error: "Name and address are required" },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length < 20 || name.length > 60) {
      return NextResponse.json(
        { error: "Name must be between 2 and 60 characters" },
        { status: 400 }
      );
    }

    // Validate address length
    if (address.length > 400) {
      return NextResponse.json(
        { error: "Address must not exceed 400 characters" },
        { status: 400 }
      );
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.userId as string },
      data: {
        name,
        address,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
