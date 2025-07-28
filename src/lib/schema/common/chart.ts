import {z} from "zod/v4";
import { roleSchema,userStatusSchema } from "../auth";

export const chartSchema = z.object({
    month: z.enum(['1', '3', '6', '12'],"Month must be one of 1, 3, 6, or 12"),
    groupBy: z.enum(['day', 'week', 'month'], "Group by must be one of day, week, or month"),
    role: roleSchema.optional(),
    status: userStatusSchema.optional()
});

export type ChartSchema = z.infer<typeof chartSchema>;