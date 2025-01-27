import { z } from "zod";

export const PreorderStatusSchema = z
	.enum(["WAITING_FOR_RELEASE", "FOREIGN_SHIPPING", "LOCAL_SHIPPING", "DISPATCH", "FINISHED"])
	.describe("PreorderStatus");
export const ShippingCostIncludedSchema = z.enum(["FOREIGN", "FULL", "NOT"]).describe("ShippingCostIncluded");

export const PreorderGetSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		status: PreorderStatusSchema,
		expectedArrival: z.string().nullable(),
	})
	.describe("PreorderGet");
