import { AvailabilityFilter, CheckedFilter, FilterGroupGet, PreorderFilter, PriceRangeFilter } from "@appTypes/Filters";
import { useEffect, useRef, useState } from "react";

import {
	Typography,
	List,
	ListItem,
	ListItemButton,
	Checkbox,
	TextField,
	Button,
	Collapse,
	Radio,
} from "@mui/material";
import { PreorderShop } from "@appTypes/Preorder";
import { handleIntChange } from "@utils/input";

const collapsedFilterGroupSize = 5;

interface FilterProps {
	value: string;
	selected: boolean;
	onClick: () => void;
}

const Filter = ({ value, selected, onClick }: FilterProps) => {
	return (
		<ListItem disablePadding>
			<ListItemButton role={undefined} onClick={onClick} sx={{ height: 42, padding: 0 }}>
				<Checkbox checked={selected} tabIndex={-1} disableRipple color="warning" />
				<div className="gap-0.5 ai-c d-f fd-r">
					<Typography variant="body1">{value}</Typography>
				</div>
			</ListItemButton>
		</ListItem>
	);
};

interface FilterGroupProps {
	data: FilterGroupGet;
	checkedFiltersIds: string[];
	onToggleFilter: (groupId: string, filterId: string) => void;
}

const FilterGroup = ({ data, checkedFiltersIds, onToggleFilter }: FilterGroupProps) => {
	const expandable = data.filters.length > collapsedFilterGroupSize;
	const [expanded, setExpanded] = useState(false);

	const expansionRef = useRef<HTMLDivElement>(null);
	const collapsedFilters = data.filters.slice(0, collapsedFilterGroupSize);
	const expandedFilters = data.filters.slice(collapsedFilterGroupSize);

	return (
		<div key={data.title} className="gap-12px d-f fd-c">
			<Typography variant="h6">{data.title}</Typography>
			<div>
				<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", padding: 0 }}>
					<div className="bg-primary ps-r" style={{ zIndex: 2 }}>
						{collapsedFilters.map((filter) => {
							return (
								<Filter
									key={filter.id}
									value={filter.value}
									selected={checkedFiltersIds.includes(filter.id)}
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
								? `Скрыть(${data.filters.length - collapsedFilterGroupSize})`
								: `Показать все(${data.filters.length})`}
						</Typography>
					</Button>
				)}
			</div>
		</div>
	);
};

interface CatalogFiltersProps {
	isMobile: boolean;

	filterGroupList: FilterGroupGet[];
	preorderList: PreorderShop[];

	availabilityFilter: AvailabilityFilter;
	handleToggleAvailabilityFilter: () => void;

	preorderIdFilter: PreorderFilter;
	handleChangePreorderIdFilter: (preorderId: string | null) => void;

	checkedFilters: CheckedFilter[];
	handleToggleFilter: (filterGroupId: string, id: string) => void;

	priceRangeFilter: PriceRangeFilter;
	handleChangePriceRangeFilter: (price: "min" | "max", value: number) => void;
}

export const CatalogFilters = ({
	isMobile,

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
}: CatalogFiltersProps) => {
	const [minPrice, setMinPrice] = useState(priceRangeFilter[0]);
	const [maxPrice, setMaxPrice] = useState(priceRangeFilter[1]);

	const handleChangeMinPriceFilter = () => {
		handleChangePriceRangeFilter("min", minPrice);
	};

	const handleChangeMaxPriceFilter = () => {
		handleChangePriceRangeFilter("max", maxPrice);
	};

	useEffect(() => {
		setMinPrice(priceRangeFilter[0]);
		setMaxPrice(priceRangeFilter[1]);
	}, [priceRangeFilter]);

	return (
		<div
			className="gap-3 bg-primary p-2 h-mc d-f fd-c fs-0"
			style={{
				width: isMobile ? "100%" : 280,
				borderRadius: 20,
			}}
		>
			<div className="gap-12px d-f fd-c">
				<Typography variant="h6">Наличие</Typography>
				<div>
					<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", padding: 0 }}>
						<ListItem disablePadding>
							<ListItemButton
								role={undefined}
								onClick={handleToggleAvailabilityFilter}
								sx={{ height: 42, padding: 0 }}
							>
								<Checkbox checked={availabilityFilter} tabIndex={-1} disableRipple color="warning" />
								<Typography variant="body1">В наличии</Typography>
							</ListItemButton>
						</ListItem>
					</List>
				</div>
			</div>

			{preorderList.length > 0 && (
				<div className="gap-12px d-f fd-c">
					<Typography variant="h6">Предзаказ</Typography>
					<div>
						<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", padding: 0 }}>
							<ListItem disablePadding>
								<ListItemButton
									role={undefined}
									onClick={() => handleChangePreorderIdFilter(null)}
									sx={{ height: 42, padding: 0 }}
								>
									<Radio
										checked={preorderIdFilter === null}
										tabIndex={-1}
										disableRipple
										color="warning"
									/>
									<Typography variant="body1">Нет</Typography>
								</ListItemButton>
							</ListItem>
							{preorderList.map((preorder) => (
								<ListItem disablePadding key={preorder.id}>
									<ListItemButton
										role={undefined}
										onClick={() => handleChangePreorderIdFilter(preorder.id)}
										sx={{ height: 42, padding: 0 }}
									>
										<Radio
											checked={preorderIdFilter === preorder.id}
											tabIndex={-1}
											disableRipple
											color="warning"
										/>
										<Typography variant="body1">{preorder.title}</Typography>
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</div>
				</div>
			)}

			{filterGroupList.map((group, index) => {
				const filterGroupId = group.id;
				const checkedFiltersIds = checkedFilters
					.filter((filter) => filter.filterGroupId === filterGroupId)
					.map((filter) => filter.id);
				return (
					<FilterGroup
						key={index}
						data={group}
						checkedFiltersIds={checkedFiltersIds}
						onToggleFilter={handleToggleFilter}
					/>
				);
			})}

			<div className="gap-12px d-f fd-c">
				<Typography variant="h6">Цена, ₽</Typography>
				<div className="gap-1 pt-1 d-f fd-r">
					<TextField
						variant="outlined"
						label="от"
						value={String(minPrice)}
						onChange={handleIntChange((value) => setMinPrice(Number(value)))}
						onBlur={handleChangeMinPriceFilter}
						onKeyDown={(event) => event.key === "Enter" && handleChangeMinPriceFilter()}
						InputProps={{
							sx: {
								backgroundColor: "#F6F6F9 !important",
							},
						}}
					/>
					<TextField
						variant="outlined"
						label="до"
						value={String(maxPrice)}
						onChange={handleIntChange((value) => setMaxPrice(Number(value)))}
						onBlur={handleChangeMaxPriceFilter}
						onKeyDown={(event) => event.key === "Enter" && handleChangeMaxPriceFilter()}
						InputProps={{
							sx: {
								backgroundColor: "#F6F6F9 !important",
							},
						}}
					/>
				</div>
			</div>
		</div>
	);
};
