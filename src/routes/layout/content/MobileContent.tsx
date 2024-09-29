import { Outlet } from "react-router-dom";

const MobileContent: React.FC = () => {
	return (
		<div
			className="bg-secondary px-2 pt-4 d-f fd-c fg-1 jc-fs"
			style={{
				marginTop: "144px",
				paddingBottom: "28px",
			}}
		>
			<Outlet />
		</div>
	);
};

export default MobileContent;
