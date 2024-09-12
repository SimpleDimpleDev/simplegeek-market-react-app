import { CatalogItem, CatalogItemShop } from "@appTypes/CatalogItem";
import { FilterGroupGet } from "@appTypes/Filters";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
	Typography,
	List,
	ListItem,
	ListItemButton,
	Radio,
	Checkbox,
	TextField,
	Button,
	Collapse,
} from "@mui/material";

type TypeFilter = "stock" | "preorder" | "all";
type CheckedFilterGroup = { id: string; filtersIds: string[] };
type PriceRange = [number, number];

const collapsedFiltersNumber = 5;

interface FilterFunctionArgs {
	item: CatalogItem;
	filters: CheckedFilterGroup[];
	typeFilter: "stock" | "preorder" | "all";
	priceRange: [number, number];
}

function filterCatalogItem({ item, filters, typeFilter, priceRange }: FilterFunctionArgs): boolean {
	if (typeFilter !== "all") {
		if ((item.preorder !== null) !== (typeFilter === "preorder")) {
			return false;
		}
	}
	if (item.price < priceRange[0] || item.price > priceRange[1]) {
		return false;
	}
	if (filters.length !== 0) {
		for (const group of filters) {
			if (group.filtersIds.length === 0) {
				continue;
			}
			const itemFilterGroup = item.product.filterGroups.find((filterGroup) => filterGroup.id === group.id);
			if (!itemFilterGroup) {
				return false;
			}
			if (!group.filtersIds.every((id) => itemFilterGroup.filters.find((filter) => filter.id === id))) {
				return false;
			}
		}
	}
	return true;
}

interface FilterProps {
	value: string;
	selected: boolean;
	changed: boolean;
	onClick: () => void;
}

const Filter = ({ value, selected, changed, onClick }: FilterProps) => {
	return (
		<ListItem disablePadding>
			<ListItemButton role={undefined} onClick={onClick} sx={{ height: 42, padding: 0 }}>
				<Checkbox checked={selected} tabIndex={-1} disableRipple color="warning" />
				<div className="d-f fd-r ai-c gap-0.5">
					<Typography variant="body1">{value}</Typography>
					<Typography sx={{ color: "warning.main" }}>{changed ? "*" : ""}</Typography>
				</div>
			</ListItemButton>
		</ListItem>
	);
};

interface FilterGroupProps {
	data: FilterGroupGet;
	checkedFiltersIds: string[];
	changedFiltersIds: string[];
	onToggleFilter: (groupId: string, filterId: string) => void;
}

const FilterGroup = ({ data, checkedFiltersIds, changedFiltersIds, onToggleFilter }: FilterGroupProps) => {
	const expandable = data.filters.length > collapsedFiltersNumber;
	const [expanded, setExpanded] = useState(false);

	const expansionRef = useRef<HTMLDivElement>(null);
	const collapsedFilters = data.filters.slice(0, collapsedFiltersNumber);
	const expandedFilters = data.filters.slice(collapsedFiltersNumber);

	return (
		<div key={data.title} className="d-f fd-c gap-12px">
			<Typography variant="h6">{data.title}</Typography>
			<div>
				<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", padding: 0 }}>
					<div className="ps-r bg-primary" style={{ zIndex: 2 }}>
						{collapsedFilters.map((filter) => {
							return (
								<Filter
									key={filter.id}
									value={filter.value}
									selected={checkedFiltersIds.includes(filter.id)}
									changed={changedFiltersIds.includes(filter.id)}
									onClick={() => onToggleFilter(data.id, filter.id)}
								/>
							);
						})}
					</div>
					<div ref={expansionRef}>
						<Collapse mountOnEnter unmountOnExit orientation="vertical" in={expanded}>
							<div className="ps-r" style={{ zIndex: 1 }}>
								{expandedFilters.map((filter) => {
									return (
										<Filter
											key={filter.id}
											value={filter.value}
											selected={checkedFiltersIds.includes(filter.id)}
											changed={changedFiltersIds.includes(filter.id)}
											onClick={() => onToggleFilter(data.id, filter.id)}
										/>
									);
								})}
							</div>
						</Collapse>
					</div>
				</List>
				{expandable && (
					<Button onClick={() => setExpanded(!expanded)}>
						<Typography color="warning.main" sx={{ cursor: "pointer" }}>
							{expanded
								? `Скрыть(${data.filters.length - collapsedFiltersNumber})`
								: `Показать все(${data.filters.length})`}
						</Typography>
					</Button>
				)}
			</div>
		</div>
	);
};

