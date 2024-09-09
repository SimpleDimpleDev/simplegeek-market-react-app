import { z } from "zod";
import { ProductAdminSchema, ProductCreateSchema } from "~/schemas/Product";

export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductAdmin = z.infer<typeof ProductAdminSchema>;
