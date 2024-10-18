import { z } from "zod";
import { OrderCreateSchema, OrderGetSchema, OrderItemGetSchema, OrderStatusSchema } from "@schemas/Order";

export type OrderCreate = z.infer<typeof OrderCreateSchema>;
export type OrderItemGet = z.infer<typeof OrderItemGetSchema>;
export type OrderGet = z.infer<typeof OrderGetSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
