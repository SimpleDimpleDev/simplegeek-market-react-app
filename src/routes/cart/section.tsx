import { Add, Delete, Favorite, FavoriteBorder, Remove } from "@mui/icons-material";
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grow,
	IconButton,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { baseFadeTime } from "@config/animation";
import { DateFormatter } from "@utils/format";
import { useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@utils/image";
import { CatalogItemCart, FormedCartSection } from "@appTypes/Cart";
import { UserCartItem, UserFavoriteItem } from "@appTypes/UserItems";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@state/store";
import { addFavoriteItem, patchCartItem, removeCartItems, removeFavoriteItem } from "@state/user/thunks";

interface CartSectionHeaderProps {
	allChecked: boolean;
	onCheckAll: () => void;
	anySelected: boolean;
	onDeleteSelected: () => void;
}

const CartSectionHeader = ({ allChecked, onCheckAll, anySelected, onDeleteSelected }: CartSectionHeaderProps) => {
	return (
		<>
			<Box width="100%" display="flex" flexDirection="row" justifyContent="space-between">
				<Box display="flex" flexDirection="row" alignItems="center" gap={1}>
					<Checkbox checked={allChecked} onChange={onCheckAll} />
					<Typography variant="body1">Выбрать все</Typography>
				</Box>
				<Button variant="text" disabled={!anySelected} onClick={onDeleteSelected}>
					<Typography color="warning.main" variant="body1">
						Удалить выбранное
					</Typography>
				</Button>
			</Box>
		</>
	);
};

const CartSectionWrapper = ({ isMobile, children }: { isMobile: boolean; children: React.ReactNode }) => (
	<Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2}>
		{children}
	</Box>
);

const CartSectionItemsWrapper = ({ isMobile, children }: { isMobile: boolean; children: React.ReactNode }) => (
	<Box
		width="100%"
		display="flex"
		flexDirection="column"
		gap={2}
		padding={isMobile ? "16px 16px 24px 8px" : "16px 24px 24px 24px"}
		borderRadius={3}
		sx={{
			backgroundColor: "surface.primary",
		}}
	>
		{children}
	</Box>
);

const ControlButtons = ({
	isFavorite,
	onDelete,
	onFavoriteClick,
}: {
	isFavorite: boolean;
	onDelete: () => void;
	onFavoriteClick: () => void;
}) => (
	<Box display={"flex"} flexDirection={"row"} gap={1}>
		<IconButton onClick={onFavoriteClick}>
			{isFavorite ? <Favorite sx={{ color: "icon.attention" }} /> : <FavoriteBorder color="secondary" />}
		</IconButton>
		<IconButton onClick={onDelete}>
			<Delete />
		</IconButton>
	</Box>
);

const QuantityButtons = ({
	quantity,
	onIncrement,
	onDecrement,
	incrementLocked,
}: {
	quantity: number;
	onIncrement: () => void;
	onDecrement: () => void;
	incrementLocked?: boolean;
}) => (
	<Box
		display={"flex"}
		flexDirection={"row"}
		justifyContent={"space-between"}
		gap={"8px"}
		width={"136px"}
		borderRadius={"8px"}
		sx={{
			backgroundColor: "surface.secondary",
		}}
	>
		<IconButton disabled={quantity === 1} onClick={onDecrement}>
			<Remove />
		</IconButton>
		<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
			<Typography
				variant="subtitle2"
				sx={{ userSelect: "none", msUserSelect: "none", MozUserSelect: "none", WebkitUserSelect: "none" }}
			>
				{quantity}
			</Typography>
		</Box>

		<IconButton disabled={incrementLocked} onClick={onIncrement}>
			<Add />
		</IconButton>
	</Box>
);

interface CartItemProps {
	isMobile: boolean;

	item: CatalogItemCart;
	isAvailable: boolean;

	onClick: () => void;

	checked: boolean;
	onCheck: () => void;

	isFavorite: boolean;
}

