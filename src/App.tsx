import "./App.css";
import "@ory/elements/style.css";
import { bootstrapStore } from "@state/bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./state/store";
import { useDebouncedResizeHandler } from "./hooks/useDebouncedResizeHandler";
import { fetchCatalogItemsAvailability } from "@state/shop/thunks";
import { AppRouter } from "./router";

function App() {
	const dispatch = useDispatch<AppDispatch>();
	useDebouncedResizeHandler();

	useEffect(() => {
		bootstrapStore(dispatch);
		const revalidateAvailabilityInterval = setInterval(() => {
			dispatch(fetchCatalogItemsAvailability());
		}, 60000);
		return () => clearInterval(revalidateAvailabilityInterval);
	}, [dispatch]);

	return <AppRouter />;
}

export default App;
