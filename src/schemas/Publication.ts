import { z } from "zod";

import { CatalogItemShopSchema } from "./CatalogItem";
import { PreorderShopSchema, ShippingCostIncludedSchema } from "./Preorder";

export const PublicationShopSchema = z.object({
	link: z.string(),
	preorder: PreorderShopSchema.nullable(),
	items: CatalogItemShopSchema.array().nonempty(),
	shippingCostIncluded: ShippingCostIncludedSchema.nullable(),
});

export const PublicationListSchema = z.object({
	items: PublicationShopSchema.array(),
});
