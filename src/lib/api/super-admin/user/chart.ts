import { api } from "@/lib/api/api";
import { AxiosError } from "axios";
import { ApiResponseSchema } from "@/lib/schema/api-response/api-response";
import { ChartSchema } from "@/lib/schema/common/chart";

export async function fetchUserChart(params: ChartSchema): Promise<ApiResponseSchema> {
    try {
        const response = await api.get("/api/super-admin/users/charts", {
            params: {
                month: params.month,
                groupBy: params.groupBy,
                role: params.role,
                status: params.status
            }
        });
        return response.data as ApiResponseSchema;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error?.response?.data as ApiResponseSchema;
        }
        return {
            message: "An unexpected error occurred",
            status: "error",
            isOperational: false,
            data: null,
            statusCode: 500
        };
    }
}
