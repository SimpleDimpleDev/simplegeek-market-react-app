import Catalog from "@components/Catalog";
import { CatalogItem } from "@appTypes/CatalogItem";
import { useParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { useGetCatalogQuery } from "@api/shop/catalog";

export function Component() {
	const params = useParams();

	const { data: catalog } = useGetCatalogQuery(void 0);
	const categoryTitle = useMemo(() => {
		if (!catalog || !params.categoryLink) return "";
		const category = catalog.categories.find(
			(category) => category.link === params.categoryLink
		)
		return category?.title || ""
	}, [catalog, params.categoryLink]);

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
			current={categoryTitle}
		/>
	);
}
