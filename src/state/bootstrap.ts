import { fetchUser } from "./user/thunks";
import { AppDispatch } from "./store";

export const bootstrapStore = (dispatch: AppDispatch) => {
	console.log("Bootstrapping store..."); // This should log only once
	dispatch(fetchUser());
	// Add other initialization actions if needed
};
