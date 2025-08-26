import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    watch: false,
    setupFiles: ["./lib/test-utils/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "lib/test-utils/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
        "**/__tests__/**",
        "**/dist/**",
        ".next/",
      ],
      include: [
        "app/**/*",
        "components/**/*",
        "lib/**/*",
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
})
