import { Close, FilterList, Search as SearchIcon } from "@mui/icons-material";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import BreadcrumbsPageHeader from "@components/BreadcrumbsPageHeader";
import ItemCard from "@components/ItemCard";
import LazyLoad from "@components/LazyLoad";
import { useEffect, useMemo, useState } from "react";

import { CatalogFilters } from "@components/Filters";
import { CatalogItem } from "@appTypes/CatalogItem";
import { Empty } from "@components/Empty";
import { isCatalogItemMatchQuery } from "@utils/search";
import { useSelector } from "react-redux";
import { RootState } from "@state/store";
import { addCartItem, addFavoriteItem, removeFavoriteItem } from "@state/user/thunks";

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

export default function Search() {
	const navigate = useNavigate();
	const searchParams = useSearchParams();
	const query = Object.fromEntries(searchParams[0].entries()).q;
	const availableItemsIds = useSelector((state: RootState) => state.availability.items);
	const catalogItems = useSelector((state: RootState) => state.catalog.items);
	const catalogLoading = useSelector((state: RootState) => state.catalog.loading);
	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);
	const userCartItems = useSelector((state: RootState) => state.userCart.items);
	const userFavoriteItems = useSelector((state: RootState) => state.userFavorites.items);

	const [searchedItems, setSearchedItems] = useState<CatalogItem[]>([]);

	const [filtersOpen, setFiltersOpen] = useState(false);

	const [sorting, setSorting] = useState<Sorting>("expensive");
	const [filteredItems, setFilteredItems] = useState<CatalogItem[]>(searchedItems);
	const [filtersReset, setFiltersReset] = useState(false);
	const [itemsFiltering, setItemsFiltering] = useState<boolean>(true);
	const sortedItems = getSortedItems(filteredItems, sorting);

	const favoriteItemsIds = useMemo(() => userFavoriteItems.map((item) => item.id), [userFavoriteItems]);
	const cartItemsIds = useMemo(() => userCartItems.map((item) => item.id), [userCartItems]);

	useEffect(() => {
		const searchedItems = catalogItems.filter((item) => isCatalogItemMatchQuery(item, query));
		setSearchedItems(searchedItems);
		setFilteredItems(searchedItems);
	}, [catalogItems, query]);

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
			{catalogLoading ? (
				<div className="w-100 h-100 d-f jc-c ai-c">
					<CircularProgress />
				</div>
			) : searchedItems.length === 0 ? (
				<Empty
					title={`По запросу "${query}" ничего не найдено.`}
					description="Попробуйте изменить параметры поиска."
					icon={<SearchIcon sx={{ height: 96, width: 96 }} />}
					button={<Button onClick={() => navigate("/")}>На главную</Button>}
				/>
			) : (
				<div>
					<Modal open={filtersOpen} onClose={() => setFiltersOpen(false)}>
						<div className="ps-f top-0 left-0 w-100v h-100v d-f fd-c jc-fs ai-fs of-a bg-primary">
							<div className="w-100 h-9 d-f fd-r jc-sb ai-c px-2">
								<IconButton>
									<Close sx={{ opacity: 0 }} />
								</IconButton>

								<Typography variant={"h6"}>Фильтры</Typography>

								<IconButton onClick={() => setFiltersOpen(false)}>
									<Close />
								</IconButton>
							</div>

							<CatalogFilters
								items={searchedItems}
								isMobile={isMobile}
								preFilter={undefined}
								onFilter={onApplyFilters}
								filtersReset={filtersReset}
								setFiltersReset={setFiltersReset}
							/>
						</div>
					</Modal>
					<BreadcrumbsPageHeader
						isMobile={isMobile}
						path={[{ title: "Главная", link: "/" }]}
						current={`Поиск по запросу "${query}"`}
					/>

					<div className="d-f fd-r gap-2">
						{!isMobile && (
							<CatalogFilters
								items={searchedItems}
								isMobile={isMobile}
								preFilter={undefined}
								onFilter={onApplyFilters}
								filtersReset={filtersReset}
								setFiltersReset={setFiltersReset}
							/>
						)}

						<div className="w-100 d-f fd-c gap-2">
							<div className="d-f fd-r ai-c gap-1">
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
									icon={<SearchIcon sx={{ height: 96, width: 96 }} />}
									button={
										<Button variant="contained" onClick={() => setFiltersReset(true)}>
											Сбросить фильтры
										</Button>
									}
								/>
							) : (
								<Grid2 container justifyContent="flex-start" spacing={2}>
									{sortedItems.map((data, index) => (
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
															onClick={() => {
																const variationParam =
																	data.variationIndex !== null
																		? `?v=${data.variationIndex}`
																		: "";
																navigate(
																	`/item/${data.publicationLink}${variationParam}`
																);
															}}
															onAddToCart={() => addCartItem({ itemId: data.id })}
															onAddToFavorites={() =>
																addFavoriteItem({ itemId: data.id })
															}
															onRemoveFromFavorites={() =>
																removeFavoriteItem({ itemId: data.id })
															}
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
