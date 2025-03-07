import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/RegisterView.vue";
import EmailVerifyView from "../views/EmailVerifyView.vue";
import LoginView from "../views/LoginView.vue";
import NewProductView from "../views/NewProductView.vue";
import ShopView from "../views/ShopView.vue";
import ProductVerifyView from "../views/admin/ProductVerifyView.vue";
import AdminView from "../views/admin/AdminView.vue";
import TypesManagementView from "../views/admin/TypesManagementView.vue";

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
            component: EmailVerifyView,
            props: (route) => ({ token: route.query.token }),
        },
        {
            path: "/user/login",
            component: LoginView,
            props: (route) => ({ callback: route.query.callback }),
        },
        {
            path: "/product/new",
            component: NewProductView,
        },
        {
            path: "/shop",
            component: ShopView,
        },
        // {
        //     path: "/product/detail/:id",
        //     component: ProductDetailView,
        // }
        {
            path: "/product/verify",
            component: ProductVerifyView,
        },
        {
            path: "/product/types",
            component: TypesManagementView,
        },
        {
            path: "/admin",
            component: AdminView,
        },
    ],
});

export default router;
