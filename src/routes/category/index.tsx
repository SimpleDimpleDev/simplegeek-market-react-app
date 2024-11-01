import { useGetCatalogQuery } from "@api/shop/catalog";
import BreadcrumbsPageHeader from "@components/BreadcrumbsPageHeader";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { CircularProgress, Grid2, Typography } from "@mui/material";
import { getImageUrl } from "@utils/image";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useIsMobile } from "src/hooks/useIsMobile";

export function Component() {
	const isMobile = useIsMobile();
	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();

	return (
		<>
			<Helmet>
				<title>Категории - SimpleGeek</title>
			</Helmet>
			{catalogIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !catalog ? (
				<SomethingWentWrong />
			) : (
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
						<Grid2 container spacing={2}>
							{catalog.categories.map((category) => (
								<Grid2 key={category.link} size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
									<Link
										to={`/category/${category.link}`}
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
											style={isMobile ? { width: "100%" } : { height: 300, width: 696 }}
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
								</Grid2>
							))}
						</Grid2>
					</div>
				</>
			)}
		</>
	);
}
