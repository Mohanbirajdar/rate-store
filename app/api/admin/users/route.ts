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

    // Get all users with their store info if they're store owners
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        store: {
          select: {
            id: true,
            name: true,
            _count: {
              select: { ratings: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
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

    const { name, email, password, address, role } = await request.json();

    // Validate input
    if (!name || !email || !password || !address || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validate name length (20-60 characters)
    if (name.length < 20 || name.length > 60) {
      return NextResponse.json({ error: "Name must be between 20 and 60 characters" }, { status: 400 });
    }

    // Validate address length (max 400 characters)
    if (address.length > 400) {
      return NextResponse.json({ error: "Address must not exceed 400 characters" }, { status: 400 });
    }

    // Validate password (8-16 characters, uppercase, special character)
    if (password.length < 8 || password.length > 16) {
      return NextResponse.json({ error: "Password must be between 8 and 16 characters" }, { status: 400 });
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one uppercase letter" }, { status: 400 });
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one special character" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate role
    if (!["NORMAL_USER", "STORE_OWNER", "SYSTEM_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
