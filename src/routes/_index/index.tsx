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
			</Helmet>
			<Catalog
				sectionFilter={sectionFilter}
				current={"Каталог"}
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
