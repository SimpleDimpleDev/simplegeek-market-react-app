import { useGetFAQItemListQuery } from "@api/shop/faq";
import { PageHeading } from "@components/PageHeading";
import SomethingWentWrong from "@components/SomethingWentWrong";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Typography } from "@mui/material";
import { Helmet } from "react-helmet";

export function Component() {
	const { data: FAQItemList, isLoading: FAQItemListIsLoading } = useGetFAQItemListQuery();
	return (
		<>
			<Helmet>
				<title>FAQ - SimpleGeek</title>
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
						<PageHeading title="FAQ" />
					</div>

					<div className="gap-2 d-f fd-c">
						{FAQItemList?.items.map((item) => (
							<Accordion
								sx={{
									width: "100%",
									borderTop: "none",
									boxShadow: "none",
									"&:before": {
										display: "none",
									},
								}}
								disableGutters
							>
								<AccordionSummary expandIcon={<ExpandMore />}>
									<Typography variant="h6">{item.question}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<div className="gap-1 pb-2 d-f fg-c">
										<Typography variant="subtitle0">{item.answer}</Typography>
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
