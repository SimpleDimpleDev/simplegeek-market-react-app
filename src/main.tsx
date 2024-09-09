import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./state/store";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ReduxProvider store={store}>
			<App />
		</ReduxProvider>
	</StrictMode>
);
