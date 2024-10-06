import { startTransition, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsMobile } from "@state/ui/responsiveSlice";
import { debounce } from "@mui/material";

export const useDebouncedResizeHandler = (delay: number = 200) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const handleResize = () => {
			const isMobile = window.innerWidth <= 768;

			dispatch(setIsMobile(isMobile));
		};

		const debouncedResizeHandler = debounce(handleResize, delay);

		startTransition(() => {
			handleResize();
		});

		window.addEventListener("resize", debouncedResizeHandler);

		return () => {
			window.removeEventListener("resize", debouncedResizeHandler);
		};
	}, [dispatch, delay]);
};
