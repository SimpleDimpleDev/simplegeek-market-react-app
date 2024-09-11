import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, styled } from "@mui/material";
import React, { createRef, useState } from "react";

const Window = ({ isMobile, children }: { isMobile: boolean; children: React.ReactNode }) => {
	return (
		<Box
			width={"100%"}
			height={isMobile ? 345 : 630}
			borderRadius={3}
			display={"flex"}
			alignItems={"center"}
			justifyContent={"center"}
			overflow={"hidden"}
		>
			{children}
		</Box>
	);
};

const ImageBar = styled(Box)({
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

const ThumbnailContainer = styled("div")({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	width: "160px",
	height: "160px",
	overflow: "hidden",
	borderRadius: 16,
	transition: "opacity 0.2s",
});

const Thumbnail = styled("img")({
	height: "100%",
	width: "100%",
	objectFit: "cover",
});

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

interface ImageCarouselProps {
	isMobile: boolean;
	imageUrls: string[]; // Array of image URLs
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ isMobile, imageUrls }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
	const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);

	const hoveredImageUrl = hoveredImageIndex ? imageUrls[hoveredImageIndex] : null;
	const selectedImageUrl = imageUrls[selectedImageIndex];

	const scrollRef = createRef<HTMLDivElement>();

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = direction === "left" ? -502 : 502;
			scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<Box width={"100%"} gap={16}>
			<Window isMobile={isMobile}>
				<img
					style={isMobile ? { width: 345, height: 345 } : { width: 630, height: 630 }}
					className="contain"
					src={hoveredImageUrl || selectedImageUrl}
					alt="Displayed"
				/>
			</Window>
			<Box display="flex" alignItems="center" position={"relative"}>
				{!isMobile && (
					<ScrollButton sx={{ left: "-3%" }} onClick={() => scroll("left")}>
						<ChevronLeft />
					</ScrollButton>
				)}
				<ImageBar
					ref={scrollRef}
					style={
						{
							// WebkitTouchCallout: 'none',
							// WebkitUserSelect: 'none',
							// KhtmlUserSelect: 'none',
							// MozUserSelect: 'none',
							// userSelect: 'none'
						}
					}
				>
					{imageUrls.map((imageUrl, index) => (
						<IconButton
							key={index}
							sx={{ margin: 0, padding: 0 }}
							onClick={() => setSelectedImageIndex(index)}
							onMouseEnter={() => setHoveredImageIndex(index)}
							onMouseLeave={() => setHoveredImageIndex(null)}
						>
							<ThumbnailContainer
								sx={{
									border: "4px solid",
									borderColor: selectedImageIndex === index ? "icon.brandSecondary" : "transparent",
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
								<Thumbnail key={index} src={imageUrl} alt={`Thumbnail ${index}`} />
							</ThumbnailContainer>
						</IconButton>
					))}
				</ImageBar>
				{!isMobile && (
					<ScrollButton sx={{ right: "-3%" }} onClick={() => scroll("right")}>
						<ChevronRight />
					</ScrollButton>
				)}
			</Box>
		</Box>
	);
};

export default ImageCarousel;
