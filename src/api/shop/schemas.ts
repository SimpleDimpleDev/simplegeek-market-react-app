import { UserCartItemSchema, UserItemsSchema } from "../../schemas/UserItems";
import { PublicationsSchema } from "../../schemas/Catalog";
import { CatalogItemsAvailabilitySchema } from "../../schemas/CatalogItem";
import { OrderCreateSchema, OrderShopSchema } from "../../schemas/Order";
import { z } from "zod";

export const CatalogResponseSchema = PublicationsSchema;
export const CatalogItemsAvailabilityResponseSchema = CatalogItemsAvailabilitySchema;

export const UserItemsResponseSchema = UserItemsSchema;
export const CheckoutItemsGetResponseSchema = z.object({
	items: UserCartItemSchema.array(),
});
export const CreateOrderRequestSchema = OrderCreateSchema;
export const OrderGetResponseSchema = OrderShopSchema;
export const OrderListGetResponseSchema = z.object({
	items: OrderShopSchema.array(),
});
export const PaymentUrlResponseSchema = z.object({
	paymentUrl: z.string().url(),
});
