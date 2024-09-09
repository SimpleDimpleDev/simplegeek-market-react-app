import { createSlice } from "@reduxjs/toolkit";
import { CatalogItemsAvailability } from "../../types/CatalogItem";
import { fetchCatalogItemsAvailability } from "./thunks";

interface AvailabilityState {
	items: CatalogItemsAvailability;
	loading: boolean;
}

const initialState: AvailabilityState = {
	items: [],
	loading: false,
};

export const availabilitySlice = createSlice({
	name: "availability",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCatalogItemsAvailability.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCatalogItemsAvailability.fulfilled, (state, action) => {
				state.items = action.payload;
				state.loading = false;
			})
			.addCase(fetchCatalogItemsAvailability.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default availabilitySlice.reducer;
