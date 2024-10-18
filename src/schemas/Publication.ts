import { z } from "zod";

import { CatalogItemGetSchema } from "./CatalogItem";
import { PreorderGetSchema, ShippingCostIncludedSchema } from "./Preorder";

export const PublicationGetSchema = z
	.object({
		link: z.string(),
		preorder: PreorderGetSchema.nullable(),
		items: CatalogItemGetSchema.array().nonempty(),
		shippingCostIncluded: ShippingCostIncludedSchema.nullable(),
	})
	.describe("PublicationGet");

export const PublicationListGetSchema = z
	.object({
		items: PublicationGetSchema.array(),
	})
	.describe("PublicationListGet");
