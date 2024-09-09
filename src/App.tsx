import "./App.css";
import { Box } from "@mui/material";
import Counter from "./components/counter";
import { bootstrapStore } from "./state/bootsrtap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./state/store";

function App() {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		bootstrapStore(dispatch);
	}, [dispatch]);

	return (
		<>
			<Box>
				<Counter />
			</Box>
		</>
	);
}

export default App;
