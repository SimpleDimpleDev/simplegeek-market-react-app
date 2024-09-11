import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserCartItem, UserFavoriteItem } from "@appTypes/UserItems";
import { createRef } from "react";

import ItemCard from "./ItemCard";
import { CatalogItem } from "@appTypes/CatalogItem";

const ItemBar = styled(Box)({
	display: "flex",
	alignItems: "center",
	position: "relative",
	overflowX: "auto",
	margin: "10px 0",
	gap: 8,
	scrollbarWidth: "none",
	"&::-webkit-scrollbar": {
		display: "none",
	},
});

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

interface SuggestedItemsProps {
	isMobile: boolean;
	itemsData: CatalogItem[];
	userFavorites: UserFavoriteItem[];
	userCart: UserCartItem[];
	availableItemIds: string[];
	onAddToCart: (id: string) => void;
	onAddToFavorites: (id: string) => void;
	onRemoveFromFavorites: (id: string) => void;
}

export default function SuggestedItems({
	isMobile,
	itemsData,
	userFavorites,
	userCart,
	availableItemIds,
	onAddToCart,
	onAddToFavorites,
	onRemoveFromFavorites,
}: SuggestedItemsProps) {
	const navigate = useNavigate();
	const scrollRef = createRef<HTMLDivElement>();

	const userFavoritesIds = userFavorites.map((item) => item.id);
	const userCartIds = userCart.map((item) => item.id);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = direction === "left" ? -1420 : 1420;
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<Box padding={"40px 0 24px 0"} width={"100%"} gap={3}>
			<Typography variant="h5">Также может понравится</Typography>
			<Box display="flex" alignItems="center" position={"relative"}>
				{!isMobile && (
					<ScrollButton sx={{ left: "-2%" }} onClick={() => scroll("left")}>
						<ChevronLeft />
					</ScrollButton>
				)}
				<ItemBar ref={scrollRef} style={{}}>
					{itemsData.map((data) => (
						<Box minWidth={346} key={data.id}>
							<ItemCard
								data={data}
								isFavorite={userFavoritesIds.includes(data.id)}
								isInCart={userCartIds.includes(data.id)}
								onClick={() => {
									const variationParam =
										data.variationIndex !== null ? `?v=${data.variationIndex}` : "";
									navigate(`/item/${data.publicationLink}${variationParam}`);
								}}
								onAddToCart={() => onAddToCart(data.id)}
								onAddToFavorites={() => onAddToFavorites(data.id)}
								onRemoveFromFavorites={() => onRemoveFromFavorites(data.id)}
								isAvailable={availableItemIds.includes(data.id)}
							/>
						</Box>
					))}
				</ItemBar>
				{!isMobile && (
					<ScrollButton sx={{ right: "-2%" }} onClick={() => scroll("right")}>
						<ChevronRight />
					</ScrollButton>
				)}
			</Box>
		</Box>
	);
}
