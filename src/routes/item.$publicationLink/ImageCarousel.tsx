import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, styled } from "@mui/material";
import React, { useState } from "react";

import Carousel from "react-multi-carousel";
import { ArrowProps } from "react-multi-carousel/lib/types";
import "react-multi-carousel/lib/styles.css";

// const ThumbnailContainer = styled("div")({
// 	display: "flex",
// 	alignItems: "center",
// 	justifyContent: "center",
// 	flexShrink: 0,
// 	width: "160px",
// 	height: "160px",
// 	overflow: "hidden",
// 	borderRadius: 16,
// 	transition: "opacity 0.2s",
// });


const ScrollButton = styled(IconButton)({
	position: "absolute",
	top: "50%",
	transform: "translateY(-50%)",
	zIndex: 2,
	backgroundColor: "white",
	"&&:hover": {
		backgroundColor: "white",
	},
});

const responsive = {
	superLargeDesktop: {
		// the naming can be any, depends on you.
		breakpoint: { max: 4000, min: 3000 },
		items: 5,
	},
	desktop: {
		breakpoint: { max: 3000, min: 1024 },
		items: 4,
	},
	tablet: {
		breakpoint: { max: 1024, min: 464 },
		items: 2,
	},
	mobile: {
		breakpoint: { max: 464, min: 0 },
		items: 2,
	},
};

const LeftButton = ({ onClick, ...rest }: ArrowProps) => (
	<ScrollButton {...rest} onClick={onClick} sx={{ left: "2%" }}>
		<ChevronLeft />
	</ScrollButton>
);

const RightButton = ({ onClick, ...rest }: ArrowProps) => (
	<ScrollButton {...rest} onClick={onClick} sx={{ right: "2%" }}>
		<ChevronRight />
	</ScrollButton>
);

interface ImageCarouselProps {
	isMobile: boolean;
	imageUrls: string[]; // Array of image URLs
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ isMobile, imageUrls }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
	const selectedImageUrl = imageUrls[selectedImageIndex];

	console.log({ imageUrls });

	return (
		<Box display={"flex"} flexDirection={"column"} alignItems={"center"} gap={2}>
			<div
				className="bg-primary w-100 ai-c br-3 d-f jc-c of-h"
				style={{ height: isMobile ? 345 : 630, width: isMobile ? 345 : 630 }}
			>
				<img
					style={isMobile ? { width: 345, height: 345 } : { width: 630, height: 630 }}
					className="contain"
					src={selectedImageUrl}
					alt={"Selected image"}
				/>
			</div>
			<Carousel
				responsive={responsive}
				swipeable={isMobile}
				draggable={isMobile}
				deviceType={isMobile ? "mobile" : "desktop"}
				customLeftArrow={<LeftButton />}
				customRightArrow={<RightButton />}
			>
				{imageUrls.map((imageUrl, index) => (
					<div key={index} className="bg-primary w-100 ai-c br-3 d-f jc-c of-h" onClick={() => setSelectedImageIndex(index)}>
						HELLO {index} {imageUrl}
					</div>
					// <IconButton
					// 	key={index}
					// 	sx={{ margin: 0, padding: 0 }}
					// 	onClick={() => setSelectedImageIndex(index)}
					// 	onMouseEnter={() => setHoveredImageIndex(index)}
					// 	onMouseLeave={() => setHoveredImageIndex(null)}
					// >
					// 	<ThumbnailContainer
					// 		sx={{
					// 			border: "4px solid",
					// 			backgroundColor: "white",
					// 			borderColor: selectedImageIndex === index ? "icon.brandSecondary" : "transparent",
					// 			"&:hover":
					// 				selectedImageIndex === index
					// 					? {
					// 							opacity: "1",
					// 					  }
					// 					: {
					// 							opacity: "0.7",
					// 					  },
					// 		}}
					// 	>
					// 		<img style={{ width: "100%", height: "100%", objectFit: "cover" }} key={index} src={imageUrl} alt={`Thumbnail ${index}`} />
					// 	</ThumbnailContainer>
					// </IconButton>
				))}
			</Carousel>
		</Box>
	);
};

export default ImageCarousel;
