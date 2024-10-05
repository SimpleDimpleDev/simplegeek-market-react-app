import "./App.css";
import { bootstrapStore } from "@state/bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./state/store";
import { useDebouncedResizeHandler } from "./hooks/useDebouncedResizeHandler";
import { AppRouter } from "./router";

function App() {
	const dispatch = useDispatch<AppDispatch>();
	useDebouncedResizeHandler();

	useEffect(() => {
		bootstrapStore(dispatch);
	}, [dispatch]);

	return <AppRouter />;
}

export default App;
