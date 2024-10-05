import { z } from "zod";

import { CreditShopSchema, InvoiceShopSchema } from "./Payment";
import { IdSchema, ISOToDateSchema } from "./Primitives";
import { DeliverySchema, DeliveryOrderSchema } from "./Delivery";
import { PreorderOrderShopSchema } from "./Preorder";
import { UserCartItemSchema } from "./UserItems";

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

export const OrderCreateSchema = z.object({
	creditIds: IdSchema.array(),
	delivery: DeliverySchema.nullable(),
});

export const OrderItemShopSchema = z.object({
	id: IdSchema,
	title: z.string(),
	image: z.string(),
	quantity: z.number(),
	sum: z.number(),
	credit: CreditShopSchema.nullable(),
});

export const OrderShopSchema = z.object({
	id: IdSchema,
	status: OrderStatusSchema,
	createdAt: ISOToDateSchema,
	delivery: DeliveryOrderSchema.nullable(),
	preorder: PreorderOrderShopSchema.nullable(),
	items: OrderItemShopSchema.array(),
	initialInvoice: InvoiceShopSchema,
});

export const OrderListSchema = z.object({
	items: OrderShopSchema.array(),
});
