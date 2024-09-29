import { Typography } from "@mui/material";
import vkIcon from "@assets/vk.svg";

const DesktopFooter = () => (
	<div
		style={{
			padding: "0 calc(24/1920 * 100%)",
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			backgroundColor: "white",
		}}
	>
		<footer
			style={{
				flexGrow: 1,
				paddingTop: 40,
				paddingBottom: 40,
				maxWidth: 1408,
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				gap: 32,
			}}
		>
			<div className="gap-1 h-100 d-f fd-c jc-fs">
				<Typography variant={"h4"}>admin@simplegeek.ru</Typography>
				<Typography variant="body1">Если у вас остались вопросы</Typography>
			</div>

			<div className="gap-2 h-100 d-f fd-c jc-fs">
				{/* <div style={{ width: 103.75, height: 56 }}>
					<img src={logo} height={56} alt="logo" />
				</div> */}
				<Typography variant={"h5"}>Мы в социальных сетях</Typography>
				<div style={{ display: "flex", justifyContent: "flex-start" }}>
					<img
						style={{ width: 32, height: 32, cursor: "pointer" }}
						src={vkIcon}
						alt="vk"
						onClick={() => window.open("https://vk.com/simplegeeek")}
					/>
				</div>
			</div>

			<div className="gap-1 h-100 d-f fd-c jc-fs">
				<Typography variant="body1">
					ИП "ФАДЕЕВА МАРИЯ"
					<br />
					ИНН 770172924866"
					<br />
					Москва, Новая Басманная 12с2
				</Typography>
				<Typography variant="body1">© 2024 Simple Geek. Все права защищены</Typography>
			</div>
		</footer>
	</div>
);

export default DesktopFooter;
