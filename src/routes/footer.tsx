import vkIcon from "@assets/vk.svg";
import { Typography, styled } from "@mui/material";

const FooterSection = styled("div")({
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-start",
	height: "100%",
});

const FooterSection16 = styled(FooterSection)({
	gap: 16,
});

const FooterSection8 = styled(FooterSection)({
	gap: 8,
});

const SocialIcon = styled("img")({
	cursor: "pointer",
	height: 32,
});

const DesktopFooterWrapper = ({ children }: { children: React.ReactNode }) => (
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
			{children}
		</footer>
	</div>
);

const MobileFooterWrapper = ({ children }: { children: React.ReactNode }) => (
	<footer
		style={{
			padding: 16,
			display: "flex",
			flexShrink: 0,
			flexDirection: "column",
			gap: 40,
			backgroundColor: "surface.primary",
		}}
	>
		{children}
	</footer>
);

const FooterContent = ({ isMobile }: { isMobile: boolean }) => {
	return (
		<>
			<FooterSection8>
				<Typography variant={isMobile ? "h5" : "h4"}>admin@simplegeek.ru</Typography>
				<Typography variant="body1">Если у вас остались вопросы</Typography>
			</FooterSection8>

			<FooterSection16>
				{/* <div style={{ width: 103.75, height: 56 }}>
					<img src={logo} height={56} alt="logo" />
				</div> */}
				<Typography variant={isMobile ? "h6" : "h5"}>Мы в социальных сетях</Typography>
				<div style={{ display: "flex", justifyContent: "flex-start" }}>
					<SocialIcon src={vkIcon} alt="vk" onClick={() => window.open("https://vk.com/simplegeeek")} />
				</div>
			</FooterSection16>

			<FooterSection8>
				<Typography variant="body1">
					ИП "ФАДЕЕВА МАРИЯ"
					<br />
					ИНН 770172924866"
					<br />
					Москва, Новая Басманная 12с2
				</Typography>
				<Typography variant="body1">© 2024 Simple Geek. Все права защищены</Typography>
			</FooterSection8>
		</>
	);
};

const MobileFooter = () => (
	<MobileFooterWrapper>
		<FooterContent isMobile={true} />
	</MobileFooterWrapper>
);

const DesktopFooter = () => (
	<DesktopFooterWrapper>
		<FooterContent isMobile={false} />
	</DesktopFooterWrapper>
);

export default function Footer({ isMobile }: { isMobile?: boolean }) {
	return <>{isMobile ? <MobileFooter /> : <DesktopFooter />}</>;
}
