import { Catalog } from "@appTypes/Catalog";
import { shopApi } from "./root";
import { validateData } from "@utils/validation";
import { PublicationListGetSchema } from "@schemas/Publication";
import { CatalogItemsAvailabilityGetSchema } from "@schemas/CatalogItem";
import { z } from "zod";

export const catalogApi = shopApi.injectEndpoints({
	endpoints: (build) => ({
		getCatalog: build.query<Catalog, void>({
			query: () => ({
				url: "/market/catalog",
				method: "GET",
			}),
            providesTags: ["Catalog"],
			transformResponse: (response) => {
				const publicationList = validateData(PublicationListGetSchema, response);
				const publications = publicationList.items;

				const items = publications.flatMap((publication) =>
					publication.items.map((item) => ({
						...item,
						preorder: publication.preorder,
						publicationLink: publication.link,
						shippingCostIncluded: publication.shippingCostIncluded,
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
				return {
					publications,
					items,
					categories,
				};
			},
		}),
		getItemsAvailability: build.query<z.infer<typeof CatalogItemsAvailabilityGetSchema>, void>({
			query: () => ({
				url: "/market/availability",
				method: "GET",
			}),
			providesTags: ["ItemsAvailability"],
			transformResponse: (response) => validateData(CatalogItemsAvailabilityGetSchema, response),
		}),
	}),
});

export const { useGetCatalogQuery, useGetItemsAvailabilityQuery } = catalogApi;
