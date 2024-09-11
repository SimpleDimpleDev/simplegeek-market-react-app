import { AddShoppingCart, Favorite, FavoriteBorder, NotificationAdd, ShoppingCart } from "@mui/icons-material";
import { IconButton, Radio, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

import { getImageUrl } from "@utils/image";
import { CatalogItem } from "@appTypes/CatalogItem";
import { CreditInfo } from "@appTypes/Credit";
import { useDispatch } from "react-redux";
import { addCartItem, addFavoriteItem, removeFavoriteItem } from "@state/user/thunks";
import { AppDispatch } from "@state/store";

interface ItemCardProps {
	data: CatalogItem;
	isAvailable: boolean;
	isInCart: boolean;
	isFavorite: boolean;
	isTracked?: boolean;
}

export default function ItemCard({ data, isAvailable, isInCart, isFavorite }: ItemCardProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	function handleToggleFavorite() {
		if (isFavorite) {
			dispatch(addFavoriteItem({ itemId: data.id }));
		} else {
			dispatch(removeFavoriteItem({ itemId: data.id }));
		}
	}

	const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (isInCart) {
			navigate("/cart");
		} else if (isAvailable) {
			dispatch(addCartItem({ itemId: data.id }));
		} else {
			alert("Товар отсутствует в наличии");
		}
		event.stopPropagation();
	};

	const handleClick = () => {
		const variationParam = data.variationIndex !== null ? `?v=${data.variationIndex}` : "";
		navigate(`/item/${data.publicationLink}${variationParam}`);
	};

	return (
		<div className="w-mc h-mc d-f fd-c gap-2 p-1 pb-2 br-2 tr-a-2 hov-item" onClick={handleClick}>
			<div className="w-mc h-mc d-f jc-c of-h br-2 bg-primary">
				<img
					style={{ width: "300px", height: "300px" }}
					src={getImageUrl(data.product.images.at(0) ?? "", "medium")}
				/>
			</div>
			<div className="d-f fd-c gap-1 px-2">
				{isAvailable ? (
					<>
						{data.preorder ? (
							<Typography variant="body2" color="typography.success">
								Доступно для предзаказа
							</Typography>
						) : (
							<Typography variant="body2" color="typography.success">
								В наличии
							</Typography>
						)}
					</>
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
					<div className="d-f fd-r gap-1 w-mc" style={{ zIndex: 1 }}>
						<IconButton
							onClick={(event) => {
								handleToggleFavorite();
								event.stopPropagation();
							}}
							style={{
								width: 48,
								height: 48,
								borderRadius: 8,
							}}
						>
							{isFavorite ? (
								<Favorite sx={{ color: "icon.attention" }} />
							) : (
								<FavoriteBorder color="secondary" />
							)}
						</IconButton>
						<IconButton
							onClick={(event) => handleAddToCart(event)}
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
							{" "}
							{isAvailable ? (
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
			<div className="d-f fd-r gap-1">
				<div className="d-f jc-c ai-c br-2 fs-0 of-h" style={{ width: 96, height: 96 }}>
					<img src={imgUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
				</div>
				<div className="d-f fd-c gap-1">
					<Typography variant="body1">{title}</Typography>
					<Typography variant="body2" sx={{ color: "typography.secondary" }}>
						{quantity} шт.
					</Typography>
				</div>
			</div>
			<div>
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
		<div className="w-100 d-f fd-c gap-1">
			<ShopOrderItemCard imgUrl={imgUrl} title={title} quantity={quantity} price={price} />
			<div className="d-f fd-r gap-1">
				<div className="d-f fd-r gap-05">
					<Radio checked={isCredit} onChange={() => onCreditChange(true)} color="warning" />
					<div className="d-f fd-c gap-05">
						<Typography variant="body1">Оплатить всю суму сразу</Typography>
						<Typography variant="body2" sx={{ color: "typography.secondary" }}>
							{price} ₽
						</Typography>
					</div>
				</div>
				<div className="d-f fd-r gap-05">
					<Radio checked={!isCredit} onChange={() => onCreditChange(false)} color="warning" />
					<div className="d-f fd-c gap-05">
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
