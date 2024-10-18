import { PreorderGetSchema, PreorderStatusSchema } from "@schemas/Preorder";
import { z } from "zod";

export type PreorderShop = z.infer<typeof PreorderGetSchema>;
export type PreorderStatus = z.infer<typeof PreorderStatusSchema>;
