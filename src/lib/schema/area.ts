import {z} from "zod/v4";

export const name = z.string().min(1, "Area name is required").max(100, "Area name must be less than 100 characters").regex(/^[a-zA-Z0-9\s]+$/, "Area name can only contain letters, numbers, and spaces");
export const code = z.string().min(1, "Area code is required").max(10, "Area code must be less than 10 characters").regex(/^[A-Z0-9]+$/, "Area code can only contain uppercase letters and numbers");

export const createAreaSchema = z.object({
    name: name,
    code: code,
});


export type CreateAreaSchema = z.infer<typeof createAreaSchema>;

export const updateAreaSchema = createAreaSchema.partial().extend({
    id: z.uuid("Invalid area ID format"),
});