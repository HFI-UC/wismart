import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/user/RegisterView.vue";
import EmailVerifyView from "../views/user/EmailVerifyView.vue";
import LoginView from "../views/user/LoginView.vue";
import NewProductView from "../views/shop/NewProductView.vue";
import ShopView from "../views/shop/ShopView.vue";
import ProductsManagementView from "../views/admin/ProductsManagementView.vue";
import AdminView from "../views/admin/AdminView.vue";
import TypesManagementView from "../views/admin/TypesManagementView.vue";
import CheckOutView from "../views/shop/CheckOutView.vue";
import TradeDetailView from "../views/shop/TradeDetailView.vue";
import UsersManagementView from "../views/admin/UsersManagementView.vue";
import LogsView from "../views/admin/LogsView.vue";

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
            path: "/user/trade/detail/:id",
            component: TradeDetailView,
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
            path: "/admin/users",
            component: UsersManagementView,
        },
        {
            path: "/admin/types",
            component: TypesManagementView,
        },
        {
            path: "/admin/logs",
            component: LogsView,
        },
        {
            path: "/admin",
            component: AdminView,
        },
    ],
});

export default router;
