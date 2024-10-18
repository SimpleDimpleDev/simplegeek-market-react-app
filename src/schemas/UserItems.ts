import { z } from "zod";

import { IdSchema } from "./Primitives";

const BaseUserItemSchema = z.object({
	id: IdSchema,
});

export const UserCartItemSchema = BaseUserItemSchema.extend({
	quantity: z.number(),
}).describe("UserCartItem");

export const CartItemListSchema = z
	.object({
		items: UserCartItemSchema.array(),
	})
	.describe("CartItemList");

export const UserFavoriteItemSchema = BaseUserItemSchema.extend({}).describe("UserFavoriteItem");

export const FavoriteItemListSchema = z
	.object({
		items: UserFavoriteItemSchema.array(),
	})
	.describe("FavoriteItemList");

export const UserTrackedItemSchema = BaseUserItemSchema.extend({}).describe("UserTrackedItem");

export const TrackedItemListSchema = z
	.object({
		items: UserTrackedItemSchema.array(),
	})
	.describe("TrackedItemList");
