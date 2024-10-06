import { CSSTransition, TransitionGroup } from "react-transition-group";

import { useLocation } from "react-router-dom";
import { PropsWithChildren } from "react";

const TransitionWrapper: React.FC<PropsWithChildren> = ({ children }) => {
	const location = useLocation();
	console.log(location.pathname);
	const transitionClass = "fade"; // adjust the class name to your liking

	return (
		<TransitionGroup className={"page-transition"}>
			<CSSTransition
				key={location.pathname}
				classNames={transitionClass}
				timeout={200} // adjust the transition duration to your liking
			>
				{children}
			</CSSTransition>
		</TransitionGroup>
	);
};

export default TransitionWrapper;
