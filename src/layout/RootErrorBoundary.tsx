import SomethingWentWrong from "@components/SomethingWentWrong";
import { useRouteError } from "react-router-dom";

export default function RootErrorBoundary() {
	const error = useRouteError();
	console.error(error);

	return (
		<div className="w-100v h-100v ai-c d-f fd-c jc-c">
			<SomethingWentWrong />
		</div>
	);
}
