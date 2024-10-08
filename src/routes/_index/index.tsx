import { Close, FilterList, Search } from "@mui/icons-material";
import {
	Badge,
	Button,
	FormControl,
	Grid2,
	Grow,
	IconButton,
	MenuItem,
	Modal,
	Select,
	Typography,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import BreadcrumbsPageHeader from "@components/BreadcrumbsPageHeader";
import ItemCard from "@components/ItemCard";
import LazyLoad from "@components/LazyLoad";
import { useEffect, useMemo, useState } from "react";

import { CatalogFilters } from "@components/Filters";
import { CatalogItem } from "@appTypes/CatalogItem";
import { Empty } from "@components/Empty";
import { ScrollTop } from "@components/ScrollToTopButton";
import { useGetCatalogQuery } from "@api/shop/catalog";
import { Loading } from "@components/Loading";
import { useIsMobile } from "src/hooks/useIsMobile";
import { Sorting } from "@appTypes/Sorting";
import { getSortedItems } from "@utils/sorting";

export function Component() {
	const navigate = useNavigate();

	const isMobile = useIsMobile();

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();

	const searchParams = useSearchParams();
	const preFilter = useMemo(() => {
		const preFilterString = searchParams[0].get("f");
		if (!preFilterString) return undefined;
		const preFilter = preFilterString.split(":");
		const preFilterGroupTitle = preFilter.at(0);
		const preFilterValue = preFilter.at(1);
		if (!preFilterGroupTitle || !preFilterValue) return undefined;
		return { title: preFilterGroupTitle, value: preFilterValue };
	}, [searchParams]);

	const catalogItems = useMemo(
		() => catalog?.items || [],
		[catalog]
	);

	const [filtersOpen, setFiltersOpen] = useState(false);
	const [filtersReset, setFiltersReset] = useState(false);
	const [itemsFiltering, setItemsFiltering] = useState<boolean>(false);
	const [filteredItems, setFilteredItems] = useState<CatalogItem[]>(catalog?.items || []);

	const [sorting, setSorting] = useState<Sorting>("popular");
	const sortedItems = useMemo(() => getSortedItems(filteredItems, sorting), [filteredItems, sorting]);

	const [showNothing, setShowNothing] = useState(false);

	useEffect(() => {
		setShowNothing(true);
		setTimeout(() => {
			setShowNothing(false);
		}, 0);
	}, [sortedItems]);

	useEffect(() => {
		setShowNothing(true);
		setTimeout(() => {
			setShowNothing(false);
		}, 0);
	}, [catalogItems]);

	useEffect(() => {
		setFilteredItems(catalogItems);
	}, [catalogItems]);

	const onApplyFilters = (filteredItems: CatalogItem[]) => {
		setFilteredItems([]);
		setItemsFiltering(true);
		setTimeout(() => {
			setItemsFiltering(false);
			setFilteredItems(filteredItems);
		}, 0);
	};

	return (
		<>
			<ScrollTop />
			<Loading isLoading={catalogIsLoading} necessaryDataIsPersisted={!!catalog}>
				{catalogItems.length === 0 ? (
					<Empty
						title={`Пока нет товаров`}
						description="Вернитесь позже"
						icon={<Search sx={{ height: 96, width: 96 }} />}
						button={<Button onClick={() => navigate("/")}>На главную</Button>}
					/>
				) : (
					<div>
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
									items={catalogItems}
									isMobile={isMobile}
									preFilter={preFilter}
									onFilter={onApplyFilters}
									filtersReset={filtersReset}
									setFiltersReset={setFiltersReset}
								/>
							</div>
						</Modal>
						<BreadcrumbsPageHeader
							isMobile={isMobile}
							current={"Каталог"}
						/>

						<div className="gap-2 d-f fd-r">
							{!isMobile && (
								<CatalogFilters
									items={catalogItems}
									isMobile={isMobile}
									preFilter={preFilter}
									onFilter={onApplyFilters}
									filtersReset={filtersReset}
									setFiltersReset={setFiltersReset}
								/>
							)}

							<div className="gap-2 w-100 d-f fd-c">
								<div className="gap-1 ai-c d-f fd-r">
									<div className="w-100">
										<FormControl fullWidth>
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={sorting}
												onChange={(e) => {
													setSorting(e.target.value as Sorting);
												}}
												defaultValue="exp"
												autoWidth
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
										</FormControl>
									</div>

									{isMobile && (
										<IconButton
											style={{
												width: 48,
												height: 48,
											}}
											onClick={() => setFiltersOpen(!filtersOpen)}
										>
											<Badge color="warning" variant="dot" badgeContent={0}>
												<FilterList />
											</Badge>
										</IconButton>
									)}
								</div>

								{sortedItems.length === 0 && !itemsFiltering ? (
									<Empty
										title={"Ничего не найдено"}
										description="Попробуйте изменить фильтры"
										icon={<Search sx={{ height: 96, width: 96 }} />}
										button={
											<Button variant="contained" onClick={() => setFiltersReset(true)}>
												Сбросить фильтры
											</Button>
										}
									/>
								) : (
									<Grid2 container justifyContent="flex-start" spacing={2}>
										{!showNothing &&
											sortedItems.map((data, index) => (
												<Grid2 size={{ xl: 4, lg: 4, md: 6, sm: 6, xs: 12 }} key={index}>
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
																<ItemCard data={data} />
															</div>
														</Grow>
													</LazyLoad>
												</Grid2>
											))}
									</Grid2>
								)}
							</div>
						</div>
					</div>
				)}
			</Loading>
		</>
	);
}
