import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@appTypes/User";
import { AuthApiClient } from "../../api/auth/client";

interface StringMessageError {
	message: string;
}

export const fetchUser = createAsyncThunk<User | null, void, { rejectValue: StringMessageError }>(
	"user/fetch",
	async (_, { rejectWithValue }) => {
		try {
			return await AuthApiClient.getUser();
		} catch (error) {
			return rejectWithValue({
				message: `${(error as Error).message}`,
			});
		}
	}
);
