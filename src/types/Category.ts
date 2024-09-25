import { z } from "zod";
import { CategoryShopSchema } from "../schemas/Category";

export type CategoryShop = z.infer<typeof CategoryShopSchema>;
