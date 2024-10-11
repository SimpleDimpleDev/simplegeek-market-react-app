import { CircularProgress } from "@mui/material";
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

import { Component as LoginRoute } from "src/routes/auth/login/LoginRoute";

export default function ShopLayout() {
	const isMobile = useIsMobile();

	const user = useSelector((state: RootState) => state.user.identity);

	if (!user || !user.isAdmin) {
		return (
			<div className="ai-c d-f jc-c">
				<LoginRoute />
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
