import { createSlice } from "@reduxjs/toolkit";
import { UserCartItem } from "../../types/UserItems";
import { fetchUserItems, addCartItem, patchCartItem, removeCartItems } from "./thunks";

interface UserCartState {
	items: UserCartItem[];
	loading: boolean;
}

const initialState: UserCartState = {
	items: [],
	loading: false,
};

export const UserCartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserItems.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchUserItems.fulfilled, (state, action) => {
				state.items = action.payload.cart;
				state.loading = false;
			})
			.addCase(fetchUserItems.rejected, (state) => {
				state.loading = false;
			});
		builder
			.addCase(addCartItem.pending, (state) => {
				state.loading = true;
			})
			.addCase(addCartItem.fulfilled, (state, action) => {
				if (action.payload.ok) {
					state.items = [
						...state.items,
						{
							id: action.meta.arg.itemId,
							quantity: 1,
						},
					];
				}
				state.loading = false;
			})
			.addCase(addCartItem.rejected, (state) => {
				state.loading = false;
			});
		builder
			.addCase(patchCartItem.pending, (state) => {
				state.loading = true;
			})
			.addCase(patchCartItem.fulfilled, (state, action) => {
				if (action.payload.ok) {
					state.items = state.items.map((item) => {
						if (item.id === action.meta.arg.itemId) {
							return {
								...item,
								quantity: item.quantity + (action.meta.arg.action === "INCREMENT" ? 1 : -1),
							};
						}
						return item;
					});
				}
				state.loading = false;
			})
			.addCase(patchCartItem.rejected, (state) => {
				state.loading = false;
			});
		builder
			.addCase(removeCartItems.pending, (state) => {
				state.loading = true;
			})
			.addCase(removeCartItems.fulfilled, (state, action) => {
				if (action.payload.ok) {
					state.items = state.items.filter((item) => !action.meta.arg.itemIds.includes(item.id));
				}
				state.loading = false;
			})
			.addCase(removeCartItems.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default UserCartSlice.reducer;
