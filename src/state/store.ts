import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";

import userAuthorityReducer from "./user/authoritySlice";
import userCartReducer from "./user/cartSlice";
import userFavoritesReducer from "./user/favoritesSlice";

import availabilityReducer from "./shop/availabilitySlice";
import catalogReducer from "./shop/catalogSlice";
import {
	crashReporterMiddleware,
	loggingMiddleware,
	updateItemsAvailabilityMiddleware,
	updateUserItemsMiddleware,
} from "./middleware";

const store = configureStore({
	reducer: {
		counter: counterReducer,
		userAuthority: userAuthorityReducer,
		userCart: userCartReducer,
		userFavorites: userFavoritesReducer,
		availability: availabilityReducer,
		catalog: catalogReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(loggingMiddleware)
			.concat(crashReporterMiddleware)
			.concat(updateUserItemsMiddleware)
			.concat(updateItemsAvailabilityMiddleware),
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
