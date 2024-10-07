import { z } from "zod";

import { InvoiceShopSchema } from "./Payment";

export const PreorderStatusSchema = z.enum([
	"NEW",
	"FUNDING",
	"WAITING_FOR_RELEASE",
	"FOREIGN_SHIPPING",
	"LOCAL_SHIPPING",
	"DISPATCH",
	"FINISHED",
]);
export const ShippingCostIncludedSchema = z.enum(["FOREIGN", "FULL", "NOT"]);

export const PreorderShopSchema = z.object({
	title: z.string(),
	status: PreorderStatusSchema,
	expectedArrival: z.string().nullable(),
});

export const PreorderOrderShopSchema = PreorderShopSchema.extend({
	shippingCostIncluded: ShippingCostIncludedSchema,
	foreignShippingInvoice: InvoiceShopSchema.nullable(),
	localShippingInvoice: InvoiceShopSchema.nullable(),
});
