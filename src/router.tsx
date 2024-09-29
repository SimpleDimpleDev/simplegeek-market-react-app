import { Routes, Route } from "react-router-dom";
import { HomeRouteLazy } from "./routes/_index/_lazy";
import { AuthLayoutLazy } from "./routes/auth/layout/_lazy";
import { LoginRouteLazy } from "./routes/auth/login/_lazy";
import { RecoveryRouteLazy } from "./routes/auth/recovery/_lazy";
import { RegistrationRouteLazy } from "./routes/auth/registration/_lazy";
import { VerificationRouteLazy } from "./routes/auth/verification/_lazy";
import { CartRouteLazy } from "./routes/cart/_lazy";
import { CatalogRouteLazy } from "./routes/catalog/$categoryLink/_lazy";
import { FAQRouteLazy } from "./routes/faq/_lazy";
import { FavoritesRouteLazy } from "./routes/favorites/_lazy";
import { PublicationRouteLazy } from "./routes/item.$publicationLink/_lazy";
import { ShopLayoutLazy } from "./routes/layout/_lazy";
import { OrderMakeRouteLazy } from "./routes/order/_lazy";
import { UserOrderRouteLazy } from "./routes/orders.$orderId/_lazy";
import { ProfileLayoutLazy } from "./routes/profile/layout/_lazy";
import { UserOrdersRouteLazy } from "./routes/profile/orders/_lazy";
import { UserSettingsRouteLazy } from "./routes/profile/settings/_lazy";
import { SearchRouteLazy } from "./routes/search/_lazy";
import React, { Suspense } from "react";
import SuspenseRouter from "@utils/SuspenseRouter";
import { CircularProgress } from "@mui/material";

const AppRouter: React.FC = () => (
	<SuspenseRouter>
		<Suspense
			fallback={
				<div
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<CircularProgress />
				</div>
			}
		>
			<Routes>
				<Route path="/" element={<ShopLayoutLazy />}>
					<Route index element={<HomeRouteLazy />} />
					<Route path="auth" element={<AuthLayoutLazy />}>
						<Route path="login" element={<LoginRouteLazy />} />
						<Route path="registration" element={<RegistrationRouteLazy />} />
						<Route path="verification" element={<VerificationRouteLazy />} />
						<Route path="recovery" element={<RecoveryRouteLazy />} />
					</Route>
					<Route path="cart" element={<CartRouteLazy />} />
					<Route path="catalog/:categoryLink" element={<CatalogRouteLazy />} />
					<Route path="faq" element={<FAQRouteLazy />} />
					<Route path="favorites" element={<FavoritesRouteLazy />} />
					<Route path="item/:publicationLink" element={<PublicationRouteLazy />} />
					<Route path="order" element={<OrderMakeRouteLazy />} />
					<Route path="orders/:orderId" element={<UserOrderRouteLazy />} />
					<Route path="profile">
						<Route index element={<ProfileLayoutLazy />} />
						<Route path="orders" element={<UserOrdersRouteLazy />} />
						<Route path="settings" element={<UserSettingsRouteLazy />} />
					</Route>
					<Route path="search" element={<SearchRouteLazy />} />
				</Route>
			</Routes>
		</Suspense>
	</SuspenseRouter>
);

export { AppRouter };
