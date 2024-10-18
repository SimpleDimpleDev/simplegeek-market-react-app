import { z } from "zod";

import { CreditInfoGetSchema } from "./Credit";
import { IdSchema, ISOToDateSchema } from "./Primitives";
import { ProductGetSchema } from "./Product";

export const CatalogItemGetSchema = z
	.object({
		id: IdSchema,
		product: ProductGetSchema,
		rating: z.number(),
		price: z.number(),
		discount: z.number().nullable(),
		variationIndex: z.number().nullable(),
		creditInfo: CreditInfoGetSchema.nullable(),
		createdAt: ISOToDateSchema,
	})
	.describe("CatalogItemGet");

export const CatalogItemsAvailabilityGetSchema = z
	.object({
		items: IdSchema.array(),
	})
	.describe("CatalogItemsAvailabilityGet");
