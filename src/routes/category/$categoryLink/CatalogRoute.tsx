import Catalog from "@components/Catalog";
import { CatalogItem } from "@appTypes/CatalogItem";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo } from "react";
import { useGetCatalogQuery } from "@api/shop/catalog";

export function Component() {
	const params = useParams();

	const { data: catalog, isLoading: catalogIsLoading } = useGetCatalogQuery(void 0);
	const category = useMemo(() => {
		if (!catalog || !params.categoryLink) return undefined;
		return catalog.categories.find((category) => category.link === params.categoryLink);
	}, [catalog, params.categoryLink]);

	useEffect(() => {
		if (!catalogIsLoading && catalog) {
			if (!category) {
				throw new Response("", { status: 404 });
			}
		}
	}, [catalog, catalogIsLoading, category]);

	const sectionFilter = useCallback(
		(item: CatalogItem) => {
			return item.product.category.link === params.categoryLink;
		},
		[params]
	);

	return (
		<Catalog
			sectionFilter={sectionFilter}
			path={[
				{ title: "Каталог", link: "/" },
				{ title: "Категории", link: "/category" },
			]}
			current={category?.title ?? ""}
		/>
	);
}
