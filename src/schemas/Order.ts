import { z } from "zod";

import { CreditGetSchema, InvoiceGetSchema } from "./Credit";
import { IdSchema, ISOToDateSchema } from "./Primitives";
import { DeliverySchema } from "./Delivery";
import { PreorderGetSchema, ShippingCostIncludedSchema } from "./Preorder";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";

export const PaymentUrlGetSchema = z
	.object({
		paymentUrl: z.string().url(),
	})
	.describe("PaymentUrlGet");

export const OrderStatusSchema = z.enum([
	"CANCELLED",
	"UNPAID",
	"ACCEPTED",
	"DELIVERY",
	"READY_FOR_PICKUP",
	"FINISHED",
]);

export const OrderDeliverySetSchema = z
	.object({
		orderId: IdSchema,
		delivery: DeliverySchema,
		saveDelivery: z.boolean(),
	})
	.describe("OrderDeliverySet");

export const OrderCreateSchema = z
	.object({
		creditIds: IdSchema.array(),
		delivery: DeliverySchema.nullable(),
		saveDelivery: z.boolean(),
	})
	.describe("OrderCreate");

export const OrderItemGetSchema = z
	.object({
		id: IdSchema,
		title: z.string(),
		image: z.string(),
		quantity: z.number(),
		sum: z.number(),
		credit: CreditGetSchema.nullable(),
		physicalProperties: PhysicalPropertiesSchema.nullable(),
	})
	.describe("OrderItemGet");

export const OrderDeliveryGetSchema = DeliverySchema.extend({
	tracking: z
		.object({
			code: z.string(),
			link: z.string(),
		})
		.nullable(),
}).describe("OrderDeliveryGet");

export const OrderPreorderGetSchema = PreorderGetSchema.extend({
	shippingCostIncluded: ShippingCostIncludedSchema,
	foreignShippingInvoice: InvoiceGetSchema.nullable(),
	localShippingInvoice: InvoiceGetSchema.nullable(),
	credit: z
		.object({
			paidAmount: z.number(),
			unpaidAmount: z.number(),
		})
		.nullable(),
}).describe("OrderPreorderGet");

export const OrderGetSchema = z
	.object({
		id: IdSchema,
		createdAt: ISOToDateSchema,
		status: OrderStatusSchema,
		delivery: OrderDeliveryGetSchema.nullable(),
		preorder: OrderPreorderGetSchema.nullable(),
		items: OrderItemGetSchema.array(),
		initialInvoice: InvoiceGetSchema,
	})
	.describe("OrderGet");

export const OrderActionsSchema = z.object({
	setDelivery: z.object({
		enabled: z.boolean(),
		packages: PhysicalPropertiesSchema.array(),
	}),
	cancel: z.boolean(),
});

export const OrderListGetSchema = z
	.object({
		items: OrderGetSchema.array(),
	})
	.describe("OrderGetList");
