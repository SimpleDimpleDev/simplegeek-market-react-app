import { z } from "zod";

import { IdSchema } from "./Primitives";

const BaseUserItemSchema = z.object({
	id: IdSchema,
});

export const UserCartItemSchema = BaseUserItemSchema.extend({
	quantity: z.number(),
});

export const CartItemListSchema = z.object(
	{
		items: UserCartItemSchema.array(),
	},
	{ description: "CartItemList" }
);

export const UserFavoriteItemSchema = BaseUserItemSchema.extend({});

export const FavoriteItemListSchema = z.object(
	{
		items: UserFavoriteItemSchema.array(),
	},
	{ description: "FavoriteItemList" }
);

export const UserTrackedItemSchema = BaseUserItemSchema.extend({});

export const TrackedItemListSchema = z.object(
	{
		items: UserTrackedItemSchema.array(),
	},
	{ description: "TrackedItemList" }
);
