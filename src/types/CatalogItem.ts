import { z } from "zod";
import { CatalogItemShopSchema, CatalogItemsAvailabilitySchema } from "../schemas/CatalogItem";
import { PreorderShop } from "./Preorder";
import { ShippingCostIncludedSchema } from "@schemas/Preorder";

export type CatalogItemShop = z.infer<typeof CatalogItemShopSchema>;
export type CatalogItem = CatalogItemShop & {
	preorder: PreorderShop | null;
	publicationLink: string;
	shippingCostIncluded: z.infer<typeof ShippingCostIncludedSchema> | null;
};

export type CatalogItemsAvailability = z.infer<typeof CatalogItemsAvailabilitySchema>;
