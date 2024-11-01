import { Box, Typography, NativeSelect } from "@mui/material";
import ImageCarousel from "./ImageCarousel";
import { useNavigate } from "react-router-dom";
import { PublicationAvailability } from "./Availability";
import { PublicationActionButtons } from "./ActionButtons";
import { PublicationProps } from "./types";
import { ItemCreditInfo } from "@components/ItemCreditInfo";

const MobilePublication: React.FC<PublicationProps> = ({
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

	trackedItemListIsLoading,
	selectedVariationIsTracked,
}) => {
	const navigate = useNavigate();

	return (
		<>
			<Box display="flex" flexDirection="column" width="100%" gap={2}>
				<ImageCarousel isMobile={true} imageUrls={imageUrls} />
			</Box>
			<Box paddingTop={3} paddingBottom={2}>
				<Typography variant="h5">{selectedVariation.product.title}</Typography>
			</Box>
			<Box sx={{ width: "100%" }} display="flex" flexDirection="column" gap={2}>
				{publication.items.length !== 1 && (
					<Box display="flex" flexDirection="column" gap={2}>
						<Typography variant="h6">Вариация</Typography>
						<NativeSelect
							fullWidth
							variant="outlined"
							sx={{ backgroundColor: "surface.primary" }}
							value={selectedVariationIndex}
							onChange={(event) => {
								onChangeSelectedVariationIndex(Number(event.target.value));
							}}
						>
							{publication.items.map((itemVariation, index) => (
								<option key={index} value={index}>
									{itemVariation.product.title}
								</option>
							))}
						</NativeSelect>
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
						trackedIsLoading={trackedItemListIsLoading}
						isTracked={selectedVariationIsTracked}
					/>
					{publication.shippingCostIncluded && publication.shippingCostIncluded !== "FULL" && (
						<Typography variant="body1" color="warning">
							Доставка НЕ включена в стоимость товара. Отдельно потребуется оплатить доставку
							{publication.shippingCostIncluded === "NOT" && "до промежуточного склада форвардера и "} до
							склада в РФ(Москва).
						</Typography>
					)}
				</Box>

				{selectedVariation.creditInfo && <ItemCreditInfo creditInfo={selectedVariation.creditInfo} />}

				{selectedVariation.product.filterGroups.length !== 0 && (
					<Box display="flex" flexDirection="column" paddingTop={4} gap={2}>
						<Typography variant="h6">О товаре</Typography>
						{selectedVariation.product.filterGroups.map((filterGroup) =>
							filterGroup.filters.map((filter, index) => (
								<Box key={index} display="flex" flexDirection="row" justifyContent={"space-between"}>
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

				<Box component={"section"} display="flex" flexDirection="column" paddingTop={4} gap={3}>
					<Typography variant="h6">Описание</Typography>
					<Typography variant="body1" color="typography.secondary">
						{selectedVariation.product.description}
					</Typography>
				</Box>
			</Box>
		</>
	);
};

export default MobilePublication;
