import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, address } = body;

    // Validate input
    if (!name || !email || !password || !address) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length < 20 || name.length > 60) {
      return NextResponse.json(
        { error: "Name must be between 20 and 60 characters" },
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

    // Validate password
    if (password.length < 8 || password.length > 16) {
      return NextResponse.json(
        { error: "Password must be between 8 and 16 characters" },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter" },
        { status: 400 }
      );
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one special character" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
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
        role: "NORMAL_USER",
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

    // Create JWT token for auto-login
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );

    // Set HTTP-only cookie for auto-login
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
