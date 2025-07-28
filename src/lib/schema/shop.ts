import {z} from "zod/v4";

import { shopStatusSchema } from "./common/shop";

export const createShopSchema = z.object({
    name: z.string().min(1, "Shop name is required").max(100, "Shop name must be less than 100 characters").regex(/^[a-zA-Z0-9\s]+$/, "Shop name can only contain letters, numbers, and spaces"),
    ownerId: z.uuid("Invalid owner ID format"),
    areaId: z.uuid("Invalid area ID format"),
    approvedById: z.uuid("Invalid approver ID format"),
    status: shopStatusSchema.optional(),
});

export type CreateShopSchema = z.infer<typeof createShopSchema>;

export const updateShopSchema = createShopSchema.partial().extend({
    id: z.uuid("Invalid shop ID format"),
});
