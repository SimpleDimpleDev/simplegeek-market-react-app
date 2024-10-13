import { Favorite as FavoriteIcon } from "@mui/icons-material";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { CountPageHeader } from "@components/CountPageHeader";
import { Empty } from "@components/Empty";
import { FavoritesSection } from "./FavoritesSection";
import { useGetItemsAvailabilityQuery, useGetCatalogQuery } from "@api/shop/catalog";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";
import { Loading } from "@components/Loading";
import { useIsMobile } from "src/hooks/useIsMobile";

export function Component() {
	const isMobile = useIsMobile();

	const { data: availableItemsList, isLoading: availableItemListIsLoading } = useGetItemsAvailabilityQuery();
	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();
	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();

	const mappedItems = useMemo(() => {
		if (!catalog || !favoriteItemList || !availableItemsList)
			return { available: [], unavailable: [], empty: true };
		const favoriteItems = catalog.items.filter((item) =>
			favoriteItemList.items.some((favorite) => favorite.id === item.id)
		);
		const available = [];
		const unavailable = [];
		for (const item of favoriteItems) {
			if (availableItemsList.items.includes(item.id)) {
				available.push(item);
			} else {
				unavailable.push(item);
			}
		}
		return { available, unavailable, empty: favoriteItems.length === 0 };
	}, [catalog, favoriteItemList, availableItemsList]);

	return (
		<>
			<CountPageHeader title="Избранное" count={favoriteItemList?.items.length || 0} isMobile={isMobile} />
			<Loading
				isLoading={catalogIsLoading || availableItemListIsLoading || favoriteItemListIsLoading}
				necessaryDataIsPersisted={!!catalog && !!availableItemsList && !!favoriteItemList}
			>
				<Stack divider={<Divider sx={{ color: "divider" }} />}>
					{mappedItems.available.length > 0 && (
						<Box padding="24px 0px">
							<FavoritesSection items={mappedItems.available} />
						</Box>
					)}
					{mappedItems.unavailable.length > 0 && (
						<>
							<Typography variant="h5" style={{ paddingTop: 24 }}>
								Недоступны для заказа
							</Typography>
							<Box padding="24px 0px">
								<FavoritesSection items={mappedItems.unavailable} />
							</Box>
						</>
					)}
				</Stack>
				{mappedItems.empty && (
					<Empty
						title="В избранном ничего нет"
						description="Добавляйте сюда понравившиеся товары. Для этого жмите на сердечко в карточке товара"
						icon={<FavoriteIcon sx={{ width: 91, height: 91, color: "icon.tertiary" }} />}
					/>
				)}
			</Loading>
		</>
	);
}
