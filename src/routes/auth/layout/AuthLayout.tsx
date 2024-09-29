import { Outlet } from "react-router-dom";

export default function AuthLayout() {
	return (
		<div className="bg-secondary h-100 ai-c d-f jc-c v-100">
			<Outlet />
		</div>
	);
}
