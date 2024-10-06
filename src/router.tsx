import { createBrowserRouter } from "react-router-dom";
import ShopLayout from "./layout/ShopLayout";
import routes from "./routes";

const router = createBrowserRouter([
	{
		path: "/",
		element: <ShopLayout />,
		children: routes,
	},
]);

export { router };
