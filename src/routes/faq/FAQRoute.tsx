import { useGetFAQItemListQuery } from "@api/shop/faq";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { useIsMobile } from "src/hooks/useIsMobile";

export function Component() {
	const isMobile = useIsMobile();
	const { data: FAQItemList, isLoading: FAQItemListIsLoading } = useGetFAQItemListQuery();
	return (
		<>
			<Helmet>
				<title>SimpleGeek | FAQ</title>
			</Helmet>
			{FAQItemListIsLoading ? (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			) : !FAQItemList ? (
				<SomethingWentWrong />
			) : (
				<>
					<div className="py-2">
						<Typography sx={{ verticalAlign: "baseline" }} variant={isMobile ? "h4" : "h3"}>
							FAQ
						</Typography>
					</div>

					<div className="py-3">
						{FAQItemList?.items.map((item) => (
							<Accordion>
								<AccordionSummary expandIcon={<ExpandMore />}>
									<Typography variant="subtitle0">{item.question}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<div className="gap-1 pb-2 d-f fg-c">
										<Typography variant="body2">{item.answer}</Typography>
									</div>
								</AccordionDetails>
							</Accordion>
						))}
					</div>
				</>
			)}
		</>
	);
}
