import { z } from "zod";
import { PreorderGetSchema, ShippingCostIncludedSchema } from "./Preorder";
import { CatalogItemCartSchema } from "./CatalogItem";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";

export const StockCartSectionSchema = z.object({
	type: z.literal("STOCK"),
	title: z.string(),
	availableItems: CatalogItemCartSchema.array(),
	unavailableItems: CatalogItemCartSchema.array(),
});

export const PreorderCartSectionSchema = z.object({
	type: z.literal("PREORDER"),
	title: z.string(),
	preorder: PreorderGetSchema,
	shippingCostIncluded: ShippingCostIncludedSchema,
	creditAvailable: z.boolean(),
	availableItems: CatalogItemCartSchema.array(),
	unavailableItems: CatalogItemCartSchema.array(),
});

export const DetailedCartSectionSchema = z.union([StockCartSectionSchema, PreorderCartSectionSchema]);

export const DetailedCartGetSchema = z.object({
	sections: DetailedCartSectionSchema.array(),
});

export const CheckoutDataSchema = z.object({
	items: CatalogItemCartSchema.array(),
	shouldSelectDelivery: z.boolean(),
	packages: PhysicalPropertiesSchema.array(),
	preorder: PreorderGetSchema.nullable(),
	price: z.object({
		original: z.number(),
		discount: z.number().nullable(),
		total: z.number(),
	}),
});
