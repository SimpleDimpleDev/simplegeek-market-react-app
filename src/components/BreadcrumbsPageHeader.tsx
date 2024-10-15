import { Breadcrumbs, Link, Typography, styled } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const FunctionalLink = styled(RouterLink)({
	textDecoration: "none",
	color: "inherit",
});

interface BreadcrumbsHeaderProps {
	isMobile: boolean;
	path?: {
		title: string;
		link: string;
	}[];
	current: string;
}

const BreadcrumbsPageHeader = ({ isMobile, path, current }: BreadcrumbsHeaderProps) => (
	<div className="gap-2 py-2 w-100 ai-bl d-f fd-c">
		{!isMobile && (
			<Breadcrumbs>
				{path &&
					path.map((element, index) => (
						<FunctionalLink key={index} to={element.link}>
							{element.title}
						</FunctionalLink>
					))}
				<Link color="typography.primary" underline="hover">
					{current}
				</Link>
			</Breadcrumbs>
		)}
		<Typography variant={isMobile ? "h4" : "h3"}>{current}</Typography>
	</div>
);

export default BreadcrumbsPageHeader;
