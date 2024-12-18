import { configureStore } from "@reduxjs/toolkit";
import { shopApi } from "@api/shop/root";
import userReducer from "./user/userSlice";
import visitsReducer from "./visits/visitsSlice";

import { crashReporterMiddleware } from "./middleware";

const store = configureStore({
	reducer: {
		user: userReducer,
		visits: visitsReducer,
		[shopApi.reducerPath]: shopApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(shopApi.middleware).concat(crashReporterMiddleware),
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
