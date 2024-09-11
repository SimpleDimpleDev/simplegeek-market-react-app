import * as React from "react";
import logo from "@assets/MainLogoBig.png";
import { CatalogItem } from "@appTypes/CatalogItem";
import { CategoryShop } from "@appTypes/Category";
import { UserAuthority } from "@appTypes/User";
import { UserCartItem, UserFavoriteItem } from "@appTypes/UserItems";
import { Button, Menu, MenuItem, TextField, Typography } from "@mui/material";
import { Autocomplete, Badge, IconButton, Slide, useScrollTrigger } from "@mui/material";
import { RootState } from "@state/store";
import { getImageUrl } from "@utils/image";
import { isCatalogItemMatchQuery } from "@utils/search";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MobileMenu } from "./MobileMenu";

import {
	AdminPanelSettings,
	ChevronRight,
	Close,
	Favorite,
	Info,
	Logout,
	Menu as MenuIcon,
	Person,
	Search,
	ShoppingCart,
} from "@mui/icons-material";


interface HeaderButtonProps {
	isMobile?: boolean;
	text: string;
	icon: React.ReactNode;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	badgeCount?: number;
}

const HeaderButton = ({ isMobile, text, icon, onClick, badgeCount }: HeaderButtonProps) => (
	<IconButton sx={{ borderRadius: 2, padding: 1, margin: -1 }} onClick={onClick}>
		<div className="d-f fd-c ai-c gap-4px">
			<div className="ps-r w-4 h-4 d-f jc-c ai-c icon-secondary">
				<Badge color="warning" badgeContent={badgeCount}>
					{icon}
				</Badge>
			</div>
			{!(isMobile === true) && (
				<Typography sx={{ color: "text.secondary" }} variant="body2">
					{text}
				</Typography>
			)}
		</div>
	</IconButton>
);

const HeaderButtons = ({ isMobile, buttons }: { isMobile?: boolean; buttons: HeaderButtonProps[] }) => (
	<div className="h-100 d-f fd-r jc-fs ai-c" style={{ gap: isMobile ? 24 : 16 }}>
		{buttons.map(({ text, icon, onClick, badgeCount }) => (
			<HeaderButton
				isMobile={isMobile}
				key={text}
				text={text}
				icon={icon}
				onClick={onClick}
				badgeCount={badgeCount}
			/>
		))}
	</div>
);

interface CatalogSearchProps {
	catalogItems: CatalogItem[];
	isMobile?: boolean;
}

const CatalogSearch: React.FC<CatalogSearchProps> = ({ catalogItems, isMobile }) => {
	const navigate = useNavigate();
	const [searchText, setSearchText] = React.useState("");
	const [value, setValue] = React.useState<string | CatalogItem>("");

	const performSearch = () => {
		if (searchText === "") return;
		return navigate(`/search?q=${searchText}`);
	};
	return (
		<Autocomplete
			freeSolo
			id="free-solo-2-demo"
			disableClearable
			sx={!isMobile ? { maxWidth: 440, width: "100%" } : {}}
			options={catalogItems}
			getOptionLabel={(item) => (typeof item === "string" ? item : item.product.title)}
			groupBy={(item) => (typeof item === "string" ? item : item.product.category.title.toUpperCase())}
			inputValue={searchText}
			onInputChange={(_, newInputValue) => {
				setSearchText(newInputValue);
			}}
			value={value}
			onChange={(_, item) => {
				if (typeof item === "string") return;
				setSearchText("");
				setValue("");
				const variationParam = item.variationIndex !== null ? `?v=${item.variationIndex}` : "";
				navigate(`/item/${item.publicationLink}${variationParam}`);
			}}
			isOptionEqualToValue={(option) => isCatalogItemMatchQuery(option, searchText)}
			renderInput={(params) => (
				<div className="ps-r w-100 br-12px">
					<TextField {...params} label="Поиск" variant="filled" color="warning" />

					<Button
						onClick={performSearch}
						variant="contained"
						style={{
							minWidth: 0,
							width: 56,
							height: 56,
							position: "absolute",
							right: 0,
							top: 0,
							zIndex: 1,
						}}
					>
						<Search sx={{ color: "icon.primary" }} />
					</Button>
				</div>
			)}
		/>
	);
};

interface HeaderProps {
	isMobile?: boolean;
	onLoginClick: () => void;
	onLogoutClick: () => void;

	categories: CategoryShop[];
	catalogItems: CatalogItem[];
	userAuthority: UserAuthority | null;
	userCartItems: UserCartItem[];
	userFavoritesItems: UserFavoriteItem[];
}

