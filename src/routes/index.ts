import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Cookies from "js-cookie";

const getToken = () => Cookies.get("token");

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
    },
    {
        path: "/admin/dashboard",
        name: "admin-dashboard",
        component: () => import("../views/admin/index.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/admin/users",
        name: "admin-users",
        component: () => import("../views/admin/users/index.vue"),
        meta: { requiresAuth: true }
    },
    {
        path: "/admin/users/create",
        name: "admin-users-create",
        component: () => import("../views/admin/users/create.vue"),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _from, next) =>
{
    const token = getToken();

    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        next({ name: "login" });
    }
    else if ((to.name === "login" || to.name === "register") && token) {
        next({ name: "admin-dashboard" });
    } else {
        next();
    }
});

export default router;