import { z } from "zod";
import { shopApi } from "./root";
import { OrderListSchema, OrderShopSchema } from "@schemas/Order";
import { validateData } from "@utils/validation";
import { DeliverySchema } from "@schemas/Delivery";

const profileApi = shopApi.injectEndpoints({
	endpoints: (build) => ({
		getOrderList: build.query<z.infer<typeof OrderListSchema>, void>({
			query: () => ({
				url: "/profile/order-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderListSchema, response),
		}),
		getOrder: build.query<z.infer<typeof OrderShopSchema>, { id: string }>({
			query: ({ id }) => ({
				url: "/profile/order",
				method: "GET",
				params: { id },
			}),
			transformResponse: (response) => validateData(OrderShopSchema, response),
		}),
		getDeliveryData: build.query<z.infer<typeof DeliverySchema>, void>({
			query: () => ({
				url: "/profile/delivery-data",
				method: "GET",
			}),
			transformResponse: (response) => validateData(DeliverySchema, response),
		}),
	}),
});

export const { useGetOrderListQuery, useGetOrderQuery, useGetDeliveryDataQuery } = profileApi;
