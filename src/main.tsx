import theme from "./theme.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./state/store";
import App from "./App.tsx";
import { oryTheme, IntlProvider, CustomTranslations, ThemeProvider as OryThemeProvider } from "@ory/elements";
import customTranslations from "src/oryLocale";

import "@ory/elements/style.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ReduxProvider store={store}>
			<ThemeProvider theme={theme}>
				<OryThemeProvider themeOverrides={oryTheme}>
					<IntlProvider<CustomTranslations>
						locale="ru"
						defaultLocale="ru"
						customTranslations={customTranslations}
					>
						<CssBaseline />
						<App />
					</IntlProvider>
				</OryThemeProvider>
			</ThemeProvider>
		</ReduxProvider>
	</StrictMode>
);
