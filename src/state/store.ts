import { configureStore } from "@reduxjs/toolkit";

import userAuthorityReducer from "./user/authoritySlice";
import userCartReducer from "./user/cartSlice";
import userFavoritesReducer from "./user/favoritesSlice";

import availabilityReducer from "./shop/availabilitySlice";
import catalogReducer from "./shop/catalogSlice";

import responsiveReducer from "./ui/responsiveSlice";

import {
	crashReporterMiddleware,
	loggingMiddleware,
	updateItemsAvailabilityMiddleware,
	updateUserItemsMiddleware,
} from "./middleware";

const store = configureStore({
	reducer: {
		userAuthority: userAuthorityReducer,
		userCart: userCartReducer,
		userFavorites: userFavoritesReducer,
		availability: availabilityReducer,
		catalog: catalogReducer,
		responsive: responsiveReducer,
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
