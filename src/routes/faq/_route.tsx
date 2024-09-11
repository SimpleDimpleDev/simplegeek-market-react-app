import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";

export default function FAQ() {
    return (
        <>
            <div className="py-2">
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    FAQ
                </Typography>
            </div>
            <div className="py-3">
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle0">Вопрос 1</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="d-f fg-c gap-1 pb-2">
                            <Typography variant="subtitle2">Заголовок 1</Typography>
                            <Typography variant="body2">Овтет 1</Typography>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );
}
