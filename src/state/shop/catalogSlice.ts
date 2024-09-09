import { createSlice } from "@reduxjs/toolkit";
import { PublicationShop } from "../../types/Publication";
import { CatalogItem } from "../../types/CatalogItem";
import { fetchCatalog } from "./thunks";

interface CatalogState {
	publications: PublicationShop[];
	items: CatalogItem[];
	loading: boolean;
}

const initialState: CatalogState = {
	publications: [],
	items: [],
	loading: false,
};

export const catalogSlice = createSlice({
	name: "catalog",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCatalog.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCatalog.fulfilled, (state, action) => {
				const publications = action.payload.items;
				const items = publications.flatMap((publication) =>
					publication.items.map((item) => ({
						...item,
						preorder: publication.preorder,
						publicationLink: publication.link,
					}))
				);
				state.publications = publications;
				state.items = items;
				state.loading = false;
			});
	},
});

export default catalogSlice.reducer;
