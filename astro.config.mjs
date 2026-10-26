import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "static",
  compressHTML: false,
  adapter: vercel({ mode: "static" }),
  site: "https://priyankasiddhesh.vercel.app"
});
