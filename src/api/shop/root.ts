import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shopApi = createApi({
	reducerPath: "shopApi",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.SHOP_API_URL,
		credentials: "include",
	}),
    tagTypes: ["Catalog", "ItemsAvailability", "Cart", "Favorites"],
	endpoints: () => ({}),
});

export { shopApi };
