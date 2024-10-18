import { FAQItemListGetSchema } from "@schemas/FAQ";
import { shopApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

const FAQItemApi = shopApi.injectEndpoints({
	endpoints: (build) => ({
		getFAQItemList: build.query<z.infer<typeof FAQItemListGetSchema>, void>({
			query: () => "/faq-item-list",
			transformResponse: (response) => validateData(FAQItemListGetSchema, response),
		}),
	}),
});

export const { useGetFAQItemListQuery } = FAQItemApi;
