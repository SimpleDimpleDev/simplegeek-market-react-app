import React from "react";
import { Outlet } from "react-router-dom";

const MobileContent: React.FC = () => {
	return (
		<div className="bg-secondary d-f fd-r fg-1 jc-c">
			<div
				className="bg-secondary px-2 pt-4 w-100v d-f fd-c fg-1 jc-fs"
				style={{
					position: "relative",
					minHeight: "100vh",
					marginTop: "144px",
					paddingBottom: "28px",
				}}
			>
				<Outlet />
			</div>
		</div>
	);
};

export default MobileContent;
