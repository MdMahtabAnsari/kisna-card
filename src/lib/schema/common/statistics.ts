import {z} from "zod/v4";
import { roleSchema,userStatusSchema } from "../auth";

export const statisticsSchema = z.object({
    role: roleSchema.optional(),
    status: userStatusSchema.optional()
});


export type StatisticsSchema = z.infer<typeof statisticsSchema>;