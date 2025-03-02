import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/RegisterView.vue";
import VerifyView from "../views/VerifyView.vue";
import LoginView from "../views/LoginView.vue";
import NewProductView from "../views/NewProductView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: HomeView,
        },
        {
            path: "/user/register",
            component: RegisterView,
        },
        {
            path: "/user/verify",
            component: VerifyView,
            props: (route) => ({ token: route.query.token }),
        },
        {
            path: "/user/login",
            component: LoginView,
            props: (route) => ({ callback: route.query.callback }),
        },
        {
            path: "/product/new",
            component: NewProductView
        }
    ],
});

export default router;
