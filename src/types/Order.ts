import { z } from "zod";
import {
	OrderCreateSchema,
	OrderShopSchema,
	OrderItemShopSchema,
	OrderStatusSchema,
} from "../schemas/Order";

export type OrderCreate = z.infer<typeof OrderCreateSchema>;
export type OrderItemShop = z.infer<typeof OrderItemShopSchema>;
export type OrderShop = z.infer<typeof OrderShopSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
