import { CatalogItem } from "@appTypes/CatalogItem";
import { AvailabilityFilter, CheckedFilter, FilterGroupGet, PreorderFilter, PriceRangeFilter } from "@appTypes/Filters";
import { PreorderShop } from "@appTypes/Preorder";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const setPreorderFilterParam = (searchParams: URLSearchParams, preorderFilter: PreorderFilter): void => {
	if (!preorderFilter) return;
	searchParams.set("p", preorderFilter);
};

const setFiltersParam = (searchParams: URLSearchParams, checkedFilters: CheckedFilter[]): void => {
	if (!checkedFilters.length) return;
	for (const filter of checkedFilters) {
		searchParams.set("f[]", `${filter.filterGroupId}:${filter.id}`);
	}
};

const parseFilterParams = (
	searchParams: URLSearchParams
): { preorderFilter: PreorderFilter; checkedFilters: CheckedFilter[] } => {
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
		preorderFilter,
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
	handleChangePriceRangeFilter: (
		price: "min" | "max",
        value: number
	) => void;

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

	const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>(true);
	const [preorderIdFilter, setPreorderIdFilter] = useState<PreorderFilter>(null);
	const [checkedFilters, setCheckedFilters] = useState<CheckedFilter[]>([]);
	const [priceRangeFilter, setPriceRangeFilter] = useState<PriceRangeFilter>([
		0,
		items.map((item) => item.price).reduce((a, b) => Math.max(a, b), 0),
	]);

	useEffect(() => {
		const { preorderFilter, checkedFilters } = parseFilterParams(searchParams);
		setPreorderIdFilter(preorderFilter);
		setCheckedFilters(checkedFilters);
	}, [searchParams, items]);

	useEffect(() => {
		setSearchParams((prev) => {
			setFiltersParam(prev, checkedFilters);
			return prev;
		});
	}, [setSearchParams, checkedFilters]);

	useEffect(() => {
		setSearchParams((prev) => {
			setPreorderFilterParam(prev, preorderIdFilter);
			return prev;
		});
	}, [setSearchParams, preorderIdFilter]);

	const handleToggleFilter = useCallback((filterGroupId: string, id: string) => {
		setCheckedFilters((currentFilters) => {
			const newCheckedFilters = [...currentFilters];
			const index = newCheckedFilters.findIndex(
				(filter) => filter.filterGroupId === filterGroupId && filter.id === id
			);
			if (index === -1) {
				newCheckedFilters.push({ filterGroupId, id });
			} else {
				newCheckedFilters.splice(index, 1);
			}
			return newCheckedFilters;
		});
	}, []);

	const handleToggleAvailabilityFilter = useCallback(() => {
		setAvailabilityFilter((value) => !value);
	}, []);

	const handleChangePreorderIdFilter = useCallback((preorderId: string | null) => {
		setPreorderIdFilter(preorderId);
	}, []);

	const handleChangePriceRangeFilter = useCallback(
		(price: "min" | "max", value: number) => {
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
		},
		[]
	);

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
    }, [items]);

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
