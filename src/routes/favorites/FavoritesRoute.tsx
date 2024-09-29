import { Favorite as FavoriteIcon } from "@mui/icons-material";
import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { CountPageHeader } from "@components/CountPageHeader";
import { Empty } from "@components/Empty";
import { FavoritesSection } from "./FavoritesSection";
import { useSelector } from "react-redux";
import { RootState } from "@state/store";


export default function FavoritesRoute() {
	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);

	const catalogItems = useSelector((state: RootState) => state.catalog.items);
	const availableItemsIds = useSelector((state: RootState) => state.availability.items);

	const userCartItems = useSelector((state: RootState) => state.userCart.items);
	const userFavoriteItems = useSelector((state: RootState) => state.userFavorites.items);
	const userFavoritesLoading = useSelector((state: RootState) => state.userFavorites.loading);

	const mappedItems = useMemo(() => {
		const favoriteItems = catalogItems.filter((item) =>
			userFavoriteItems.some((favorite) => favorite.id === item.id)
		);
		const available = [];
		const unavailable = [];
		for (const item of favoriteItems) {
			if (availableItemsIds.includes(item.id)) {
				available.push(item);
			} else {
				unavailable.push(item);
			}
		}
		return { available, unavailable, empty: favoriteItems.length === 0 };
	}, [availableItemsIds, catalogItems, userFavoriteItems]);

	return (
		<>
			<CountPageHeader title="Избранное" count={userFavoriteItems.length} isMobile={isMobile} />
			<Stack divider={<Divider sx={{ color: "divider" }} />}>
				{mappedItems.available.length > 0 && (
					<Box padding="24px 0px">
						<FavoritesSection
							items={mappedItems.available}
							isAvailable={true}
							cartItems={userCartItems}
							favoriteItems={userFavoriteItems}
						/>
					</Box>
				)}
				{mappedItems.unavailable.length > 0 && (
					<>
						<Typography variant="h5" style={{ paddingTop: 24 }}>
							Недоступны для заказа
						</Typography>
						<Box padding="24px 0px">
							<FavoritesSection
								items={mappedItems.unavailable}
								isAvailable={false}
								cartItems={userCartItems}
								favoriteItems={userFavoriteItems}
							/>
						</Box>
					</>
				)}
			</Stack>
			{mappedItems.empty &&
				(userFavoritesLoading ? (
					<CircularProgress />
				) : (
					<Empty
						title="В избранном ничего нет"
						description="Добавляйте сюда понравившиеся товары. Для этого жмите на сердечко в карточке товара"
						icon={<FavoriteIcon sx={{ width: 91, height: 91, color: "icon.tetriary" }} />}
					/>
				))}
		</>
	);
}
