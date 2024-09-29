import { oryTheme, IntlProvider, CustomTranslations, ThemeProvider as OryThemeProvider } from "@ory/elements";
import { Outlet } from "react-router-dom";
import customTranslations from "src/oryLocale";
import "@ory/elements/style.css"

export default function AuthLayout() {
	return (
		<div className="bg-secondary h-100 ai-c d-f jc-c v-100">
			<OryThemeProvider themeOverrides={oryTheme}>
				<IntlProvider<CustomTranslations>
					locale="ru"
					defaultLocale="ru"
					customTranslations={customTranslations}
				>
					<Outlet />
				</IntlProvider>
			</OryThemeProvider>
		</div>
	);
}
