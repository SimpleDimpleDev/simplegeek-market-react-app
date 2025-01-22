import { Box, Typography, NativeSelect, Button, Divider, Stack } from "@mui/material";
import ImageCarousel from "./ImageCarousel";
import { useNavigate } from "react-router-dom";
import { PublicationAvailability } from "./Availability";
import { PublicationActionButtons } from "./ActionButtons";
import { PublicationProps } from "./types";
import { ItemCreditInfo } from "@components/ItemCreditInfo";
import { PageHeading } from "@components/PageHeading";
import { CatalogItemGet } from "@appTypes/CatalogItem";

interface AttributesSectionProps {
	selectedVariation: CatalogItemGet;
}
const AttributesSection: React.FC<AttributesSectionProps> = ({ selectedVariation }) => {
	const navigate = useNavigate();
	const sortedFilterGroups = [...selectedVariation.product.filterGroups].sort((a, b) =>
		a.title.localeCompare(b.title)
	);
	return (
		<Box display={"flex"} flexDirection={"column"} paddingTop={3} gap={1}>
			<Typography variant="h6">О товаре</Typography>
			<Stack direction="column" divider={<Divider />} spacing={1}>
				<Box display="flex" flexDirection="column" justifyContent={"space-between"}>
					<Typography variant="body1">Категория</Typography>
					<Box display="flex" flexDirection="row" flexWrap={"wrap"} gap={1}>
						<Button
							variant="text"
							color="warning"
							onClick={() => {
								navigate(`/category/${selectedVariation.product.category.link}`);
							}}
							sx={{
								width: "max-content",
								overflow: "hidden",
								textOverflow: "ellipsis",
								WebkitLineClamp: 1,
								display: "-webkit-box",
								WebkitBoxOrient: "vertical",
								maxWidth: "100%",
								minWidth: 0,
							}}
						>
							{selectedVariation.product.category.title}
						</Button>
					</Box>
				</Box>
				{sortedFilterGroups.map((filterGroup, filterGroupIndex) => (
					<Box key={filterGroupIndex} display="flex" flexDirection="column" justifyContent={"space-between"}>
						<Typography variant="body1">{filterGroup.title}</Typography>
						<Box display="flex" flexDirection="row" flexWrap={"wrap"} gap={1}>
							{filterGroup.filters.map((filter, index) => (
								<Button
									key={index}
									variant="text"
									color="warning"
									onClick={() => {
										navigate(`/?f[]=${filterGroup.id}:${filter.id}`);
									}}
									sx={{
										width: "max-content",
										overflow: "hidden",
										textOverflow: "ellipsis",
										WebkitLineClamp: 1,
										display: "-webkit-box",
										WebkitBoxOrient: "vertical",
										maxWidth: "100%",
										minWidth: 0,
									}}
								>
									{filter.value}
								</Button>
							))}
						</Box>
					</Box>
				))}
			</Stack>
		</Box>
	);
};

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
	return (
		<>
			<Box display="flex" flexDirection="column" width="100%" alignItems={"center"} gap={2}>
				<ImageCarousel imageUrls={imageUrls} />
			</Box>
			<PageHeading title={selectedVariation.product.title} />
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

				<AttributesSection selectedVariation={selectedVariation} />

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
