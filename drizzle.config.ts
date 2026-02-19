import { resolve } from "node:path";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: resolve(process.cwd(), "data", "sqlite.db"),
  },
});
