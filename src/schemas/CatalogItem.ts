import { z } from "zod";

import { CreditInfoSchema } from "./Payment";
import { IdSchema, ISOToDateSchema } from "./Primitives";
import { ProductShopSchema } from "./Product";

export const CatalogItemShopSchema = z.object({
	id: IdSchema,
	product: ProductShopSchema,
	price: z.number(),
	discount: z.number().nullable(),
	variationIndex: z.number().nullable(),
	creditInfo: CreditInfoSchema.nullable(),
	createdAt: ISOToDateSchema,
});

export const CatalogItemsAvailabilitySchema = IdSchema.array();
