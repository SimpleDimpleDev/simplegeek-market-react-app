import { CatalogItem } from "@appTypes/CatalogItem";
import { Sorting } from "@appTypes/Sorting";

// Sort both sections based on the sorting criteria

const sortFunction = (a: CatalogItem, b: CatalogItem, sorting: Sorting) => {
	switch (sorting) {
		case "popular":
			return b.rating - a.rating;
		case "new":
			return b.createdAt.getTime() - a.createdAt.getTime();
		case "expensive":
			return b.price - a.price;
		case "cheap":
			return a.price - b.price;
		default:
			throw new Error(`Unknown sorting: ${sorting}`);
	}
};

export const getSortedItems = (
	items: CatalogItem[],
	availableItemIds: Set<string>,
	sorting: Sorting
): CatalogItem[] => {
	let newSortedItems;
	if (sorting !== "new") {
		newSortedItems = [...items].sort((a, b) => sortFunction(a, b, "new"));
	} else {
		newSortedItems = [...items];
	}

	const availableItems = [...newSortedItems].filter((item) => availableItemIds.has(item.id));
	const unavailableItems = [...newSortedItems].filter((item) => !availableItemIds.has(item.id));

	const sortedAvailableItems = availableItems.sort((a, b) => sortFunction(a, b, sorting));
	const sortedUnavailableItems = unavailableItems.sort((a, b) => sortFunction(a, b, sorting));

	return [...sortedAvailableItems, ...sortedUnavailableItems];
};
