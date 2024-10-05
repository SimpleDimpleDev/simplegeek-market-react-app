import { AddShoppingCart, Favorite, FavoriteBorder, NotificationAdd, ShoppingCart } from "@mui/icons-material";
import { CircularProgress, IconButton, Radio, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";

import { getImageUrl } from "@utils/image";
import { CatalogItem } from "@appTypes/CatalogItem";
import { CreditInfo } from "@appTypes/Credit";
import { useAddCartItemMutation, useGetCartItemListQuery } from "@api/shop/cart";
import {
	useAddFavoriteItemMutation,
	useGetFavoriteItemListQuery,
	useRemoveFavoriteItemMutation,
} from "@api/shop/favorites";
import { useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import { useMemo } from "react";

interface ItemCardProps {
	data: CatalogItem;
}

export default function ItemCard({ data }: ItemCardProps) {
	const navigate = useNavigate();

	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const { data: cartItemList, isLoading: cartItemListIsLoading } = useGetCartItemListQuery();
	const { data: availableItemIds, isLoading: availableItemIdsIsLoading } = useGetItemsAvailabilityQuery();

	const [addCartItem] = useAddCartItemMutation();
	const [addFavoriteItem] = useAddFavoriteItemMutation();
	const [removeFavoriteItem] = useRemoveFavoriteItemMutation();

	const isAvailable = useMemo(() => {
		return availableItemIds?.includes(data.id) || false;
	}, [availableItemIds, data.id]);

	const isInCart = useMemo(() => {
		return cartItemList?.items.some((item) => item.id === data.id);
	}, [cartItemList, data.id]);

	const isFavorite = useMemo(() => {
		return favoriteItemList?.items.some((item) => item.id === data.id);
	}, [favoriteItemList, data.id]);

	function handleToggleFavorite(event: React.MouseEvent<HTMLElement, MouseEvent>) {
		event.stopPropagation();
		if (isFavorite === undefined) return;
		if (isFavorite) {
			removeFavoriteItem({ itemId: data.id });
		} else {
			addFavoriteItem({ itemId: data.id });
		}
	}

	const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.stopPropagation();
		if (isAvailable === undefined || isInCart === undefined) return;
		if (isInCart) {
			navigate("/cart");
		} else if (isAvailable) {
			addCartItem({ itemId: data.id });
		} else {
			// TODO: implement tracked items
			alert("Товар отсутствует в наличии");
		}
	};

	return (
		<div className="gap-2 p-1 pb-2 w-mc h-mc br-2 d-f fd-c hov-item tr-a-2" style={{ textDecoration: "none" }}>
			<Link
				to={`/item/${data.publicationLink}${data.variationIndex !== null ? `?v=${data.variationIndex}` : ""}`}
				title={data.product.title}
				className="bg-primary w-mc h-mc br-2 d-f jc-c of-h"
			>
				<img
					style={{ width: "300px", height: "300px" }}
					src={getImageUrl(data.product.images.at(0)?.url ?? "", "medium")}
				/>
			</Link>
			<div className="gap-1 px-2 d-f fd-c">
				{availableItemIdsIsLoading ? (
					<Typography variant="body2">Загрузка...</Typography>
				) : isAvailable === undefined ? null : isAvailable ? (
					data.preorder ? (
						<Typography variant="body2" color="typography.success">
							Доступно для предзаказа
						</Typography>
					) : (
						<Typography variant="body2" color="typography.success">
							В наличии
						</Typography>
					)
				) : (
					<Typography variant="body2" color="typography.attention">
						Нет в наличии
					</Typography>
				)}

				<div className="d-f fd-r jc-sb">
					<div className="d-f fd-c">
						<Typography variant="h6">{data.price} ₽</Typography>
						<div>
							<Typography
								variant="body1"
								style={{
									maxWidth: 205.33,
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}
							>
								{data.product.title}
							</Typography>
						</div>
					</div>
					<div className="gap-1 w-mc d-f fd-r" style={{ zIndex: 1 }}>
						<IconButton
							onClick={handleToggleFavorite}
							disabled={favoriteItemListIsLoading}
							style={{
								width: 48,
								height: 48,
								borderRadius: 8,
							}}
						>
							{favoriteItemListIsLoading ? (
								<CircularProgress sx={{ color: "icon.primary" }} />
							) : isFavorite ? (
								<Favorite sx={{ color: "icon.attention" }} />
							) : (
								<FavoriteBorder color="secondary" />
							)}
						</IconButton>
						<IconButton
							disabled={availableItemIdsIsLoading || cartItemListIsLoading}
							onClick={handleAddToCart}
							style={{
								width: 48,
								height: 48,
								borderRadius: 8,
							}}
							sx={{
								backgroundColor: isAvailable ? "primary.main" : "surface.tertiary",
								cursor: isAvailable ? "pointer" : "default",
								"&:hover": {
									backgroundColor: isAvailable ? "primary.dark" : "surface.tertiary",
								},
							}}
						>
							{availableItemIdsIsLoading || cartItemListIsLoading ? (
								<CircularProgress sx={{ color: "icon.primary" }} />
							) : isAvailable ? (
								isInCart ? (
									<ShoppingCart sx={{ color: "icon.primary" }} />
								) : (
									<AddShoppingCart sx={{ color: "icon.primary" }} />
								)
							) : (
								<NotificationAdd sx={{ color: "icon.tertiary" }} />
							)}
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	);
}

export const SmallItemCard = ({ imgUrl, price, quantity }: { imgUrl: string; price: number; quantity: number }) => {
	return (
		<Box display={"flex"} flexDirection={"column"} gap={1}>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					borderRadius: 16,
					overflow: "hidden",
					width: 96,
					height: 96,
					flexShrink: 0,
				}}
			>
				<img src={imgUrl} className="contain" />
			</div>
			<Box display={"flex"} flexDirection={"column"} gap={0.5}>
				<Typography variant={"body2"}>{price} ₽</Typography>
				<Typography variant={"body2"} color={"typography.secondary"}>
					{quantity} шт.
				</Typography>
			</Box>
		</Box>
	);
};

