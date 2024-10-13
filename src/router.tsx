import { createBrowserRouter } from "react-router-dom";
import ShopLayout from "./layout/ShopLayout";
import routes from "./routes";
import RootErrorBoundary from "./layout/RootErrorBoundary";

const router = createBrowserRouter([
	{
		path: "/",
		element: <ShopLayout />,
		errorElement: <RootErrorBoundary />,
		children: routes,
	},
]);

export { router };