const CartItem = ({
	isMobile,

	item,
	isAvailable,

	checked,
	onCheck,

	isFavorite,
}: CartItemProps) => {
	const dispatch = useDispatch<AppDispatch>();

	const handleToggleFavorite = () => {
		if (isFavorite) {
			dispatch(removeFavoriteItem({ itemId: item.id }));
		} else {
			dispatch(addFavoriteItem({ itemId: item.id }));
		}
	};

	const handleDelete = () => {
		dispatch(removeCartItems({ itemIds: [item.id] }));
	};

	const handleIncrement = () => {
		dispatch(patchCartItem({ itemId: item.id, action: "INCREMENT" }));
	};

	const handleDecrement = () => {
		dispatch(patchCartItem({ itemId: item.id, action: "DECREMENT" }));
	};

	return (
		<Box width="100%" display="flex" flexDirection="row" gap={1}>
			{isMobile && <Checkbox checked={checked} onChange={onCheck} />}

			<Box width="100%" display="flex" flexDirection="column" gap={1}>
				<Box display="flex" flexDirection="row" justifyContent="space-between">
					<Box display="flex" flexDirection="row" gap={1}>
						{!isMobile && <Checkbox checked={checked} onChange={onCheck} />}

						<Box
							width={96}
							height={96}
							borderRadius={2}
							display="flex"
							flexShrink={0}
							justifyContent="center"
							alignItems="center"
							overflow="hidden"
						>
							<img
								src={getImageUrl(item.product.images.at(0) ?? "", "medium")}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
						</Box>

						<Box display="flex" flexDirection="column" justifyContent="space-between">
							<Box display="flex" flexDirection="column" gap={"4px"} paddingLeft={1}>
								{isMobile && <Typography variant="subtitle1">{item.price} ₽</Typography>}

								<Typography variant="body2">{item.product.title}</Typography>

								{isAvailable ? (
									item.preorder !== null ? (
										<Typography color="typography.secondary" variant="body2">
											Доступно для предзаказа
										</Typography>
									) : (
										<Typography color="typography.success" variant="body2">
											В наличии
										</Typography>
									)
								) : (
									<Typography color="typography.attention" variant="body2">
										Нет в наличии
									</Typography>
								)}
							</Box>

							{!isMobile && (
								<ControlButtons
									isFavorite={isFavorite}
									onDelete={handleDelete}
									onFavoriteClick={handleToggleFavorite}
								/>
							)}
						</Box>
					</Box>

					{!isMobile && (
						<Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="end">
							<Typography variant="subtitle1">{item.price} ₽</Typography>

							<QuantityButtons
								quantity={item.quantity}
								onIncrement={handleIncrement}
								onDecrement={handleDecrement}
							/>
						</Box>
					)}
				</Box>
				{isMobile && (
					<Box display="flex" flexDirection="row" justifyContent="space-between">
						<ControlButtons
							isFavorite={isFavorite}
							onDelete={handleDelete}
							onFavoriteClick={handleToggleFavorite}
						/>
						<QuantityButtons
							quantity={item.quantity}
							onIncrement={handleIncrement}
							onDecrement={handleDecrement}
						/>
					</Box>
				)}
			</Box>
		</Box>
	);
};

interface CartSectionProps {
	isMobile: boolean;

	data: FormedCartSection;

	userCart: UserCartItem[];
	userFavorites: UserFavoriteItem[];

	onMakeOrder: (items: UserCartItem[]) => void;
}

