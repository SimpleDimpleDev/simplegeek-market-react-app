import { Box, Typography } from "@mui/material";

interface Props {
	title: string | React.ReactNode;
	infoText?: string;
	subText?: string;
	additional?: React.ReactNode;
}

export const PageHeading: React.FC<Props> = ({ title, infoText, subText, additional }) => {
	return (
		<Box width={"100%"} padding={"16px 0px"} flex={1} flexDirection={"column"} gap={1}>
			<Box display={"flex"} flexDirection={"row"} alignItems={"baseline"} gap={2}>
				<Typography sx={{ verticalAlign: "baseline" }} variant={"h4"}>
					{title}
				</Typography>

				{infoText && (
					<Typography color={"typography.secondary"} variant="body1">
						{infoText}
					</Typography>
				)}
			</Box>
			{subText && (
				<Typography variant="subtitle0" sx={{ color: "typography.secondary" }}>
					{subText}
				</Typography>
			)}
			{additional && additional}
		</Box>
	);
};
