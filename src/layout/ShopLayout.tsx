import { CircularProgress, Typography } from "@mui/material";
import { RootState } from "@state/store";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { ScrollRestoration } from "react-router-dom";
import { useIsMobile } from "src/hooks/useIsMobile";

const MobileHeader = lazy(() => import("./header/MobileHeader"));
const DesktopHeader = lazy(() => import("./header/DesktopHeader"));
const MobileContent = lazy(() => import("./content/MobileContent"));
const DesktopContent = lazy(() => import("./content/DesktopContent"));
const MobileFooter = lazy(() => import("./footer/MobileFooter"));
const DesktopFooter = lazy(() => import("./footer/DesktopFooter"));

// only while dev
// TODO: remove this on release
import { IntlProvider, CustomTranslations, ThemeProvider as OryThemeProvider } from "@ory/elements";
import customTranslations from "src/oryLocale";
import oryTheme from "src/oryTheme.ts";
import { Component as LoginRoute } from "src/routes/auth/login/LoginRoute";

export default function ShopLayout() {
	const isMobile = useIsMobile();

	// only while dev
	// TODO: remove this on release
	const user = useSelector((state: RootState) => state.user.identity);
	if (!user) {
		return (
			<OryThemeProvider themeOverrides={oryTheme}>
				<IntlProvider<CustomTranslations>
					locale="ru"
					defaultLocale="ru"
					customTranslations={customTranslations}
				>
					<div className="bg-secondary w-100v h-100v ai-c d-f jc-c">
						<LoginRoute />
					</div>
				</IntlProvider>
			</OryThemeProvider>
		);
	}

	if (!user.isAdmin) {
		return (
			<div className="w-100v h-100v ai-c d-f fd-r jc-c" style={{ textAlign: "center" }}>
				<Typography variant="h1">Скоро здесь будет магазин {":)"}</Typography>
			</div>
		);
	}

	return (
		<div className="d-f fd-c" style={{ height: "100vh" }}>
			<div className="d-f fd-c" style={{ minHeight: "101vh" }}>
				<Suspense
					fallback={
						<div className="w-100 h-100 ai-c d-f jc-c">
							<CircularProgress />
						</div>
					}
				>
					{isMobile ? (
						<>
							<MobileHeader />
							<MobileContent />
							<MobileFooter />
						</>
					) : (
						<>
							<DesktopHeader />
							<DesktopContent />
							<DesktopFooter />
						</>
					)}
				</Suspense>
			</div>
			<ScrollRestoration />
		</div>
	);
}
