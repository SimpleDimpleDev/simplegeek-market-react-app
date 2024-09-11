import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsMobile } from "@state/ui/responsiveSlice";
import { debounce } from "@utils/debounce";

export const useDebouncedResizeHandler = (delay: number = 200) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const handleResize = () => {
			const isMobile = window.innerWidth <= 768;
			dispatch(setIsMobile(isMobile));
		};

		const debouncedResizeHandler = debounce(handleResize, delay);

		window.addEventListener("resize", debouncedResizeHandler);
		handleResize(); // Initial check

		return () => {
			window.removeEventListener("resize", debouncedResizeHandler);
		};
	}, [dispatch, delay]);
};
