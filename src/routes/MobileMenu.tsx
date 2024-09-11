import logo from "@assets/MainLogoBig.png";
import { CategoryShop } from "@appTypes/Category";
import { UserAuthority } from "@appTypes/User";
import { ChevronRight, Close, Info, Person } from "@mui/icons-material";
import { IconButton, ListItem, ListItemButton, MenuItem, Modal, Slide, Typography } from "@mui/material";
import { getImageUrl } from "@utils/image";
import { useNavigate } from "react-router-dom";

const CatalogSectionMenuItem = ({ onClick, title, imgUrl }: { onClick: () => void; title: string; imgUrl: string }) => (
	<MenuItem sx={{ width: "100%", padding: "12px 0" }} onClick={onClick}>
		<div className="d-f fd-r ai-c gap-12px">
			<div className="ps-r w-7 h-7 br-1 d-f jc-c of-h">
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
					<div className="ps-f top-0 left-0 w-100v h-100v d-f fd-c jc-fs ai-c of-a bg-secondary">
						<div className="w-100 h-9 fs-0 d-f fd-r jc-sb ai-c px-2">
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

						<div className="w-100 d-f fd-c gap-1 py-1">
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
									<div className="d-f fd-r ai-c gap-1">
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
								<div className="d-f fd-c gap-12px px-2">
									<div
										className="d-f fd-r jc-fs ai-c br-12px px-2 py-12px bg-primary"
										onClick={() => {
											navigate("/profile/orders");
											onMenuClose();
										}}
									>
										<Typography variant="body1">Заказы</Typography>
									</div>
									<div
										className="d-f fd-r jc-fs ai-c br-12px px-2 py-12px bg-primary"
										onClick={() => {
											navigate("/profile/settings");
											onMenuClose();
										}}
									>
										<Typography variant="body1">Мои данные</Typography>
									</div>
									<div
										className="d-f fd-r jc-fs ai-c br-12px px-2 py-12px bg-primary"
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
									<div className="d-f fd-r ai-c gap-1">
										<Info />
										<div className="py-05">
											<Typography variant="subtitle1">FAQ</Typography>
										</div>
									</div>
								</ListItemButton>
							</ListItem>
						</div>

						<div className="w-100 h-100 d-f fd-c gap-1 p-2 pb-1 bg-primary">
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
										imgUrl={getImageUrl(category.image, "small")}
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
