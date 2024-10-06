import { CircularProgress } from "@mui/material";
import { PropsWithChildren } from "react";
import SomethingWentWrong from "./SomethingWentWrong";

type Props = PropsWithChildren & {
	isLoading: boolean;
	necessaryDataIsPersisted?: boolean;
};

const Loading: React.FC<Props> = ({ isLoading, necessaryDataIsPersisted, children }) => {
	return (
		<>
			{isLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : necessaryDataIsPersisted !== undefined && !necessaryDataIsPersisted ? (
				<SomethingWentWrong />
			) : (
				children
			)}
		</>
	);
};

export { Loading };
