import { useGetCartItemListQuery } from "@api/shop/cart";
import { useGetCatalogQuery, useGetItemsAvailabilityQuery } from "@api/shop/catalog";
import { useGetFavoriteItemListQuery } from "@api/shop/favorites";
import { useGetTrackedItemListQuery } from "@api/shop/tracked";
import { Sorting } from "@appTypes/Sorting";
import BreadcrumbsPageHeader from "@components/BreadcrumbsPageHeader";
import { Empty } from "@components/Empty";
import { CatalogFilters } from "@components/Filters";
import ItemCard from "@components/ItemCard";
import LazyLoad from "@components/LazyLoad";
import { ScrollTop } from "@components/ScrollToTopButton";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { catalogPollingInterval, availabilityPollingInterval } from "@config/polling";
import { Search, Close, FilterList, Search as SearchIcon } from "@mui/icons-material";
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
} from "@mui/material";
import { isCatalogItemMatchQuery } from "@utils/search";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFilters } from "src/hooks/useFilters";
import { useIsMobile } from "src/hooks/useIsMobile";
import { useItemsToRender } from "src/hooks/useItemsToRender";

export function Component() {
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const searchParams = useSearchParams();
	const query = searchParams[0].get("q") || "";

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

	const sectionItems = useMemo(
		() => catalog?.items.filter((item) => isCatalogItemMatchQuery(item, query)),
		[catalog, query]
	);

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

		availabilityFilter,
		handleToggleAvailabilityFilter,

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

	const { itemsToRender } = useItemsToRender({ items: sectionItems, filterFunction, sorting });

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
				<Empty
					title={`По запросу "${query}" ничего не найдено.`}
					description="Попробуйте изменить параметры поиска."
					icon={<SearchIcon sx={{ height: 96, width: 96 }} />}
					button={<Button onClick={() => navigate("/")}>На главную</Button>}
				/>
			) : (
				<>
					<ScrollTop />
					<Modal open={filtersOpen} onClose={() => setFiltersOpen(false)}>
						<div className="top-0 left-0 bg-primary w-100v h-100v ai-fs d-f fd-c jc-fs of-a ps-f">
							<div className="px-2 w-100 h-9 ai-c d-f fd-r jc-sb">
								<IconButton>
									<Close sx={{ opacity: 0 }} />
								</IconButton>

								<Typography variant={"h6"}>Фильтры</Typography>

								<IconButton onClick={() => setFiltersOpen(false)}>
									<Close />
								</IconButton>
							</div>

							<CatalogFilters
								isMobile={isMobile}
								filterGroupList={filterGroupList}
								preorderList={preorderList}
								availabilityFilter={availabilityFilter}
								handleToggleAvailabilityFilter={handleToggleAvailabilityFilter}
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
					</Modal>
					<BreadcrumbsPageHeader
						isMobile={isMobile}
						path={[
							{ title: "Каталог", link: "/" },
						]}
						current={`Поиск: ${query}`}
					/>

					<div className="gap-2 d-f fd-r">
						{!isMobile && (
							<CatalogFilters
								isMobile={isMobile}
								filterGroupList={filterGroupList}
								preorderList={preorderList}
								availabilityFilter={availabilityFilter}
								handleToggleAvailabilityFilter={handleToggleAvailabilityFilter}
								preorderIdFilter={preorderIdFilter}
								handleChangePreorderIdFilter={handleChangePreorderIdFilter}
								checkedFilters={checkedFilters}
								handleToggleFilter={handleToggleFilter}
								priceRangeFilter={priceRangeFilter}
								handleChangePriceRangeFilter={handleChangePriceRangeFilter}
								onResetFilters={() => resetFilters()}
							/>
						)}

						<div className="gap-2 w-100 d-f fd-c">
							<div className="gap-1 ai-c d-f fd-r">
								<div className="w-100">
									<FormControl fullWidth>
										{isMobile ? (
											<NativeSelect
												value={sorting}
												onChange={(e) => {
													setSorting(e.target.value as Sorting);
												}}
											>
												<option value={"popular"}>Сначала популярные</option>
												<option value={"new"}>Сначала новые</option>
												<option value={"old"}>Сначала старые</option>
												<option value={"expensive"}>Сначала дорогие</option>
												<option value={"cheap"}>Сначала недорогие</option>
											</NativeSelect>
										) : (
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={sorting}
												onChange={(e) => {
													setSorting(e.target.value as Sorting);
												}}
												sx={{
													flexShrink: 0,
													width: isMobile ? "100%" : 360,
													backgroundColor: "surface.primary",
												}}
											>
												<MenuItem value={"popular"}>Сначала популярные</MenuItem>
												<MenuItem value={"new"}>Сначала новые</MenuItem>
												<MenuItem value={"old"}>Сначала старые</MenuItem>
												<MenuItem value={"expensive"}>Сначала дорогие</MenuItem>
												<MenuItem value={"cheap"}>Сначала недорогие</MenuItem>
											</Select>
										)}
									</FormControl>
								</div>

								{isMobile && (
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
								)}
							</div>

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
											height={420}
											display={"flex"}
											justifyContent={"center"}
											alignItems={"center"}
											key={index}
										>
											<LazyLoad
												key={index}
												width={"100%"}
												height={420}
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
}
