import { UserAuthority } from "../User";

export type RootContext = {
	isMobile: boolean;
	user: UserAuthority | null;
	handleLogin: () => void;
	handleLogout: () => void;
};
