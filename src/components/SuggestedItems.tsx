// import { ChevronLeft, ChevronRight } from "@mui/icons-material";
// import { Box, IconButton, Typography, styled } from "@mui/material";
// import { createRef } from "react";

// import ItemCard from "./ItemCard";
// import { Loading } from "./Loading";
// import { useGetCatalogQuery } from "@api/shop/catalog";
// import { useIsMobile } from "src/hooks/useIsMobile";

// const ItemBar = styled(Box)({
// 	display: "flex",
// 	alignItems: "center",
// 	position: "relative",
// 	overflowX: "auto",
// 	margin: "10px 0",
// 	gap: 8,
// 	scrollbarWidth: "none",
// 	"&::-webkit-scrollbar": {
// 		display: "none",
// 	},
// });

// const ScrollButton = styled(IconButton)({
// 	position: "absolute",
// 	top: "38%",
// 	transform: "translateY(-50%)",
// 	zIndex: 2,
// 	boxShadow: "0px 2px 18px -8px #000000",
// 	backgroundColor: "white",
// 	"&&:hover": {
// 		backgroundColor: "white",
// 	},
// });

export default function SuggestedItems() {
	// const scrollRef = createRef<HTMLDivElement>();

	// const isMobile = useIsMobile();

	// const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();

	// const scroll = (direction: "left" | "right") => {
	// 	if (scrollRef.current) {
	// 		const scrollAmount = direction === "left" ? -1420 : 1420;
	// 		scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
	// 	}
	// };

	return (
		<>
		</>
		// <Box padding={"40px 0 24px 0"} width={"100%"} gap={3}>
		// 	<Typography variant="h5">Также может понравится</Typography>
		// 	<Loading isLoading={catalogIsLoading} necessaryDataIsPersisted={!!catalog}>
		// 		<Box display="flex" alignItems="center" position={"relative"}>
		// 			{!isMobile && (
		// 				<ScrollButton sx={{ left: "-2%" }} onClick={() => scroll("left")}>
		// 					<ChevronLeft />
		// 				</ScrollButton>
		// 			)}
		// 			<ItemBar ref={scrollRef} style={{}}>
		// 				{/* TODO: mechanism for suggesting items */}
		// 				{catalog?.items.map((data) => (
		// 					<Box minWidth={346} key={data.id}>
		// 						<ItemCard data={data} />
		// 					</Box>
		// 				))}
		// 			</ItemBar>
		// 			{!isMobile && (
		// 				<ScrollButton sx={{ right: "-2%" }} onClick={() => scroll("right")}>
		// 					<ChevronRight />
		// 				</ScrollButton>
		// 			)}
		// 		</Box>
		// 	</Loading>
		// </Box>
	);
}
