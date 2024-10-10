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
			<Box position={"absolute"} top={0} bottom={"28px"}>
				<Fab
					onClick={handleClick}
					color="primary"
					size="small"
					aria-label="scroll-top"
					sx={{
						position: "sticky",
						top: "90%",
					}}
				>
					<KeyboardArrowUp />
				</Fab>
			</Box>
		</Fade>
	);
};

export { ScrollTop };
