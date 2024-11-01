import Catalog from "@components/Catalog";
import { Empty } from "@components/Empty";
import { Search } from "@mui/icons-material";
import { useCallback } from "react";

export function Component() {
	const sectionFilter = useCallback(() => true, []);

	return (
		<>
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
