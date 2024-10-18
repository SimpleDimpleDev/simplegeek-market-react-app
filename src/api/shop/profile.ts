import { z } from "zod";
import { shopApi } from "./root";
import { OrderListGetSchema, OrderGetSchema } from "@schemas/Order";
import { validateData } from "@utils/validation";
import { DeliverySchema } from "@schemas/Delivery";

const profileApi = shopApi.injectEndpoints({
	endpoints: (build) => ({
		getOrderList: build.query<z.infer<typeof OrderListGetSchema>, void>({
			query: () => ({
				url: "/profile/order-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderListGetSchema, response),
		}),
		getOrder: build.query<z.infer<typeof OrderGetSchema>, { id: string }>({
			query: ({ id }) => ({
				url: "/profile/order",
				method: "GET",
				params: { id },
			}),
			transformResponse: (response) => validateData(OrderGetSchema, response),
		}),
		getSavedDelivery: build.query<z.infer<typeof DeliverySchema>, void>({
			query: () => ({
				url: "/profile/saved-delivery",
				method: "GET",
			}),
			transformResponse: (response) => validateData(DeliverySchema, response),
		}),
	}),
});

export const { useGetOrderListQuery, useGetOrderQuery, useGetSavedDeliveryQuery } = profileApi;
