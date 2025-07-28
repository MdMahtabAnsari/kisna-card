import { z } from "zod/v4";
import { roleSchema, userStatusSchema } from "./auth";

export const superAdminCreateUserSchema = z.object({
    email: z.email("Invalid email format"),
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    phone: z.string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone number can only contain digits"),
    userId: z.string().min(1, "User ID is required").max(50, "User ID must be less than 50 characters").regex(/^[a-zA-Z0-9_]+$/, "User ID can only contain letters, numbers, and underscores"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(100, "Password must be less than 100 characters long").regex(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]+$/, "Password can only contain letters, numbers, and special characters"),
    role: roleSchema,
    status: userStatusSchema,
    approvedById: z.uuid("Invalid UUID format for approvedById").optional(),
}).refine((data) => {
    return data.role === "USER" && data.approvedById === undefined;
}, {
    message: "ApprovedById must be defined for roles other than USER",
    path: ["approvedById"],
});


