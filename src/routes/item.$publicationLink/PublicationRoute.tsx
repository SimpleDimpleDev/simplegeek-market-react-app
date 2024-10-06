import { AddShoppingCart, Favorite, FavoriteBorder, NotificationAdd, ShoppingCart } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BreadcrumbsPageHeader from "@components/BreadcrumbsPageHeader";
import { ItemCreditInfo } from "@components/CreditTimeline";
import SuggestedItems from "@components/SuggestedItems";
import { DateFormatter } from "@utils/format";
import React, { useMemo, useState } from "react";

import ImageCarousel from "./ImageCarousel";
import { getImageUrl } from "@utils/image";
import { useSelector } from "react-redux";
import { RootState } from "@state/store";
import { useAddCartItemMutation, useGetCartItemListQuery } from "@api/shop/cart";
import { useGetCatalogQuery, useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import {
	useAddFavoriteItemMutation,
	useGetFavoriteItemListQuery,
	useRemoveFavoriteItemMutation,
} from "@api/shop/favorites";
import { Loading } from "@components/Loading";
import { PreorderShop } from "@appTypes/Preorder";

interface ActionButtonsProps {
	isFavorite: boolean | undefined;
	isInCart: boolean | undefined;
	isAvailable: boolean | undefined;
	onFavoriteClick: () => void;
	onCartClick: () => void;
	favoritesIsLoading: boolean;
	cartIsLoading: boolean;
	availabilityIsLoading: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
	isFavorite,
	onFavoriteClick,
	favoritesIsLoading,
	isInCart,
	onCartClick,
	cartIsLoading,
	isAvailable,
	availabilityIsLoading,
}) => {
	return (
		<Box display="flex" flexDirection="row" gap={1}>
			<Button variant="contained" size="large" fullWidth onClick={onCartClick}>
				{availabilityIsLoading || cartIsLoading ? (
					<CircularProgress />
				) : isAvailable ? (
					isInCart ? (
						<ShoppingCart sx={{ color: "icon.primary" }} />
					) : (
						<AddShoppingCart sx={{ color: "icon.primary" }} />
					)
				) : (
					<NotificationAdd />
				)}
				<Typography>{isInCart ? "Перейти" : "Добавить"} в корзину</Typography>
			</Button>
			<IconButton onClick={onFavoriteClick}>
				{favoritesIsLoading ? (
					<CircularProgress />
				) : isFavorite ? (
					<Favorite sx={{ color: "icon.attention" }} />
				) : (
					<FavoriteBorder color="secondary" />
				)}
			</IconButton>
		</Box>
	);
};

interface VariationAvailabilityProps {
	availabilityIsLoading: boolean;
	variationIsAvailable: boolean | undefined;
	price: number;
	preorder: PreorderShop | null;
}

const Availability: React.FC<VariationAvailabilityProps> = ({
	availabilityIsLoading,
	variationIsAvailable,
	price,
	preorder,
}) => {
	return (
		<Box display="flex" flexDirection="column" gap={1}>
			<Typography variant="h4">{price} ₽</Typography>
			{availabilityIsLoading ? (
				<Typography variant="body2">Загрузка...</Typography>
			) : variationIsAvailable === undefined ? null : variationIsAvailable ? (
				preorder ? (
					<>
						<Typography variant="body2" color={"typography.success"}>
							Доступно для предзаказа
						</Typography>
						<Box display="flex" flexDirection="row">
							<Typography variant="body2" color={"typography.secondary"}>
								На складе ожидается:
							</Typography>
							<Typography variant="body2">
								{preorder.expectedArrival
									? DateFormatter.CyrillicMonthNameYYYY(preorder.expectedArrival)
									: "Неизвестно"}
							</Typography>
						</Box>
					</>
				) : (
					<Typography variant="body2" color={"typography.success"}>
						В наличии
					</Typography>
				)
			) : (
				<Typography variant="body2" color={"typography.error"}>
					Нет в наличии
				</Typography>
			)}
		</Box>
	);
};

