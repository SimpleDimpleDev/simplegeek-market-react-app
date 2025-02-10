import { Grid2 } from "@mui/material";

import { CatalogItem } from "@appTypes/CatalogItem";

import ItemCard from "@components/ItemCard";
import { useGetCartItemListQuery } from "@api/shop/cart";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";
import { useMemo } from "react";
import { useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import { availabilityPollingInterval } from "@config/polling";
import { useGetTrackedItemListQuery } from "@api/shop/tracked";

interface FavoritesSectionProps {
	items: CatalogItem[];
}

export const FavoritesSection = ({ items }: FavoritesSectionProps) => {
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

	return (
		<Grid2 container justifyContent="flex-start" spacing={2}>
			{items.map((data, index) => (
				<Grid2
					size={{ xl: 3, lg: 3, md: 4, sm: 6, xs: 12 }}
					width={"100%"}
					height={424}
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
					key={index}
				>
					<div>
						<ItemCard
							data={data}
							isAvailable={availableItemIds?.has(data.id)}
							availabilityIsLoading={availabilityIsLoading}
							isInCart={cartItemIds?.has(data.id)}
							cartItemListIsLoading={cartItemListIsLoading}
							isFavorite={favoriteItemIds?.has(data.id)}
							favoriteItemListIsLoading={favoriteItemListIsLoading}
							isTracked={trackedItemIds?.has(data.id)}
							trackedItemListIsLoading={trackedItemListIsLoading}
						/>
					</div>
				</Grid2>
			))}
		</Grid2>
	);
};
