import {z} from "zod/v4";

export const UserChartDataSchema = z.object({
  date: z.string(), // or z.coerce.date() if you want to parse to Date
  count: z.number(),
});

export const UserChartDataArraySchema = z.array(UserChartDataSchema);

export type UserChartData = z.infer<typeof UserChartDataSchema>;
export type UserChartDataArray = z.infer<typeof UserChartDataArraySchema>;
