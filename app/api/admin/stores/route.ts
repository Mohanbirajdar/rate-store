import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key-change-in-production"
      );
      const { payload } = await jwtVerify(token, secret);
      const userId = payload.userId as string;

      const admin = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!admin || admin.role !== "SYSTEM_ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    }

    // Get all stores with their owner info and ratings
    const stores = await prisma.store.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
          },
        },
        _count: {
          select: { ratings: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ stores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key-change-in-production"
      );
      const { payload } = await jwtVerify(token, secret);
      const userId = payload.userId as string;

      const admin = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!admin || admin.role !== "SYSTEM_ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    }

    const { ownerName, ownerEmail, ownerPassword, ownerAddress, storeName, storeEmail, storeAddress } = await request.json();

    // Validate input
    if (!ownerName || !ownerEmail || !ownerPassword || !ownerAddress || !storeName || !storeEmail || !storeAddress) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: ownerEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Check if store email already exists
    const existingStore = await prisma.store.findUnique({
      where: { email: storeEmail },
    });

    if (existingStore) {
      return NextResponse.json({ error: "Store with this email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);

    // Create user and store in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: ownerName,
          email: ownerEmail,
          password: hashedPassword,
          address: ownerAddress,
          role: "STORE_OWNER",
        },
      });

      const store = await tx.store.create({
        data: {
          name: storeName,
          email: storeEmail,
          address: storeAddress,
          ownerId: user.id,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              address: true,
              role: true,
            },
          },
        },
      });

      return { user, store };
    });

    return NextResponse.json({ 
      store: result.store, 
      message: "Store and owner created successfully" 
    });
  } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
