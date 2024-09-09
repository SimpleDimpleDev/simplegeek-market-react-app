import { createAsyncThunk } from "@reduxjs/toolkit";
import ShopApiClient from "../../api/shop/client";
import { UserItems } from "../../types/UserItems";
import { UserAuthority } from "../../types/User";
import { AuthApiClient } from "../../api/auth/client";

interface StringMessageError {
	message: string;
}

interface UserActionResponse {
	ok: boolean;
}

export const fetchUserItems = createAsyncThunk<UserItems, void, { rejectValue: StringMessageError }>(
	"user/items/fetch",
	async (_, { rejectWithValue }) => {
		try {
			return await ShopApiClient.getUserItems();
		} catch (error) {
			return rejectWithValue({
				message: `${(error as Error).message}`,
			});
		}
	}
);

export const fetchUserAuthority = createAsyncThunk<UserAuthority | null, void, { rejectValue: StringMessageError }>(
	"user/authority/fetch",
	async (_, { rejectWithValue }) => {
		try {
			return await AuthApiClient.getUserAuthority();
		} catch (error) {
			return rejectWithValue({
				message: `${(error as Error).message}`,
			});
		}
	}
);

export const addCartItem = createAsyncThunk<
	UserActionResponse,
	{ itemId: string },
	{ rejectValue: StringMessageError }
>("user/items/cart/add", async ({ itemId }, { rejectWithValue }) => {
	try {
		const response = await ShopApiClient.addCartItem(itemId);
		if (!response.ok) {
			return rejectWithValue({ message: "Failed to add item to cart" });
		}
		return response;
	} catch (error) {
		return rejectWithValue({ message: (error as Error).message });
	}
});

export const patchCartItem = createAsyncThunk<
	UserActionResponse,
	{ itemId: string; action: "INCREMENT" | "DECREMENT" },
	{ rejectValue: StringMessageError }
>("user/items/cart/patch", async ({ itemId, action }, { rejectWithValue }) => {
	try {
		const response = await ShopApiClient.patchCartItem(itemId, action);
		if (!response.ok) {
			return rejectWithValue({ message: "Failed to patch cart item" });
		}
		return response;
	} catch (error) {
		return rejectWithValue({ message: (error as Error).message });
	}
});

export const removeCartItems = createAsyncThunk<
	UserActionResponse,
	{ itemIds: string[] },
	{ rejectValue: StringMessageError }
>("user/items/cart/remove", async ({ itemIds }, { rejectWithValue }) => {
	try {
		const response = await ShopApiClient.removeCartItems(itemIds);
		if (!response.ok) {
			return rejectWithValue({ message: "Failed to remove item from cart" });
		}
		return response;
	} catch (error) {
		return rejectWithValue({ message: (error as Error).message });
	}
});

export const addFavoriteItem = createAsyncThunk<
	UserActionResponse,
	{ itemId: string },
	{ rejectValue: StringMessageError }
>("user/items/favorites/addFavoriteItem", async ({ itemId }, { rejectWithValue }) => {
	try {
		const response = await ShopApiClient.addFavoriteItem(itemId);
		if (!response.ok) {
			return rejectWithValue({ message: "Failed to add item to favorites" });
		}
		return response;
	} catch (error) {
		return rejectWithValue({ message: (error as Error).message });
	}
});

export const removeFavoriteItem = createAsyncThunk<
	UserActionResponse,
	{ itemId: string },
	{ rejectValue: StringMessageError }
>("user/items/favorites/removeFavoriteItem", async ({ itemId }, { rejectWithValue }) => {
	try {
		const response = await ShopApiClient.removeFavoriteItem(itemId);
		if (!response.ok) {
			return rejectWithValue({ message: "Failed to remove item from favorites" });
		}
		return response;
	} catch (error) {
		return rejectWithValue({ message: (error as Error).message });
	}
});
