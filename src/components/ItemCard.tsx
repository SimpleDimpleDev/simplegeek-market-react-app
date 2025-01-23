import {
	AddShoppingCart,
	ExpandMore,
	Favorite,
	FavoriteBorder,
	NotificationAdd,
	NotificationsOff,
	ShoppingCart,
} from "@mui/icons-material";
import { CircularProgress, Collapse, Divider, IconButton, Radio, Tooltip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";

import { getImageUrl } from "@utils/image";
import { CatalogItem } from "@appTypes/CatalogItem";
import { CreditInfoGet } from "@appTypes/Credit";
import { useAddCartItemMutation } from "@api/shop/cart";
import { useAddFavoriteItemMutation, useRemoveFavoriteItemMutation } from "@api/shop/favorites";
import { useAddTrackedItemMutation, useRemoveTrackedItemMutation } from "@api/shop/tracked";
import { useState } from "react";
import { DateFormatter, getRuPaymentWord } from "@utils/format";

interface ItemCardProps {
	data: CatalogItem;

	isAvailable?: boolean;
	availabilityIsLoading: boolean;

	isInCart?: boolean;
	cartItemListIsLoading: boolean;

	isFavorite?: boolean;
	favoriteItemListIsLoading: boolean;

	isTracked?: boolean;
	trackedItemListIsLoading: boolean;
}

export default function ItemCard({
	data,
	isAvailable,
	availabilityIsLoading,
	isInCart,
	cartItemListIsLoading,
	isFavorite,
	favoriteItemListIsLoading,
	isTracked,
	trackedItemListIsLoading,
}: ItemCardProps) {
	const navigate = useNavigate();

	const [addCartItem] = useAddCartItemMutation();

	const [addFavoriteItem] = useAddFavoriteItemMutation();
	const [removeFavoriteItem] = useRemoveFavoriteItemMutation();

	const [addTrackedItem] = useAddTrackedItemMutation();
	const [removeTrackedItem] = useRemoveTrackedItemMutation();

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
		if (isAvailable === undefined || isInCart === undefined || isTracked === undefined) return;
		if (isInCart) {
			navigate("/cart");
		} else if (isAvailable) {
			addCartItem({ itemId: data.id });
		} else if (isTracked) {
			removeTrackedItem({ itemId: data.id });
		} else {
			addTrackedItem({ itemId: data.id });
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
			<div className="gap-1 px-1 d-f fd-c">
				<Tooltip leaveTouchDelay={5000} enterTouchDelay={10} enterDelay={500} title={data.product.title}>
					<Typography	
						variant="subtitle0"
						sx={{
							userSelect: "none",
							// msUserSelect: "none",
							// mozUserSelect: "none",
							// WebkitUserSelect: "none",
							fontWeight: 600,
							maxWidth: 280,
							overflow: "hidden",
							textOverflow: "ellipsis",
							WebkitLineClamp: 1,
							display: "-webkit-box",
							WebkitBoxOrient: "vertical",
						}}
					>
						{data.product.title}
					</Typography>
				</Tooltip>
				<div className="d-f fd-r jc-sb">
					<div className="d-f fd-c">
						{availabilityIsLoading ? (
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
							data.preorder ? (
								<Typography variant="body2" color="typography.success">
									Недоступно для предзаказа
								</Typography>
							) : (
								<Typography variant="body2" color="typography.success">
									Нет в наличии
								</Typography>
							)
						)}
						<div className="gap-1 d-f fd-r">
							{data.discount ? (
								<>
									<Typography
										variant="h6"
										sx={{ textDecoration: "line-through", color: "typography.secondary" }}
									>
										{data.price} ₽
									</Typography>
									<Typography variant="h6" color="warning">
										{data.price - data.discount} ₽
									</Typography>
								</>
							) : (
								<Typography variant="h6">{data.price} ₽</Typography>
							)}
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
							disabled={isAvailable === undefined || isInCart === undefined || isTracked === undefined}
							onClick={handleAddToCart}
							style={{
								width: 48,
								height: 48,
								borderRadius: 8,
							}}
							sx={
								isAvailable
									? {
											backgroundColor: "primary.main",
											"&:hover": {
												backgroundColor: "primary.dark",
											},
									  }
									: {}
							}
						>
							{availabilityIsLoading || cartItemListIsLoading || trackedItemListIsLoading ? (
								<CircularProgress sx={{ color: "icon.primary" }} />
							) : isAvailable ? (
								isInCart ? (
									<ShoppingCart sx={{ color: "icon.primary" }} />
								) : (
									<AddShoppingCart sx={{ color: "icon.primary" }} />
								)
							) : isTracked ? (
								<NotificationsOff sx={{ color: "icon.primary" }} />
							) : (
								<NotificationAdd sx={{ color: "icon.primary" }} />
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
				<div className="gap-1 d-f fd-c">
					<Typography variant="body1">{title}</Typography>
					<Typography variant="body2" sx={{ color: "typography.secondary" }}>
						{quantity} шт.
					</Typography>
				</div>
			</div>
			<div className="ml-2">
				<Typography variant="subtitle0" sx={{ width: "max-content", display: "flex" }}>{price} ₽</Typography>
			</div>
		</div>
	);
};

type ShopOrderItemCardCreditProps = ShopOrderItemCardProps & {
	creditInfo: CreditInfoGet;
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
	const [creditInfoExpanded, setCreditInfoExpanded] = useState(false);
	return (
		<div className="gap-1 w-100 d-f fd-c">
			<ShopOrderItemCard imgUrl={imgUrl} title={title} quantity={quantity} price={price} />
			<div className="gap-1 d-f fd-r">
				<div className="gap-05 d-f fd-r">
					<Radio checked={!isCredit} onChange={() => onCreditChange(false)} color="warning" />
					<div className="gap-05 d-f fd-c">
						<Typography variant="body1">Оплатить всю суму сразу</Typography>
						<Typography variant="body2" sx={{ color: "typography.secondary" }}>
							{price} ₽
						</Typography>
					</div>
				</div>
				<div className="gap-05 d-f fd-r">
					<Radio checked={isCredit} onChange={() => onCreditChange(true)} color="warning" />
					<div className="gap-05 d-f fd-c">
						<Typography variant="body1">В рассрочку</Typography>
						<Typography variant="body2" sx={{ color: "typography.secondary" }}>
							{creditInfo.payments.length + 1} {getRuPaymentWord(creditInfo.payments.length + 1)} от{" "}
							{creditInfo.payments[0].sum} ₽
						</Typography>
					</div>
				</div>

				<IconButton sx={{ padding: 0 }} onClick={() => setCreditInfoExpanded(!creditInfoExpanded)}>
					<ExpandMore
						sx={{
							transform: creditInfoExpanded ? "rotate(180deg)" : "rotate(0deg)",
							transition: "all 0.2s ease-in-out",
						}}
					/>
				</IconButton>
			</div>
			<Collapse orientation="vertical" in={creditInfoExpanded}>
				<Stack direction="column" divider={<Divider />} spacing={1}>
					<Box display="flex" flexDirection="row" gap={1}>
						<Typography variant="subtitle1" sx={{ width: "100%" }}>{`${creditInfo.deposit} ₽`}</Typography>
						<Typography variant="subtitle1" sx={{ width: "100%" }}>
							Депозит
						</Typography>
					</Box>
					{creditInfo.payments.map((part) => {
						return (
							<Box display="flex" flexDirection="row" gap={1}>
								<Typography variant="subtitle1" sx={{ width: "100%" }}>{`${part.sum} ₽`}</Typography>
								<Typography variant="subtitle1" sx={{ width: "100%" }}>
									{DateFormatter.DDMMYYYY(part.deadline)}
								</Typography>
							</Box>
						);
					})}
				</Stack>
			</Collapse>
		</div>
	);
};
