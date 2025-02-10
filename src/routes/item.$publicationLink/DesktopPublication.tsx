import {
	Box,
	Typography,
	Select,
	MenuItem,
	CircularProgress,
	useMediaQuery,
	Stack,
	Divider,
	Button,
} from "@mui/material";
import { PublicationProps } from "./types";
import { PublicationAvailability } from "./Availability";
import { PublicationActionButtons } from "./ActionButtons";
import { useNavigate } from "react-router-dom";
import { Fragment, lazy, Suspense } from "react";
import { ItemCreditInfo } from "@components/ItemCreditInfo";
import { PageHeading } from "@components/PageHeading";
import { PublicationGet } from "@appTypes/Publication";
import { CatalogItemGet } from "@appTypes/CatalogItem";

const ImageCarousel = lazy(() => import("./ImageCarousel"));

interface VariationSelectProps {
	publication: PublicationGet;
	selectedVariationIndex: number;
	onChangeSelectedVariationIndex: (index: number) => void;
}

const VariationSelect: React.FC<VariationSelectProps> = ({
	publication,
	selectedVariationIndex,
	onChangeSelectedVariationIndex,
}) => {
	return (
		<>
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
		</>
	);
};

interface AttributesSectionProps {
	selectedVariation: CatalogItemGet;
}
const AttributesSection: React.FC<AttributesSectionProps> = ({ selectedVariation }) => {
	const navigate = useNavigate();
	const sortedFilterGroups = [...selectedVariation.product.filterGroups].sort((a, b) =>
		a.title.localeCompare(b.title)
	);
	return (
		<Box display={"flex"} flexDirection={"column"} gap={1}>
			<Typography variant="h5">О товаре</Typography>
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

	trackedItemListIsLoading,
	selectedVariationIsTracked,
}) => {
	const isTablet = useMediaQuery("(max-width: 1442px)");
	return (
		<Box component={"section"}>
			<PageHeading title={selectedVariation.product.title} />
			<Box display="flex" flexDirection="row" justifyContent={"space-between"}>
				<Box display="flex" flexDirection="column" gap={2}>
					<Suspense
						fallback={
							<div className="ai-c d-f jc-c">
								<CircularProgress />
							</div>
						}
					>
						<ImageCarousel imageUrls={imageUrls} alt={selectedVariation.product.title} />
					</Suspense>
				</Box>
				{!isTablet && (
					<Box display="flex" flexDirection="column" gap={3} width={360} flexShrink={0}>
						<VariationSelect
							publication={publication}
							selectedVariationIndex={selectedVariationIndex}
							onChangeSelectedVariationIndex={onChangeSelectedVariationIndex}
						/>
						<AttributesSection selectedVariation={selectedVariation} />
					</Box>
				)}
				<Box display="flex" flexDirection="column" gap={3} width={360} flexShrink={0}>
					{isTablet && (
						<VariationSelect
							publication={publication}
							selectedVariationIndex={selectedVariationIndex}
							onChangeSelectedVariationIndex={onChangeSelectedVariationIndex}
						/>
					)}
					<Box position={"sticky"} top={24} display={"flex"} flexDirection={"column"} gap={2}>
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
									Доставка до склада НЕ включена в стоимость товара. Её потребуется оплатить отдельно.
									{publication.shippingCostIncluded === "NOT" &&
										"до промежуточного склада форвардера и "}{" "}
									до склада в РФ(Москва).
								</Typography>
							)}
						</Box>
						{selectedVariation.creditInfo && <ItemCreditInfo creditInfo={selectedVariation.creditInfo} />}
					</Box>
				</Box>
			</Box>
			{selectedVariation.product.description && selectedVariation.product.description.length > 0 && (
				<Box
					display="flex"
					flexDirection="column"
					paddingTop={3}
					paddingBottom={3}
					gap={2}
				>
					<Typography variant="h5">Описание</Typography>
					<Typography variant="body1" color="typography.secondary">
						{selectedVariation.product.description.split("\n").map((text, index) => (
							<Fragment key={index}>
								{text}
								<br />
							</Fragment>
						))}
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default DesktopPublication;