export type ShopOrderItemCardProps = {
	imgUrl: string;
	title: string;
	quantity: number;
	price: number;
};

export const ShopOrderItemCard: React.FC<ShopOrderItemCardProps> = ({ imgUrl, title, quantity, price }) => {
	return (
		<div className="w-100 d-f fd-r jc-sb">
			<div className="gap-1 d-f fd-r">
				<div className="ai-c br-2 d-f fs-0 jc-c of-h" style={{ width: 96, height: 96 }}>
					<img src={imgUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
				</div>
				<div className="gap-1 pt-2 d-f fd-c">
					<Typography variant="body1">{title}</Typography>
					<Typography variant="body2" sx={{ color: "typography.secondary" }}>
						{quantity} шт.
					</Typography>
				</div>
			</div>
			<div className="pt-2">
				<Typography variant="subtitle1">{price} ₽</Typography>
			</div>
		</div>
	);
};

type ShopOrderItemCardCreditProps = ShopOrderItemCardProps & {
	creditInfo: CreditInfo;
	isCredit: boolean;
	onCreditChange: (isCredit: boolean) => void;
};

export const ShopOrderItemCardCredit: React.FC<ShopOrderItemCardCreditProps> = ({
	imgUrl,
	title,
	quantity,
	price,
	isCredit,
	creditInfo,
	onCreditChange,
}) => {
	return (
		<div className="gap-1 w-100 d-f fd-c">
			<ShopOrderItemCard imgUrl={imgUrl} title={title} quantity={quantity} price={price} />
			<div className="gap-1 d-f fd-r">
				<div className="gap-05 d-f fd-r">
					<Radio checked={isCredit} onChange={() => onCreditChange(true)} color="warning" />
					<div className="gap-05 d-f fd-c">
						<Typography variant="body1">Оплатить всю суму сразу</Typography>
						<Typography variant="body2" sx={{ color: "typography.secondary" }}>
							{price} ₽
						</Typography>
					</div>
				</div>
				<div className="gap-05 d-f fd-r">
					<Radio checked={!isCredit} onChange={() => onCreditChange(false)} color="warning" />
					<div className="gap-05 d-f fd-c">
						<Typography variant="body1">В рассрочку</Typography>
						<Typography variant="body2" sx={{ color: "typography.secondary" }}>
							{creditInfo.payments.length} платежа от {creditInfo.payments[0].sum} ₽
						</Typography>
					</div>
				</div>
			</div>
		</div>
	);
};
