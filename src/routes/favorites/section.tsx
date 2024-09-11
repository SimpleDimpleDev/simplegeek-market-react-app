import { Grid2, Grow } from "@mui/material";

import { CatalogItem } from "@appTypes/CatalogItem";
import { UserCartItem, UserFavoriteItem } from "@appTypes/UserItems";

import ItemCard from "@components/ItemCard";
import LazyLoad from "@components/LazyLoad";

interface FavoritesSectionProps {
	items: CatalogItem[];
	isAvailable: boolean;
	cartItems: UserCartItem[];
	favoriteItems: UserFavoriteItem[];
}

export const FavoritesSection = ({ items, isAvailable, cartItems, favoriteItems }: FavoritesSectionProps) => {
	const favoriteItemsIds = favoriteItems.map((item) => item.id);
	const cartItemsIds = cartItems.map((item) => item.id);

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
									isAvailable={isAvailable}
									isFavorite={favoriteItemsIds.includes(data.id)}
									isInCart={cartItemsIds.includes(data.id)}
								/>
							</div>
						</Grow>
					</LazyLoad>
				</Grid2>
			))}
		</Grid2>
	);
};
