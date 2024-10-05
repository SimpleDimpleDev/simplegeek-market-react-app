import { FormedCart, FormedCartSection, CatalogItemCart } from "@appTypes/Cart";
import { CatalogItem } from "@appTypes/CatalogItem";
import { UserCartItem } from "@appTypes/UserItems";

interface FormCartArgs {
	catalogItems: CatalogItem[];
	userCart: UserCartItem[];
	availableItemsIds: string[];
}

export function formCart({ catalogItems, userCart, availableItemsIds }: FormCartArgs): FormedCart {
	const stockSection: FormedCartSection = {
		title: "В наличии",
		unavailable: false,
		preorder: null,
		creditAvailable: false,
		items: [],
	};
	const unavailableSection: FormedCartSection = {
		title: "Нет в наличии",
		unavailable: true,
		preorder: null,
		creditAvailable: false,
		items: [],
	};
	const preorderSections: FormedCartSection[] = [];

	for (const userCartItem of userCart) {
		const catalogItem = catalogItems.find((item) => item.id === userCartItem.id);
		if (catalogItem === undefined) {
			continue;
		}
		const item: CatalogItemCart = { ...catalogItem, quantity: userCartItem.quantity };
		const isAvailable = availableItemsIds.includes(item.id);
		if (!isAvailable) {
			unavailableSection.items.push(item);
		} else {
			const itemPreorder = item.preorder;
			if (itemPreorder !== null) {
				const preorderSection = preorderSections.find((section) => section.title === itemPreorder.title);
				const itemCreditAvailable = item.creditInfo !== null;
				if (preorderSection === undefined) {
					preorderSections.push({
						title: itemPreorder.title,
						unavailable: false,
						preorder: itemPreorder,
						creditAvailable: itemCreditAvailable,
						items: [item],
					});
				} else {
					preorderSection.items.push(item);
					if (itemCreditAvailable) {
						preorderSection.creditAvailable = true;
					}
				}
			} else {
				stockSection.items.push(item);
			}
		}
	}

	return {
		sections: [stockSection, ...preorderSections, unavailableSection],
	};
}
