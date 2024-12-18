import { Box, Button, Radio, Typography } from "@mui/material";

interface CardRadioProps {
	isChecked: boolean;
	disabled?: boolean;
	onChange: (event: React.SyntheticEvent) => void;
	mainText: string;
	subText?: string;
	imgUrl: string;
}

const CardRadio = ({ isChecked, disabled, onChange, mainText, subText, imgUrl }: CardRadioProps) => {
	return (
		<Button
			disabled={disabled}
			onClick={onChange}
			fullWidth
			sx={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "8px 16px 8px 8px",
				backgroundColor: isChecked ? "surface.secondary" : "surface.primary",
				transition: "background-color 0.05s ease-in-out",
				borderRadius: "16px",
			}}
		>	
			<div className="gap-1 ai-c d-f fd-r">
				<Radio color="warning" checked={isChecked}/>
				<div className="ai-fs d-f fd-c">
					<Typography variant={"body1"}>{mainText}</Typography>
					{subText && (
						<Typography color={"typography.secondary"} variant={"body2"}>
							{subText}
						</Typography>
					)}
				</div>
			</div>
			<Box height={"42px"} width={"42px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<img src={imgUrl} alt="" />
			</Box>
		</Button>
	);
};

export { CardRadio };
