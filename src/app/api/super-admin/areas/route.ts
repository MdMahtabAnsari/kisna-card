import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ApiResponseSchema } from "@/lib/schema/api-response/api-response";
import { createAreaSchema, updateAreaSchema } from "@/lib/schema/area";
import { getToken } from "next-auth/jwt";
import { nameOrCodeSchema } from "@/lib/schema/common/area";

// Create a new area by super admin

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
    const parsedData = createAreaSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({
        message: `${parsedData.error?.message}` || "Invalid request body",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 400
      }, { status: 400 });
    }

    const { name, code } = parsedData.data;

    const newArea = await prisma.area.create({
      data: {
        name,
        code,
        createdById: typeof token.id === "string" ? token.id : "" // Ensure token.id is a string
      }
    });

    return NextResponse.json({
      message: "Area created successfully",
      status: "success",
      isOperational: true,
      data: newArea,
      statusCode: 201
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating area:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: "error",
      isOperational: false,
      data: null,
      statusCode: 500
    }, { status: 500 });
  }
}

// Update an existing area by super admin

export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponseSchema>> {
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
    const parsedData = updateAreaSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({
        message: `${parsedData.error?.message}` || "Invalid request body",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 400
      }, { status: 400 });
    }

    const { id, name, code } = parsedData.data;

    const updatedArea = await prisma.area.update({
      where: { id },
      data: {
        name,
        code,
      }
    });

    return NextResponse.json({
      message: "Area updated successfully",
      status: "success",
      isOperational: true,
      data: updatedArea,
      statusCode: 200
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating area:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: "error",
      isOperational: false,
      data: null,
      statusCode: 500
    }, { status: 500 });
  }
}

//  Get an area by name or code

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

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || undefined;
    const code = searchParams.get("code") || undefined;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const parsedQuery = nameOrCodeSchema.safeParse({ name, code, page, limit });

    if (!parsedQuery.success) {
      return NextResponse.json({
        message: `${parsedQuery.error?.message}` || "Invalid query parameters",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 400
      }, { status: 400 });
    }
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const totalAreas = await prisma.area.count({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        code: code ? { contains: code, mode: 'insensitive' } : undefined
      }
    });
    if( totalAreas === 0) {
      return NextResponse.json({
        message: "No areas found",
        status: "success",
        isOperational: true,
        data: [],
        statusCode: 200
      }, { status: 200 });
    }

    const areas = await prisma.area.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        code: code ? { contains: code, mode: 'insensitive' } : undefined,
      },
      skip: (pageInt - 1) * limitInt,
      take: limitInt,
    });

    return NextResponse.json({
      message: "Areas retrieved successfully",
      status: "success",
      isOperational: true,
      data: areas,
      statusCode: 200
    }, { status: 200 });

  } catch (error) {
    console.error("Error retrieving areas:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: "error",
      isOperational: false,
      data: null,
      statusCode: 500
    }, { status: 500 });
  }
}

