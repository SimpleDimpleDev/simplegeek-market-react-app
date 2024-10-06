import "./App.css";
import { bootstrapStore } from "@state/bootstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./state/store";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";

function App() {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		bootstrapStore(dispatch);
	}, [dispatch]);

	return <RouterProvider router={router} />;
}

export default App;
