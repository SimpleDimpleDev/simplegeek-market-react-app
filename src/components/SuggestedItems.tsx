import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Typography, styled } from "@mui/material";
import { ArrowProps } from "react-multi-carousel/lib/types";

import ItemCard from "./ItemCard";
import { useGetCatalogQuery, useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import { useIsMobile } from "src/hooks/useIsMobile";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useGetCartItemListQuery } from "@api/shop/cart";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";
import { useMemo } from "react";
import { availabilityPollingInterval, catalogPollingInterval } from "@config/polling";
import { useGetTrackedItemListQuery } from "@api/shop/tracked";
import SomethingWentWrong from "./SomethingWentWrong";
import { useSuggestedItems } from "src/hooks/useSuggestedItems";

const responsive = {
	desktop: {
		breakpoint: { max: 3000, min: 1358 },
		items: 4,
	},
	tablet: {
		breakpoint: { max: 1358, min: 1024 },
		items: 3,
	},
	wideMobile: {
		breakpoint: { max: 1024, min: 674 },
		items: 2,
	},
	mobile: {
		breakpoint: { max: 674, min: 0 },
		items: 1,
	},
};
const ScrollButton = styled(IconButton)({
	position: "absolute",
	top: "38%",
	transform: "translateY(-50%)",
	zIndex: 2,
	boxShadow: "0px 2px 18px -8px #000000",
	backgroundColor: "white",
	"&&:hover": {
		backgroundColor: "white",
	},
});

const LeftButton = ({ onClick, ...rest }: ArrowProps) => (
	<ScrollButton {...rest} onClick={onClick} sx={{ left: "2%" }}>
		<ChevronLeft />
	</ScrollButton>
);

const RightButton = ({ onClick, ...rest }: ArrowProps) => (
	<ScrollButton {...rest} onClick={onClick} sx={{ right: "2%" }}>
		<ChevronRight />
	</ScrollButton>
);

type SuggestedItemsProps = {
	excludeItemIds?: string[];
};

export default function SuggestedItems({ excludeItemIds }: SuggestedItemsProps) {
	const isMobile = useIsMobile();

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: catalogPollingInterval,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});

	const { data: availableItemList, isLoading: availabilityIsLoading } = useGetItemsAvailabilityQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: availabilityPollingInterval,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});

	const { data: cartItemList, isLoading: cartItemListIsLoading } = useGetCartItemListQuery();
	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const { data: trackedItemList, isLoading: trackedItemListIsLoading } = useGetTrackedItemListQuery();

	const availableItemIds = useMemo(() => {
		if (!availableItemList) return undefined;
		const idSet = new Set<string>();
		availableItemList?.items.forEach((item) => idSet.add(item));
		return idSet;
	}, [availableItemList]);

	const cartItemIds = useMemo(() => {
		if (!cartItemList) return undefined;
		const idSet = new Set<string>();
		cartItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [cartItemList]);

	const favoriteItemIds = useMemo(() => {
		if (!favoriteItemList) return undefined;
		const idSet = new Set<string>();
		favoriteItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [favoriteItemList]);

	const trackedItemIds = useMemo(() => {
		if (!trackedItemList) return undefined;
		const idSet = new Set<string>();
		trackedItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [trackedItemList]);

	const availableItems = useMemo(() => {
		return catalog?.items.filter((item) => availableItemIds?.has(item.id));
	}, [catalog, availableItemIds]);

	const { suggestedItems } = useSuggestedItems({
		catalogItems: availableItems || [],
		excludeItemIds: excludeItemIds || [],
	});

	if (!catalogIsLoading && !suggestedItems.length) {
		return null;
	}

	return (
		<Box padding={"40px 0 24px 0"} width={"100%"} gap={3}>
			{catalogIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !catalog ? (
				<SomethingWentWrong />
			) : (
				<>
					<Typography variant="h5" sx={{ mb: 2 }}>
						Также может понравится
					</Typography>
					<Carousel
						responsive={responsive}
						swipeable={isMobile}
						draggable={isMobile}
						minimumTouchDrag={25}
						deviceType={isMobile ? "mobile" : "desktop"}
						customLeftArrow={<LeftButton />}
						customRightArrow={<RightButton />}
					>
						{suggestedItems.map((item) => (
							<div className="w-100 h-100 ai-c d-f jc-c" key={item.id}>
								<ItemCard
									data={item}
									isAvailable={availableItemIds?.has(item.id)}
									availabilityIsLoading={availabilityIsLoading}
									isInCart={cartItemIds?.has(item.id)}
									cartItemListIsLoading={cartItemListIsLoading}
									isFavorite={favoriteItemIds?.has(item.id)}
									favoriteItemListIsLoading={favoriteItemListIsLoading}
									isTracked={trackedItemIds?.has(item.id)}
									trackedItemListIsLoading={trackedItemListIsLoading}
								/>
							</div>
						))}
					</Carousel>
				</>
			)}
		</Box>
	);
}
