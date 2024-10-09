import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Typography, styled } from "@mui/material";
import { ArrowProps } from "react-multi-carousel/lib/types";

import ItemCard from "./ItemCard";
import { Loading } from "./Loading";
import { useGetCatalogQuery } from "@api/shop/catalog";
import { useIsMobile } from "src/hooks/useIsMobile";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
	superLargeDesktop: {
		// the naming can be any, depends on you.
		breakpoint: { max: 4000, min: 3000 },
		items: 5,
	},
	desktop: {
		breakpoint: { max: 3000, min: 1024 },
		items: 3,
	},
	tablet: {
		breakpoint: { max: 1024, min: 464 },
		items: 2,
	},
	mobile: {
		breakpoint: { max: 464, min: 0 },
		items: 1,
	},
};
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

const LeftButton = ({ onClick, ...rest }: ArrowProps) => (
	<ScrollButton {...rest} onClick={onClick} sx={{ left: "-3%" }}>
		<ChevronLeft />
	</ScrollButton>
);

const RightButton = ({ onClick, ...rest }: ArrowProps) => (
	<ScrollButton {...rest} onClick={onClick} sx={{ right: "-3%" }}>
		<ChevronRight />
	</ScrollButton>
);

export default function SuggestedItems() {
	const isMobile = useIsMobile();

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();

	return (
		<Box padding={"40px 0 24px 0"} width={"100%"} gap={3}>
			<Typography variant="h5">Также может понравится</Typography>
			<Loading isLoading={catalogIsLoading} necessaryDataIsPersisted={!!catalog}>
				<Carousel
					responsive={responsive}
					swipeable={isMobile}
					draggable={isMobile}
					deviceType={isMobile ? "mobile" : "desktop"}
					customLeftArrow={<LeftButton />}
					customRightArrow={<RightButton />}
				>
					{catalog?.items.map((item) => (
						<ItemCard key={item.id} data={item} />
					))}
				</Carousel>
			</Loading>
		</Box>
	);
}
