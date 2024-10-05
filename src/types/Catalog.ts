import { CatalogItem } from "./CatalogItem";
import { CategoryShop } from "./Category";
import { PublicationShop } from "./Publication";

export type Catalog = {
	publications: PublicationShop[];
	items: CatalogItem[];
	categories: CategoryShop[];
};
