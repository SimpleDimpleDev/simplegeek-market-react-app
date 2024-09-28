import { Close, FilterList, Search } from "@mui/icons-material";
import {
	Badge,
	Button,
	CircularProgress,
	FormControl,
	Grid2,
	Grow,
	IconButton,
	MenuItem,
	Modal,
	Select,
	Typography,
} from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BreadcrumbsPageHeader from "@components/BreadcrumbsPageHeader";
import ItemCard from "@components/ItemCard";
import LazyLoad from "@components/LazyLoad";
import { useEffect, useMemo, useState } from "react";

import { CatalogFilters } from "@components/Filters";
import { CatalogItem } from "@appTypes/CatalogItem";
import { Empty } from "@components/Empty";
import { useSelector } from "react-redux";
import { RootState } from "@state/store";
import { ScrollTop } from "@components/ScrollToTopButton";

type Sorting = "expensive" | "cheap";
const getSortedItems = (items: CatalogItem[], sorting: Sorting): CatalogItem[] => {
	switch (sorting) {
		case "expensive": {
			return [...items].sort((a, b) => b.price - a.price);
		}
		case "cheap": {
			return [...items].sort((a, b) => a.price - b.price);
		}
		default: {
			throw new Error(`Unknown sorting: ${sorting}`);
		}
	}
};

export default function Catalog() {
	const navigate = useNavigate();

	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);

	const availableItemsIds = useSelector((state: RootState) => state.availability.items);
	const catalogItems = useSelector((state: RootState) => state.catalog.items);
	const catalogLoading = useSelector((state: RootState) => state.catalog.loading);
	const userCartItems = useSelector((state: RootState) => state.userCart.items);
	const userFavoriteItems = useSelector((state: RootState) => state.userFavorites.items);

	const params = useParams();
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

	const categoryItems = useMemo(
		() => catalogItems.filter((item) => item.product.category.link === params.categoryLink),
		[catalogItems, params]
	);

	const [filtersOpen, setFiltersOpen] = useState(false);
	const [filtersReset, setFiltersReset] = useState(false);
	const [itemsFiltering, setItemsFiltering] = useState<boolean>(false);
	const [filteredItems, setFilteredItems] = useState<CatalogItem[]>(categoryItems);

	const [sorting, setSorting] = useState<Sorting>("expensive");
	const sortedItems = useMemo(() => getSortedItems(filteredItems, sorting), [filteredItems, sorting]);

	const favoriteItemsIds = useMemo(() => userFavoriteItems.map((item) => item.id), [userFavoriteItems]);
	const cartItemsIds = useMemo(() => userCartItems.map((item) => item.id), [userCartItems]);

	const [showNothing, setShowNothing] = useState(false);

	useEffect(() => {
		const recordCategoryVisited = () => {
			const categoryLink = params.categoryLink;
			if (!categoryLink) return;
			const categoryVisitsString = localStorage.getItem("categoryVisits");
			if (!categoryVisitsString) return;
			const categoryVisits: { categoryLink: string; categoryVisits: number }[] = JSON.parse(categoryVisitsString);
			if (!categoryVisits) return;
			const categoryVisitsCopy = { ...categoryVisits };
			const currentCategoryVisit = categoryVisitsCopy.find(
				(categoryVisit) => categoryVisit.categoryLink === categoryLink
			);
			if (currentCategoryVisit) {
				currentCategoryVisit.categoryVisits++;
			} else {
				categoryVisitsCopy.push({ categoryLink, categoryVisits: 1 });
			}
			localStorage.setItem("categoryVisits", JSON.stringify(categoryVisitsCopy));
		};

		recordCategoryVisited();
	}, [params.categoryLink]);

	useEffect(() => {
		setShowNothing(true);
		setTimeout(() => {
			setShowNothing(false);
		}, 0);
	}, [categoryItems]);

	useEffect(() => {
		setFilteredItems(categoryItems);
	}, [categoryItems]);

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
			{catalogLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : categoryItems.length === 0 ? (
				<Empty
					title={`В категории ${params.categoryLink} пока нет товаров`}
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
								items={categoryItems}
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
						path={[{ title: "Главная", link: "/" }]}
						current={categoryItems[0].product.category.title}
					/>

					<div className="gap-2 d-f fd-r">
						{!isMobile && (
							<CatalogFilters
								items={categoryItems}
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
											<MenuItem value={"expensive"}>Сначала дорогие</MenuItem>
											<MenuItem value={"cheap"}>Сначала дешевые</MenuItem>
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
															<ItemCard
																data={data}
																isAvailable={availableItemsIds.includes(data.id)}
																isInCart={cartItemsIds.includes(data.id)}
																isFavorite={favoriteItemsIds.includes(data.id)}
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
				</div>
			)}
		</>
	);
}
