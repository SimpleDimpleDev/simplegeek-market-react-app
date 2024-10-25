import { CatalogItem } from "@appTypes/CatalogItem";
import { RootState } from "@state/store";
import { useMemo } from "react";

import { useSelector } from "react-redux";

const RECENT_ITEMS_LIMIT = 10;

type useRecentItemsProps = {
	catalogItems: CatalogItem[];
};

type useRecentItemsReturn = {
	recentItems: CatalogItem[];
};

const useRecentItems = ({ catalogItems }: useRecentItemsProps): useRecentItemsReturn => {
	const visits = useSelector((state: RootState) => state.visits.visits);
	const recentItems = useMemo(() => {
		const weightedRecentItems: Array<{ item: CatalogItem; weight: number }> = [];
		for (const visit of visits) {
			const catalogItem = catalogItems.find((catalogItem) => catalogItem.id === visit.id);
			if (!catalogItem) continue;
			weightedRecentItems.push({
				item: catalogItem,
				weight: visit.visitsCount,
			});
		}
		const recentItems = weightedRecentItems
			.sort((a, b) => b.weight - a.weight)
			.map((weightedItem) => weightedItem.item);
		return recentItems.slice(0, RECENT_ITEMS_LIMIT);
	}, [catalogItems, visits]);

	return { recentItems };
};

export { useRecentItems };
