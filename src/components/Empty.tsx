import { Typography } from "@mui/material";

interface EmptyProps {
	title: string;
	description?: string;
	icon: JSX.Element;
	button?: JSX.Element;
}

export const Empty = ({ title, description, icon, button }: EmptyProps) => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				height: "100%",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: 320,
					gap: 16,
				}}
			>
				{icon}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
					}}
				>
					<Typography variant="h6">{title}</Typography>
					<Typography variant="body1" sx={{ textAlign: "center", color: "typography.secondary" }}>
						{description && description}
					</Typography>
				</div>
				{button && button}
			</div>
		</div>
	);
};
