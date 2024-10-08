import { z } from "zod";

import { CreditInfoSchema } from "./Payment";
import { IdSchema, ISOToDateSchema } from "./Primitives";
import { ProductShopSchema } from "./Product";

export const DiscountSchema = z.object({
	type: z.enum(["FIXED", "PERCENTAGE"]),
	value: z.number(),
});

export const CatalogItemShopSchema = z.object({
	id: IdSchema,
	product: ProductShopSchema,
	rating: z.number(),
	price: z.number(),
	discount: DiscountSchema.nullable(),
	variationIndex: z.number().nullable(),
	creditInfo: CreditInfoSchema.nullable(),
	createdAt: ISOToDateSchema,
});

export const CatalogItemsAvailabilitySchema = IdSchema.array();
