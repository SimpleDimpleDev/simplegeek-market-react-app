import logo from "@assets/MainLogoBig.png";
import { CategoryShop } from "@appTypes/Category";
import { UserAuthority } from "@appTypes/User";
import { ChevronRight, Close, Info, Person } from "@mui/icons-material";
import { IconButton, ListItem, ListItemButton, MenuItem, Modal, Slide, Typography } from "@mui/material";
import { getImageUrl } from "@utils/image";
import { useNavigate } from "react-router-dom";

const CatalogSectionMenuItem = ({ onClick, title, imgUrl }: { onClick: () => void; title: string; imgUrl: string }) => (
	<MenuItem sx={{ width: "100%", padding: "12px 0" }} onClick={onClick}>
		<div className="gap-12px ai-c d-f fd-r">
			<div className="w-7 h-7 br-1 d-f jc-c of-h ps-r">
				<img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={imgUrl}></img>
			</div>
			<Typography variant="body1">{title}</Typography>
		</div>
		<ChevronRight />
	</MenuItem>
);

interface MobileMenuProps {
	user: UserAuthority | null;
	onLoginClick: () => void;
	onLogoutClick: () => void;
	categories: CategoryShop[];
	isOpened: boolean;
	onMenuClose: () => void;
}

export const MobileMenu = ({
	user,
	onLoginClick,
	onLogoutClick,
	categories,
	isOpened,
	onMenuClose,
}: MobileMenuProps) => {
	const navigate = useNavigate();

	return (
		<Modal open={isOpened} onClose={() => onMenuClose} closeAfterTransition>
			<Slide mountOnEnter unmountOnExit direction="right" in={isOpened}>
				<div>
					<div className="top-0 left-0 bg-secondary w-100v h-100v ai-c d-f fd-c jc-fs of-a ps-f">
						<div className="px-2 w-100 h-9 ai-c d-f fd-r fs-0 jc-sb">
							<IconButton
								onClick={() => {
									onMenuClose();
									navigate("/");
								}}
							>
								<div style={{ width: 80, height: 40 }}>
									<img src={logo} height={40} alt="logo" />
								</div>
							</IconButton>

							<IconButton onClick={onMenuClose}>
								<Close />
							</IconButton>
						</div>

						<div className="gap-1 py-1 w-100 d-f fd-c">
							<ListItem disablePadding>
								<ListItemButton
									sx={{ padding: "8px 16px" }}
									onClick={
										user === null
											? () => {
													onLoginClick();
													onMenuClose();
											  }
											: () => {}
									}
								>
									<div className="gap-1 ai-c d-f fd-r">
										<Person />
										<div className="py-05">
											{user ? (
												<Typography variant="subtitle1">{user.email}</Typography>
											) : (
												<Typography variant="subtitle1">Войти</Typography>
											)}
										</div>
									</div>
								</ListItemButton>
							</ListItem>

							{user && (
								<div className="gap-12px px-2 d-f fd-c">
									<div
										className="bg-primary px-2 py-12px ai-c br-12px d-f fd-r jc-fs"
										onClick={() => {
											navigate("/profile/orders");
											onMenuClose();
										}}
									>
										<Typography variant="body1">Заказы</Typography>
									</div>
									<div
										className="bg-primary px-2 py-12px ai-c br-12px d-f fd-r jc-fs"
										onClick={() => {
											navigate("/profile/settings");
											onMenuClose();
										}}
									>
										<Typography variant="body1">Мои данные</Typography>
									</div>
									<div
										className="bg-primary px-2 py-12px ai-c br-12px d-f fd-r jc-fs"
										onClick={() => {
											onLogoutClick();
											onMenuClose();
										}}
									>
										<Typography variant="body1" sx={{ color: "error.main" }}>
											Выйти из аккаунта
										</Typography>
									</div>
								</div>
							)}

							<ListItem disablePadding>
								<ListItemButton
									sx={{ padding: "8px 16px" }}
									onClick={() => {
										navigate("/faq");
										onMenuClose();
									}}
								>
									<div className="gap-1 ai-c d-f fd-r">
										<Info />
										<div className="py-05">
											<Typography variant="subtitle1">FAQ</Typography>
										</div>
									</div>
								</ListItemButton>
							</ListItem>
						</div>

						<div className="gap-1 bg-primary p-2 pb-1 w-100 h-100 d-f fd-c">
							<Typography variant="h5">Каталог</Typography>
							<div>
								{categories.map((category) => (
									<CatalogSectionMenuItem
										key={category.id}
										onClick={() => {
											navigate(`/catalog/${category.link}`);
											onMenuClose();
										}}
										title={category.title}
										imgUrl={getImageUrl(category.icon.url, "small")}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</Slide>
		</Modal>
	);
};
