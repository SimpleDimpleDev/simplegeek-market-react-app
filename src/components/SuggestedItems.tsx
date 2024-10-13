import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Typography, styled } from "@mui/material";
import { ArrowProps } from "react-multi-carousel/lib/types";

import ItemCard from "./ItemCard";
import { Loading } from "./Loading";
import { useGetCatalogQuery, useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import { useIsMobile } from "src/hooks/useIsMobile";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useGetCartItemListQuery } from "@api/shop/cart";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";
import { useMemo } from "react";

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

export default function SuggestedItems() {
	const isMobile = useIsMobile();

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: 60000,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});
	const { data: availableItemIds, isLoading: availabilityIsLoading } = useGetItemsAvailabilityQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: 5000,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});

	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const { data: cartItemList, isLoading: cartItemListIsLoading } = useGetCartItemListQuery();

	const favoriteItemIds = useMemo(() => favoriteItemList?.items.map((item) => item.id), [favoriteItemList]);
	const cartItemIds = useMemo(() => cartItemList?.items.map((item) => item.id), [cartItemList]);

	return (
		<Box padding={"40px 0 24px 0"} width={"100%"} gap={3}>
			<Typography variant="h5">Также может понравится</Typography>
			<Loading isLoading={catalogIsLoading} necessaryDataIsPersisted={!!catalog}>
				<Carousel
					responsive={responsive}
					swipeable={isMobile}
					draggable={isMobile}
					deviceType={isMobile ? "mobile" : "desktop"}
					customLeftArrow={<LeftButton />}
					customRightArrow={<RightButton />}
				>
					{catalog?.items.map((item) => (
						<ItemCard
							data={item}
							isAvailable={availableItemIds?.includes(item.id)}
							availabilityIsLoading={availabilityIsLoading}
							isInCart={cartItemIds?.includes(item.id)}
							cartItemListIsLoading={cartItemListIsLoading}
							isFavorite={favoriteItemIds?.includes(item.id)}
							favoriteItemListIsLoading={favoriteItemListIsLoading}
						/>
					))}
				</Carousel>
			</Loading>
		</Box>
	);
}
