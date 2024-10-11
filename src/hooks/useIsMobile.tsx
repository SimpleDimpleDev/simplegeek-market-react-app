import { useMediaQuery } from "@mui/material";

export const useIsMobile = () => {
	const isMobile = useMediaQuery("(max-width: 928px)");
	return isMobile;
};
