import { Outlet } from "react-router-dom";
import { IntlProvider, CustomTranslations, ThemeProvider as OryThemeProvider } from "@ory/elements";
import customTranslations from "src/oryLocale";
import oryTheme from "src/oryTheme.ts";


export function Component() {
	return (
		<OryThemeProvider themeOverrides={oryTheme}>
			<IntlProvider<CustomTranslations> locale="ru" defaultLocale="ru" customTranslations={customTranslations}>
				<div className="bg-secondary w-100 h-100 ai-c d-f jc-c">
					<Outlet />
				</div>
			</IntlProvider>
		</OryThemeProvider>
	);
}
