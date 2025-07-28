import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ApiResponseSchema } from "@/lib/schema/api-response/api-response";
import { getToken } from "next-auth/jwt";
import { chartSchema } from "@/lib/schema/common/chart";
import { subMonths } from "date-fns";
import { groupByInterval } from "@/lib/helpers/group-by-interval";


export async function GET(request: NextRequest): Promise<NextResponse<ApiResponseSchema>> {
    try{
        const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
    })
    if(!token || token.role !== "SUPER_ADMIN") {
      return NextResponse.json({
        message: "Unauthorized",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 403
      }, { status: 403 });
    }
    const month = request.nextUrl.searchParams.get("month") || "1";
    const groupBy = request.nextUrl.searchParams.get("groupBy") || "day";
    const role = request.nextUrl.searchParams.get("role") || undefined;
    const status = request.nextUrl.searchParams.get("status") || undefined;

    const parsedParams = chartSchema.safeParse({ month, groupBy, role, status });
    if (!parsedParams.success) {
      return NextResponse.json({
        message: `${parsedParams.error?.message}` || "Invalid parameters",
        status: "error",
        isOperational: true,
        data: null,
        statusCode: 400
      }, { status: 400 });
    }
    const { month: m, groupBy: g, role: r, status: s } = parsedParams.data;
    const from = subMonths(new Date(), parseInt(m));
     const raw = await prisma.user.findMany({
    where: {
      role: r ? r : undefined,
      status: s ? s : undefined,
      createdAt: {
        gte: from,
        lte: new Date(),
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const transformed = raw.map((u) => ({ createdAt: u.createdAt, count: 1 }));
  const groupedData = groupByInterval(transformed, g);
    return NextResponse.json({
        message: "Chart data fetched successfully",
        status: "success",
        isOperational: true,
        data: groupedData,
        statusCode: 200
    }, { status: 200 });

}catch (error) {
        console.error("Error fetching token:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            status: "error",
            isOperational: false,
            data: null,
            statusCode: 500
        }, { status: 500 });
    }
}
