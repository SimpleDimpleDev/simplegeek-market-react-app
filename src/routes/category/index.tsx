import { useGetCatalogQuery } from "@api/shop/catalog";
import BreadcrumbsPageHeader from "@components/BreadcrumbsPageHeader";
import { Loading } from "@components/Loading";
import { Typography } from "@mui/material";
import { getImageUrl } from "@utils/image";
import { Link } from "react-router-dom";
import { useIsMobile } from "src/hooks/useIsMobile";

export function Component() {
	const isMobile = useIsMobile();
	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();

	return (
		<>
			<div
				style={{
					paddingTop: 0,
					paddingBottom: 0,
					display: "flex",
					flexDirection: "column",
					gap: 8,
					width: "100%",
				}}
			>
				<BreadcrumbsPageHeader
					isMobile={isMobile}
					path={[{ title: "Каталог", link: "/" }]}
					current="Категории"
				/>
			</div>
			<div className="h-100">
				<div
					style={{
						display: "flex",
						flexDirection: isMobile ? "column" : "row",
						justifyContent: "space-between",
						width: "100%",
						height: "100%",
						gap: 16,
					}}
				>
					<Loading isLoading={catalogIsLoading} necessaryDataIsPersisted={!!catalog}>
						{catalog?.categories.map((category) => (
							<Link
								to={`/catalog/${category.link}`}
								title={category.title}
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
								<img
									style={{ height: 300, width: 696 }}
									src={getImageUrl(category.banner.url, "large")}
									alt={category.title}
								/>
								<div
									style={{
										position: "absolute",
										top: 237,
										left: "50%",
										transform: "translateX(-50%)",
									}}
								>
									<Typography variant="h4" color="white">
										{category.title}
									</Typography>
								</div>
							</Link>
						))}
					</Loading>
				</div>
			</div>
		</>
	);
}
