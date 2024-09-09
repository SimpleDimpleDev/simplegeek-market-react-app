import { z } from "zod";
import { FilterGroupAdminSchema, FilterGroupGetSchema, FilterGroupNewSchema } from "~/schemas/FilterGroup";

export type FilterGroupGet = z.infer<typeof FilterGroupGetSchema>;
export type FilterGroupCreate = z.infer<typeof FilterGroupNewSchema>;
export type FilterGroupAdmin = z.infer<typeof FilterGroupAdminSchema>;
