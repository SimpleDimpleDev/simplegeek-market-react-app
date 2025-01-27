import { OrderCreate } from "@appTypes/Order";
import { shopApi } from "./root";
import { z } from "zod";
import { validateData } from "@utils/validation";
import { UserCartItem } from "@appTypes/UserItems";
import { CheckoutDataSchema, PaymentUrlGetSchema } from "@schemas/Order";

const orderApi = shopApi.injectEndpoints({
	endpoints: (build) => ({
		checkout: build.mutation<void, { items: UserCartItem[] }>({
			query: (body) => ({
				url: "/checkout",
				method: "POST",
				body,
			}),
		}),
		getCheckoutData: build.query<z.infer<typeof CheckoutDataSchema>, void>({
			query: () => ({
				url: "/checkout",
				method: "GET",
			}),
			transformResponse: (response) => validateData(CheckoutDataSchema, response),
		}),
		createOrder: build.mutation<z.infer<typeof PaymentUrlGetSchema>, OrderCreate>({
			query: (body) => ({
				url: "/order",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Cart"],
			transformResponse: (response) => validateData(PaymentUrlGetSchema, response),
		}),
		getPaymentUrl: build.query<z.infer<typeof PaymentUrlGetSchema>, { invoiceId: string }>({
			query: ({ invoiceId }) => ({
				url: `/payment-link`,
				method: "GET",
				params: { invoiceId },
			}),
			transformResponse: (response) => validateData(PaymentUrlGetSchema, response),
		}),
	}),
});

export const {
	useCheckoutMutation,
	useGetCheckoutDataQuery,
	useCreateOrderMutation,
	useGetPaymentUrlQuery,
	useLazyGetPaymentUrlQuery,
} = orderApi;
