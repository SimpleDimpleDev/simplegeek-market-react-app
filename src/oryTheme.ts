
import { Theme as OryTheme } from "@ory/elements";

const oryTheme: OryTheme = {
	fontFamily: '"Noto Sans", sans-serif',
	fontFamilyMono: '"Noto Sans", sans-serif',
	fontStyle: "normal",
	accent: {
		def: "#FFD92E",
		muted: "#FFD100",
		emphasis: "#EF6C00",
		disabled: "#464B53",
		subtle: "#464B53",
	},
	foreground: {
		def: "#000A29",
		muted: "#6C7284",
		subtle: "#6C7284",
		disabled: "#6C7284",
		onDark: "#6C7284",
		onAccent: "#6C7284",
		onDisabled: "#6C7284",
	},
	background: {
		surface: "#FFF",
		canvas: "#F6F6F9",
		subtle: "#F6F6F9",
	},
	error: {
		def: "#E53935",
		subtle: "#E53935",
		muted: "#E53935",
		emphasis: "#E53935",
	},
	success: {
		emphasis: "#2E7D32",
	},
	border: {
		def: "#FFF",
	},
	text: {
		def: "#000A29",
		disabled: "#6C7284",
	},
	input: {
		background: "#F6F6F9",
		disabled: "#C8CDC4",
		placeholder: "#6C7284",
		text: "#000A29",
	},
};

export default oryTheme;