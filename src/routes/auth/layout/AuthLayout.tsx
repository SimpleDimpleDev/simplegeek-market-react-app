import { Outlet } from "react-router-dom";
import { IntlProvider, CustomTranslations, ThemeProvider as OryThemeProvider } from "@ory/elements";
import customTranslations from "src/oryLocale";
import oryTheme from "src/oryTheme.ts";

export function Component() {
	return (
		<OryThemeProvider themeOverrides={oryTheme}>
			<IntlProvider<CustomTranslations> locale="ru" defaultLocale="ru" customTranslations={customTranslations}>
				<Outlet />
			</IntlProvider>
		</OryThemeProvider>
	);
}
