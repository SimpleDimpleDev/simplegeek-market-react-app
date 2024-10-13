import Catalog from "@components/Catalog";
import { useCallback } from "react";

export function Component() {
	const sectionFilter = useCallback(() => true, []);

	return <Catalog sectionFilter={sectionFilter} />;
}
