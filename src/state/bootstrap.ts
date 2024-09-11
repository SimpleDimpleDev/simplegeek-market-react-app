import { fetchUserAuthority } from "./user/thunks";
import { fetchCatalog } from "./shop/thunks";
import { AppDispatch } from "./store";

export const bootstrapStore = (dispatch: AppDispatch) => {
	console.log("Bootstrapping store..."); // This should log only once
	dispatch(fetchUserAuthority());
	dispatch(fetchCatalog());
	// Add other initialization actions if needed
};
