
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ApiResponseSchema } from '@/lib/schema/api-response/api-response';
import { getToken } from 'next-auth/jwt';

// Fetch registration changes for super admin

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
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: thisMonthStart,
          lte: now,
        },
      },
    });

    const lastMonthCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    let percentChange = 0;
    if (lastMonthCount > 0) {
      percentChange = ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;
    } else if (thisMonthCount > 0) {
      percentChange = 100;
    }

    return NextResponse.json({
      message: "Registration changes fetched successfully",
      status: "success",
      data: {
        lastMonthCount,
        thisMonthCount,
        percentChange: Number(percentChange.toFixed(2)),
      },
      isOperational: true,
      statusCode: 200

    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching registration changes:", error);
    return NextResponse.json({
      message: "Internal server error",
      status: "error",
      isOperational: false,
      data: null,
      statusCode: 500
    }, { status: 500 });
  }
}