const DesktopHeader: React.FC<HeaderProps> = ({
	isMobile = false,
	onLoginClick,
	onLogoutClick,
	categories,
	catalogItems,
	userAuthority,
	userCartItems,
	userFavoritesItems,
}) => {
	const navigate = useNavigate();

	const [anchorElCatalog, setAnchorElCatalog] = React.useState<null | HTMLElement>(null);
	const catalogMenuOpened = Boolean(anchorElCatalog);

	const [anchorElProfile, setAnchorElProfile] = React.useState<null | HTMLElement>(null);
	const profileMenuOpened = Boolean(anchorElProfile);

	const handleCloseCatalogMenu = () => setAnchorElCatalog(null);

	const handleCloseProfileMenu = () => setAnchorElProfile(null);

	return (
		<div className="d-f fd-r jc-c" style={{ padding: "0 calc(24/1920 * 100%)", backgroundColor: "white" }}>
			<header className="fg-1 d-f fd-r jc-sb ai-c gap-3 pt-4 pb-3 " style={{ maxWidth: 1408 }}>
				<div className="w-100 d-f jc-fs ai-c gap-5">
					<IconButton onClick={() => navigate("/")}>
						<img src={logo} height={88} alt="logo" />
					</IconButton>

					<div className="w-100 h-7 d-f jc-fs gap-3" style={{ maxWidth: 810 }}>
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
							{categories.map((category) => (
								<MenuItem
									onClick={() => {
										handleCloseCatalogMenu();
										return navigate(`/catalog/${category.link}`);
									}}
								>
									<div className="d-f fd-r ai-c gap-12px">
										<div className="ps-r w-7 h-7 br-1 d-f jc-c of-h">
											<img className="cover" src={getImageUrl(category.image, "small")}></img>
										</div>
										<Typography variant="body1">{category.title}</Typography>
									</div>
									<ChevronRight />
								</MenuItem>
							))}
						</Menu>
						<CatalogSearch catalogItems={catalogItems} />
					</div>
				</div>
				<HeaderButtons
					isMobile={isMobile}
					buttons={[
						{ text: "Админка", icon: <AdminPanelSettings />, onClick: () => navigate("/admin") },
						{ text: "FAQ", icon: <Info />, onClick: () => navigate("/faq") },
						{
							text: "Избранное",
							icon: <Favorite />,
							onClick: () => navigate("/favorites"),
							badgeCount: userFavoritesItems.length,
						},
						{
							text: userAuthority ? "Профиль" : "Войти",
							icon: <Person />,
							onClick: userAuthority
								? (event) => setAnchorElProfile(event.currentTarget)
								: () => onLoginClick(),
						},
						{
							text: "Корзина",
							icon: <ShoppingCart />,
							onClick: () => navigate("/cart"),
							badgeCount: userCartItems.length,
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
						<div className="d-f fd-r ai-c gap-12px">
							<Typography variant="body1">Заказы</Typography>
						</div>
						<ChevronRight />
					</MenuItem>

					<MenuItem
						onClick={() => {
							handleCloseProfileMenu();
							return navigate("/profile/settings");
						}}
					>
						<div className="d-f fd-r ai-c gap-12px">
							<Typography variant="body1">Мои данные</Typography>
						</div>
						<ChevronRight />
					</MenuItem>

					<MenuItem
						onClick={() => {
							handleCloseProfileMenu();
							onLogoutClick();
						}}
					>
						<div className="d-f fd-r ai-c gap-12px">
							<Typography color="error.main" variant="body1">
								Выход
							</Typography>
						</div>
						<Logout />
					</MenuItem>
				</Menu>
			</header>
		</div>
	);
};

const MobileHeader: React.FC<HeaderProps> = ({
	isMobile = true,
	onLoginClick,
	onLogoutClick,
	categories,
	catalogItems,
	userAuthority,
	userCartItems,
	userFavoritesItems,
}) => {
	const navigate = useNavigate();
	const [mobileMenuIsOpened, setMobileMenuIsOpened] = React.useState(false);
	const trigger = useScrollTrigger();

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
			<div className="ps-f top-0 w-100 h-9 fs-0 d-f fd-r jc-sb ai-c pr-2 pl-1 bg-primary" style={{ zIndex: 5 }}>
				<div className="d-f fd-r ai-c gap-1" style={{ zIndex: 1000 }}>
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
					isMobile={isMobile}
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
				<div className="ps-f top-8 w-100 h-11 p-2 bg-primary" style={{ zIndex: 4 }}>
					<CatalogSearch catalogItems={catalogItems} isMobile />
				</div>
			</Slide>
		</div>
	);
};

interface HeaderWrapperProps {
	isMobile?: boolean;
}

export default function Header({ isMobile }: HeaderWrapperProps) {
	const navigate = useNavigate();
	const categories = useSelector((state: RootState) => state.catalog.categories);
	const catalogItems = useSelector((state: RootState) => state.catalog.items);
	const userAuthority = useSelector((state: RootState) => state.userAuthority.authority);
	const userCartItems = useSelector((state: RootState) => state.userCart.items);
	const userFavoritesItems = useSelector((state: RootState) => state.userFavorites.items);

	const onLoginClick = () => {
		navigate("/auth/login");
	};

	const onLogoutClick = () => {
		navigate("/logout");
	}

	return (
		<>
			{isMobile === true ? (
				<MobileHeader
					onLoginClick={onLoginClick}
					onLogoutClick={onLogoutClick}
					categories={categories}
					catalogItems={catalogItems}
					userAuthority={userAuthority}
					userCartItems={userCartItems}
					userFavoritesItems={userFavoritesItems}
				/>
			) : (
				<DesktopHeader
					onLoginClick={onLoginClick}
					onLogoutClick={onLogoutClick}
					categories={categories}
					catalogItems={catalogItems}
					userAuthority={userAuthority}
					userCartItems={userCartItems}
					userFavoritesItems={userFavoritesItems}
				/>
			)}
		</>
	);
}
