import Catalog from "@components/Catalog";
import { CatalogItem } from "@appTypes/CatalogItem";
import { useCallback } from "react";
import { isCatalogItemMatchQuery } from "@utils/search";
import { useSearchParams } from "react-router-dom";

export function Component() {
	const searchParams = useSearchParams();
	const query = searchParams[0].get("q") || "";

	const sectionFilter = useCallback(
		(item: CatalogItem) => {
			return isCatalogItemMatchQuery(item, query);
		},
		[query]
	);

	return <Catalog sectionFilter={sectionFilter} />;
}
