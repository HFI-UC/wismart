import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/user/RegisterView.vue";
import EmailVerifyView from "../views/user/EmailVerifyView.vue";
import LoginView from "../views/user/LoginView.vue";
import NewProductView from "../views/NewProductView.vue";
import ShopView from "../views/ShopView.vue";
import ProductsManagementView from "../views/admin/ProductsManagementView.vue";
import AdminView from "../views/admin/AdminView.vue";
import TypesManagementView from "../views/admin/TypesManagementView.vue";
import CheckOutView from "../views/shop/CheckOutView.vue";

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
        {
            path: "/shop/checkout/:id",
            component: CheckOutView,
        },
        {
            path: "/admin/products",
            component: ProductsManagementView,
        },
        {
            path: "/admin/types",
            component: TypesManagementView,
        },
        {
            path: "/admin",
            component: AdminView,
        },
    ],
});

export default router;
