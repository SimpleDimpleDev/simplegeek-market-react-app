import { Middleware, ThunkMiddleware } from "@reduxjs/toolkit";
import { fetchUserAuthority, fetchUserItems } from "./user/thunks";
import { fetchCatalog, fetchCatalogItemsAvailability } from "./shop/thunks";

/**
 * Logs all actions and next state to the console.
 * Useful for debugging.
 */
const loggingMiddleware: Middleware = (store) => (next) => (action) => {
	const result = next(action);
	console.log("%cDispatching:", "color: green; padding-top: 2px", action);
	console.log("%cPrev state:", "color: orange; padding-top: 2px", store.getState());
	console.log("%cNext state:", "color: blue; padding-top: 2px", store.getState());
	return result;
};

const crashReporterMiddleware: Middleware = () => (next) => (action) => {
	try {
		return next(action);
	} catch (err) {
		console.error("Caught an exception!", err);
		throw err;
	}
};

/**
 * This middleware listens for the `fetchUserAuthority.fulfilled` action and dispatches
 * `fetchUserItems` when it is received. This is useful for keeping the user's items up to
 * date when the user logs in or out.
 */
const updateUserItemsMiddleware: ThunkMiddleware = (store) => (next) => (action) => {
	if (fetchUserAuthority.fulfilled.match(action)) {
		store.dispatch(fetchUserItems());
	}
	return next(action);
};

/**
 * This middleware listens for the `fetchCatalog.fulfilled` action and dispatches
 * `fetchCatalogItemsAvailability` when it is received. This is useful for keeping
 * the catalog items availability up to date when the catalog is fetched.
 */
const updateItemsAvailabilityMiddleware: ThunkMiddleware = (store) => (next) => (action) => {
	if (fetchCatalog.fulfilled.match(action)) {
		store.dispatch(fetchCatalogItemsAvailability());
	}
	return next(action);
};

export { loggingMiddleware, crashReporterMiddleware, updateUserItemsMiddleware, updateItemsAvailabilityMiddleware };
