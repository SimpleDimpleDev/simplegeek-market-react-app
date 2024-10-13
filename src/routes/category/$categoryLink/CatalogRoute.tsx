import Catalog from "@components/Catalog";
import { CatalogItem } from "@appTypes/CatalogItem";
import { useParams } from "react-router-dom";
import { useCallback } from "react";

export function Component() {
	const params = useParams();

	const sectionFilter = useCallback(
		(item: CatalogItem) => {
			return item.product.category.link === params.categoryLink;
		},
		[params]
	);

	return <Catalog sectionFilter={sectionFilter} />;
}
