import "./App.css";
import "@ory/elements/style.css";
import { bootstrapStore } from "@state/bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { AppDispatch } from "./state/store";
import { useDebouncedResizeHandler } from "./hooks/useDebouncedResizeHandler";
import { fetchCatalogItemsAvailability } from "@state/shop/thunks";

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

	return <Outlet />;
}

export default App;