interface CatalogFiltersProps {
	items: CatalogItem[];
	isMobile: boolean;
	preFilter?: { title: string; value: string };
	onFilter: (filteredItems: CatalogItem[]) => void;
	filtersReset?: boolean;
	setFiltersReset?: (value: boolean) => void;
}

const getInitialFilters = (filters: FilterGroupGet[]): CheckedFilterGroup[] => {
	return [...filters].map((group) => {
		return {
			id: group.id,
			filtersIds: [],
		} as CheckedFilterGroup;
	});
};

const getInitialPriceRange = (items: CatalogItemShop[]): [number, number] => {
	const prices = items.map((item) => item.price);
	return [Math.min(...prices), Math.max(...prices)];
};

export const CatalogFilters = ({
	items,
	isMobile,
	preFilter,
	onFilter,
	filtersReset,
	setFiltersReset,
}: CatalogFiltersProps) => {
	const filterGroups = useMemo(() => {
		const existingGroups: FilterGroupGet[] = [];
		for (const item of items) {
			for (const itemFilterGroup of item.product.filterGroups) {
				const existingGroup = existingGroups.find((group) => group.id === itemFilterGroup.id);
				if (existingGroup) {
					for (const filter of itemFilterGroup.filters) {
						if (!existingGroup.filters.find((groupFilter) => groupFilter.id === filter.id)) {
							existingGroup.filters.push(filter);
						}
					}
				} else {
					existingGroups.push(itemFilterGroup);
				}
			}
		}
		return existingGroups;
	}, [items]);

	const [filters, setFilters] = useState<CheckedFilterGroup[]>(getInitialFilters(filterGroups));
	const [lastFilters, setLastFilters] = useState<CheckedFilterGroup[]>(getInitialFilters(filterGroups));

	const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
	const [lastTypeFilter, setLastTypeFilter] = useState<TypeFilter>("all");

	const [priceRange, setPriceRange] = useState<PriceRange>(getInitialPriceRange(items));
	const [lastPriceRange, setLastPriceRange] = useState<PriceRange>(getInitialPriceRange(items));

	const handleResetFilters = useCallback(() => {
		const initialFilters = getInitialFilters(filterGroups);
		const initialTypeFilter = "all";
		const initialPriceRange = getInitialPriceRange(items);
		const lastFilteredItems = items.filter((item) =>
			filterCatalogItem({ item, filters: lastFilters, typeFilter: lastTypeFilter, priceRange: lastPriceRange })
		);
		setFilters(initialFilters);
		setLastFilters(initialFilters);
		setTypeFilter(initialTypeFilter);
		setLastTypeFilter(initialTypeFilter);
		setPriceRange(initialPriceRange);
		setLastPriceRange(initialPriceRange);
		if (JSON.stringify(lastFilteredItems) === JSON.stringify(items)) {
			return;
		}
		onFilter(items);
	}, [filterGroups, items, onFilter, lastFilters, lastTypeFilter, lastPriceRange]);

	useEffect(() => {
		handleResetFilters();
	}, [items, handleResetFilters]);

	useEffect(() => {
		if (filtersReset && setFiltersReset) {
			handleResetFilters();
			setFiltersReset(false);
		}
	}, [filtersReset, setFiltersReset, handleResetFilters]);

	useEffect(() => {
		const setupPreFilter = () => {
			if (!preFilter) return;
			const newFilters: CheckedFilterGroup[] = [];
			const foundFilterGroup = filterGroups.find((group) => group.title === preFilter.title);
			if (!foundFilterGroup) return;
			const foundFilter = foundFilterGroup.filters.find((filter) => filter.value === preFilter.value);
			if (!foundFilter) return;
			newFilters.push({
				id: foundFilterGroup.id,
				filtersIds: [foundFilter.id],
			});
			setFilters(newFilters);
		};

		setupPreFilter();
	}, [filterGroups, preFilter]);

	const canApplyFilters =
		JSON.stringify(filters) != JSON.stringify(lastFilters) ||
		typeFilter != lastTypeFilter ||
		JSON.stringify(priceRange) != JSON.stringify(lastPriceRange);

	function handleToggleFilter(groupId: string, filterId: string) {
		const newSelectedFilters = [...filters];
		const targetGroup = newSelectedFilters.find((group) => group.id === groupId);
		if (!targetGroup) return;
		if (targetGroup.filtersIds.includes(filterId)) {
			targetGroup.filtersIds = targetGroup.filtersIds.filter((id) => id !== filterId);
		} else {
			targetGroup.filtersIds.push(filterId);
		}
		setFilters(newSelectedFilters);
	}

	function handleChangePriceRange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		price: "min" | "max"
	) {
		const inputString = event.target.value;
		if (!/^\d+$/.test(inputString) && inputString !== "") {
			return;
		} else if (Number(inputString) < 0) {
			return;
		}
		const newPriceRange: [number, number] = [...priceRange];
		newPriceRange[price === "min" ? 0 : 1] = Number(inputString);
		setPriceRange(newPriceRange);
	}

	function handleApplyFilters() {
		const deepCopiedFilters = filters.map((filterGroup) => ({
			...filterGroup,
			filtersIds: [...filterGroup.filtersIds],
		}));
		const lastFilteredItems = items.filter((item) =>
			filterCatalogItem({ item, filters: lastFilters, typeFilter: lastTypeFilter, priceRange: lastPriceRange })
		);
		setLastFilters(deepCopiedFilters);
		setLastTypeFilter(typeFilter);
		setLastPriceRange(priceRange);
		const filteredItems = items.filter((item) => filterCatalogItem({ item, filters, typeFilter, priceRange }));
		if (JSON.stringify(filteredItems) === JSON.stringify(lastFilteredItems)) {
			return;
		}
		onFilter(filteredItems);
	}

	return (
		<div
			className="h-mc fs-0 d-f fd-c gap-3 bg-primary"
			style={{
				width: isMobile ? "100%" : 280,
				padding: "16px 15px 0 15px",
				borderRadius: 20,
			}}
		>
			<div className="d-f fd-c gap-12px">
				<Typography variant="h6">Наличие</Typography>
				<div>
					<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", padding: 0 }}>
						<ListItem disablePadding>
							<ListItemButton
								role={undefined}
								onClick={() => setTypeFilter("stock")}
								sx={{ height: 42, padding: 0 }}
							>
								<Radio checked={typeFilter === "stock"} tabIndex={-1} disableRipple color="warning" />
								<Typography variant="body1">В наличии</Typography>
							</ListItemButton>
						</ListItem>

						<ListItem disablePadding>
							<ListItemButton
								role={undefined}
								onClick={() => setTypeFilter("preorder")}
								sx={{ height: 42, padding: 0 }}
							>
								<Radio
									checked={typeFilter === "preorder"}
									tabIndex={-1}
									disableRipple
									color="warning"
								/>
								<Typography variant="body1">Предзаказ</Typography>
							</ListItemButton>
						</ListItem>

						<ListItem disablePadding>
							<ListItemButton
								role={undefined}
								onClick={() => setTypeFilter("all")}
								sx={{ height: 42, padding: 0 }}
							>
								<Radio checked={typeFilter === "all"} tabIndex={-1} disableRipple color="warning" />
								<Typography variant="body1">Показать все</Typography>
							</ListItemButton>
						</ListItem>
					</List>
				</div>
			</div>

			{filterGroups.map((group, index) => {
				const filterGroupId = group.id;
				const checkedFiltersIds = filters.find((group) => group.id === filterGroupId)?.filtersIds || [];
				const lastFiltersIds = lastFilters.find((group) => group.id === filterGroupId)?.filtersIds || [];
				const changedFilterIds = checkedFiltersIds
					.filter((id) => !lastFiltersIds.includes(id))
					.concat(lastFiltersIds.filter((id) => !checkedFiltersIds.includes(id)));
				return (
					<FilterGroup
						key={index}
						data={group}
						checkedFiltersIds={checkedFiltersIds}
						changedFiltersIds={changedFilterIds}
						onToggleFilter={handleToggleFilter}
					/>
				);
			})}

			<div className="d-f fd-c gap-12px">
				<Typography variant="h6">Цена, ₽</Typography>
				<div className="d-f fd-r gap-1 pt-1">
					<TextField
						variant="outlined"
						label="от"
						value={String(priceRange[0])}
						onChange={(event) => handleChangePriceRange(event, "min")}
						InputProps={{
							sx: {
								backgroundColor: "#F6F6F9 !important",
							},
						}}
					/>
					<TextField
						variant="outlined"
						label="до"
						value={String(priceRange[1])}
						onChange={(event) => handleChangePriceRange(event, "max")}
						InputProps={{
							sx: {
								backgroundColor: "#F6F6F9 !important",
							},
						}}
					/>
				</div>
			</div>
			<div
				className="ps-s bottom-0 w-100 d-f fd-c jc-c ai-c gap-1 py-2 bg-primary"
				style={{
					zIndex: 3,
					marginTop: "-16px",
				}}
			>
				<Button fullWidth variant={"contained"} onClick={handleApplyFilters} disabled={!canApplyFilters}>
					Применить
				</Button>
				<Button fullWidth variant={"contained"} onClick={handleResetFilters}>
					Сбросить
				</Button>
			</div>
		</div>
	);
};
