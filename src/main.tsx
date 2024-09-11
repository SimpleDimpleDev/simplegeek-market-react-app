/* eslint-disable react-refresh/only-export-components */
import theme from "./theme.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { store } from "./state/store";

import App from "./App.tsx";

const AuthLayout = lazy(() => import("./routes/auth/_layout.tsx"));
const Home = lazy(() => import("./routes/_index/index.tsx"));
const Login = lazy(() => import("./routes/auth/login/_route.tsx"));
const Recovery = lazy(() => import("./routes/auth/recovery/_route.tsx"));
const Registration = lazy(() => import("./routes/auth/registration/_route.tsx"));
const ShopLayout = lazy(() => import("./routes/_layout.tsx"));
const Verification = lazy(() => import("./routes/auth/verification/_route.tsx"));
const Cart = lazy(() => import("./routes/cart/_route.tsx"));
const Catalog = lazy(() => import("./routes/catalog/$categoryName/_route.tsx"));
const FAQ = lazy(() => import("./routes/faq/_route.tsx"));
const Favorites = lazy(() => import("./routes/favorites/_route.tsx"));
const ItemPage = lazy(() => import("./routes/item.$publicationLink/_route.tsx"));
const Order = lazy(() => import("./routes/order/_route.tsx"));
const UserOrder = lazy(() => import("./routes/orders.$orderId/_route.tsx"));
const ProfileLayout = lazy(() => import("./routes/profile/_layout.tsx"));
const UserOrders = lazy(() => import("./routes/profile/orders/_route.tsx"));
const Me = lazy(() => import("./routes/profile/settings/_route.tsx"));
const Search = lazy(() => import("./routes/search/_route.tsx"));

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <ShopLayout />,
				children: [
					{
						index: true,
						element: <Home />,
					},
					{
						path: "auth",
						element: <AuthLayout />,
						children: [
							{
								path: "login",
								element: <Login />,
							},
							{
								path: "registration",
								element: <Registration />,
							},
							{
								path: "verification",
								element: <Verification />,
							},
							{
								path: "recovery",
								element: <Recovery />,
							},
						],
					},
					{
						path: "cart",
						element: <Cart />,
					},
					{
						path: "catalog/:categoryName",
						element: <Catalog />,
					},
					{
						path: "faq",
						element: <FAQ />,
					},
					{
						path: "favorites",
						element: <Favorites />,
					},
					{
						path: "item/:publicationLink",
						element: <ItemPage />,
					},
					{
						path: "order",
						element: <Order />,
					},
					{
						path: "orders/:orderId",
						element: <UserOrder />,
					},
					{
						path: "profile",
						children: [
							{
								index: true,
								element: <ProfileLayout />,
							},
							{
								path: "orders",
								element: <UserOrders />,
							},
							{
								path: "settings",
								element: <Me />,
							},
						],
					},
					{
						path: "search",
						element: <Search />,
					},
				],
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ReduxProvider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<RouterProvider router={router} />
			</ThemeProvider>
		</ReduxProvider>
	</StrictMode>
);
