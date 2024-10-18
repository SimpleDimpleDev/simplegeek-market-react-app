import { z } from "zod";
import { CatalogItemGetSchema } from "@schemas/CatalogItem";
import { PreorderShop } from "./Preorder";
import { ShippingCostIncludedSchema } from "@schemas/Preorder";

export type CatalogItemGet = z.infer<typeof CatalogItemGetSchema>;
export type CatalogItem = CatalogItemGet & {
	preorder: PreorderShop | null;
	publicationLink: string;
	shippingCostIncluded: z.infer<typeof ShippingCostIncludedSchema> | null;
};

