import { configureStore } from "@reduxjs/toolkit";

import userAuthorityReducer from "./user/authoritySlice";
import responsiveReducer from "./ui/responsiveSlice";

import {
	crashReporterMiddleware,
	loggingMiddleware,
	updateUserItemsMiddleware,
} from "./middleware";

const store = configureStore({
	reducer: {
		userAuthority: userAuthorityReducer,
		responsive: responsiveReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(loggingMiddleware)
			.concat(crashReporterMiddleware)
			.concat(updateUserItemsMiddleware)
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
