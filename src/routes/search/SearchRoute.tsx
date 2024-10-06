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
import { useEffect, useState } from "react";

import { CatalogFilters } from "@components/Filters";
import { CatalogItem } from "@appTypes/CatalogItem";
import { Empty } from "@components/Empty";
import { isCatalogItemMatchQuery } from "@utils/search";
import { useGetCatalogQuery } from "@api/shop/catalog";
import { useIsMobile } from "src/hooks/useIsMobile";

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

export function Component() {
	const isMobile = useIsMobile();

	const navigate = useNavigate();
	const searchParams = useSearchParams();
	const query = Object.fromEntries(searchParams[0].entries()).q;

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery();

	const [searchedItems, setSearchedItems] = useState<CatalogItem[]>([]);

	const [filtersOpen, setFiltersOpen] = useState(false);

	const [sorting, setSorting] = useState<Sorting>("expensive");
	const [filteredItems, setFilteredItems] = useState<CatalogItem[]>(searchedItems);
	const [filtersReset, setFiltersReset] = useState(false);
	const [itemsFiltering, setItemsFiltering] = useState<boolean>(true);
	const sortedItems = getSortedItems(filteredItems, sorting);

	useEffect(() => {
		const searchedItems = catalog?.items.filter((item) => isCatalogItemMatchQuery(item, query)) || [];
		setSearchedItems(searchedItems);
		setFilteredItems(searchedItems);
	}, [catalog, query]);

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
			{catalogIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
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

					<div className="gap-2 d-f fd-r">
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
		</>
	);
}
