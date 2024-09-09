import { FaqItemCreateFormData, FaqItemUpdateFormData } from "~/routes/admin/faq/forms";

import { BaseClientApiClient } from "../baseClientApiClient";
import {
	CategoryCreateAdminRequestSchema,
	CreateResponseSchema,
	FilterGroupCreateAdminRequestSchema,
	FilterGroupListAdminResponseSchema,
	ProductCreateAdminRequestSchema,
	PublicationCreateAdminRequestSchema,
} from "./schemas";
import { PublicationCreate } from "~/types/Publication";
import { z } from "zod";
import { ProductCreateSchema } from "~/schemas/Product";
import { ProductCreate } from "~/types/Product";

export class ClientAdminApiClient extends BaseClientApiClient {
	constructor(shopApiUrl: string) {
		super(shopApiUrl);
	}

	createFAQItem = async (item: FaqItemCreateFormData) => {
		return this.makeRequest({
			method: "post",
			url: `/admin/faq`,
			data: item,
		}).then((response) => response);
	};

	updateFAQItem = async (item: FaqItemUpdateFormData) => {
		return this.makeRequest({
			method: "put",
			url: `/admin/faq`,
			data: item,
		}).then((response) => response);
	};

	deleteFAQItems = async (ids: string[]) => {
		return this.makeRequest({
			method: "delete",
			url: `/admin/faq`,
			data: { ids },
		}).then((response) => response);
	};

	createCategory = async (category: z.infer<typeof CategoryCreateAdminRequestSchema>) => {
		const formData = new FormData();
		formData.append("title", category.title);
		formData.append("link", category.link);

		formData.append("smallImage", category.smallImage.file);
		formData.append("largeImage", category.bigImage.file);
		formData.append("smallImageProperties", JSON.stringify(category.smallImage.properties));
		formData.append("largeImageProperties", JSON.stringify(category.bigImage.properties));

		return this.makeRequest({
			method: "post",
			url: `/admin/category`,
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}).then((response) => this.parseJson(CreateResponseSchema, response.data));
	};

	createFilterGroup = async (filterGroup: z.infer<typeof FilterGroupCreateAdminRequestSchema>) => {
		return this.makeRequest({
			method: "post",
			url: `/admin/filter-group`,
			data: filterGroup,
		}).then((response) => this.parseJson(CreateResponseSchema, response.data));
	};

	getFilterGroups = async (categoryId: string) => {
		try {
			return this.makeRequest({
				method: "get",
				url: `/admin/filter-group-list`,
				params: { categoryId },
			}).then((response) => this.parseJson(FilterGroupListAdminResponseSchema, response.data));
		} catch (error) {
			console.error("Failed to get filter groups:", "\n", error);
			return {
				items: [],
			};
		}
	};

	updateFilterGroup = async (filterGroup: unknown) => {
		return this.makeRequest({
			method: "put",
			url: `/admin/filter-group`,
			data: filterGroup,
		}).then((response) => response);
	};

	deleteFilterGroups = async (ids: string[]) => {
		return this.makeRequest({
			method: "delete",
			url: `/admin/filter-group`,
			data: { ids },
		}).then((response) => response);
	};

	createProduct = async (data: z.infer<typeof ProductCreateAdminRequestSchema>) => {
		const formData = new FormData();

		// Append item details
		formData.append("title", data.title);
		formData.append("description", data.description || "");
		formData.append("categoryId", data.categoryId);
		formData.append("physicalProperties", JSON.stringify(data.physicalProperties));

		// Append filterGroups
		formData.append("filterGroups", JSON.stringify(data.filterGroups || JSON.stringify([])));
		formData.append("imageProperties", JSON.stringify(data.images.map(image => image.properties)));

		// Append images
		data.images.forEach((image, index) => {
			formData.append(`images`, image.file, image.file.name);
		});

		return this.makeRequest({
			method: "post",
			url: `/admin/product`,
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}).then((response) => this.parseJson(CreateResponseSchema, response.data));
	};

	createPublication = async (data: z.infer<typeof PublicationCreateAdminRequestSchema>) => {
		return this.makeRequest({
			method: "post",
			url: `/admin/publication`,
			data: data,
		}).then((response) => this.parseJson(CreateResponseSchema, response.data));
	};
}
