import BreadcrumbsPageHeader from "@components/BreadcrumbsPageHeader";
import React, { PropsWithChildren } from "react";
import { styled } from "@mui/material";
import { Typography } from "@mui/material";
import { RootState } from "@state/store";
import { getImageUrl } from "@utils/image";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CatalogSectionWrapper: React.FC<PropsWithChildren<{ isMobile: boolean; onClick: () => void }>> = ({
	children,
	isMobile,
	onClick,
}) => (
	<div
		onClick={onClick}
		style={{
			width: isMobile ? "100%" : 696,
			height: 300,
			borderRadius: 16,
			position: "relative",
			cursor: "pointer",
			transition: "transform .2s",
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			overflowX: "hidden",
		}}
	>
		{children}
	</div>
);

const SectionTypographyWrapper = styled("div")({
	position: "absolute",
	top: 237,
	left: "50%",
	transform: "translateX(-50%)",
});

export default function Home() {
	// TODO: resolve isMobile
	const categories = useSelector((state: RootState) => state.catalog.categories);
	const isMobile = false;
	const navigate = useNavigate();

	return (
		<>
			<div
				style={{
					paddingTop: 0,
					paddingBottom: 32,
					display: "flex",
					flexDirection: "column",
					gap: 8,
					width: "100%",
				}}
			>
				<BreadcrumbsPageHeader isMobile={isMobile} current="Главная" />
			</div>
			<div>
				<div
					style={{
						display: "flex",
						flexDirection: isMobile ? "column" : "row",
						justifyContent: "space-between",
						width: "100%",
						gap: 16,
					}}
				>
					{categories.map((category) => (
						<CatalogSectionWrapper
							isMobile={isMobile}
							onClick={() => navigate(`/catalog/${category.link}`)}
						>
							<img style={{ height: 300, width: 696 }} src={getImageUrl(category.image, "large")} />
							<SectionTypographyWrapper>
								<Typography variant="h4" color="white">
									{category.title}
								</Typography>
							</SectionTypographyWrapper>
						</CatalogSectionWrapper>
					))}
				</div>
			</div>
		</>
	);
}
