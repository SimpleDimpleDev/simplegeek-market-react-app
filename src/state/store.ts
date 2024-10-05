import { configureStore } from "@reduxjs/toolkit";
import { shopApi } from "@api/shop/root";
import userAuthorityReducer from "./user/authoritySlice";
import responsiveReducer from "./ui/responsiveSlice";

import { crashReporterMiddleware, loggingMiddleware, updateUserItemsMiddleware } from "./middleware";

const store = configureStore({
	reducer: {
		[shopApi.reducerPath]: shopApi.reducer,
		userAuthority: userAuthorityReducer,
		responsive: responsiveReducer,
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
