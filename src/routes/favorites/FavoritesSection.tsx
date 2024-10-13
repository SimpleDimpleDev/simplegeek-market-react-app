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
	const { data: availableItemList, isLoading: availabilityIsLoading } = useGetItemsAvailabilityQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: availabilityPollingInterval,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});

	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const { data: cartItemList, isLoading: cartItemListIsLoading } = useGetCartItemListQuery();

	const availableItemIds = useMemo(() => {
		const idSet = new Set<string>();
		availableItemList?.items.forEach((item) => idSet.add(item));
		return idSet;
	}, [availableItemList]);

	const favoriteItemIds = useMemo(() => {
		const idSet = new Set<string>();
		favoriteItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [favoriteItemList]);

	const cartItemIds = useMemo(() => {
		const idSet = new Set<string>();
		cartItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [cartItemList]);

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
									isAvailable={availableItemIds?.has(data.id)}
									availabilityIsLoading={availabilityIsLoading}
									isInCart={cartItemIds?.has(data.id)}
									cartItemListIsLoading={cartItemListIsLoading}
									isFavorite={favoriteItemIds?.has(data.id)}
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
