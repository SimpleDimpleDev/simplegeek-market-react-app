import { KeyboardArrowUp } from "@mui/icons-material";
import { useScrollTrigger, Fade, Box, Fab } from "@mui/material";

const ScrollTop: React.FC = () => {
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 100,
	});

	const handleClick = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<Fade in={trigger}>
			<Box
				onClick={handleClick}
				role="presentation"
				sx={{ position: "sticky", top: "80%", width: "max-content" }}
			>
				<Fab color="primary" size="small" aria-label="scroll back to top">
					<KeyboardArrowUp />
				</Fab>
			</Box>
		</Fade>
	);
};

export { ScrollTop };
