import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, styled, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { ArrowProps } from "react-multi-carousel/lib/types";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ThumbnailContainer = styled("div")({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	width: "157.5px",
	height: "157.5px",
	overflow: "hidden",
	backgroundColor: "surface.primary",
	borderRadius: 16,
	transition: "opacity 0.2s",
});

const ScrollButton = styled(IconButton)({
	position: "absolute",
	top: "50%",
	transform: "translateY(-50%)",
	zIndex: 2,
	backgroundColor: "rgba(255, 255, 255, 0.8)",
	"&:hover": {
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
		breakpoint: { max: 3000, min: 662 },
		items: 4,
	},
	mobile: {
		breakpoint: { max: 662, min: 0 },
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
	imageUrls: string[]; // Array of image URLs
	alt: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ imageUrls, alt }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
	const selectedImageUrl = imageUrls[selectedImageIndex];

	const isMobile = useMediaQuery("(max-width: 662px)");

	return (
		<Box style={{ width: isMobile ? 345 : 630 }}>
			<div
				className="bg-primary w-100 ai-c br-3 d-f jc-c of-h"
				style={{ height: isMobile ? 345 : 630, width: isMobile ? 345 : 630 }}
			>
				<img
					style={isMobile ? { width: 345, height: 345 } : { width: 630, height: 630 }}
					className="contain"
					src={selectedImageUrl}
					alt={alt}
					loading="lazy"
				/>
			</div>
			<div className="pt-2 w-100">
				{imageUrls.length > 1 && (
					<Carousel
						responsive={responsive}
						swipeable={isMobile}
						draggable={isMobile}
						deviceType={isMobile ? "mobile" : "desktop"}
						customLeftArrow={<LeftButton />}
						customRightArrow={<RightButton />}
					>
						{imageUrls.map((imageUrl, index) => (
							<IconButton
								key={index}
								sx={{ margin: 0, padding: 0 }}
								onClick={() => setSelectedImageIndex(index)}
							>
								<ThumbnailContainer
									sx={{
										border: "4px solid",
										borderColor:
											selectedImageIndex === index ? "icon.brandSecondary" : "transparent",
										"&:hover":
											selectedImageIndex === index
												? {
														opacity: "1",
												  }
												: {
														opacity: "0.7",
												  },
									}}
								>
									<img
										style={{ width: "100%", height: "100%", objectFit: "cover" }}
										key={index}
										src={imageUrl}
										alt={`Thumbnail ${index}`}
										loading="lazy"
									/>
								</ThumbnailContainer>
							</IconButton>
						))}
					</Carousel>
				)}
			</div>
		</Box>
	);
};

export default ImageCarousel;
