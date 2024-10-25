import { CatalogItem } from "@appTypes/CatalogItem";
import { useMemo } from "react";

const SIMILAR_ITEMS_LIMIT = 10;

type useSimilarItemsProps = {
	catalogItems: CatalogItem[];
	itemId: string;
};

type useSimilarItemsReturn = {
	similarItems: CatalogItem[];
};

const useSimilarItems = ({ catalogItems, itemId }: useSimilarItemsProps): useSimilarItemsReturn => {
	const similarItems = useMemo(() => {
		const itemFilters: { filterGroupId: string; id: string }[] = [];
		const catalogItem = catalogItems.find((catalogItem) => catalogItem.id === itemId);
		if (!catalogItem) return [];
		for (const filterGroup of catalogItem.product.filterGroups) {
			for (const filter of filterGroup.filters) {
				itemFilters.push({ filterGroupId: filterGroup.id, id: filter.id });
			}
		}

		const weightedItems: Array<{ item: CatalogItem; weight: number }> = [];
		for (const catalogItem of catalogItems) {
			let weight = 0;
			for (const filterGroup of catalogItem.product.filterGroups) {
				for (const filter of filterGroup.filters) {
					const itemFilter = itemFilters.find(
						(itemFilter) => itemFilter.filterGroupId === filterGroup.id && itemFilter.id === filter.id
					);
					if (itemFilter) {
						weight += 1;
					}
				}
			}
			if (weight > 0) {
				weightedItems.push({ item: catalogItem, weight });
			}
		}
		console.log({ weightedItems });
		const sortedWeightedItems = weightedItems.sort((a, b) => b.weight - a.weight);
		const similarItems = sortedWeightedItems
			.filter((similarItem) => similarItem.item.id !== itemId)
			.slice(0, SIMILAR_ITEMS_LIMIT)
			.map((weightedItem) => weightedItem.item);

		return similarItems;
	}, [catalogItems, itemId]);

	return { similarItems };
};

export { useSimilarItems };
