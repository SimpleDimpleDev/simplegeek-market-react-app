import Catalog from "@components/Catalog";
import { Empty } from "@components/Empty";
import { Search } from "@mui/icons-material";
import { useCallback } from "react";
import { Helmet } from "react-helmet";

export function Component() {
	const sectionFilter = useCallback(() => true, []);

	return (
		<>
			<Helmet>
				<title>SimpleGeek - товары для гиков</title>
				<meta
					name="description"
					content="Коллекционные статуи, фигурки и саундтреки на виниле из любимых игр и вселенных. SimpleGeek — ваш проводник в мир совершенства форм милых сердцу персонажей по ещё более милым сердцу ценам."
				/>
				<script type="application/ld+json">
					{`{
						"@context": "https://schema.org",
						"@type": "WebSite",
						"name": "SimpleGeek",
						"alternateName": ["Симпл Гик", "СимплГик"],
						"url": "https://simplegeek.ru/",
						"description": "Коллекционные статуи, фигурки и саундтреки на виниле из любимых игр и вселенных. SimpleGeek — ваш проводник в мир совершенства форм милых сердцу персонажей по ещё более милым сердцу ценам.",
						"potentialAction": {
							"@type": "SearchAction",
							"target": "https://simplegeek.ru/search?q={search_term_string}",
							"query-input": "required name=search_term_string"
						}
					}`}
				</script>
			</Helmet>
			<Catalog
				sectionFilter={sectionFilter}
				title={"Каталог"}
				emptyElement={
					<Empty
						title={`Пока нет товаров`}
						description="Вернитесь позже"
						icon={<Search sx={{ height: 96, width: 96 }} />}
					/>
				}
			/>
		</>
	);
}
