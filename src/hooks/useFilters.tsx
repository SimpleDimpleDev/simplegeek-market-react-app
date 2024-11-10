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
	priceLimits: { min: number; max: number };

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

	const { preorderIdFilter, checkedFilters } = parseFilterParams(searchParams);
	const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>(true);
	const [priceRangeFilter, setPriceRangeFilter] = useState<PriceRangeFilter>([0, Infinity]);

	useEffect(() => {
		setPriceRangeFilter([priceMin, priceMax]);
	}, [priceMin, priceMax]);

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
		priceLimits: { min: priceMin, max: priceMax },
		
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
