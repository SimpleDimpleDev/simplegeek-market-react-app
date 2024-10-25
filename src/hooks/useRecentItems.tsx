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
		const datedRecentItems: Array<{ item: CatalogItem; date: Date }> = [];
		for (const visit of visits) {
			const catalogItem = catalogItems.find((catalogItem) => catalogItem.id === visit.id);
			if (!catalogItem) continue;
			datedRecentItems.push({
				item: catalogItem,
				date: visit.lastVisit,
			});
		}
		const recentItems = datedRecentItems
			.sort((a, b) => b.date.getTime() - a.date.getTime())
			.map((weightedItem) => weightedItem.item)
			.slice(0, RECENT_ITEMS_LIMIT);
		return recentItems;
	}, [catalogItems, visits]);

	return { recentItems };
};

export { useRecentItems };
