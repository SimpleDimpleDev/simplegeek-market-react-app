import { useGetCartItemListQuery } from "@api/shop/cart";
import { useGetCatalogQuery, useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";
import { useGetTrackedItemListQuery } from "@api/shop/tracked";
import { CatalogItem } from "@appTypes/CatalogItem";
import { Sorting } from "@appTypes/Sorting";
import { catalogPollingInterval, availabilityPollingInterval } from "@config/polling";
import { Search, Close, FilterList } from "@mui/icons-material";
import {
	CircularProgress,
	Modal,
	IconButton,
	Typography,
	FormControl,
	NativeSelect,
	Select,
	MenuItem,
	Badge,
	Button,
	Grid2,
	Grow,
	Box,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFilters } from "src/hooks/useFilters";
import { useIsMobile } from "src/hooks/useIsMobile";
import { useItemsToRender } from "src/hooks/useItemsToRender";
import { Empty } from "./Empty";
import { CatalogFilters } from "./Filters";
import ItemCard from "./ItemCard";
import LazyLoad from "./LazyLoad";
import { ScrollTop } from "./ScrollToTopButton";
import SomethingWentWrong from "./SomethingWentWrong";
import { PageHeading } from "./PageHeading";

interface CatalogProps {
	sectionFilter: (item: CatalogItem) => boolean;
	title: string;
	emptyElement: React.ReactNode;
}

const Catalog: React.FC<CatalogProps> = ({ sectionFilter, title, emptyElement }) => {
	const isMobile = useIsMobile();

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: catalogPollingInterval,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});

	const { data: availableItemList, isLoading: availabilityIsLoading } = useGetItemsAvailabilityQuery(void 0, {
		refetchOnMountOrArgChange: true,
		pollingInterval: availabilityPollingInterval,
		skipPollingIfUnfocused: true,
		refetchOnFocus: true,
	});

	const sectionItems = useMemo(() => catalog?.items.filter(sectionFilter), [catalog, sectionFilter]);

	const { data: cartItemList, isLoading: cartItemListIsLoading } = useGetCartItemListQuery();
	const { data: favoriteItemList, isLoading: favoriteItemListIsLoading } = useGetFavoriteItemListQuery();
	const { data: trackedItemList, isLoading: trackedItemListIsLoading } = useGetTrackedItemListQuery();

	const availableItemIds = useMemo(() => {
		if (!availableItemList) return undefined;
		const idSet = new Set<string>();
		availableItemList?.items.forEach((item) => idSet.add(item));
		return idSet;
	}, [availableItemList]);

	const cartItemIds = useMemo(() => {
		if (!cartItemList) return undefined;
		const idSet = new Set<string>();
		cartItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [cartItemList]);

	const favoriteItemIds = useMemo(() => {
		if (!favoriteItemList) return undefined;
		const idSet = new Set<string>();
		favoriteItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [favoriteItemList]);

	const trackedItemIds = useMemo(() => {
		if (!trackedItemList) return undefined;
		const idSet = new Set<string>();
		trackedItemList?.items.forEach((item) => idSet.add(item.id));
		return idSet;
	}, [trackedItemList]);

	const {
		filterGroupList,
		preorderList,
		priceLimits,

		availabilityFilter,
		handleToggleAvailabilityFilter,

		typeFilter,
		handleChangeTypeFilter,

		preorderIdFilter,
		handleChangePreorderIdFilter,

		checkedFilters,
		handleToggleFilter,

		priceRangeFilter,
		handleChangePriceRangeFilter,

		filterFunction,
		resetFilters,
	} = useFilters({ items: sectionItems, availableItemIds: availableItemIds });

	const [filtersOpen, setFiltersOpen] = useState(false);

	const [sorting, setSorting] = useState<Sorting>("popular");

	const { itemsToRender } = useItemsToRender({ items: sectionItems, availableItemIds, filterFunction, sorting });

	const isFirstItemsRender = useRef(true);
	const catalogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (itemsToRender === undefined) return;
		if (isFirstItemsRender.current) {
			isFirstItemsRender.current = false;
			return;
		}

		if (catalogRef.current) {
			const catalogTop = catalogRef.current.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({ top: catalogTop - 16, behavior: "smooth" });
		}
	}, [itemsToRender, isFirstItemsRender]);

	if (catalogIsLoading || availabilityIsLoading) {
		return (
			<div className="w-100 h-100 ai-c d-f jc-c">
				<CircularProgress />
			</div>
		);
	}

	if (catalog === undefined || availableItemIds === undefined) {
		return <SomethingWentWrong />;
	}

	if (sectionItems === undefined || itemsToRender === undefined) {
		return <CircularProgress />;
	}

	return (
		<>
			{sectionItems.length === 0 ? (
				emptyElement
			) : (
				<>
					<ScrollTop />
					<Modal open={filtersOpen} onClose={() => setFiltersOpen(false)}>
						<div className="top-0 left-0 bg-primary w-100v h-100v ai-fs d-f fd-c jc-fs of-a">
							<div
								className="bg-primary px-2 w-100 h-7 ai-c d-f fd-r jc-sb ps-a"
								style={{ zIndex: 1000 }}
							>
								<IconButton>
									<Close sx={{ opacity: 0 }} />
								</IconButton>

								<Typography variant={"h6"}>Фильтры</Typography>

								<IconButton onClick={() => setFiltersOpen(false)}>
									<Close />
								</IconButton>
							</div>

							<Box paddingTop={7} height={"100%"} width={"100%"} flexShrink={0}>
								<div>
									<CatalogFilters
										isMobile={isMobile}
										filterGroupList={filterGroupList}
										preorderList={preorderList}
										priceLimits={priceLimits}
										availabilityFilter={availabilityFilter}
										handleToggleAvailabilityFilter={handleToggleAvailabilityFilter}
										typeFilter={typeFilter}
										onTypeFilterChange={handleChangeTypeFilter}
										preorderIdFilter={preorderIdFilter}
										handleChangePreorderIdFilter={handleChangePreorderIdFilter}
										checkedFilters={checkedFilters}
										handleToggleFilter={handleToggleFilter}
										priceRangeFilter={priceRangeFilter}
										handleChangePriceRangeFilter={handleChangePriceRangeFilter}
										onResetFilters={() => {
											resetFilters();
											setFiltersOpen(false);
										}}
										onCloseFilters={() => setFiltersOpen(false)}
									/>
								</div>
							</Box>
						</div>
					</Modal>
					<div ref={catalogRef}/>
					<PageHeading title={title} />
					<div className="gap-2 d-f fd-r">
						{!isMobile && (
							<Box height={"100%"} width={280} flexShrink={0}>
								<div className="gap-1 d-f fd-c" style={{ position: "sticky", top: "16px" }}>
									<FormControl fullWidth>
										<Select
											value={sorting}
											onChange={(e) => {
												setSorting(e.target.value as Sorting);
											}}
											sx={{
												flexShrink: 0,
												backgroundColor: "surface.primary",
											}}
										>
											<MenuItem value={"popular"}>Сначала популярные</MenuItem>
											<MenuItem value={"new"}>Сначала новые</MenuItem>
											<MenuItem value={"expensive"}>Сначала дорогие</MenuItem>
											<MenuItem value={"cheap"}>Сначала недорогие</MenuItem>
										</Select>
									</FormControl>
									<CatalogFilters
										isMobile={isMobile}
										filterGroupList={filterGroupList}
										preorderList={preorderList}
										priceLimits={priceLimits}
										availabilityFilter={availabilityFilter}
										handleToggleAvailabilityFilter={handleToggleAvailabilityFilter}
										typeFilter={typeFilter}
										onTypeFilterChange={handleChangeTypeFilter}
										preorderIdFilter={preorderIdFilter}
										handleChangePreorderIdFilter={handleChangePreorderIdFilter}
										checkedFilters={checkedFilters}
										handleToggleFilter={handleToggleFilter}
										priceRangeFilter={priceRangeFilter}
										handleChangePriceRangeFilter={handleChangePriceRangeFilter}
										onResetFilters={() => resetFilters()}
									/>
								</div>
							</Box>
						)}

						<div className="gap-2 w-100 d-f fd-c">
							{isMobile && (
								<div className="gap-1 ai-c d-f fd-r">
									<div className="w-100">
										<FormControl fullWidth>
											<NativeSelect
												variant="outlined"
												value={sorting}
												onChange={(e) => {
													setSorting(e.target.value as Sorting);
												}}
											>
												<option value={"popular"}>Сначала популярные</option>
												<option value={"new"}>Сначала новые</option>
												<option value={"expensive"}>Сначала дорогие</option>
												<option value={"cheap"}>Сначала недорогие</option>
											</NativeSelect>
										</FormControl>
									</div>

									<IconButton
										style={{
											width: 48,
											height: 48,
										}}
										onClick={() => setFiltersOpen(true)}
									>
										<Badge
											variant="dot"
											color="warning"
											invisible={checkedFilters.length === 0 && preorderIdFilter === null}
										>
											<FilterList />
										</Badge>
									</IconButton>
								</div>
							)}

							{itemsToRender.length === 0 ? (
								<Empty
									title={"Ничего не найдено"}
									description="Попробуйте изменить фильтры"
									icon={<Search sx={{ height: 96, width: 96 }} />}
									button={
										<Button variant="contained" onClick={() => resetFilters()}>
											Сбросить фильтры
										</Button>
									}
								/>
							) : (
								<Grid2 container spacing={2}>
									{itemsToRender.map((data, index) => (
										<Grid2
											size={{ xl: 4, lg: 6, md: 4, sm: 6, xs: 12 }}
											width={"100%"}
											height={424}
											display={"flex"}
											justifyContent={"center"}
											alignItems={"center"}
											key={index}
										>
											<LazyLoad
												key={index}
												width={"100%"}
												height={424}
												observerOptions={{
													rootMargin: "100px",
												}}
												once
											>
												<Grow key={index} in={true} timeout={200}>
													<div>
														<ItemCard
															data={data}
															isAvailable={availableItemIds.has(data.id)}
															availabilityIsLoading={availabilityIsLoading}
															isInCart={cartItemIds?.has(data.id)}
															cartItemListIsLoading={cartItemListIsLoading}
															isFavorite={favoriteItemIds?.has(data.id)}
															favoriteItemListIsLoading={favoriteItemListIsLoading}
															isTracked={trackedItemIds?.has(data.id)}
															trackedItemListIsLoading={trackedItemListIsLoading}
														/>
													</div>
												</Grow>
											</LazyLoad>
										</Grid2>
									))}
								</Grid2>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Catalog;
