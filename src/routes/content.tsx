import { Outlet } from "react-router-dom";

const Content = ({ isMobile }: { isMobile?: boolean }) => {
	return (
		<>
			{isMobile ? (
				<div
					className="fg-1 d-f fd-c jc-fs px-2 pt-4 bg-secondary"
					style={{
						marginTop: "144px",
						paddingBottom: "28px",
					}}
				>
					<Outlet />
				</div>
			) : (
				<div
					className="fg-1 d-f fd-r jc-c bg-secondary"
					style={{
						paddingLeft: "calc(48/1920 * 100%)",
						paddingRight: "calc(48/1920 * 100%)",
					}}
				>
					<div
						className="fg-1 w-100 h-100 d-f fd-c jc-fs pt-4"
						style={{
							paddingBottom: "28px",
							maxWidth: `calc(1392/1920 * 1920px)`,
						}}
					>
						<Outlet />
					</div>
				</div>
			)}
		</>
	);
};

export default Content;
