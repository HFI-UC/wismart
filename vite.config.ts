import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), vue()],
    define: {
        "process.env.VERCEL_GIT_COMMIT_SHA": JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA)
    }
});