export function Component() {
	const params = useParams();
	const searchParams = useSearchParams();
	const navigate = useNavigate();

	const publicationLink = params.publicationLink;
	if (publicationLink === undefined) {
		throw new Response("No item link provided", { status: 404 });
	}

	const itemVariationIndexString = searchParams[0].get("v");
	const itemVariationIndex = itemVariationIndexString === null ? 0 : parseInt(itemVariationIndexString) - 1;

	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();

	const { data: availableItemIds, isLoading: availableItemIdsIsLoading } = useGetItemsAvailabilityQuery();
	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const { data: cartItemList, isLoading: cartItemListIsLoading } = useGetCartItemListQuery();

	const [addCartItem] = useAddCartItemMutation();
	const [addFavoriteItem] = useAddFavoriteItemMutation();
	const [removeFavoriteItem] = useRemoveFavoriteItemMutation();

	const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(itemVariationIndex);

	const publication = useMemo(
		() => catalog?.publications.find((publication) => publication.link === publicationLink),
		[catalog, publicationLink]
	);
	const selectedVariation = publication?.items.at(selectedVariationIndex);

	const selectedVariationIsAvailable = useMemo(
		() => (selectedVariation === undefined ? undefined : availableItemIds?.includes(selectedVariation.id)),
		[availableItemIds, selectedVariation]
	);
	const selectedVariationIsInCart = useMemo(
		() =>
			selectedVariation === undefined
				? undefined
				: cartItemList?.items.some((cartItem) => cartItem.id === selectedVariation.id),
		[cartItemList, selectedVariation]
	);
	const selectedVariationIsFavorite = useMemo(
		() =>
			selectedVariation === undefined
				? undefined
				: favoriteItemList?.items.some((favoriteItem) => favoriteItem.id === selectedVariation.id),
		[favoriteItemList, selectedVariation]
	);
	const preparedImageUrls = useMemo(
		() => selectedVariation?.product.images.map((image) => getImageUrl(image.url, "large")) || [],
		[selectedVariation]
	);

	const handleToggleFavorite = () => {
		if (selectedVariationIsFavorite === undefined || selectedVariation === undefined) return;
		if (selectedVariationIsFavorite) {
			removeFavoriteItem({ itemId: selectedVariation.id });
		} else {
			addFavoriteItem({ itemId: selectedVariation.id });
		}
	};

	const handleCartClick = () => {
		if (
			selectedVariationIsAvailable === undefined ||
			selectedVariationIsInCart === undefined ||
			selectedVariation === undefined
		)
			return;
		if (selectedVariationIsInCart) {
			navigate("/cart");
		} else if (selectedVariationIsAvailable) {
			addCartItem({ itemId: selectedVariation.id });
		} else {
			// TODO: implement tracked items
			alert("Товар отсутствует в наличии");
		}
	};

	return (
		<Loading
			isLoading={catalogIsLoading}
			necessaryDataIsPersisted={!!catalog && !!publication && !!selectedVariation}
		>
			{!publication || !selectedVariation ? null : isMobile ? (
				<>
					<Box display="flex" flexDirection="column" width="100%" gap={2}>
						<ImageCarousel isMobile={true} imageUrls={preparedImageUrls} />
					</Box>
					<Box paddingTop={3} paddingBottom={2}>
						<Typography variant="h5">{selectedVariation.product.title}</Typography>
					</Box>
					<Box display="flex" flexDirection="column" gap={2}>
						{publication.items.length !== 1 && (
							<Box display="flex" flexDirection="column" gap={2}>
								<Typography variant="h6">Вариация</Typography>
								<Select
									fullWidth
									value={selectedVariationIndex}
									onChange={(event) => {
										setSelectedVariationIndex(event.target.value as number);
									}}
								>
									{publication.items.map((itemVariation, index) => (
										<MenuItem key={index} value={index}>
											{itemVariation.product.title}
										</MenuItem>
									))}
								</Select>
							</Box>
						)}

						<Box
							display="flex"
							flexDirection="column"
							gap={2}
							p={2}
							borderRadius={2}
							sx={{
								backgroundColor: "surface.primary",
							}}
						>
							<Availability
								availabilityIsLoading={availableItemIdsIsLoading}
								variationIsAvailable={selectedVariationIsAvailable}
								price={selectedVariation.price}
								preorder={publication.preorder}
							/>
							<ActionButtons
								isInCart={selectedVariationIsInCart}
								isFavorite={selectedVariationIsFavorite}
								isAvailable={selectedVariationIsAvailable}
								onFavoriteClick={handleToggleFavorite}
								onCartClick={handleCartClick}
								favoritesIsLoading={favoriteItemListIsLoading}
								cartIsLoading={cartItemListIsLoading}
								availabilityIsLoading={availableItemIdsIsLoading}
							/>
							{publication.preorder && (
								<Typography variant="body2" color={"typography.secondary"}>
									В сумме товара не учитывается сумма доставки до склада. Она будет известна только в
									момент приезда
								</Typography>
							)}
						</Box>

						{selectedVariation.creditInfo && (
							<Box
								display="flex"
								flexDirection="column"
								gap={3}
								p={2}
								borderRadius={2}
								sx={{
									backgroundColor: "surface.primary",
								}}
							>
								<Box display="flex" flexDirection="column" gap={1}>
									<Typography variant="h6">Есть рассрочка</Typography>
									<Typography variant="body2" color="typography.secondary">
										На 4 платежа
									</Typography>
								</Box>
								<Box display="flex" flexDirection="column" gap={1}>
									<ItemCreditInfo
										width="235px"
										lineColor="surface.secondary"
										payments={selectedVariation.creditInfo.payments}
									/>
								</Box>
							</Box>
						)}

						<Box display="flex" flexDirection="column" paddingTop={4} gap={2}>
							<Typography variant="h6">О товаре</Typography>
							{selectedVariation.product.filterGroups.map((filterGroup) =>
								filterGroup.filters.map((filter, index) => (
									<Box
										key={index}
										display="flex"
										flexDirection="row"
										justifyContent={"space-between"}
									>
										<Typography variant="body1" color="typography.secondary">
											{filterGroup.title}
										</Typography>
										<Typography
											variant="body1"
											color="warning.main"
											onClick={() => {
												navigate(
													`/catalog/${
														selectedVariation.product.category.link
													}${`?f=${filterGroup.title}:${filter.value}`}`
												);
											}}
										>
											{filter.value}
										</Typography>
									</Box>
								))
							)}
						</Box>

						<Box display="flex" flexDirection="column" paddingTop={4} gap={3}>
							<Typography variant="h6">Описание</Typography>
							<Typography variant="body1" color="typography.secondary">
								{selectedVariation.product.description}
							</Typography>
						</Box>
					</Box>
				</>
			) : (
				<>
					<BreadcrumbsPageHeader
						isMobile={false}
						isBig={false}
						path={[
							{
								title: "Главная",
								link: "/",
							},
						]}
						current={selectedVariation.product.title}
					/>
					<Box display="flex" flexDirection="row" gap={3} paddingBottom={3}>
						<Box display="flex" flexDirection="column" width={624} gap={2}>
							<ImageCarousel isMobile={false} imageUrls={preparedImageUrls} />
						</Box>

						<Box display="flex" flexDirection="column" gap={3}>
							{publication.items.length !== 1 && (
								<Box display="flex" flexDirection="column" gap={2}>
									<Typography variant="h5">Вариация</Typography>
									<Select
										fullWidth
										value={selectedVariationIndex}
										onChange={(event) => {
											setSelectedVariationIndex(event.target.value as number);
										}}
									>
										{publication.items.map((itemVariation, index) => (
											<MenuItem key={index} value={index}>
												{itemVariation.product.title}
											</MenuItem>
										))}
									</Select>
								</Box>
							)}
							<Box display={"flex"} flexDirection={"column"} width={360} gap={2}>
								<Typography variant="h5">О товаре</Typography>
								{selectedVariation.product.filterGroups.map((filterGroup) =>
									filterGroup.filters.map((filter, index) => (
										<Box
											key={index}
											display="flex"
											flexDirection="row"
											justifyContent={"space-between"}
										>
											<Typography variant="body1" color="typography.secondary">
												{filterGroup.title}
											</Typography>
											<Typography variant="body1">{filter.value}</Typography>
										</Box>
									))
								)}
							</Box>
						</Box>

						<Box display="flex" flexDirection="column" gap={3} width={360}>
							<Box
								display="flex"
								flexDirection="column"
								gap={2}
								p={2}
								borderRadius={2}
								sx={{
									backgroundColor: "surface.primary",
								}}
							>
								<Availability
									availabilityIsLoading={availableItemIdsIsLoading}
									variationIsAvailable={selectedVariationIsAvailable}
									price={selectedVariation.price}
									preorder={publication.preorder}
								/>
								<ActionButtons
									isInCart={selectedVariationIsInCart}
									isFavorite={selectedVariationIsFavorite}
									isAvailable={selectedVariationIsAvailable}
									onFavoriteClick={handleToggleFavorite}
									onCartClick={handleCartClick}
									favoritesIsLoading={favoriteItemListIsLoading}
									cartIsLoading={cartItemListIsLoading}
									availabilityIsLoading={availableItemIdsIsLoading}
								/>
								{publication.preorder && (
									<Typography variant="body2" color={"typography.secondary"}>
										В сумме товара не учитывается сумма доставки до склада. Она будет известна
										только в момент приезда
									</Typography>
								)}
							</Box>

							{selectedVariation.creditInfo && (
								<Box
									display="flex"
									flexDirection="column"
									gap={3}
									p={2}
									borderRadius={2}
									sx={{
										backgroundColor: "surface.primary",
									}}
								>
									<Box display="flex" flexDirection="column" gap={1}>
										<Typography variant="h6">Есть рассрочка</Typography>
										<Typography variant="body2" color="typography.secondary">
											На 4 платежа
										</Typography>
									</Box>
									<Box display="flex" flexDirection="column" gap={1}>
										<ItemCreditInfo
											lineColor="surface.secondary"
											width="260px"
											payments={selectedVariation.creditInfo.payments}
										/>
									</Box>
								</Box>
							)}
						</Box>
					</Box>
					<Box display="flex" flexDirection="column" paddingTop={3} paddingBottom={3} gap={3}>
						<Typography variant="h5">Описание</Typography>
						<Typography variant="body1" color="typography.secondary">
							{selectedVariation.product.description}
						</Typography>
					</Box>
				</>
			)}
			<SuggestedItems />
		</Loading>
	);
}
