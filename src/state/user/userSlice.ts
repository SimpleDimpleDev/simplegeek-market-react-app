import { createSlice } from "@reduxjs/toolkit";
import { User } from "@appTypes/User";
import { fetchUser } from "./thunks";

interface UserState {
	identity: User | null;
	loading: boolean;
}

const initialState: UserState = {
	identity: null,
	loading: false,
};

export const userSlice = createSlice({
	name: "identity",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchUser.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchUser.fulfilled, (state, action) => {
			state.identity = action.payload;
			state.loading = false;
		});
		builder.addCase(fetchUser.rejected, (state) => {
			state.identity = null;
			state.loading = false;
		});
	},
});

export default userSlice.reducer;
