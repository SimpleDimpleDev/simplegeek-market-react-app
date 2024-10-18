import { CatalogItem } from "./CatalogItem";
import { CategoryGet } from "./Category";
import { PublicationGet } from "./Publication";

export type Catalog = {
	publications: PublicationGet[];
	items: CatalogItem[];
	categories: CategoryGet[];
};
