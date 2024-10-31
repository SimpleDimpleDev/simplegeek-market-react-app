import { Button, Typography } from "@mui/material";

export default function SomethingWentWrong({ showButton = true }: { showButton?: boolean }) {
	const handleReloadPage = () => window.location.reload();
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
					textAlign: "center",
					gap: 8,
				}}
			>
				<Typography variant="h5">Что-то пошло не так</Typography>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Typography variant="h6">Попробуйте обновить страницу</Typography>
				</div>
				{showButton && (
					<Button variant="contained" onClick={handleReloadPage}>
						Обновить
					</Button>
				)}
			</div>
		</div>
	);
}
