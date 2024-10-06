import { Outlet } from "react-router-dom";
import { IntlProvider, CustomTranslations, ThemeProvider as OryThemeProvider } from "@ory/elements";
import customTranslations from "src/oryLocale";
import oryTheme from "src/oryTheme.ts";


export function Component() {
	return (
		<OryThemeProvider themeOverrides={oryTheme}>
			<IntlProvider<CustomTranslations> locale="ru" defaultLocale="ru" customTranslations={customTranslations}>
				<div className="bg-secondary h-100 ai-c d-f jc-c v-100">
					<Outlet />
				</div>
			</IntlProvider>
		</OryThemeProvider>
	);
}
