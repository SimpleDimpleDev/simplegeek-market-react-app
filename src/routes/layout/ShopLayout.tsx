import { useSelector } from "react-redux";
import { RootState } from "@state/store";
import { lazy, Suspense } from "react";
import { ScrollRestoration } from "react-router-dom";

const MobileHeader = lazy(() => import("./header/MobileHeader"));
const DesktopHeader = lazy(() => import("./header/DesktopHeader"));
const MobileContent = lazy(() => import("./content/MobileContent"));
const DesktopContent = lazy(() => import("./content/DesktopContent"));
const MobileFooter = lazy(() => import("./footer/MobileFooter"));
const DesktopFooter = lazy(() => import("./footer/DesktopFooter"));

export default function ShopLayout() {
	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);
	return (
		<div className="d-f fd-c" style={{ height: "100vh" }}>
			<div className="d-f fd-c" style={{ minHeight: "100vh" }}>
				<Suspense fallback={null}>
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
