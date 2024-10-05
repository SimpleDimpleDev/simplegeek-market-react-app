import { CartItemListSchema } from "@schemas/UserItems";
import { shopApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

export const cartApi = shopApi.injectEndpoints({
	endpoints: (build) => ({
		getCartItemList: build.query<z.infer<typeof CartItemListSchema>, void>({
			query: () => ({
				url: "/user/cart",
				method: "GET",
			}),
			providesTags: ["Cart"],
			transformResponse: (response) => validateData(CartItemListSchema, response),
		}),
		addCartItem: build.mutation<void, { itemId: string }>({
			query: ({ itemId }) => ({
				url: "/user/cart",
				method: "POST",
				params: { itemId },
			}),
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
				url: "/user/cart",
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
				} catch (error) {
					console.log(error);
				}
			},
		}),
		deleteCartItems: build.mutation<void, { itemIds: string[] }>({
			query: (body) => ({
				url: "/user/cart",
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
				} catch (error) {
					console.log(error);
				}
			},
		}),
	}),
});

export const { useGetCartItemListQuery, useAddCartItemMutation, usePatchCartItemMutation, useDeleteCartItemsMutation } =
	cartApi;
