import { z } from "zod";

import { CreditGetSchema, InvoiceGetSchema } from "./Credit";
import { IdSchema, ISOToDateSchema } from "./Primitives";
import { DeliverySchema } from "./Delivery";
import { PreorderGetSchema, ShippingCostIncludedSchema } from "./Preorder";
import { UserCartItemSchema } from "./UserItems";
import { PhysicalPropertiesSchema } from "./PhysicalProperties";

export const PaymentUrlGetSchema = z
	.object({
		paymentUrl: z.string().url(),
	})
	.describe("PaymentUrlGet");

export const CheckoutItemListSchema = z.object({
	items: UserCartItemSchema.array(),
});

export const OrderStatusSchema = z.enum([
	"CANCELLED",
	"UNPAID",
	"ACCEPTED",
	"DELIVERY",
	"READY_FOR_PICKUP",
	"FINISHED",
]);

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
		catalogItemLink: z.string().nullable(),
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
}).describe("OrderPreorderGet");

export const OrderGetSchema = z
	.object({
		id: IdSchema,
		status: OrderStatusSchema,
		createdAt: ISOToDateSchema,
		delivery: OrderDeliveryGetSchema.nullable(),
		preorder: OrderPreorderGetSchema.nullable(),
		items: OrderItemGetSchema.array(),
		initialInvoice: InvoiceGetSchema,
	})
	.describe("OrderGet");

export const OrderListGetSchema = z
	.object({
		items: OrderGetSchema.array(),
	})
	.describe("OrderGetList");
