import { Favorite as FavoriteIcon } from "@mui/icons-material";
import { CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { PageHeading } from "@components/PageHeading";
import { Empty } from "@components/Empty";
import { FavoritesSection } from "./FavoritesSection";
import { useGetItemsAvailabilityQuery, useGetCatalogQuery } from "@api/shop/catalog";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { Helmet } from "react-helmet";
import { getRuGoodsWord } from "@utils/format";

export function Component() {
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
			<Helmet>
				<title>Избранное - SimpleGeek</title>
			</Helmet>
			{catalogIsLoading || availableItemListIsLoading || favoriteItemListIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !catalog || !availableItemsList || !favoriteItemList ? (
				<SomethingWentWrong />
			) : (
				<>
					<PageHeading
						title="Избранное"
						infoText={
							favoriteItemList
								? `${favoriteItemList.items.length} ${getRuGoodsWord(favoriteItemList.items.length)}`
								: ""
						}
					/>
					<Stack divider={<Divider sx={{ color: "divider" }} />}>
						{mappedItems.available.length > 0 && <FavoritesSection items={mappedItems.available} />}
						{mappedItems.unavailable.length > 0 && (
							<>
								<Typography variant="h5" style={{ paddingTop: 24 }}>
									Недоступны для заказа
								</Typography>
								<FavoritesSection items={mappedItems.unavailable} />
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
				</>
			)}
		</>
	);
}
