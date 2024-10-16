import { useDeleteCartItemsMutation, usePatchCartItemMutation } from "@api/shop/cart";
import {
	useAddFavoriteItemMutation,
	useRemoveFavoriteItemMutation,
} from "@api/shop/favorites";
import { CatalogItemCart } from "@appTypes/Cart";
import { Favorite, FavoriteBorder, Delete, Remove, Add } from "@mui/icons-material";
import { Box, IconButton, Typography, Checkbox, CircularProgress } from "@mui/material";

import { getImageUrl } from "@utils/image";

const ControlButtons = ({
	isFavorite,
	onFavoriteClick,
	favoriteLoading,
	isInCart,
	onDelete,
	cartLoading,
}: {
	isFavorite: boolean | undefined;
	onFavoriteClick: () => void;
	favoriteLoading: boolean;
	isInCart: boolean | undefined;
	onDelete: () => void;
	cartLoading: boolean;
}) => (
	<Box display={"flex"} flexDirection={"row"} gap={1}>
		<IconButton disabled={favoriteLoading} onClick={onFavoriteClick}>
			{favoriteLoading ? (
				<CircularProgress sx={{ color: "icon.primary" }} />
			) : isFavorite ? (
				<Favorite sx={{ color: "icon.attention" }} />
			) : (
				<FavoriteBorder color="secondary" />
			)}
		</IconButton>
		<IconButton disabled={cartLoading || !isInCart} onClick={onDelete}>
			{cartLoading ? <CircularProgress sx={{ color: "icon.primary" }} /> : <Delete />}
		</IconButton>
	</Box>
);

const QuantityButtons = ({
	quantity,
	onIncrement,
	onDecrement,
	disabled,
	incrementLocked,
}: {
	quantity: number;
	onIncrement: () => void;
	onDecrement: () => void;
	disabled?: boolean;
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
		<IconButton disabled={quantity === 1 || disabled} onClick={onDecrement}>
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

		<IconButton disabled={incrementLocked || disabled} onClick={onIncrement}>
			<Add />
		</IconButton>
	</Box>
);

interface CartItemProps {
	isMobile: boolean;
	item: CatalogItemCart;

	isAvailable?: boolean;
	availabilityIsLoading: boolean;

	isInCart?: boolean;
	cartItemListIsLoading: boolean;

	isFavorite?: boolean;
	favoriteItemListIsLoading: boolean;

	checked: boolean;
	onCheck: () => void;
	onClick: () => void;
}

const CartItem = ({
	isMobile,
	item,
	isAvailable,
	availabilityIsLoading,
	isInCart,
	cartItemListIsLoading,
	isFavorite,
	favoriteItemListIsLoading,
	checked,
	onCheck,
}: CartItemProps) => {
	const [addFavoriteItem] = useAddFavoriteItemMutation();
	const [removeFavoriteItem] = useRemoveFavoriteItemMutation();

	const [patchCartItem, { isLoading: patchCartItemIsLoading }] = usePatchCartItemMutation();
	const [removeCartItems] = useDeleteCartItemsMutation();

	const handleToggleFavorite = () => {
		if (isFavorite) {
			removeFavoriteItem({ itemId: item.id });
		} else {
			addFavoriteItem({ itemId: item.id });
		}
	};

	const handleDelete = () => {
		removeCartItems({ itemIds: [item.id] });
	};

	const handleIncrement = () => {
		patchCartItem({ itemId: item.id, action: "INCREMENT" });
	};

	const handleDecrement = () => {
		patchCartItem({ itemId: item.id, action: "DECREMENT" });
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
								src={getImageUrl(item.product.images.at(0)?.url ?? "", "medium")}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
						</Box>

						<Box display="flex" flexDirection="column" justifyContent="space-between">
							<Box display="flex" flexDirection="column" gap={"4px"} paddingLeft={1}>
								{isMobile && (
									<div className="gap-05 d-f fd-r">
										{item.discount ? (
											<>
												<Typography
													variant="subtitle1"
													sx={{
														textDecoration: "line-through",
														color: "typography.secondary",
													}}
												>
													{item.price} ₽
												</Typography>
												<Typography variant="subtitle1">
													{item.price - item.discount} ₽
												</Typography>
											</>
										) : (
											<Typography variant="subtitle1">{item.price} ₽</Typography>
										)}
									</div>
								)}

								<Typography variant="body2">{item.product.title}</Typography>
								{availabilityIsLoading ? (
									<Typography variant="body2">Загрузка...</Typography>
								) : isAvailable === undefined ? null : isAvailable ? (
									item.preorder !== null ? (
										<Typography color="typography.success" variant="body2">
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
									onFavoriteClick={handleToggleFavorite}
									favoriteLoading={favoriteItemListIsLoading}
									isInCart={isInCart}
									onDelete={handleDelete}
									cartLoading={cartItemListIsLoading}
								/>
							)}
						</Box>
					</Box>

					{!isMobile && (
						<Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="end">
							<div className="gap-1 d-f fd-r">
								{item.discount ? (
									<>
										<Typography
											variant="subtitle1"
											sx={{
												textDecoration: "line-through",
												color: "typography.secondary",
											}}
										>
											{item.price} ₽
										</Typography>
										<Typography variant="subtitle1">{item.price - item.discount} ₽</Typography>
									</>
								) : (
									<Typography variant="subtitle1">{item.price} ₽</Typography>
								)}
							</div>

							<QuantityButtons
								quantity={item.quantity}
								onIncrement={handleIncrement}
								onDecrement={handleDecrement}
								disabled={patchCartItemIsLoading}
							/>
						</Box>
					)}
				</Box>
				{isMobile && (
					<Box display="flex" flexDirection="row" justifyContent="space-between">
						<ControlButtons
							isFavorite={isFavorite}
							onFavoriteClick={handleToggleFavorite}
							favoriteLoading={favoriteItemListIsLoading}
							isInCart={isInCart}
							onDelete={handleDelete}
							cartLoading={cartItemListIsLoading}
						/>
						<QuantityButtons
							quantity={item.quantity}
							onIncrement={handleIncrement}
							onDecrement={handleDecrement}
							disabled={patchCartItemIsLoading}
						/>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export { CartItem };
