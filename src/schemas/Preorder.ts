import { z } from "zod";

import { ISOToDateSchema } from "./Primitives";
import { InvoiceShopSchema } from "./Payment";

export const PreorderStatusSchema = z.enum([
	"NEW",
	"FUNDING",
	"WAITING_FOR_RELEASE",
	"SHIPPING",
	"DISPATCH",
	"FINISHED",
]);
export const ShippingCostIncludedSchema = z.enum(["FOREIGN", "FULL", "NOT"]);

export const PreorderShopSchema = z.object({
	title: z.string(),
	status: PreorderStatusSchema,
	expectedArrival: ISOToDateSchema.nullable(),
});

export const PreorderOrderShopSchema = PreorderShopSchema.extend({
	shippingCostIncluded: ShippingCostIncludedSchema,
	foreignShippingInvoice: InvoiceShopSchema.nullable(),
	localShippingInvoice: InvoiceShopSchema.nullable(),
});
