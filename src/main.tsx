import theme, { oryTheme } from "./theme.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { store } from "./state/store";
import App from "./App.tsx";
import AuthLayout from "./routes/auth/_layout.tsx";
import Home from "./routes/_index/index.tsx";
import Login from "./routes/auth/login/_route.tsx";
import Recovery from "./routes/auth/recovery/_route.tsx";
import Registration from "./routes/auth/registration/_route.tsx";
import ShopLayout from "./routes/_layout.tsx";
import Verification from "./routes/auth/verification/_route.tsx";
import Cart from "./routes/cart/_route.tsx";
import Catalog from "./routes/catalog/$categoryLink/_route.tsx";
import FAQ from "./routes/faq/_route.tsx";
import Favorites from "./routes/favorites/_route.tsx";
import ItemPage from "./routes/item.$publicationLink/_route.tsx";
import Order from "./routes/order/_route.tsx";
import UserOrder from "./routes/orders.$orderId/_route.tsx";
import ProfileLayout from "./routes/profile/_layout.tsx";
import UserOrders from "./routes/profile/orders/_route.tsx";
import Me from "./routes/profile/settings/_route.tsx";
import Search from "./routes/search/_route.tsx";
import { CustomTranslations, IntlProvider } from "@ory/elements";
import { customTranslations } from "./oryLocale.ts";
import { ThemeProvider as OryThemeProvider } from "@ory/elements";

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
						path: "catalog/:categoryLink",
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
				<OryThemeProvider themeOverrides={oryTheme}>
					<CssBaseline />
					<IntlProvider<CustomTranslations>
						locale="ru"
						defaultLocale="ru"
						customTranslations={customTranslations}
					>
						<RouterProvider router={router} />
					</IntlProvider>
				</OryThemeProvider>
			</ThemeProvider>
		</ReduxProvider>
	</StrictMode>
);
