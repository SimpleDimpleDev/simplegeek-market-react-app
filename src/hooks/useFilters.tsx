import { CatalogItem } from "@appTypes/CatalogItem";
import {
	AvailabilityFilter,
	CheckedFilter,
	FilterGroupGet,
	PreorderFilter,
	PriceRangeFilter,
	TypeFilter,
} from "@appTypes/Filters";
import { PreorderShop } from "@appTypes/Preorder";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const setTypeFilterParam = (searchParams: URLSearchParams, typeFilter: TypeFilter): void => {
	searchParams.set("t", typeFilter);
};

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
): { typeFilter: TypeFilter; preorderIdFilter: PreorderFilter; checkedFilters: CheckedFilter[] } => {
	let typeFilter: TypeFilter = "STOCK";
	let preorderFilter: PreorderFilter = null;
	const checkedFilters: CheckedFilter[] = [];

	const typeParam = searchParams.get("t");
	if (typeParam && (typeParam === "PREORDER" || typeParam === "STOCK")) {
		typeFilter = typeParam;
	}

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
		typeFilter,
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
	priceLimits: { min: number; max: number };

	availabilityFilter: AvailabilityFilter;
	handleToggleAvailabilityFilter: () => void;

	typeFilter: TypeFilter;
	handleChangeTypeFilter: (type: TypeFilter) => void;

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

		// Create a map to track existing filter groups by their IDs
		const groupMap = new Map<string, FilterGroupGet>();

		items.forEach((item) => {
			item.product.filterGroups.forEach((itemFilterGroup) => {
				// Check if the group already exists in the map
				if (groupMap.has(itemFilterGroup.id)) {
					// If it exists, merge the filters immutably
					const existingGroup = groupMap.get(itemFilterGroup.id);

					// Check if existingGroup is defined
					if (existingGroup) {
						const existingFilters = new Set(existingGroup.filters.map((filter) => filter.id));

						// Create a new array of filters that includes the existing ones and adds new ones
						const mergedFilters = [
							...existingGroup.filters,
							...itemFilterGroup.filters.filter((filter) => !existingFilters.has(filter.id)),
						];

						// Update the map with a new object
						groupMap.set(itemFilterGroup.id, {
							...existingGroup,
							filters: mergedFilters as [
								{ id: string; value: string },
								...{ id: string; value: string }[]
							],
						});
					}
				} else {
					// If it doesn't exist, add it to the map
					groupMap.set(itemFilterGroup.id, { ...itemFilterGroup });
				}
			});
		});

		// Convert the map values back to an array
		return Array.from(groupMap.values());
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

	const priceMin = useMemo(() => 0, []);
	const priceMax = useMemo(() => Math.max(...(items?.map((item) => item.price) || [Infinity])), [items]);

	const { typeFilter, preorderIdFilter, checkedFilters } = parseFilterParams(searchParams);
	const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>(true);
	const [priceRangeFilter, setPriceRangeFilter] = useState<PriceRangeFilter>([0, Infinity]);

	useEffect(() => {
		setPriceRangeFilter([priceMin, priceMax]);
	}, [priceMin, priceMax]);

	const setTypeFilter = useCallback(
		(type: TypeFilter) => {
			setSearchParams(
				(prevSearchParams) => {
					const newSearchParams = new URLSearchParams(prevSearchParams);
					setTypeFilterParam(newSearchParams, type);
					return newSearchParams;
				},
				{ replace: true, preventScrollReset: true }
			);
		},
		[setSearchParams]
	);

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
				{ replace: true, preventScrollReset: true }
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
				{ replace: true, preventScrollReset: true }
			);
		},
		[setSearchParams]
	);

	const handleToggleAvailabilityFilter = useCallback(() => {
		setAvailabilityFilter((value) => !value);
	}, []);

	const handleChangeTypeFilter = useCallback(
		(type: TypeFilter) => {
			if (type === "STOCK") {
				setPreorderIdFilter(null);
			}
			setTypeFilter(type);
		},
		[setTypeFilter, setPreorderIdFilter]
	);

	const handleChangePreorderIdFilter = useCallback(
		(preorderId: string | null) => {
			setPreorderIdFilter(preorderId);
		},
		[setPreorderIdFilter]
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

			//type
			if (typeFilter === "STOCK" && item.preorder !== null) return false;
			if (typeFilter === "PREORDER" && item.preorder === null) return false;

			// preorder
			if (preorderIdFilter !== null && preorderList.some((preorder) => preorder.id === preorderIdFilter)) {
				const itemPreorder = item.preorder;
				if (itemPreorder === null) return false;
				if (itemPreorder.id !== preorderIdFilter) return false;
			}

			// filters
			if (checkedFilters.length !== 0) {
				const itemFilterGroups = item.product.filterGroups;
				let filterMatched = false;

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
					if (!itemFilterGroup) continue;

					if (itemFilterGroup.filters.find((groupFilter) => groupFilter.id === checkedFilter.id)) {
						filterMatched = true;
						break;
					}
				}

				if (!filterMatched) return false;
			}

			// price
			if (item.price < priceRangeFilter[0] || item.price > priceRangeFilter[1]) return false;

			return true;
		},
		[
			availableItemIds,
			typeFilter,
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
				setTypeFilterParam(newSearchParams, "STOCK");
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
		priceLimits: { min: priceMin, max: priceMax },

		availabilityFilter,
		handleToggleAvailabilityFilter,

		typeFilter,
		handleChangeTypeFilter,

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
