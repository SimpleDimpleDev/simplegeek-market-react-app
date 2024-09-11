import { Outlet } from "react-router-dom";

export default function AuthLayout() {
	return (
		<div className="h-100 v-100 d-f jc-c ai-c bg-secondary">
			<Outlet />
		</div>
	);
}
