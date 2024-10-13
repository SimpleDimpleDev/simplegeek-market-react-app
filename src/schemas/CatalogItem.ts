import { z } from "zod";

import { CreditInfoSchema } from "./Payment";
import { IdSchema, ISOToDateSchema } from "./Primitives";
import { ProductShopSchema } from "./Product";

export const CatalogItemShopSchema = z.object(
	{
		id: IdSchema,
		product: ProductShopSchema,
		rating: z.number(),
		price: z.number(),
		discount: z.number().nullable(),
		variationIndex: z.number().nullable(),
		creditInfo: CreditInfoSchema.nullable(),
		createdAt: ISOToDateSchema,
	},
	{ description: "CatalogItem" }
);

export const CatalogItemsAvailabilitySchema = z.object(
	{
		items: IdSchema.array(),
	},
	{ description: "CatalogItemsAvailability" }
);
