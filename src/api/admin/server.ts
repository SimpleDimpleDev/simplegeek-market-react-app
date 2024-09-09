import { OrderAdminSchema } from "~/schemas/Order";
import { BaseServerApiClient } from "../baseServerApiClient";
import {
	CategoryListAdminResponseSchema,
	FAQItemTableAdminResponseSchema,
	FilterGroupListAdminResponseSchema,
	OrderGetAdminResponseSchema,
	OrderListGetAdminResponseSchema,
	ProductGetAdminResponseSchema,
	ProductListGetAdminResponseSchema,
	PublicationGetAdminResponseSchema,
	PublicationListGetAdminResponseSchema,
	UserListGetAdminResponseSchema,
} from "./schemas";

export class ServerAdminApiClient extends BaseServerApiClient {
	constructor(shopApiUrl: string) {
		super(shopApiUrl);
	}

	loadFAQItemsTable = async (userRequest: Request) => {
		return this.redirectUserRequest(userRequest, {
			method: "GET",
			url: "/admin/faq-item/table",
		})
			.then((response) => this.parseJson(FAQItemTableAdminResponseSchema, response.data))
			.catch((error) => {
				console.error("Failed to load FAQ items table");
				throw new Response("Failed to load FAQ items table", { status: 407 });
			});
	};

	loadFilterGroupList = async (userRequest: Request) => {
		try {
			return this.redirectUserRequest(userRequest, {
				method: "get",
				url: `/admin/filter-group-list`,
			}).then((response) => this.parseJson(FilterGroupListAdminResponseSchema, response.data));
		} catch (error) {
			console.error("Failed to get filter groups:", "\n", error);
			return {
				items: [],
			};
		}
	};

	loadCategoryList = async (userRequest: Request) => {
		return this.redirectUserRequest(userRequest, {
			method: "GET",
			url: `/admin/category-list`,
		})
			.then((response) => this.parseJson(CategoryListAdminResponseSchema, response.data))
			.catch((error) => {
				console.error("Failed to load category list");
				throw new Response("Failed to load category list", { status: 407 });
			});
	};

	loadProduct = async (userRequest: Request, id: string) => {
		return this.redirectUserRequest(userRequest, {
			method: "GET",
			url: `/admin/product`,
			params: { id },
		})
			.then((response) => this.parseJson(ProductGetAdminResponseSchema, response.data))
			.catch((error) => {
				console.error("Failed to load product");
				throw new Response("Failed to load product", { status: 407 });
			});
	};

	loadProductList = async (userRequest: Request) => {
		return this.redirectUserRequest(userRequest, {
			method: "GET",
			url: `/admin/product-list`,
		})
			.then((response) => this.parseJson(ProductListGetAdminResponseSchema, response.data))
			.catch((error) => {
				console.error("Failed to load product list");
				throw new Response("Failed to load product list", { status: 407 });
			});
	};

	loadPublication = async (userRequest: Request, id: string) => {
		return this.redirectUserRequest(userRequest, {
			method: "GET",
			url: `/admin/publication`,
			params: { id },
		})
			.then((response) => this.parseJson(PublicationGetAdminResponseSchema, response.data))
			.catch((error) => {
				console.error("Failed to load publication");
				throw new Response("Failed to load publication", { status: 407 });
			});
	};

	loadPublicationList = async (userRequest: Request) => {
		return this.redirectUserRequest(userRequest, {
			method: "GET",
			url: `/admin/publication-list`,
		})
			.then((response) => this.parseJson(PublicationListGetAdminResponseSchema, response.data))
			.catch((error) => {
				console.error("Failed to load publication list");
				throw new Response("Failed to load publication list", { status: 407 });
			});
	};

	loadOrder = async (userRequest: Request, id: string) => {
		return this.redirectUserRequest(userRequest, {
			method: "GET",
			url: `/admin/order`,
			params: { id },
		})
			.then((response) => this.parseJson(OrderGetAdminResponseSchema, response.data))
			.catch((error) => {
				console.error("Failed to load order");
				throw new Response("Failed to load order", { status: 407 });
			});
	};

	loadOrderList = async (userRequest: Request) => {
		return this.redirectUserRequest(userRequest, {
			method: "GET",
			url: `/admin/order-list`,
		})
			.then((response) => this.parseJson(OrderListGetAdminResponseSchema, response.data))
			.catch((error) => {
				console.error("Failed to load order list");
				throw new Response("Failed to load order list", { status: 407 });
			});
	};

	loadUserList = async (userRequest: Request) => {
		return this.redirectUserRequest(userRequest, {
			method: "GET",
			url: `/admin/user-list`,
		})
			.then((response) => this.parseJson(UserListGetAdminResponseSchema, response.data))
			.catch((error) => {
				console.error("Failed to load user list");
				throw new Response("Failed to load user list", { status: 407 });
			});
	};
}
