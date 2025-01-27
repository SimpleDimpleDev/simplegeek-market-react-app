import { z } from "zod";
import { shopApi } from "./root";
import { OrderListGetSchema, OrderGetSchema, OrderActionsSchema, OrderDeliverySetSchema } from "@schemas/Order";
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
		setOrderDelivery: build.mutation<void, z.infer<typeof OrderDeliverySetSchema>>({
			query: (data) => ({
				url: "/profile/order/delivery",
				method: "PUT",
				body: data,
			}),
		}),
		getOrderActions: build.query<z.infer<typeof OrderActionsSchema>, { id: string }>({
			query: ({ id }) => ({
				url: "/profile/order/actions",
				method: "GET",
				params: { id },
			}),
			transformResponse: (response) => validateData(OrderActionsSchema, response),
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

export const {
	useGetOrderListQuery,
	useGetOrderQuery,
	useGetSavedDeliveryQuery,
	useGetOrderActionsQuery,
	useSetOrderDeliveryMutation,
} = profileApi;
