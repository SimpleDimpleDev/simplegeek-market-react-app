import routes from "@routes/index";

import React from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

const DesktopContent: React.FC = () => {
	const location = useLocation();
	const currentOutlet = useOutlet();
	const { nodeRef } =
		(routes.find((route) => route.path === location.pathname) as { nodeRef: React.RefObject<HTMLDivElement> }) ??
		{};

	return (
		<div
			className="bg-secondary d-f fd-r fg-1 jc-c"
			style={{
				paddingLeft: "calc(48/1920 * 100%)",
				paddingRight: "calc(48/1920 * 100%)",
			}}
		>
			<SwitchTransition>
				<CSSTransition
					key={location.pathname}
					classNames={"page"}
					timeout={100} // adjust the transition duration to your liking
					unmountOnExit
				>
					{() => (
						<div
							className="pt-4 w-100 h-100 d-f fd-c fg-1 jc-fs"
							style={{
								paddingBottom: "28px",
								maxWidth: `calc(1392/1920 * 1920px)`,
							}}
							ref={nodeRef}
						>
							{currentOutlet}
						</div>
					)}
				</CSSTransition>
			</SwitchTransition>
		</div>
	);
};

export default DesktopContent;
