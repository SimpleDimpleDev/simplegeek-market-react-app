import { PreorderShopSchema, PreorderStatusSchema } from "../schemas/Preorder";
import { z } from "zod";

export type PreorderShop = z.infer<typeof PreorderShopSchema>;
export type PreorderStatus = z.infer<typeof PreorderStatusSchema>;
