import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ApiResponseSchema } from "@/lib/schema/api-response/api-response";
import { getToken } from "next-auth/jwt";

// Fetch total shops count for super admin

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponseSchema>> {
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

    const count = await prisma.shop.count();

    return NextResponse.json({
      message: "Total shops count fetched successfully",
      status: "success",
      isOperational: true,
      data: { count },
      statusCode: 200
    }, { status: 200 });

    }
    catch (error) {
        console.error("Error fetching shops count:", error);
        return NextResponse.json({
            message: "Internal server error",
            status: "error",
            isOperational: false,
            data: null,
            statusCode: 500
        }, { status: 500 });
    }
}