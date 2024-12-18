import { Box, Typography } from "@mui/material";

interface Props {
	title: string;
	infoText?: string;
	subText?: string;
}

export const PageHeading: React.FC<Props> = ({ title, infoText, subText }) => {
	return (
		<Box width={"100%"} padding={"16px 0px"}>
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
		</Box>
	);
};
