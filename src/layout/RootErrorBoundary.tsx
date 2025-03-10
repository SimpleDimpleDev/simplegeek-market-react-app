import NotFound from "@components/NotFound";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RootErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error) && error.status === 404) {
		return (
			<NotFound />
		)
	}
	return (
		<div className="w-100v h-100v ai-c d-f fd-c jc-c">
			<SomethingWentWrong />
		</div>
	);
}
