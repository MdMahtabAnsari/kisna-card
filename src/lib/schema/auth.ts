import {z} from "zod/v4";

export const roleSchema = z.enum(["USER", "ADMIN", "SUPER_ADMIN", "SHOP_OWNER"], "Invalid role");
export const userStatusSchema = z.enum(
  ["PENDING", "ACTIVE", "INACTIVE", "SUSPENDED", "DELETED", "BANNED"],
  "Invalid user status"
);

export type Role = z.infer<typeof roleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;

export const identifierPasswordSchema = z.object({
    identifier:z.union([
        z.email("Invalid email format"),
        // userId
        z.string().min(1, "User ID is required").max(50, "User ID must be less than 50 characters").regex(/^[a-zA-Z0-9_]+$/, "User ID can only contain letters, numbers, and underscores"),
        // phone
        z.string().length(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Phone number can only contain digits")
    ]),
    password:z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be less than 100 characters long").regex(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]+$/, "Password can only contain letters, numbers, and special characters")
});


export type IdentifierPasswordSchema = z.infer<typeof identifierPasswordSchema>;