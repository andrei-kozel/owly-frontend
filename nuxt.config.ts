import tailwindcss from "@tailwindcss/vite";
import en from "./i18n/locales/en.json";
import ru from "./i18n/locales/ru.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/styles/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    "@nuxt/image",
    "@nuxtjs/color-mode",
    "@nuxt/icon",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
  ],
  i18n: {
    locales: [
      { code: "en", language: "English", file: "en.json", flag: "🇺🇸" },
      { code: "ru", language: "Русский", file: "ru.json", flag: "🇷🇺" },
    ],
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true,
    },
  },

  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "dark",
  },
});
