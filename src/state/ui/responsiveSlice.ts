// src/state/ui/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResponsiveState {
	isMobile: boolean;
	isMobileOnly: boolean;
}

const initialState: ResponsiveState = {
	isMobile: false,
	isMobileOnly: false,
};

const responsiveSlice = createSlice({
	name: "responsive",
	initialState,
	reducers: {
		setIsMobile(state, action: PayloadAction<boolean>) {
			state.isMobile = action.payload;
		},
		setIsMobileOnly(state, action: PayloadAction<boolean>) {
			state.isMobileOnly = action.payload;
		},
	},
});

export const { setIsMobile, setIsMobileOnly } = responsiveSlice.actions;
export default responsiveSlice.reducer;
