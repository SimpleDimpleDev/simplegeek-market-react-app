import { CreditInfo } from "@appTypes/Credit";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from "@mui/material";
import { DateFormatter, getRuPaymentWord } from "@utils/format";

interface ItemCreditInfoProps {
	payments: CreditInfo["payments"];
}

const ItemCreditInfo = ({ payments }: ItemCreditInfoProps) => {
	return (
		<Accordion sx={{ width: "100%" }}>
			<AccordionSummary expandIcon={<ExpandMore />}>
				<Box display="flex" flexDirection="column" gap={1}>
					<Typography variant="h6">Есть рассрочка</Typography>
					<Typography variant="body2" color="typography.secondary">
						На {payments.length} {getRuPaymentWord(payments.length)}
					</Typography>
				</Box>
			</AccordionSummary>
			<AccordionDetails>
				<Stack direction="column" spacing={1}>
					{payments.map((part) => {
						return (
							<Box display="flex" flexDirection="column" gap={1}>
								<Typography variant="subtitle1">{`${part.sum} ₽`}</Typography>
								<Typography variant="body2" color="typography.secondary">
									{DateFormatter.DDMMYYYY(part.deadline)}
								</Typography>
							</Box>
						);
					})}
				</Stack>
			</AccordionDetails>
		</Accordion>
	);
};

export { ItemCreditInfo };
