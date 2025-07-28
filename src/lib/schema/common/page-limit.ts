import { z } from "zod/v4";

export const page = z.string({error:"page must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{error:"page must be number and greater than 0"});
export const limit = z.string({error:"limit must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{error:"limit must be number and greater than 0"});

const pageInt = z.number({error:"page must be number"}).int().positive({error:"page must be greater than 0"});
const limitInt = z.number({error:"limit must be number"}).int().positive({error:"limit must be greater than 0"});


export const paginationSchema = z.object({
    currentPage:pageInt,
    limit: limitInt,
    totalPages: pageInt
});

export const pageLimitSchema = z.object({
    page: page,
    limit: limit
});

export type PaginationSchema = z.infer<typeof paginationSchema>;
export type PageLimitSchema = z.infer<typeof pageLimitSchema>;