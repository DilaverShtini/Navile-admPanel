import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  ssr: false,
  srcDir: "src",
  dir: {
    public: "../public"
  },
  runtimeConfig: {
    baseUrl: "" // Override with NUXT_BASE_URL
  },
})