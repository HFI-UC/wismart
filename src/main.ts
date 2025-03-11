import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { definePreset } from "@primeuix/themes";
import ToastService from "primevue/toastservice";
import ConfirmationService from 'primevue/confirmationservice';
import zh_cn from "primelocale/zh-CN.json";

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: definePreset(Aura, {
            semantic: {
                primary: {
                    50: "{orange.50}",
                    100: "{orange.100}",
                    200: "{orange.200}",
                    300: "{orange.300}",
                    400: "{orange.400}",
                    500: "{orange.500}",
                    600: "{orange.600}",
                    700: "{orange.700}",
                    800: "{orange.800}",
                    900: "{orange.900}",
                    950: "{orange.950}",
                },
                colorScheme: {
                    light: {
                        primary: {
                            color: "{orange.500}",
                            inverseColor: "#ffffff",
                            hoverColor: "{orange.800}",
                            activeColor: "{orange.800}",
                        },
                        highlight: {
                            background: "{orange.950}",
                            focusBackground: "{orange.700}",
                            color: "#ffffff",
                            focusColor: "#ffffff",
                        },
                    },
                    dark: {
                        primary: {
                            color: "{zinc.50}",
                            inverseColor: "{zinc.950}",
                            hoverColor: "{zinc.300}",
                            activeColor: "{zinc.200}",
                        },
                        highlight: {
                            background: "rgba(250, 250, 250, .16)",
                            focusBackground: "rgba(250, 250, 250, .24)",
                            color: "rgba(255, 255, 255, .87)",
                            focusColor: "rgba(255, 255, 255, .87)",
                        },
                    },
                },
            },
        }),
        options: {
            darkModeSelector: ".p-dark",
        },
    },
    locale: zh_cn["zh-CN"],
});
app.use(ToastService);
app.use(ConfirmationService)
app.use(router);
app.mount("#app");
