import "./App.css";
import { bootstrapStore } from "@state/bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { AppDispatch } from "./state/store";
import { useDebouncedResizeHandler } from "./hooks/useDebouncedResizeHandler";

function App() {
	const dispatch = useDispatch<AppDispatch>();
	useDebouncedResizeHandler();
	
	useEffect(() => {
		bootstrapStore(dispatch);
	}, [dispatch]);

	return <Outlet />;
}

export default App;
