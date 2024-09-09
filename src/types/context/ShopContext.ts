import { ClientShopApiClient } from "~/api/shop/client";

import { ItemsActions } from "../ItemsActions";
import { UserItems } from "../UserItems";
import { RootContext } from "./RootContext";
import { PublicationShop } from "../Publication";
import { CatalogItem } from "../CatalogItem";
import { CategoryShop } from "../Category";

export interface ShopContext extends RootContext {
	userItems: UserItems;
	userItemsIsLoading: boolean;
	userItemsActions: ItemsActions;
	publications: PublicationShop[];
	categories: CategoryShop[];
	catalogItems: CatalogItem[];
	shopApiClient: ClientShopApiClient;
}
