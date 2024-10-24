import { CatalogItem } from "@appTypes/CatalogItem";
import { Sorting } from "@appTypes/Sorting";
import { getSortedItems } from "@utils/sorting";
import { useMemo, useRef } from "react";

type UseItemsToRenderProps = {
	items: CatalogItem[] | undefined;
	availableItemIds: Set<string> | undefined;
	filterFunction: (item: CatalogItem) => boolean;
	sorting: Sorting;
};

type UseItemsToRenderReturn = {
	itemsToRender: CatalogItem[] | undefined;
};

const useItemsToRender = ({ items, availableItemIds, filterFunction, sorting }: UseItemsToRenderProps): UseItemsToRenderReturn => {
	const prevItemsToRender = useRef<CatalogItem[] | undefined>(undefined);

	const itemsToRender = useMemo(() => {
		if (items === undefined) return undefined;
		if (availableItemIds === undefined) return undefined;
		const filteredItems = items.filter(filterFunction);
		const newItemsToRender = getSortedItems(filteredItems, availableItemIds, sorting);
		if (
			JSON.stringify(newItemsToRender) ===
			JSON.stringify(prevItemsToRender.current)
		) {
			return prevItemsToRender.current;
		}
		prevItemsToRender.current = newItemsToRender;
		return newItemsToRender;
	}, [items, availableItemIds, filterFunction, sorting]);

	return { itemsToRender };
};

export { useItemsToRender };
