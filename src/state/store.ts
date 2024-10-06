import { configureStore } from "@reduxjs/toolkit";
import { shopApi } from "@api/shop/root";
import userAuthorityReducer from "./user/authoritySlice";

import { crashReporterMiddleware, loggingMiddleware, updateUserItemsMiddleware } from "./middleware";

const store = configureStore({
	reducer: {
		userAuthority: userAuthorityReducer,
		[shopApi.reducerPath]: shopApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(shopApi.middleware)
			.concat(loggingMiddleware)
			.concat(crashReporterMiddleware)
			.concat(updateUserItemsMiddleware),
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
