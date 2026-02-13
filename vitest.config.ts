import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			exclude: ["src/index.ts", "src/**/*.test.ts", "**/*.d.ts"],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100,
			},
		},
	},
	plugins: [tsConfigPaths()],
});
