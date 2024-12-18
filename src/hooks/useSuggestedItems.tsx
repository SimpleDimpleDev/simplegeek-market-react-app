import { CatalogItem } from "@appTypes/CatalogItem";
import { RootState } from "@state/store";
import { useMemo } from "react";

import { useSelector } from "react-redux";

const SUGGESTED_ITEMS_LIMIT = 10;

type useSuggestedItemsProps = {
	catalogItems: CatalogItem[];
	excludeItemIds?: string[];
};

type useSuggestedItemsReturn = {
	suggestedItems: CatalogItem[];
};

const useSuggestedItems = ({ catalogItems, excludeItemIds }: useSuggestedItemsProps): useSuggestedItemsReturn => {
	const visits = useSelector((state: RootState) => state.visits.visits);

	const suggestedItems = useMemo(() => {
		const weightedFilters: { filterGroupId: string; id: string; weight: number }[] = [];
		for (const visit of visits) {
			const catalogItem = catalogItems.find((catalogItem) => catalogItem.id === visit.id);
			if (!catalogItem) continue;
			for (const filterGroup of catalogItem.product.filterGroups) {
				for (const filter of filterGroup.filters) {
					const existingWeightedFilter = weightedFilters.find(
						(weightedFilter) =>
							weightedFilter.filterGroupId === filterGroup.id && weightedFilter.id === filter.id
					);
					if (!existingWeightedFilter) {
						weightedFilters.push({ filterGroupId: filterGroup.id, id: filter.id, weight: 1 });
					} else {
						existingWeightedFilter.weight++;
					}
				}
			}
		}
		console.log({ weightedFilters });
		const weightedItems: Array<{ item: CatalogItem; weight: number }> = [];
		for (const catalogItem of catalogItems) {
			let weight = 0;
			for (const filterGroup of catalogItem.product.filterGroups) {
				for (const filter of filterGroup.filters) {
					const weightedFilter = weightedFilters.find(
						(weightedFilter) =>
							weightedFilter.filterGroupId === filterGroup.id && weightedFilter.id === filter.id
					);
					if (weightedFilter) {
						weight += weightedFilter.weight;
					}
				}
			}
			if (weight > 0) {
				weightedItems.push({ item: catalogItem, weight });
			}
		}
		console.log({ weightedItems });
		const sortedWeightedItems = weightedItems.sort((a, b) => b.weight - a.weight);
		const suggestedItems = sortedWeightedItems
			.slice(0, SUGGESTED_ITEMS_LIMIT)
			.map((weightedItem) => weightedItem.item);
        //TODO: excludeItemIds
		if (excludeItemIds !== undefined) {
			return suggestedItems.filter((item) => !excludeItemIds.includes(item.id));
		}
		return suggestedItems;
	}, [catalogItems, visits, excludeItemIds]);

	return { suggestedItems };
};

export { useSuggestedItems };
