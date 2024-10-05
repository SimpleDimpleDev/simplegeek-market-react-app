import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserAuthority } from "@appTypes/User";
import { AuthApiClient } from "../../api/auth/client";

interface StringMessageError {
	message: string;
}

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
