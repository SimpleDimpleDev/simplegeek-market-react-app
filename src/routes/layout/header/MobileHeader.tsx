import { Favorite, ShoppingCart, Menu as MenuIcon } from "@mui/icons-material";
import { useScrollTrigger, IconButton, Slide } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CatalogSearch } from "./CatalogSearch";
import { HeaderButtons } from "./HeaderButtons";
import { MobileMenu } from "./MobileMenu";

import logo from "@assets/MainLogoBig.png";
import { oryClient } from "@api/auth/client";
import { fetchUserAuthority } from "@state/user/thunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { useState } from "react";

const MobileHeader: React.FC = () => {
	const navigate = useNavigate();
	const [mobileMenuIsOpened, setMobileMenuIsOpened] = useState(false);
	const trigger = useScrollTrigger();

	const categories = useSelector((state: RootState) => state.catalog.categories);
	const catalogItems = useSelector((state: RootState) => state.catalog.items);
	const userAuthority = useSelector((state: RootState) => state.userAuthority.authority);
	// const userAuthorityLoading = useSelector((state: RootState) => state.userAuthority.loading);
	const userCartItems = useSelector((state: RootState) => state.userCart.items);
	const userFavoritesItems = useSelector((state: RootState) => state.userFavorites.items);

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
		dispatch(fetchUserAuthority());
	};

	return (
		<div>
			<MobileMenu
				user={userAuthority}
				onLoginClick={onLoginClick}
				onLogoutClick={onLogoutClick}
				categories={categories}
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
							badgeCount: userFavoritesItems.length,
						},
						{
							text: "Корзина",
							icon: <ShoppingCart />,
							onClick: () => navigate("/cart"),
							badgeCount: userCartItems.length,
						},
					]}
				/>
			</div>
			<Slide in={!trigger} direction="down">
				<div className="top-8 bg-primary p-2 w-100 h-11 ps-f" style={{ zIndex: 4 }}>
					<CatalogSearch catalogItems={catalogItems} isMobile />
				</div>
			</Slide>
		</div>
	);
};

export default MobileHeader;
