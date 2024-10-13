import { Grid2, Grow } from "@mui/material";

import { CatalogItem } from "@appTypes/CatalogItem";

import ItemCard from "@components/ItemCard";
import LazyLoad from "@components/LazyLoad";
import { useGetCartItemListQuery } from "@api/shop/cart";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";
import { useMemo } from "react";
import { useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import { availabilityPollingInterval } from "@config/polling";

interface FavoritesSectionProps {
	items: CatalogItem[];
}

export const FavoritesSection = ({ items }: FavoritesSectionProps) => {
	const { data: availableItemIds, isLoading: availabilityIsLoading } = useGetItemsAvailabilityQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: availabilityPollingInterval,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});

	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const { data: cartItemList, isLoading: cartItemListIsLoading } = useGetCartItemListQuery();

	const favoriteItemIds = useMemo(() => favoriteItemList?.items.map((item) => item.id), [favoriteItemList]);
	const cartItemIds = useMemo(() => cartItemList?.items.map((item) => item.id), [cartItemList]);

	return (
		<Grid2 container justifyContent="flex-start" spacing={2}>
			{items.map((data, index) => (
				<Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 6, xs: 12 }} key={index}>
					<LazyLoad
						key={index}
						width={"100%"}
						height={420}
						observerOptions={{
							rootMargin: "100px",
						}}
						once
					>
						<Grow key={index} in={true} timeout={200}>
							<div>
								<ItemCard
									data={data}
									isAvailable={availableItemIds?.includes(data.id)}
									availabilityIsLoading={availabilityIsLoading}
									isInCart={cartItemIds?.includes(data.id)}
									cartItemListIsLoading={cartItemListIsLoading}
									isFavorite={favoriteItemIds?.includes(data.id)}
									favoriteItemListIsLoading={favoriteItemListIsLoading}
								/>
							</div>
						</Grow>
					</LazyLoad>
				</Grid2>
			))}
		</Grid2>
	);
};
