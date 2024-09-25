import { AddShoppingCart, Favorite, FavoriteBorder, ShoppingCart } from "@mui/icons-material";
import { Box, Button, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BreadcrumbsPageHeader from "@components/BreadcrumbsPageHeader";
import { ItemCreditInfo } from "@components/CreditTimeline";
import SuggestedItems from "@components/SuggestedItems";
import { DateFormatter } from "@utils/format";
import { useEffect, useMemo, useState } from "react";

import ImageCarousel from "./ImageCarousel";
import { getImageUrl } from "@utils/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { addCartItem, addFavoriteItem, removeFavoriteItem } from "@state/user/thunks";

export default function ItemPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const navigate = useNavigate();

	const publicationLink = params.publicationLink;
	if (publicationLink === undefined) {
		throw new Response("No item link provided", { status: 404 });
	}

	const itemVariationIndexString = searchParams[0].get("v");
	const itemVariationIndex = itemVariationIndexString === null ? 0 : parseInt(itemVariationIndexString) - 1;

	const dispatch = useDispatch<AppDispatch>();

	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);

	const publications = useSelector((state: RootState) => state.catalog.publications);
	const availableItemsIds = useSelector((state: RootState) => state.availability.items);

	const userCart = useSelector((state: RootState) => state.userCart.items);
	const userFavorites = useSelector((state: RootState) => state.userFavorites.items);

	const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(itemVariationIndex);

	const publication = useMemo(
		() => publications.find((publication) => publication.link === publicationLink),
		[publications, publicationLink]
	);

	if (publication === undefined) {
		throw new Response("No publication found", { status: 404 });
	}
	const singleVariation = publication.items.length === 1;
	const selectedVariation = publication.items.at(selectedVariationIndex);
	if (selectedVariation === undefined) {
		throw new Response("No variation found", { status: 404 });
	}
	const selectedVariationIsInCart = useMemo(
		() => userCart.some((cartItem) => cartItem.id === selectedVariation.id),
		[userCart, selectedVariation]
	);
	const selectedVariationIsFavorite = useMemo(
		() => userFavorites.some((favoriteItem) => favoriteItem.id === selectedVariation.id),
		[userFavorites, selectedVariation]
	);
	const preparedImageUrls = useMemo(
		() => selectedVariation.product.images.map((image) => getImageUrl(image.url, "large")),
		[selectedVariation]
	);

	useEffect(() => {
		const recordPublicationVisited = () => {
			const publicationLink = params.publicationLink;
			if (!publicationLink) return
			const publicationVisitsString = localStorage.getItem("publicationVisits");
			if (!publicationVisitsString) return;
			const publicationVisits: { publicationLink: string; publicationVisits: number }[] = JSON.parse(publicationVisitsString);
			if (!publicationVisits) return;
			const publicationVisitsCopy = { ...publicationVisits };
			const currentPublicationVisit = publicationVisitsCopy.find(
				(publicationVisit) => publicationVisit.publicationLink === publicationLink
			);
			if (currentPublicationVisit) {
				currentPublicationVisit.publicationVisits++;
			} else {
				publicationVisitsCopy.push({ publicationLink, publicationVisits: 1 });
			}
			localStorage.setItem("publicationVisits", JSON.stringify(publicationVisitsCopy));
		};
		recordPublicationVisited();
	}, [ params.publicationLink ]); 

	const handleToggleFavorite = () => {
		if (selectedVariationIsFavorite) {
			dispatch(removeFavoriteItem({ itemId: selectedVariation.id }));
		} else {
			dispatch(addFavoriteItem({ itemId: selectedVariation.id }));
		}
	};

	const handleCartClick = () => {
		if (selectedVariationIsInCart) {
			navigate("/cart");
		} else {
			dispatch(addCartItem({ itemId: selectedVariation.id }));
		}
	};

	return (
		<>
			{isMobile ? (
				<>
					<Box display="flex" flexDirection="column" width="100%" gap={2}>
						<ImageCarousel isMobile={true} imageUrls={preparedImageUrls} />
					</Box>
					<Box paddingTop={3} paddingBottom={2}>
						<Typography variant="h5">{selectedVariation.product.title}</Typography>
					</Box>
					<Box display="flex" flexDirection="column" gap={2}>
						{!singleVariation && (
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
							<Box display="flex" flexDirection="column" gap={1}>
								<Typography variant="h4">{selectedVariation.price} ₽</Typography>
								{availableItemsIds.includes(selectedVariation.id) ? (
									publication.preorder ? (
										<>
											<Typography variant="body2" color={"typography.success"}>
												Доступно для предзаказа
											</Typography>
											<Box display="flex" flexDirection="row">
												<Typography variant="body2" color={"typography.secondary"}>
													На складе ожидается:
												</Typography>
												<Typography variant="body2">
													{publication.preorder.expectedArrival
														? DateFormatter.CyrillicMonthNameYYYY(
																publication.preorder.expectedArrival
														  )
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
							<Box display="flex" flexDirection="row" gap={1}>
								<Button variant="contained" size="large" fullWidth onClick={handleCartClick}>
									{selectedVariationIsInCart ? (
										<ShoppingCart sx={{ color: "icon.primary" }} />
									) : (
										<AddShoppingCart sx={{ color: "icon.primary" }} />
									)}
									<Typography>
										{selectedVariationIsInCart ? "Перейти" : "Добавить"} в корзину
									</Typography>
								</Button>
								<IconButton onClick={handleToggleFavorite}>
									{selectedVariationIsFavorite ? (
										<Favorite sx={{ color: "icon.attention" }} />
									) : (
										<FavoriteBorder color="secondary" />
									)}
								</IconButton>
							</Box>
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
							{!singleVariation && (
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
								<Box display="flex" flexDirection="column" gap={1}>
									<Typography variant="h4">{selectedVariation.price} ₽</Typography>
									{availableItemsIds.includes(selectedVariation.id) ? (
										publication.preorder ? (
											<>
												<Typography variant="body2" color={"typography.success"}>
													Доступно для предзаказа
												</Typography>
												<Box display="flex" flexDirection="row">
													<Typography variant="body2" color={"typography.secondary"}>
														На складе ожидается:
													</Typography>
													<Typography variant="body2">
														{publication.preorder.expectedArrival
															? DateFormatter.CyrillicMonthNameYYYY(
																	publication.preorder.expectedArrival
															  )
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
								<Box display="flex" flexDirection="row" gap={1}>
									<Button variant="contained" size="large" fullWidth onClick={handleCartClick}>
										{selectedVariationIsInCart ? (
											<ShoppingCart sx={{ color: "icon.primary" }} />
										) : (
											<AddShoppingCart sx={{ color: "icon.primary" }} />
										)}
										<Typography>
											{selectedVariationIsInCart ? "Перейти" : "Добавить"} в корзину
										</Typography>
									</Button>
									<IconButton onClick={handleToggleFavorite}>
										{selectedVariationIsFavorite ? (
											<Favorite sx={{ color: "icon.attention" }} />
										) : (
											<FavoriteBorder color="secondary" />
										)}
									</IconButton>
								</Box>
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
		</>
	);
}
