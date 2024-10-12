import BreadcrumbsPageHeader from "@components/BreadcrumbsPageHeader";
import { ItemCreditInfo } from "@components/CreditTimeline";
import { Box, Typography, Select, MenuItem, CircularProgress } from "@mui/material";
import { PublicationProps } from "./types";
import { PublicationAvailability } from "./Availability";
import { PublicationActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const ImageCarousel = lazy(() => import("./ImageCarousel"));

const DesktopPublication: React.FC<PublicationProps> = ({
	publication,
	selectedVariation,
	imageUrls,

	selectedVariationIndex,
	onChangeSelectedVariationIndex,

	availableItemIdsIsLoading,
	selectedVariationIsAvailable,

	cartItemListIsLoading,
	selectedVariationIsInCart,
	onCartClick,

	favoriteItemListIsLoading,
	selectedVariationIsFavorite,
	onFavoriteClick,
}) => {
	const navigate = useNavigate();

	return (
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
			<Box display="flex" flexDirection="row" gap={3} paddingBottom={3} justifyContent={"space-between"}>
				<Box display="flex" flexDirection="column" gap={2}>
					<Suspense
						fallback={
							<div className="ai-c d-f jc-c">
								<CircularProgress />
							</div>
						}
					>
						<ImageCarousel isMobile={false} imageUrls={imageUrls} />
					</Suspense>
				</Box>

				<Box width={360} display="flex" flexDirection="column" gap={3}>
					{publication.items.length !== 1 && (
						<Box display="flex" flexDirection="column" gap={2}>
							<Typography variant="h5">Вариация</Typography>
							<Select
								fullWidth
								variant="outlined"
								sx={{ backgroundColor: "surface.primary" }}
								value={selectedVariationIndex}
								onChange={(event) => {
									onChangeSelectedVariationIndex(event.target.value as number);
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
					{selectedVariation.product.filterGroups.length !== 0 && (
						<Box display={"flex"} flexDirection={"column"}  gap={2}>
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
										<Typography
											variant="body1"
											color="warning.main"
											onClick={() => {
												navigate(`/?f[]=${filterGroup.id}:${filter.id}`);
											}}
										>
											{filter.value}
										</Typography>
									</Box>
								))
							)}
						</Box>
					)}
				</Box>

				<Box display="flex" flexDirection="column" gap={3} width={360} flexShrink={0}>
					<Box
						display="flex"
						flexDirection="column"
						position={"sticky"}
						top={24}
						gap={2}
						p={2}
						borderRadius={2}
						sx={{
							backgroundColor: "surface.primary",
						}}
					>
						<PublicationAvailability
							availabilityIsLoading={availableItemIdsIsLoading}
							variationIsAvailable={selectedVariationIsAvailable}
							price={selectedVariation.price}
							discount={selectedVariation.discount}
							preorder={publication.preorder}
						/>
						<PublicationActionButtons
							isInCart={selectedVariationIsInCart}
							isFavorite={selectedVariationIsFavorite}
							isAvailable={selectedVariationIsAvailable}
							onFavoriteClick={onFavoriteClick}
							onCartClick={onCartClick}
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
	);
};

export default DesktopPublication;
