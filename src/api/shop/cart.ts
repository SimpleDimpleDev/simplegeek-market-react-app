import { CartItemListSchema } from "@schemas/UserItems";
import { shopApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";
import { DetailedCartGetSchema } from "@schemas/Cart";

export const cartApi = shopApi.injectEndpoints({
	endpoints: (build) => ({
		getCartItemList: build.query<z.infer<typeof CartItemListSchema>, void>({
			query: () => "/cart",
			transformResponse: (response) => validateData(CartItemListSchema, response),
		}),
		getDetailedCart: build.query<z.infer<typeof DetailedCartGetSchema>, void>({
			query: () => ({
				url: "/cart/details",
				method: "GET",
			}),
			providesTags: ["Cart"],
			transformResponse: (response) => validateData(DetailedCartGetSchema, response),
		}),
		addCartItem: build.mutation<void, { itemId: string }>({
			query: ({ itemId }) => ({
				url: "/cart",
				method: "POST",
				params: { itemId },
			}),
			invalidatesTags: ["Cart"],
			onQueryStarted: async ({ itemId }, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled;
					dispatch(
						cartApi.util.updateQueryData("getCartItemList", undefined, (draft) => {
							draft.items.push({
								id: itemId,
								quantity: 1,
							});
						})
					);
				} catch (error) {
					console.log(error);
				}
			},
		}),
		patchCartItem: build.mutation<void, { itemId: string; action: "INCREMENT" | "DECREMENT" }>({
			query: ({ itemId, action }) => ({
				url: "/cart",
				method: "PATCH",
				params: { itemId, action },
			}),
			onQueryStarted: async ({ itemId, action }, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled;
					dispatch(
						cartApi.util.updateQueryData("getCartItemList", undefined, (draft) => {
							const itemIndex = draft.items.findIndex((item) => item.id === itemId);
							if (itemIndex > -1) {
								draft.items[itemIndex].quantity += action === "INCREMENT" ? 1 : -1;
							}
						})
					);
					dispatch(
						cartApi.util.updateQueryData("getDetailedCart", undefined, (draft) => {
							let item;
							for (const section of draft.sections) {
								for (const availableItem of section.availableItems) {
									if (availableItem.id === itemId) item = availableItem;
								}
								if (!item) {
									for (const unavailableItem of section.unavailableItems) {
										if (unavailableItem.id === itemId) item = unavailableItem;
									}
								}
								if (item) break;
							}
							if (!item) return;
							if (action === "INCREMENT") item.quantity += 1;
							if (action === "DECREMENT") item.quantity -= 1;
						})
					);
				} catch (error) {
					console.log(error);
				}
			},
		}),
		deleteCartItems: build.mutation<void, { itemIds: string[] }>({
			query: (body) => ({
				url: "/cart",
				method: "DELETE",
				body: body,
			}),
			onQueryStarted: async ({ itemIds }, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled;
					dispatch(
						cartApi.util.updateQueryData("getCartItemList", undefined, (draft) => {
							draft.items = draft.items.filter((item) => !itemIds.includes(item.id));
						})
					);
					dispatch(
						cartApi.util.updateQueryData("getDetailedCart", undefined, (draft) => {
							for (const section of draft.sections) {
								section.availableItems = section.availableItems.filter(
									(item) => !itemIds.includes(item.id)
								);
								section.unavailableItems = section.unavailableItems.filter(
									(item) => !itemIds.includes(item.id)
								);
							}
						})
					);
				} catch (error) {
					console.debug(error);
				}
			},
		}),
	}),
});

export const { useGetCartItemListQuery, useGetDetailedCartQuery, useAddCartItemMutation, usePatchCartItemMutation, useDeleteCartItemsMutation } =
	cartApi;
