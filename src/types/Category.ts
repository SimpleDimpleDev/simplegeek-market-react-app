import { z } from "zod";
import { CategoryAdminSchema, CategoryCreateSchema, CategoryShopSchema } from "~/schemas/Category";

export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;
export type CategoryShop = z.infer<typeof CategoryShopSchema>;
export type CategoryAdmin = z.infer<typeof CategoryAdminSchema>;
