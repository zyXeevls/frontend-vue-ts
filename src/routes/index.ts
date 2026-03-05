import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/home/index.vue")
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/auth/register.vue")
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/auth/login.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;