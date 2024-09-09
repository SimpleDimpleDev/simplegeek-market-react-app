import { createSlice } from "@reduxjs/toolkit";
import { UserAuthority } from "../../types/User";
import { fetchUserAuthority } from "./thunks";

interface UserAuthorityState {
	authority: UserAuthority | null;
	loading: boolean;
}

const initialState: UserAuthorityState = {
	authority: null,
	loading: false,
};

export const authoritySlice = createSlice({
	name: "authority",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchUserAuthority.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchUserAuthority.fulfilled, (state, action) => {
			state.authority = action.payload;
			state.loading = false;
		});
		builder.addCase(fetchUserAuthority.rejected, (state) => {
			state.authority = null;
			state.loading = false;
		});
	},
});

export default authoritySlice.reducer;
