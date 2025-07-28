import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ApiResponseSchema } from "@/lib/schema/api-response/api-response";
import {superAdminCreateUserSchema} from "@/lib/schema/user";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponseSchema>> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
    });

    if (!token || token.role !== "SUPER_ADMIN") {
      return NextResponse.json({
        message: "Unauthorized",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 403
      }, { status: 403 });
    }

    const body = await request.json();
    const parsedBody = superAdminCreateUserSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({
        message: `${parsedBody.error?.message}` || "Invalid parameters",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 400
      }, { status: 400 });
    }

    // Extracting fields from the parsed body
    const { email, name, phone, userId, password, role, status, approvedById } = parsedBody.data;

    // Creating the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        userId,
        password,
        role,
        status,
        createdById: typeof token.id === "string" ? token.id : "", // Ensure token.id is a string
        approvedById
      }
    });

    return NextResponse.json({
      message: "User created successfully",
      status: "success",
      isOperational: true,
      data: user,
      statusCode: 201
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: "error",
      isOperational: false,
      data: null,
      statusCode: 500
    }, { status: 500 });
  }
}
