import React from "react";
import { Outlet } from "react-router-dom";

const DesktopContent: React.FC = () => {
	return (
		<div
			className="bg-secondary d-f fd-r fg-1 jc-c"
			style={{
				paddingLeft: "calc(48/1920 * 100%)",
				paddingRight: "calc(48/1920 * 100%)",
			}}
		>
			<div
				className="pt-4 w-100 h-100 d-f fd-c fg-1 jc-fs"
				style={{
					position: "relative",
					paddingBottom: "28px",
					minHeight: "100vh",
					maxWidth: `calc(1392/1920 * 1920px)`,
				}}
			>
				<Outlet />
			</div>
		</div>
	);
};

export default DesktopContent;
