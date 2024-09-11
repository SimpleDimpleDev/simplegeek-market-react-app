import { createTheme } from "@mui/material/styles";

import { cssBaseLine } from "./cssBaseLine";
import { Theme as OryTheme } from "@ory/elements";

interface CustomPaletteOptions {
	light?: string;
	main?: string;
	dark?: string;
	contrastText?: string;

	primary?: string;
	secondary?: string;
	tertiary?: string;
	invertPrimary?: string;

	brandPrimary?: string;
	brandSecondary?: string;

	attention?: string;
	success?: string;
	disabled?: string;

	outlined?: string;
}

declare module "@mui/material/Typography" {
	interface TypographyPropsVariantOverrides {
		subtitle0: true;
	}
}

declare module "@mui/material/styles" {
	interface Palette {
		icon: CustomPaletteOptions;
		surface: CustomPaletteOptions;
		typography: CustomPaletteOptions;
		snackbar: CustomPaletteOptions;
	}

	interface PaletteOptions {
		icon?: CustomPaletteOptions;
		surface?: CustomPaletteOptions;
		typography?: CustomPaletteOptions;
		snackbar?: CustomPaletteOptions;
	}

	interface TypographyVariants {
		subtitle0: React.CSSProperties;
	}

	// allow configuration using `createTheme`
	interface TypographyVariantsOptions {
		subtitle0?: React.CSSProperties;
	}
}

export const oryTheme: OryTheme = {
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

// Create a theme instance.
const theme = createTheme({
	palette: {
		surface: {
			main: "#FFFFFF",
			primary: "#FFFFFF",
			secondary: "#F6F6F9",
			tertiary: "#F0F0F3",
		},
		icon: {
			primary: "#000A29",
			secondary: "#6C7284",
			tertiary: "#B4BACE",
			brandPrimary: "#FFD92E",
			brandSecondary: "#EF6C00",
			attention: "#E53935",
			invertPrimary: "#FFFFFF",
			success: "#2E7D32",
		},
		typography: {
			primary: "#000A29",
			secondary: "#6C7284",
			disabled: "#B4BACE",
			invertPrimary: "#FFFFFF",
			attention: "#E53935",
			brandPrimary: "#EF6C00",
			success: "#2E7D32",
		},
		primary: {
			main: "#FFD92E",
			dark: "#FFD100",
			light: "#464B53",
		},
		secondary: {
			main: "#DADDE2",
			dark: "#C8CDC4",
			light: "#464B53",
		},
		warning: {
			main: "#EF6C00",
			dark: "#EF6C00",
			light: "#464B53",
		},
		divider: "#464B53",
		snackbar: {
			outlined: "#464646",
		},
	},
	typography: {
		fontFamily: '"Noto Sans", sans-serif',
		h1: {
			fontWeight: 600,
		},
		h2: {
			fontWeight: 600,
		},
		h3: {
			fontWeight: 600,
		},
		h4: {
			fontWeight: 600,
		},
		h5: {
			fontWeight: 600,
		},
		body1: {
			fontWeight: 400,
			fontSize: "16px",
			lineHeight: "24px",
			letterSpacing: "0px",
		},
		body2: {
			fontSize: "14px",
			lineHeight: "20px",
			letterSpacing: "0.17px",
		},
		button: {
			textTransform: "none",
		},
		subtitle0: {
			fontSize: "18px",
			lineHeight: "24px",
			letterSpacing: "0",
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: cssBaseLine,
		},
		MuiTab: {
			defaultProps: {
				sx: {
					color: "typography.secondary",
					"&.MuiTab-root.Mui-selected": {
						color: "typography.primary",
					},
				},
			},
		},
		MuiTabs: {
			defaultProps: {
				sx: {
					"& .MuiTabs-indicator": {
						bgcolor: "warning.main",
					},
				},
			},
		},
		MuiDivider: {
			defaultProps: {
				style: {
					borderColor: "#464b5312",
					backgroundColor: "#464b5312",
				},
			},
		},
		MuiPaper: {
			defaultProps: {
				style: {
					borderRadius: "12px",
				},
			},
		},
		MuiDialogTitle: {
			defaultProps: {
				style: {
					display: "flex",
					justifyContent: "center",
				},
			},
		},
		MuiDialogContent: {
			defaultProps: {
				style: {
					textAlign: "center",
				},
			},
		},
		MuiDialogActions: {
			defaultProps: {
				style: {
					justifyContent: "center",
					gap: "8px",
					padding: "0px 16px 16px 16px",
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					borderRadius: "8px",
				},
			},
			defaultProps: {
				sx: {
					zIndex: 1,
				},
			},
		},
		MuiTypography: {
			defaultProps: {
				color: "typography.primary",
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
				sx: {
					color: "typography.primary",
				},
			},
			styleOverrides: {
				root: {
					borderRadius: 12,
					boxShadow: "none",
					gap: "8px",
				},
				sizeSmall: {
					fontSize: "13px",
					lineHeight: "22px",
					fontWeight: "500",
				},
				sizeMedium: {
					fontSize: "14px",
					lineHeight: "24px",
					fontWeight: "600",
				},
				sizeLarge: {
					fontSize: "18px",
					lineHeight: "28px",
					fontWeight: "600",
				},
			},
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					color: "#6C7284",
				},
			},
		},
		MuiOutlinedInput: {
			defaultProps: {
				color: "warning",
			},
			styleOverrides: {
				root: {
					borderRadius: "12px",
				},
			},
		},
		MuiInputLabel: {
			defaultProps: {
				color: "warning",
			},
		},
		MuiFilledInput: {
			defaultProps: {
				disableUnderline: true,
			},
			styleOverrides: {
				root: {
					backgroundColor: "#F6F6F9",
					borderRadius: "12px",
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				root: {
					width: 360,
				},
				paper: {
					marginTop: 12,
					borderRadius: 12,
					boxShadow: "none",
				},
				list: {
					paddingTop: 0,
					paddingBottom: 0,
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					width: "100%",
					padding: "12px 16px 12px 16px",
				},
			},
		},
	},
});

export default theme;
