import {
	Close,
	AdminPanelSettings,
	Info,
	Favorite,
	Person,
	ShoppingCart,
	Logout,
	Menu as MenuIcon,
} from "@mui/icons-material";
import { Button, Menu, MenuItem, Typography, CircularProgress } from "@mui/material";
import { getImageUrl } from "@utils/image";
import { useNavigate } from "react-router-dom";
import { CatalogSearch } from "./CatalogSearch";
import { HeaderButtons } from "./HeaderButtons";

import { oryClient } from "@api/auth/client";
import { fetchUser } from "@state/user/thunks";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";

import logo from "@assets/MainLogoBig.webp";
import { useState } from "react";
import { useGetCartItemListQuery } from "@api/shop/cart";
import { useGetCatalogQuery } from "@api/shop/catalog";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";

const DesktopHeader: React.FC = () => {
	const navigate = useNavigate();

	const user = useSelector((state: RootState) => state.user.identity);
	const userLoading = useSelector((state: RootState) => state.user.loading);

	const { data: catalog } = useGetCatalogQuery();
	const { data: cartItemList, refetch: refetchCart } = useGetCartItemListQuery();
	const { data: favoriteItemList, refetch: refetchFavorite } = useGetFavoriteItemListQuery();

	const dispatch = useDispatch<AppDispatch>();

	const [anchorElCatalog, setAnchorElCatalog] = useState<null | HTMLElement>(null);
	const catalogMenuOpened = Boolean(anchorElCatalog);

	const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
	const profileMenuOpened = Boolean(anchorElProfile);

	const handleCloseCatalogMenu = () => setAnchorElCatalog(null);

	const handleCloseProfileMenu = () => setAnchorElProfile(null);

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
		<div className="d-f fd-r jc-c" style={{ padding: "0 calc(24/1920 * 100%)", backgroundColor: "white" }}>
			<header className="gap-3 ai-c d-f fd-r fg-1 jc-sb" style={{ maxWidth: 1408 }}>
				<div className="gap-5 w-100 ai-c d-f jc-fs">
					<Button onClick={() => navigate("/")}>
						<img src={logo} height={88} alt="logo" />
					</Button>

					<div className="gap-3 w-100 h-7 d-f jc-fs" style={{ maxWidth: 810 }}>
						<Button
							id="catalog-button"
							variant="contained"
							size="large"
							style={{ minWidth: 143 }}
							aria-controls={catalogMenuOpened ? "catalog-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={catalogMenuOpened ? "true" : undefined}
							onClick={(event) => setAnchorElCatalog(event.currentTarget)}
						>
							{catalogMenuOpened ? (
								<Close sx={{ color: "icon.primary" }} />
							) : (
								<MenuIcon sx={{ color: "icon.primary" }} />
							)}
							Каталог
						</Button>

						<Menu
							id="catalog-menu"
							anchorEl={anchorElCatalog}
							open={catalogMenuOpened}
							onClose={handleCloseCatalogMenu}
							MenuListProps={{
								"aria-labelledby": "catalog-button",
							}}
						>
							{catalog?.categories.map((category) => (
								<MenuItem
									onClick={() => {
										handleCloseCatalogMenu();
										navigate(`/category/${category.link}`);
									}}
								>
									<div className="gap-12px ai-c d-f fd-r">
										<div className="w-7 h-7 br-1 d-f jc-c of-h ps-r">
											<img className="cover" src={getImageUrl(category.icon.url, "small")}></img>
										</div>
										<Typography variant="body1">{category.title}</Typography>
									</div>
								</MenuItem>
							))}
						</Menu>
						<CatalogSearch catalogItems={catalog?.items || []} />
					</div>
				</div>
				<HeaderButtons
					buttons={[
						...(user?.isAdmin
							? [
									{
										text: "Админка",
										icon: <AdminPanelSettings />,
										onClick: () => window.location.assign("https://admin.simplegeek.ru"),
									},
							  ]
							: []),
						{ text: "FAQ", icon: <Info />, onClick: () => navigate("/faq") },
						{
							text: "Избранное",
							icon: <Favorite />,
							onClick: () => navigate("/favorites"),
							badgeCount: favoriteItemList?.items.length,
						},
						{
							text: userLoading ? "" : user ? "Профиль" : "Войти",
							icon: userLoading ? <CircularProgress /> : <Person />,
							onClick: user ? (event) => setAnchorElProfile(event.currentTarget) : () => onLoginClick(),
						},
						{
							text: "Корзина",
							icon: <ShoppingCart />,
							onClick: () => navigate("/cart"),
							badgeCount: cartItemList?.items.length,
						},
					]}
				/>

				<Menu
					id="profile-menu"
					anchorEl={anchorElProfile}
					open={profileMenuOpened}
					onClose={handleCloseProfileMenu}
					MenuListProps={{
						"aria-labelledby": "catalog-button",
					}}
				>
					<MenuItem
						onClick={() => {
							handleCloseProfileMenu();
							return navigate("/profile/orders");
						}}
					>
						<div className="gap-12px ai-c d-f fd-r">
							<Typography variant="body1">Заказы</Typography>
						</div>
					</MenuItem>

					<MenuItem
						onClick={() => {
							handleCloseProfileMenu();
							return navigate("/profile/settings");
						}}
					>
						<div className="gap-12px ai-c d-f fd-r">
							<Typography variant="body1">Мои данные</Typography>
						</div>
					</MenuItem>

					<MenuItem
						onClick={() => {
							handleCloseProfileMenu();
							onLogoutClick();
						}}
					>
						<div className="gap-12px ai-c d-f fd-r">
							<Typography color="error.main" variant="body1">
								Выход
							</Typography>
						</div>
						<Logout sx={{ color: "error.main" }} />
					</MenuItem>
				</Menu>
			</header>
		</div>
	);
};

export default DesktopHeader;
