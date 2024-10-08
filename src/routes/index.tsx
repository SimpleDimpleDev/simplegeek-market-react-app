import NotFound from "@components/NotFound";
import { createRoutesFromElements, Route } from "react-router-dom";

const routes = createRoutesFromElements(
	<>
		<Route index lazy={() => import("@routes/_index/index")} />
		<Route path="auth" lazy={() => import("@routes/auth/layout/AuthLayout")}>
			<Route path="login" lazy={() => import("@routes/auth/login/LoginRoute")} />
			<Route path="registration" lazy={() => import("@routes/auth/registration/RegistrationRoute")} />
			<Route path="verification" lazy={() => import("@routes/auth/verification/VerificationRoute")} />
			<Route path="recovery" lazy={() => import("@routes/auth/recovery/RecoveryRoute")} />
		</Route>
		<Route path="cart" lazy={() => import("@routes/cart/CartRoute")} />
		<Route path="category" lazy={() => import("@routes/category/index")} />
		<Route path="category/:categoryLink" lazy={() => import("@routes/category/$categoryLink/CatalogRoute")} />
		<Route path="faq" lazy={() => import("@routes/faq/FAQRoute")} />
		<Route path="favorites" lazy={() => import("@routes/favorites/FavoritesRoute")} />
		<Route path="item/:publicationLink" lazy={() => import("@routes/item.$publicationLink/PublicationRoute")} />
		<Route path="order" lazy={() => import("@routes/order/OrderMakeRoute")} />
		<Route path="orders/:orderId" lazy={() => import("@routes/orders.$orderId/UserOrderRoute")} />
		<Route path="profile" lazy={() => import("@routes/profile/layout/ProfileLayout")}>
			<Route path="orders" lazy={() => import("@routes/profile/orders/UserOrdersRoute")} />
			<Route path="settings" lazy={() => import("@routes/profile/settings/UserSettingsRoute")} />
		</Route>
		<Route path="search" lazy={() => import("@routes/search/SearchRoute")} />
		<Route path="*" element={<NotFound />} />
	</>
);

export default routes;
