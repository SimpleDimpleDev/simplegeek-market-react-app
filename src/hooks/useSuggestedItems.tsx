import { CatalogItem } from "@appTypes/CatalogItem";
import { RootState } from "@state/store";
import { useMemo } from "react";

import { useSelector } from "react-redux";

const SUGGESTED_ITEMS_LIMIT = 10;

type useSuggestedItemsProps = {
	catalogItems: CatalogItem[];
};

type useSuggestedItemsReturn = {
	suggestedItems: CatalogItem[];
};

const useSuggestedItems = ({ catalogItems }: useSuggestedItemsProps): useSuggestedItemsReturn => {
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
		const sortedWeightedItems = weightedItems.sort((a, b) => b.weight - a.weight);
		return sortedWeightedItems
			.filter((sortedWeightedItem) => !visits.some((visit) => visit.id === sortedWeightedItem.item.id))
			.slice(0, SUGGESTED_ITEMS_LIMIT)
			.map((weightedItem) => weightedItem.item);
	}, [catalogItems, visits]);

	return { suggestedItems };
};

export { useSuggestedItems };
