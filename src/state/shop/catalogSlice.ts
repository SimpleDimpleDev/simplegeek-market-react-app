import { createSlice } from "@reduxjs/toolkit";
import { PublicationShop } from "../../types/Publication";
import { CatalogItem } from "../../types/CatalogItem";
import { fetchCatalog } from "./thunks";
import { CategoryShop } from "../../types/Category";

interface CatalogState {
	publications: PublicationShop[];
	items: CatalogItem[];
	categories: CategoryShop[];
	loading: boolean;
}

const initialState: CatalogState = {
	publications: [],
	items: [],
	categories: [],
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
				const seenIds = new Set();
				const categories = publications
					.flatMap((publication) => publication.items.map((item) => item.product.category))
					.filter((category) => {
						if (seenIds.has(category.link)) {
							return false;
						}
						seenIds.add(category.link);
						return true;
					});
				state.publications = publications;
				state.items = items;
				state.categories = categories;
				state.loading = false;
			});
	},
});

export default catalogSlice.reducer;
