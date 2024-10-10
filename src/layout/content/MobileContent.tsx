import routes from "@routes/index";

import React from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

const MobileContent: React.FC = () => {
	const location = useLocation();
	const currentOutlet = useOutlet();
	const { nodeRef } =
		(routes.find((route) => route.path === location.pathname) as { nodeRef: React.RefObject<HTMLDivElement> }) ??
		{};

	return (
		<div className="bg-secondary d-f fd-r fg-1 jc-c">
			<SwitchTransition>
				<CSSTransition
					key={location.pathname}
					classNames={"page"}
					timeout={100} // adjust the transition duration to your liking
					unmountOnExit
				>
					{() => (
						<div
							className="bg-secondary px-2 pt-4 w-100v d-f fd-c fg-1 jc-fs"
							style={{
								position: "relative",
								minHeight: "100vh",
								marginTop: "144px",
								paddingBottom: "28px",
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

export default MobileContent;
