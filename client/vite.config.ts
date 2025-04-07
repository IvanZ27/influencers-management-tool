import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	const isDev = mode === "development";
	const apiUrl = env.VITE_API_BASE_URL || "http://localhost:1337";

	return {
		plugins: [react()],
		server: {
			proxy: isDev
				? {
						"/influencers": {
							target: apiUrl,
							changeOrigin: true,
						},
						"/influencer": {
							target: apiUrl,
							changeOrigin: true,
						},
					}
				: undefined,
		},
	};
});
