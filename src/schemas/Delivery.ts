import { z } from "zod";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";

export const DeliveryServiceSchema = z.enum(["SELF_PICKUP", "CDEK"]);

export const DeliveryPointSchema = z.object(
	{
		address: z.string(),
		code: z.string(),
	},
	{ description: "DeliveryPoint" }
);

export const RecipientSchema = z.object(
	{
		fullName: z.string(),
		phone: z.string(),
	},
	{ description: "Recipient" }
);

export const DeliveryPackageSchema = PhysicalPropertiesSchema;

export const DeliverySchema = z.object(
	{
		recipient: RecipientSchema,
		service: DeliveryServiceSchema,
		point: DeliveryPointSchema.nullable(),
	},
	{ description: "Delivery" }
);

export const DeliveryOrderSchema = DeliverySchema.extend({
	tracking: z
		.object({
			code: z.string(),
			link: z.string(),
		})
		.nullable(),
});
