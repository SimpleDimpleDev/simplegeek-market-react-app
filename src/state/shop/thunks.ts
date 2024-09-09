import { createAsyncThunk } from "@reduxjs/toolkit";
import ShopApiClient from "../../api/shop/client";
import { z } from "zod";
import { CatalogItemsAvailabilityResponseSchema, CatalogResponseSchema } from "../../api/shop/schemas";

interface StringMessageError {
	message: string;
}

export const fetchCatalog = createAsyncThunk<
	z.infer<typeof CatalogResponseSchema>,
	void,
	{ rejectValue: StringMessageError }
>("catalog/fetch", async (_, { rejectWithValue }) => {
	try {
		const catalog = await ShopApiClient.getCatalog();
		return catalog;
	} catch (error) {
		return rejectWithValue({
			message: `${(error as Error).message}`,
		});
	}
});

export const fetchCatalogItemsAvailability = createAsyncThunk<
	z.infer<typeof CatalogItemsAvailabilityResponseSchema>,
	void,
	{ rejectValue: StringMessageError }
>("catalog/items/availability/fetch", async (_, { rejectWithValue }) => {
	try {
		const availability = await ShopApiClient.getItemsAvailability();
		return availability;
	} catch (error) {
		return rejectWithValue({
			message: `${(error as Error).message}`,
		});
	}
});
