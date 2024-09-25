import { z } from "zod";
import { CatalogItemShopSchema, CatalogItemsAvailabilitySchema } from "../schemas/CatalogItem";
import { PreorderShop } from "./Preorder";

export type CatalogItemShop = z.infer<typeof CatalogItemShopSchema>;
export type CatalogItem = CatalogItemShop & {
	preorder: PreorderShop | null;
	publicationLink: string;
};

export type CatalogItemsAvailability = z.infer<typeof CatalogItemsAvailabilitySchema>;
