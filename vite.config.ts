import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	define: {
		"import.meta.env.SHOP_API_URL": JSON.stringify(process.env.SHOP_API_URL || "http://127.0.0.1/api"),
		"import.meta.env.AUTH_API_URL": JSON.stringify(process.env.AUTH_API_URL || "http://127.0.0.1/auth"),
	},
});
