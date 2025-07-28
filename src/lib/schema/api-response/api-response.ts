import {z} from "zod/v4";


export const apiResponseSchema = z.object({
  message: z.string(),
  status:z.enum(["success", "error", "fail"]),
  isOperational: z.boolean(),
  data: z.any().nullable(),
  statusCode: z.number()
});

export type ApiResponseSchema = z.infer<typeof apiResponseSchema>;