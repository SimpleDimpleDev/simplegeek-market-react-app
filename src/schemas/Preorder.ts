import { z } from "zod";

import { InvoiceShopSchema } from "./Payment";

export const PreorderStatusSchema = z.enum(
	["NEW", "FUNDING", "WAITING_FOR_RELEASE", "FOREIGN_SHIPPING", "LOCAL_SHIPPING", "DISPATCH", "FINISHED"],
	{ description: "PreorderStatus" }
);
export const ShippingCostIncludedSchema = z.enum(["FOREIGN", "FULL", "NOT"], { description: "ShippingCostIncluded" });

export const PreorderShopSchema = z.object(
	{
		id: z.string(),
		title: z.string(),
		status: PreorderStatusSchema,
		expectedArrival: z.string().nullable(),
	},
	{ description: "Preorder" }
);

export const PreorderOrderShopSchema = PreorderShopSchema.extend({
	shippingCostIncluded: ShippingCostIncludedSchema,
	foreignShippingInvoice: InvoiceShopSchema.nullable(),
	localShippingInvoice: InvoiceShopSchema.nullable(),
});
