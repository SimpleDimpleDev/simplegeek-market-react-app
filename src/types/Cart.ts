import { DetailedCartGetSchema, DetailedCartSectionSchema } from "@schemas/Cart";
import { CatalogItemCartSchema } from "@schemas/CatalogItem";
import { z } from "zod";

export type CatalogItemCart = z.infer<typeof CatalogItemCartSchema>;
export type DetailedCartSection = z.infer<typeof DetailedCartSectionSchema>;
export type DetailedCartGet = z.infer<typeof DetailedCartGetSchema>;
