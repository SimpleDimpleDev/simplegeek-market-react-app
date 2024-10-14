import { CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { ScrollRestoration } from "react-router-dom";
import { useIsMobile } from "src/hooks/useIsMobile";

const MobileHeader = lazy(() => import("./header/MobileHeader"));
const DesktopHeader = lazy(() => import("./header/DesktopHeader"));
const MobileContent = lazy(() => import("./content/MobileContent"));
const DesktopContent = lazy(() => import("./content/DesktopContent"));
const MobileFooter = lazy(() => import("./footer/MobileFooter"));
const DesktopFooter = lazy(() => import("./footer/DesktopFooter"));

export default function ShopLayout() {
	const isMobile = useIsMobile();

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
