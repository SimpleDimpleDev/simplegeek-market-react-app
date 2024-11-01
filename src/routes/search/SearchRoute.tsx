import { CatalogItem } from "@appTypes/CatalogItem";
import Catalog from "@components/Catalog";
import { Empty } from "@components/Empty";
import { Search as SearchIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import { isCatalogItemMatchQuery } from "@utils/search";
import { useCallback } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";

export function Component() {
	const navigate = useNavigate();
	const searchParams = useSearchParams();
	const query = searchParams[0].get("q") || "";

	const sectionFilter = useCallback((item: CatalogItem) => isCatalogItemMatchQuery(item, query), [query]);

	return (
		<>
			<Helmet>
				<title>SimpleGeek | Поиск</title>
			</Helmet>
			<Catalog
				sectionFilter={sectionFilter}
				current={`Поиск по запросу "${query}"`}
				path={[{ title: "Каталог", link: "/" }]}
				emptyElement={
					<Empty
						title={`По запросу "${query}" ничего не найдено.`}
						description="Попробуйте изменить параметры поиска."
						icon={<SearchIcon sx={{ height: 96, width: 96 }} />}
						button={<Button onClick={() => navigate("/")}>На главную</Button>}
					/>
				}
			/>
		</>
	);
}
