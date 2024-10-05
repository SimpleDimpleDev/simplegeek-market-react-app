import { Grid2, Grow } from "@mui/material";

import { CatalogItem } from "@appTypes/CatalogItem";

import ItemCard from "@components/ItemCard";
import LazyLoad from "@components/LazyLoad";

interface FavoritesSectionProps {
	items: CatalogItem[];
}

export const FavoritesSection = ({ items }: FavoritesSectionProps) => {
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
								<ItemCard data={data} />
							</div>
						</Grow>
					</LazyLoad>
				</Grid2>
			))}
		</Grid2>
	);
};
