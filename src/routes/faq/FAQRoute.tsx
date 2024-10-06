import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { useIsMobile } from "src/hooks/useIsMobile";

export function Component() {
	const isMobile = useIsMobile();
	return (
		<>
			<div className="py-2">
				<Typography sx={{ verticalAlign: "baseline" }} variant={isMobile ? "h4" : "h3"}>
					FAQ
				</Typography>
			</div>
			<div className="py-3">
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography variant="subtitle0">Вопрос 1</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<div className="gap-1 pb-2 d-f fg-c">
							<Typography variant="subtitle2">Заголовок 1</Typography>
							<Typography variant="body2">Ответ 1</Typography>
						</div>
					</AccordionDetails>
				</Accordion>
			</div>
		</>
	);
}
