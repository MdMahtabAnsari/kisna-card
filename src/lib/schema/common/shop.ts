import { pageLimitSchema } from "./page-limit";
import { z } from "zod/v4";

export const shopStatusSchema = z.enum(["OPEN", "CLOSED", "PENDING"], "Invalid shop status");

export const areaOrStatusSchema = pageLimitSchema.extend({
  areaId: z.uuid("Invalid area ID format").optional(),
  status: shopStatusSchema.optional()
});

export type AreaOrStatusSchema = z.infer<typeof areaOrStatusSchema>;

export type ShopStatusSchema = z.infer<typeof shopStatusSchema>;