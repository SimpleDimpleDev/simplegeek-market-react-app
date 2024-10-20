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
	searchParams.delete("f[]");
	if (checkedFilters.length === 0) return;
	for (const filter of checkedFilters) {
		searchParams.append("f[]", `${filter.filterGroupId}:${filter.id}`);
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
	items: CatalogItem[] | undefined;
	availableItemIds: Set<string> | undefined;
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
		if (!items) return [];
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
		if (!items) return [];
		const existingPreorderList: PreorderShop[] = [];
		for (const item of items) {
			const itemPreorder = item.preorder;
			if (itemPreorder !== null && !existingPreorderList.some((preorder) => preorder.id === itemPreorder.id)) {
				existingPreorderList.push(itemPreorder);
			}
		}
		return existingPreorderList;
	}, [items]);

	const { preorderIdFilter, checkedFilters } = parseFilterParams(searchParams);
	const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>(true);
	const [priceRangeFilter, setPriceRangeFilter] = useState<PriceRangeFilter>([0, Infinity]);

	useEffect(() => {
		setPriceRangeFilter([0, Math.max(...(items?.map((item) => item.price) || [Infinity]))]);
	}, [items]);

	const setPreorderIdFilter = useCallback(
		(preorderId: string | null) => {
			setSearchParams(
				(prevSearchParams) => {
					const { preorderIdFilter: prevPreorderIdFilter } = parseFilterParams(prevSearchParams);

					const newSearchParams = new URLSearchParams(prevSearchParams);

					if (prevPreorderIdFilter === preorderId) {
						setPreorderFilterParam(newSearchParams, null);
					} else {
						setPreorderFilterParam(newSearchParams, preorderId);
					}
					return newSearchParams;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	const setCheckedFilters = useCallback(
		(checkedFilters: CheckedFilter[]) => {
			setSearchParams(
				(prevSearchParams) => {
					const newSearchParams = new URLSearchParams(prevSearchParams);
					setFiltersParam(newSearchParams, checkedFilters);
					return newSearchParams;
				},
				{ replace: true }
			);
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
			if (availableItemIds !== undefined) {
				if (availabilityFilter && !availableItemIds.has(item.id)) return false;
			}

			// preorder
			if (preorderIdFilter !== null && preorderList.some((preorder) => preorder.id === preorderIdFilter)) {
				const itemPreorder = item.preorder;

				if (itemPreorder === null) return false;

				if (itemPreorder.id !== preorderIdFilter) return false;
			}

			// filters
			if (checkedFilters.length !== 0) {
				const itemFilterGroups = item.product.filterGroups;
				for (const checkedFilter of checkedFilters) {
					// check if filter group and filter exists
					const existingFilterGroup = filterGroupList.find(
						(group) => group.id === checkedFilter.filterGroupId
					);
					if (
						!existingFilterGroup ||
						!existingFilterGroup.filters.some((groupFilter) => groupFilter.id === checkedFilter.id)
					)
						continue;

					const itemFilterGroup = itemFilterGroups.find((group) => group.id === checkedFilter.filterGroupId);
					if (!itemFilterGroup) return false;

					if (!itemFilterGroup.filters.find((groupFilter) => groupFilter.id === checkedFilter.id))
						return false;
				}
			}

			// price
			if (item.price < priceRangeFilter[0] || item.price > priceRangeFilter[1]) return false;

			return true;
		},
		[
			availableItemIds,
			availabilityFilter,
			preorderList,
			preorderIdFilter,
			filterGroupList,
			checkedFilters,
			priceRangeFilter,
		]
	);

	const resetFilters = useCallback(() => {
		setSearchParams(
			(prevSearchParams) => {
				const newSearchParams = new URLSearchParams(prevSearchParams);
				setPreorderFilterParam(newSearchParams, null);
				setFiltersParam(newSearchParams, []);
				return newSearchParams;
			},
			{ replace: true }
		);
		setAvailabilityFilter(true);
		setPriceRangeFilter([0, Math.max(...(items?.map((item) => item.price) || [0]))]);
	}, [items, setSearchParams]);

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