export const CartSection = ({
	isMobile,

	data,

	userFavorites,

	onMakeOrder,
}: CartSectionProps) => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const [checkedIds, setCheckedIds] = useState<string[]>(data.unavailable ? [] : data.items.map((item) => item.id));
	const [deleteModalIsOpened, setDeleteModalIsOpened] = useState(false);

	useEffect(() => {
		setCheckedIds((prev) => prev.filter((id) => data.items.some((item) => item.id === id)));
	}, [data]);

	const checkedItemsCount = checkedIds.length;
	const allChecked = checkedItemsCount === data.items.length;

	const userFavoriteIds = useMemo(() => userFavorites.map((item) => item.id), [userFavorites]);

	const totalPrice = data.items
		.filter((cartItem) => checkedIds.includes(cartItem.id))
		.map((cartItem) => cartItem.price * cartItem.quantity)
		.reduce((a, b) => a + b, 0);

	const handleDeleteSelected = () => {
		dispatch(removeCartItems({ itemIds: checkedIds }));
		setCheckedIds([]);
		setDeleteModalIsOpened(false);
	};

	const handleCheckItem = (id: string) => {
		if (checkedIds.includes(id)) {
			setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id));
		} else {
			setCheckedIds([...checkedIds, id]);
		}
	};

	const handleCheckAll = () => {
		if (allChecked) {
			setCheckedIds([]);
		} else {
			setCheckedIds(data.items.map((item) => item.id));
		}
	};

	return (
		<Box display="flex" flexDirection="column" gap={2}>
			<Dialog
				sx={{ borderRadius: "24px", "& .MuiPaper-root": { width: isMobile ? "100%" : "444px" } }}
				open={deleteModalIsOpened}
				onClose={() => setDeleteModalIsOpened(false)}
			>
				<DialogTitle>Удалить выбранные товары?</DialogTitle>
				<DialogContent>После удаления отменить действие будет невозможно</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setDeleteModalIsOpened(false)}
						sx={{ borderRadius: "8px" }}
						fullWidth
						variant="contained"
						color="secondary"
					>
						Отмена
					</Button>
					<Button onClick={handleDeleteSelected} sx={{ borderRadius: "8px" }} fullWidth variant="contained">
						Удалить
					</Button>
				</DialogActions>
			</Dialog>

			<Typography variant="h6">{data.title}</Typography>
			{data.preorder && data.preorder.expectedArrival && (
				<Box display={"flex"} flexDirection={"row"} gap={"8px"}>
					<Typography color="typography.secondary" variant="subtitle1">
						На складе ожидается:
					</Typography>
					<Typography variant="subtitle1">
						{DateFormatter.CyrillicMonthNameYYYY(data.preorder.expectedArrival)}
					</Typography>
				</Box>
			)}
			<CartSectionWrapper isMobile={isMobile}>
				<CartSectionItemsWrapper isMobile={isMobile}>
					<CartSectionHeader
						allChecked={allChecked}
						onCheckAll={handleCheckAll}
						anySelected={checkedIds.length > 0}
						onDeleteSelected={() => setDeleteModalIsOpened(true)}
					/>
					{data.items.map((cartItem, cartItemIndex) => {
						return (
							<Grow key={cartItem.id} in timeout={(cartItemIndex + 1) * baseFadeTime}>
								<Box display="flex" flexDirection="column" gap={2}>
									<Divider></Divider>
									<CartItem
										isMobile={isMobile}
										key={cartItem.id}
										item={cartItem}
										isAvailable={!data.unavailable}
										isFavorite={userFavoriteIds.includes(cartItem.id)}
										checked={checkedIds.includes(cartItem.id)}
										onClick={() => {
											const variationParam =
												cartItem.variationIndex !== null ? `?v=${cartItem.variationIndex}` : "";
											navigate(`/item/${cartItem.publicationLink}${variationParam}`);
										}}
										onCheck={() => {
											handleCheckItem(cartItem.id);
										}}
									/>
								</Box>
							</Grow>
						);
					})}
				</CartSectionItemsWrapper>
				{!data.unavailable ? (
					<Box
						position={isMobile ? "relative" : "sticky"}
						top={16}
						display="flex"
						flexShrink={0}
						flexDirection="column"
						gap={2} // assuming the theme's spacing unit is 8px, otherwise adjust accordingly
						p={2}
						bgcolor="white"
						borderRadius={3}
						width={isMobile ? "100%" : 360}
						height="fit-content"
					>
						<Box display="flex" flexDirection="column" gap={1}>
							<Typography variant="subtitle0">Итого:</Typography>
							<Box display="flex" flexDirection="row" alignItems={"baseline"} gap={1}>
								<Typography variant="h4">{totalPrice} ₽</Typography>
								<Typography color="typography.secondary" variant="body1">
									/ {checkedItemsCount} товаров
								</Typography>
							</Box>
							{data.creditAvailable && (
								<Typography variant="body2" color="typography.success">
									Доступна рассрочка
								</Typography>
							)}
						</Box>
						<Button
							onClick={() => {
								const checkedItems = data.items.filter((item) => checkedIds.includes(item.id));
								onMakeOrder(checkedItems);
							}}
							variant="contained"
							disabled={checkedItemsCount === 0}
						>
							Оформить
						</Button>
						{data.preorder && (
							<Typography variant="caption" color="typography.disabled">
								В сумме заказа не учитывается стоимость доставки до склада. Она будет известна после его
								приезда.
							</Typography>
						)}
					</Box>
				) : (
					<Box display={isMobile ? "none" : "flex"} width={360} flexShrink={0}></Box>
				)}
			</CartSectionWrapper>
		</Box>
	);
};
