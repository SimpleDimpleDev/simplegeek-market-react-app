import { CatalogItem } from "@appTypes/CatalogItem";
import { AvailabilityFilter, CheckedFilter, FilterGroupGet, PreorderFilter, PriceRangeFilter } from "@appTypes/Filters";
import { PreorderShop } from "@appTypes/Preorder";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const setPreorderFilterParam = (searchParams: URLSearchParams, preorderFilter: PreorderFilter): void => {
	if (!preorderFilter) {
		searchParams.delete("p");
		return;
	}
	searchParams.set("p", preorderFilter);
};

const setFiltersParam = (searchParams: URLSearchParams, checkedFilters: CheckedFilter[]): void => {
	if (!checkedFilters.length) {
		searchParams.delete("f[]");
		return;
	}
	for (const filter of checkedFilters) {
		searchParams.set("f[]", `${filter.filterGroupId}:${filter.id}`);
	}
};

const parseFilterParams = (
	searchParams: URLSearchParams
): { preorderIdFilter: PreorderFilter; checkedFilters: CheckedFilter[] } => {
	let preorderFilter: PreorderFilter = null;
	const checkedFilters: CheckedFilter[] = [];

	const preorderIdParam = searchParams.get("p");
	if (preorderIdParam) {
		preorderFilter = preorderIdParam;
	}

	const filtersParam = searchParams.getAll("f[]");
	if (filtersParam.length) {
		for (const filter of filtersParam) {
			const [filterGroupId, id] = filter.split(":");
			checkedFilters.push({
				filterGroupId,
				id,
			});
		}
	}

	return {
		preorderIdFilter: preorderFilter,
		checkedFilters,
	};
};

interface useFiltersArgs {
	items: CatalogItem[];
	availableItemIds: string[];
}

interface useFiltersReturn {
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

	filterFunction: (item: CatalogItem) => boolean;
	resetFilters: () => void;
}

function useFilters({ items, availableItemIds }: useFiltersArgs): useFiltersReturn {
	const [searchParams, setSearchParams] = useSearchParams();

	const filterGroupList: FilterGroupGet[] = useMemo(() => {
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

	const preorderList: PreorderShop[] = useMemo(() => {
		const existingPreorderList: PreorderShop[] = [];
		for (const item of items) {
			const itemPreorder = item.preorder;
			if (itemPreorder !== null && !existingPreorderList.includes(itemPreorder)) {
				existingPreorderList.push(itemPreorder);
			}
		}
		return existingPreorderList;
	}, [items]);

	const { preorderIdFilter, checkedFilters } = parseFilterParams(searchParams);
	const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>(true);
	const [priceRangeFilter, setPriceRangeFilter] = useState<PriceRangeFilter>([0, 0]);

	useEffect(() => {
		setPriceRangeFilter((range) => [range[0], items.map((item) => item.price).reduce((a, b) => a + b, 0)]);
	}, [items]);

	const setPreorderIdFilter = useCallback(
		(preorderId: string | null) => {
			setSearchParams((prevSearchParams) => {
				const newSearchParams = new URLSearchParams(prevSearchParams);
				setPreorderFilterParam(newSearchParams, preorderId);
				return newSearchParams;
			});
		},
		[setSearchParams]
	);

	const setCheckedFilters = useCallback(
		(checkedFilters: CheckedFilter[]) => {
			setSearchParams((prevSearchParams) => {
				const newSearchParams = new URLSearchParams(prevSearchParams);
				setFiltersParam(newSearchParams, checkedFilters);
				return newSearchParams;
			});
		},
		[setSearchParams]
	);

	const handleToggleFilter = useCallback(
		(filterGroupId: string, id: string) => {
			const newCheckedFilters = [...checkedFilters];
			const index = newCheckedFilters.findIndex(
				(filter) => filter.filterGroupId === filterGroupId && filter.id === id
			);
			if (index === -1) {
				newCheckedFilters.push({ filterGroupId, id });
			} else {
				newCheckedFilters.splice(index, 1);
			}
			setCheckedFilters(newCheckedFilters);
		},
		[checkedFilters, setCheckedFilters]
	);

	const handleToggleAvailabilityFilter = useCallback(() => {
		setAvailabilityFilter((value) => !value);
	}, []);

	const handleChangePreorderIdFilter = useCallback(
		(preorderId: string | null) => {
			setPreorderIdFilter(preorderId);
		},
		[setPreorderIdFilter]
	);

	const handleChangePriceRangeFilter = useCallback((price: "min" | "max", value: number) => {
		switch (price) {
			case "min": {
				setPriceRangeFilter((range) => [value, range[1]]);
				break;
			}
			case "max": {
				setPriceRangeFilter((range) => [range[0], value]);
				break;
			}
		}
	}, []);

	const filterFunction = useCallback(
		(item: CatalogItem) => {
			// availability
			if (availabilityFilter && !availableItemIds.includes(item.id)) return false;

			// preorder
			if (preorderIdFilter !== null) {
				const itemPreorder = item.preorder;
				if (itemPreorder === null) return false;
				if (itemPreorder.id !== preorderIdFilter) return false;
			}

			// filters
			if (checkedFilters.length !== 0) {
				const itemFilterGroups = item.product.filterGroups;
				for (const filter of checkedFilters) {
					const itemFilterGroup = itemFilterGroups.find((group) => group.id === filter.filterGroupId);
					if (!itemFilterGroup) return false;
					if (!itemFilterGroup.filters.find((groupFilter) => groupFilter.id === filter.id)) return false;
				}
			}

			// price
			if (item.price < priceRangeFilter[0] || item.price > priceRangeFilter[1]) {
				return false;
			}

			return true;
		},
		[availableItemIds, availabilityFilter, preorderIdFilter, checkedFilters, priceRangeFilter]
	);

	const resetFilters = useCallback(() => {
		setCheckedFilters([]);
		setPreorderIdFilter(null);
		setAvailabilityFilter(true);
		setPriceRangeFilter([0, items.map((item) => item.price).reduce((a, b) => Math.max(a, b), 0)]);
	}, [items, setCheckedFilters, setPreorderIdFilter]);

	return {
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
	};
}

export { useFilters };
