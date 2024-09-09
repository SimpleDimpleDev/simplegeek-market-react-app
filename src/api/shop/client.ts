import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, isAxiosError } from "axios";
import { z, ZodError, ZodSchema } from "zod";
import { OrderCreate } from "../../types/Order";
import { UserCartItem } from "../../types/UserItems";
import {
	CatalogResponseSchema,
	CatalogItemsAvailabilityResponseSchema,
	UserItemsResponseSchema,
	CheckoutItemsGetResponseSchema,
	OrderListGetResponseSchema,
	OrderGetResponseSchema,
	PaymentUrlResponseSchema,
} from "./schemas";

const axiosInstance = axios.create({
	baseURL: import.meta.env.SHOP_API_URL || "http://localhost:8000",
	withCredentials: true,
});

class ShopApiClient {
	private static client: AxiosInstance = axiosInstance;

	private static parseJson<T extends ZodSchema>(schema: T, data: unknown): z.infer<T> {
		try {
			return schema.parse(data);
		} catch (error) {
			if (error instanceof ZodError) {
				console.error(error.message);
				console.error(error.issues);
			}
			throw error;
		}
	}

	private static async makeRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
		return this.client
			.request(config)
			.catch(function (undefinedError) {
				if (isAxiosError(undefinedError)) {
					const axiosError = undefinedError as AxiosError;
					if (axiosError.response) {
						console.error(
							`ShopApi error: url: ${axiosError.response.config.url}, status: ${
								axiosError.response.status
							}, data: ${JSON.stringify(axiosError.response.data, null, 2)}`
						);
					} else if (axiosError.request) {
						console.error("ShopApiClient Request Error", axiosError.message);
					} else {
						console.error("ShopApiClient Request Config Error", axiosError.message);
					}
				} else {
					console.error("ShopApiClient unexpected error!");
					console.error(undefinedError);
				}
				throw undefinedError;
			})
			.then((response) => response);
	}

	private static makeUserActionRequest = async (config: AxiosRequestConfig): Promise<{ ok: boolean }> => {
		try {
			await this.makeRequest(config);
			return { ok: true };
		} catch (error) {
			const axiosError = error as AxiosError;
			console.log("makeUserActionRequest error");
			if (axiosError.response) {
				console.log(axiosError.response.status);
				if (axiosError.response.status === 400) {
					return { ok: false };
				}
			}
			throw error;
		}
	};

	// Catalog
	public static getCatalog = async () => {
		return this.makeRequest({
			method: "get",
			url: `/market/catalog`,
		}).then((response) => this.parseJson(CatalogResponseSchema, response.data));
	};

	public static getItemsAvailability = async () => {
		return this.makeRequest({
			method: "post",
			url: "/availability/catalog",
		}).then((response) => this.parseJson(CatalogItemsAvailabilityResponseSchema, response.data));
	};

	// User items
	public static getUserItems = async () => {
		return this.makeRequest({
			method: "get",
			url: "/user/items",
		}).then((response) => this.parseJson(UserItemsResponseSchema, response.data));
	};

	// Cart
	public static addCartItem = async (itemId: string) => {
		return this.makeUserActionRequest({
			method: "post",
			url: "/user/cart",
			params: { itemId },
		});
	};

	public static patchCartItem = async (itemId: string, action: "INCREMENT" | "DECREMENT") => {
		return this.makeUserActionRequest({
			method: "patch",
			url: "/user/cart",
			params: { itemId, action },
		});
	};

	public static removeCartItems = async (itemIds: string[]) => {
		return this.makeUserActionRequest({
			method: "delete",
			url: "/user/cart",
			data: { itemIds },
		});
	};

	// Favorites
	public static addFavoriteItem = async (itemId: string) => {
		return this.makeUserActionRequest({
			method: "post",
			url: "/user/favorites",
			params: { itemId },
		});
	};

	public static removeFavoriteItem = async (itemId: string) => {
		return this.makeUserActionRequest({
			method: "delete",
			url: "/user/favorites",
			params: { itemId },
		});
	};

	// Checkout
	public static checkout = async (items: UserCartItem[]) => {
		return this.makeUserActionRequest({
			method: "post",
			url: "/checkout",
			data: { items },
		});
	};

	public static getCheckoutItems = async () => {
		return this.makeRequest({
			method: "get",
			url: `/checkout`,
		})
			.then((response) => this.parseJson(CheckoutItemsGetResponseSchema, response.data))
			.catch(() => null);
	};

	// Order
	public static createOrder = async (order: OrderCreate) => {
		const response = await this.makeRequest({
			method: "post",
			url: "/order",
			data: order,
		});
		return this.parseJson(PaymentUrlResponseSchema, response.data);
	};

	public static getOrderList = async () => {
		return this.makeRequest({
			method: "get",
			url: `/order-list`,
		}).then((response) => this.parseJson(OrderListGetResponseSchema, response.data));
	};

	public static getOrder = async (id: string) => {
		return this.makeRequest({
			method: "get",
			url: `/order`,
			params: { id },
		}).then((response) => this.parseJson(OrderGetResponseSchema, response.data));
	};

	// Payment
	public static getPaymentUrl = async (invoiceId: string) => {
		const response = await this.makeRequest({
			method: "get",
			url: "/payment-link",
			params: { invoiceId },
		});
		return this.parseJson(PaymentUrlResponseSchema, response.data);
	};
}

export default ShopApiClient;
