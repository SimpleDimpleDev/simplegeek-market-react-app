import { useMediaQuery } from "@mui/material";

export const useIsMobile = () => {
	const isMobile = useMediaQuery("(max-width: 600px)");
	return isMobile;
};
