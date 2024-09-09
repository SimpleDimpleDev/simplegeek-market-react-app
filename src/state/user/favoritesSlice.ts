import { createSlice } from "@reduxjs/toolkit";
import { UserFavoriteItem } from "../../types/UserItems";
import { fetchUserItems, addFavoriteItem, removeFavoriteItem } from "./thunks";

interface UserFavoritesState {
	items: UserFavoriteItem[];
	loading: boolean;
}

const initialState: UserFavoritesState = {
	items: [],
	loading: false,
};

export const userFavoritesSlice = createSlice({
	name: "favorites",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserItems.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchUserItems.fulfilled, (state, action) => {
				state.items = action.payload.favorites;
				state.loading = false;
			})
			.addCase(fetchUserItems.rejected, (state) => {
				state.loading = false;
			});
		builder
			.addCase(addFavoriteItem.pending, (state) => {
				state.loading = true;
			})
			.addCase(addFavoriteItem.fulfilled, (state, action) => {
				if (action.payload.ok) {
					state.items = [
						...state.items,
						{
							id: action.meta.arg.itemId,
						},
					];
				}
				state.loading = false;
			})
			.addCase(addFavoriteItem.rejected, (state) => {
				state.loading = false;
			});
		builder
			.addCase(removeFavoriteItem.pending, (state) => {
				state.loading = true;
			})
			.addCase(removeFavoriteItem.fulfilled, (state, action) => {
				if (action.payload.ok) {
					state.items = state.items.filter((item) => item.id !== action.meta.arg.itemId);
				}
				state.loading = false;
			})
			.addCase(removeFavoriteItem.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default userFavoritesSlice.reducer;
