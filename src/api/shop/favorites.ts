import { validateData } from "@utils/validation";
import { shopApi } from "./root";
import { FavoriteItemListSchema } from "@schemas/UserItems";
import { z } from "zod";

export const favoritesApi = shopApi.injectEndpoints({
	endpoints: (build) => ({
		getFavoriteItemList: build.query<z.infer<typeof FavoriteItemListSchema>, void>({
			query: () => ({
				url: "/user/favorites",
				method: "GET",
			}),
			providesTags: ["Favorites"],
			transformResponse: (response) => validateData(FavoriteItemListSchema, response),
		}),
		addFavoriteItem: build.mutation<void, { itemId: string }>({
			query: ({ itemId }) => ({
				url: "/user/favorites",
				method: "POST",
				params: { itemId },
			}),
			onQueryStarted: async ({ itemId }, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled;
					dispatch(
						favoritesApi.util.updateQueryData("getFavoriteItemList", undefined, (draft) => {
							draft.items.push({
								id: itemId,
							});
						})
					);
				} catch (error) {
					console.log(error);
				}
			},
		}),
		removeFavoriteItem: build.mutation<void, { itemId: string }>({
			query: ({ itemId }) => ({
				url: "/user/favorites",
				method: "DELETE",
				params: { itemId },
			}),
			onQueryStarted: async ({ itemId }, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled;
					dispatch(
						favoritesApi.util.updateQueryData("getFavoriteItemList", undefined, (draft) => {
							draft.items = draft.items.filter((item) => item.id !== itemId);
						})
					);
				} catch (error) {
					console.log(error);
				}
			},
		}),
	}),
});

export const { useGetFavoriteItemListQuery, useAddFavoriteItemMutation, useRemoveFavoriteItemMutation } = favoritesApi;
