import { useSelector } from "react-redux";
import Content from "./content";
import Footer from "./footer";
import Header from "./header";
import { RootState } from "@state/store";

export default function ShopLayout() {
	const isMobile = useSelector((state: RootState) => state.responsive.isMobile);
	return (
		<div className="d-f fd-c" style={{ height: "100vh" }}>
			<div className="d-f fd-c" style={{ minHeight: "100vh" }}>
				<Header isMobile={isMobile} />
				<Content isMobile={isMobile} />
				<Footer isMobile={isMobile} />
			</div>
		</div>
	);
}
