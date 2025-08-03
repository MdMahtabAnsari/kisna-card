import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ApiResponseSchema } from "@/lib/schema/api-response/api-response";
import { areaOrStatusSchema, ShopStatusSchema } from "@/lib/schema/common/shop";
import { createShopSchema, updateShopSchema } from "@/lib/schema/shop";
import { getToken } from "next-auth/jwt";

// get shops by area or status by super admin

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponseSchema>> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
    })


    if (!token || token.role !== "SUPER_ADMIN") {
      return NextResponse.json({
        message: "Unauthorized",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 403
      }, { status: 403 });
    }


    const page = request.nextUrl.searchParams.get("page") || "1";
    const limit = request.nextUrl.searchParams.get("limit") || "10";
    const areaId = request.nextUrl.searchParams.get("areaId") || undefined;
    const status = request.nextUrl.searchParams.get("status") || undefined;
    const parsedParams = areaOrStatusSchema.safeParse({
      page,
      limit,
      areaId,
      status
    });


    if (!parsedParams.success) {
      return NextResponse.json({
        message: `${parsedParams.error?.message}` || "Invalid parameters",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 400
      }, { status: 400 });
    }


    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const totalShops = await prisma.shop.count({
      where: {
        areaId: areaId,
        status: status as ShopStatusSchema | undefined
      }
    });


    const totalPages = Math.ceil(totalShops / limitInt);
    if (totalShops === 0) {
      return NextResponse.json({
        message: "No shops found",
        status: "success",
        isOperational: true,
        data: {
          shops: [],
          pagination: {
            totalPages,
            currentPage: pageInt,
            pageSize: limitInt
          }
        },
        statusCode: 200
      }, { status: 200 });
    }


    const shops = await prisma.shop.findMany({
      where: {
        areaId: areaId,
        status: status as ShopStatusSchema | undefined
      },
      skip: (pageInt - 1) * limitInt,
      take: limitInt
    });


    return NextResponse.json({
      message: "Shops retrieved successfully",
      status: "success",
      isOperational: true,
      data: {
        shops,
        pagination: {
          totalPages,
          currentPage: pageInt,
          pageSize: limitInt
        }
      },
      statusCode: 200
    }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving shops:", error);
    
    return NextResponse.json({
      message: "Internal server error",
      status: "error",
      isOperational: false,
      data: null,
      statusCode: 500
    }, { status: 500 });
  }
}

// Create a new shop by super admin


export async function POST(request: NextRequest): Promise<NextResponse<ApiResponseSchema>> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
    })
    if (!token || token.role !== "SUPER_ADMIN") {
      return NextResponse.json({
        message: "Unauthorized",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 403
      }, { status: 403 });
    }
    // Parse and validate the request body against the createShopSchema
    const body = await request.json();
    const parsedBody = createShopSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({
        message: `${parsedBody.error?.message}` || "Invalid request body",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 400
      }, { status: 400 });
    }

    const { name, areaId, approvedById, status, ownerId } = parsedBody.data;

    // Create the shop in the database
    const shop = await prisma.shop.create({
      data: {
        name,
        areaId,
        createdById: typeof token.id === "string" ? token.id : "", // Ensure token.id is a string
        approvedById,
        status,
        ownerId
      }
    });

    return NextResponse.json({
      message: "Shop created successfully",
      status: "success",
      isOperational: true,
      data: shop,
      statusCode: 201
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating shop:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: "error",
      isOperational: false,
      data: null,
      statusCode: 500
    }, { status: 500 });
  }
}

// update a shop by super admin

export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponseSchema>> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
    })
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
    const parsedBody = updateShopSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({
        message: `${parsedBody.error?.message}` || "Invalid request body",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 400
      }, { status: 400 });
    }

    const { id, name, areaId, approvedById, status, ownerId } = parsedBody.data;

    // Update the shop in the database
    const shop = await prisma.shop.update({
      where: { id },
      data: {
        name,
        areaId,
        createdById: typeof token.id === "string" ? token.id : "", // Ensure token.id is a string
        approvedById,
        status,
        ownerId
      }
    });

    return NextResponse.json({
      message: "Shop updated successfully",
      status: "success",
      isOperational: true,
      data: shop,
      statusCode: 200
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: "error",
      isOperational: false,
      data: null,
      statusCode: 500
    }, { status: 500 });
  }
}

