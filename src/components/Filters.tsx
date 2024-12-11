import { AvailabilityFilter, CheckedFilter, FilterGroupGet, PreorderFilter, PriceRangeFilter } from "@appTypes/Filters";
import { useState } from "react";

import {
	Typography,
	List,
	ListItem,
	ListItemButton,
	Checkbox,
	TextField,
	Button,
	Collapse,
	ListItemText,
} from "@mui/material";
import { PreorderShop } from "@appTypes/Preorder";
import { handleIntChange } from "@utils/input";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface FilterGroupProps {
	data: FilterGroupGet;
	checkedFiltersIds: string[];
	onToggleFilter: (groupId: string, filterId: string) => void;
	defaultExpanded?: boolean;
}

const FilterGroup = ({ data, checkedFiltersIds, onToggleFilter, defaultExpanded = false }: FilterGroupProps) => {
	const [expanded, setExpanded] = useState(defaultExpanded ? true : checkedFiltersIds.length > 0);

	return (
		<>
			<ListItemButton key={data.title} onClick={() => setExpanded(!expanded)}>
				<ListItemText disableTypography primary={<Typography variant="subtitle0">{data.title}</Typography>} />
				{expanded ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>
			<Collapse mountOnEnter unmountOnExit orientation="vertical" in={expanded}>
				<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", padding: 0 }}>
					{data.filters.map((filter) => {
						return (
							<ListItem key={filter.id} disablePadding>
								<ListItemButton
									role={undefined}
									onClick={() => onToggleFilter(data.id, filter.id)}
									sx={{ height: 42, padding: 0 }}
								>
									<Checkbox
										checked={checkedFiltersIds.includes(filter.id)}
										tabIndex={-1}
										disableRipple
										color="warning"
									/>
									<div className="gap-0.5 ai-c d-f fd-r">
										<Typography variant="body1">{filter.value}</Typography>
									</div>
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>
			</Collapse>
		</>
	);
};

interface CatalogFiltersProps {
	isMobile: boolean;

	filterGroupList: FilterGroupGet[];
	preorderList: PreorderShop[];
	priceLimits: { min: number; max: number };

	availabilityFilter: AvailabilityFilter;
	handleToggleAvailabilityFilter: () => void;

	preorderIdFilter: PreorderFilter;
	handleChangePreorderIdFilter: (preorderId: string | null) => void;

	checkedFilters: CheckedFilter[];
	handleToggleFilter: (filterGroupId: string, id: string) => void;

	priceRangeFilter: PriceRangeFilter;
	handleChangePriceRangeFilter: (price: "min" | "max", value: number) => void;

	onResetFilters: () => void;
	onCloseFilters?: () => void;
}

export const CatalogFilters = ({
	isMobile,

	filterGroupList,
	preorderList,
	priceLimits,

	availabilityFilter,
	handleToggleAvailabilityFilter,

	preorderIdFilter,
	handleChangePreorderIdFilter,

	checkedFilters,
	handleToggleFilter,

	priceRangeFilter,
	handleChangePriceRangeFilter,

	onResetFilters,
	onCloseFilters,
}: CatalogFiltersProps) => {
	const handleChangeMinPriceFilter = (value: number) => {
		handleChangePriceRangeFilter("min", value);
	};

	const handleChangeMaxPriceFilter = (value: number) => {
		handleChangePriceRangeFilter("max", value);
	};

	return (
		<div className="gap-1 bg-primary pt-2 w-100 h-mc br-3 d-f fd-c fs-0">
			<List
				sx={{
					width: "100%",
					maxWidth: isMobile ? "100%" : 360,
					bgcolor: "background.paper",
					padding: 0,
					maxHeight: "68lvh",
					overflowY: "auto",
				}}
			>
				<ListItem disablePadding>
					<ListItemButton
						role={undefined}
						onClick={handleToggleAvailabilityFilter}
						sx={{ height: 42, padding: 0 }}
					>
						<Checkbox checked={availabilityFilter} tabIndex={-1} disableRipple color="warning" />
						<Typography variant="subtitle0">В наличии</Typography>
					</ListItemButton>
				</ListItem>

				{preorderList.length > 0 && (
					<FilterGroup
						data={{
							id: "preorder",
							title: "Предзаказ",
							filters: preorderList.map((preorder) => ({ id: preorder.id, value: preorder.title })) as [
								{ id: string; value: string },
								...{ id: string; value: string }[]
							],
						}}
						checkedFiltersIds={preorderIdFilter ? [preorderIdFilter] : []}
						onToggleFilter={(_, id) => handleChangePreorderIdFilter(id)}
					/>
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
			</List>

			<div className="gap-2 p-2 d-f fd-c">
				<div className="gap-05 d-f fd-c">
					<Typography variant="subtitle0">Цена, ₽</Typography>
					<div className="gap-1 pt-1 d-f fd-r">
						<TextField
							variant="outlined"
							label="от"
							value={String(priceRangeFilter[0])}
							onChange={handleIntChange(
								(value) => handleChangeMinPriceFilter(Number(value)),
								priceLimits.min,
								priceLimits.max
							)}
							slotProps={{
								input: {
									sx: {
										backgroundColor: "#F6F6F9 !important",
									},
								},
							}}
						/>
						<TextField
							variant="outlined"
							label="до"
							value={String(priceRangeFilter[1])}
							onChange={handleIntChange(
								(value) => handleChangeMaxPriceFilter(Number(value)),
								priceLimits.min,
								priceLimits.max
							)}
							slotProps={{
								input: {
									sx: {
										backgroundColor: "#F6F6F9 !important",
									},
								},
							}}
						/>
					</div>
				</div>

				<div className="gap-1 d-f fd-c">
					{isMobile && (
						<Button
							variant="contained"
							onClick={() => {
								if (onCloseFilters) onCloseFilters();
							}}
						>
							Применить
						</Button>
					)}
					<Button color="tertiary" variant="outlined" onClick={() => onResetFilters()}>
						Сбросить
					</Button>
				</div>
			</div>
		</div>
	);
};
