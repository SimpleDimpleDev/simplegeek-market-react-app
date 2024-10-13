import { validateData } from "@utils/validation";
import { shopApi } from "./root";
import { TrackedItemListSchema } from "@schemas/UserItems";
import { z } from "zod";

export const trackedApi = shopApi.injectEndpoints({
	endpoints: (build) => ({
		getTrackedItemList: build.query<z.infer<typeof TrackedItemListSchema>, void>({
			query: () => ({
				url: "/tracked",
				method: "GET",
			}),
			providesTags: ["Tracked"],
			transformResponse: (response) => validateData(TrackedItemListSchema, response),
		}),
		addTrackedItem: build.mutation<void, { itemId: string }>({
			query: ({ itemId }) => ({
				url: "/tracked",
				method: "POST",
				params: { itemId },
			}),
			onQueryStarted: async ({ itemId }, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled;
					dispatch(
						trackedApi.util.updateQueryData("getTrackedItemList", undefined, (draft) => {
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
		removeTrackedItem: build.mutation<void, { itemId: string }>({
			query: ({ itemId }) => ({
				url: "/tracked",
				method: "DELETE",
				params: { itemId },
			}),
			onQueryStarted: async ({ itemId }, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled;
					dispatch(
						trackedApi.util.updateQueryData("getTrackedItemList", undefined, (draft) => {
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

export const { useGetTrackedItemListQuery, useAddTrackedItemMutation, useRemoveTrackedItemMutation } = trackedApi;
