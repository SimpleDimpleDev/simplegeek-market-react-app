import { configureStore } from "@reduxjs/toolkit";
import { shopApi } from "@api/shop/root";
import userReducer from "./user/userSlice";

import { crashReporterMiddleware, loggingMiddleware } from "./middleware";

const store = configureStore({
	reducer: {
		user: userReducer,
		[shopApi.reducerPath]: shopApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(shopApi.middleware).concat(loggingMiddleware).concat(crashReporterMiddleware),
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
