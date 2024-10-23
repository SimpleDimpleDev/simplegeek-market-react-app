import { Favorite, ShoppingCart, Menu as MenuIcon } from "@mui/icons-material";
import { useScrollTrigger, IconButton, Slide } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CatalogSearch } from "./CatalogSearch";
import { HeaderButtons } from "./HeaderButtons";
import { MobileMenu } from "./MobileMenu";

import logo from "@assets/MainLogoBig.webp";
import { oryClient } from "@api/auth/client";
import { fetchUser } from "@state/user/thunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { useState } from "react";
import { useGetCatalogQuery } from "@api/shop/catalog";
import { useGetCartItemListQuery } from "@api/shop/cart";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";

const MobileHeader: React.FC = () => {
	const navigate = useNavigate();
	const [mobileMenuIsOpened, setMobileMenuIsOpened] = useState(false);
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 100,
	});

	const user = useSelector((state: RootState) => state.user.identity);

	const { data: catalog } = useGetCatalogQuery();
	const { data: cartItemList, refetch: refetchCart } = useGetCartItemListQuery();
	const { data: favoriteItemList, refetch: refetchFavorite } = useGetFavoriteItemListQuery();
	// const userLoading = useSelector((state: RootState) => state.user.loading);

	const dispatch = useDispatch<AppDispatch>();

	const onLoginClick = () => {
		navigate("/auth/login");
	};

	const onLogoutClick = async () => {
		// Create a "logout flow" in Ory Identities
		const { data: flow } = await oryClient.createBrowserLogoutFlow();
		// Use the received token to "update" the flow and thus perform the logout
		await oryClient.updateLogoutFlow({
			token: flow.logout_token,
		});
		// Reset the user state
		dispatch(fetchUser());
		refetchCart();
		refetchFavorite();
		// Navigate to the home page
		navigate("/");
	};

	return (
		<div>
			<MobileMenu
				user={user}
				onLoginClick={onLoginClick}
				onLogoutClick={onLogoutClick}
				categories={catalog?.categories || []}
				isOpened={mobileMenuIsOpened}
				onMenuClose={() => setMobileMenuIsOpened(false)}
			/>
			<div className="top-0 bg-primary pr-2 pl-1 w-100 h-9 ai-c d-f fd-r fs-0 jc-sb ps-f" style={{ zIndex: 5 }}>
				<div className="gap-1 ai-c d-f fd-r" style={{ zIndex: 1000 }}>
					<IconButton onClick={() => setMobileMenuIsOpened(true)}>
						<MenuIcon sx={{ color: "icon.primary" }} />
					</IconButton>
					<IconButton onClick={() => navigate("/")}>
						<div className="w-10 h-5">
							<img src={logo} height={40} alt="logo" />
						</div>
					</IconButton>
				</div>

				<HeaderButtons
					isMobile
					buttons={[
						{
							text: "Избранное",
							icon: <Favorite />,
							onClick: () => navigate("/favorites"),
							badgeCount: favoriteItemList?.items.length,
						},
						{
							text: "Корзина",
							icon: <ShoppingCart />,
							onClick: () => navigate("/cart"),
							badgeCount: cartItemList?.items.length,
						},
					]}
				/>
			</div>
			<Slide in={!trigger} direction="down">
				<div className="top-8 bg-primary p-2 w-100 h-11 ps-f" style={{ zIndex: 4 }}>
					<CatalogSearch catalogItems={catalog?.items || []} isMobile />
				</div>
			</Slide>
		</div>
	);
};

export default MobileHeader;
