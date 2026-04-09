import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppLayout from '@/layouts/AppLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: AuthLayout,
        meta: { guest: true },
        props: {
            title: 'Log in to your account',
            description: 'Enter your email and password below to log in',
        },
        children: [
            {
                path: '',
                name: 'login',
                component: () => import('@/pages/auth/Login.vue'),
            },
        ],
    },
    {
        path: '/register',
        component: AuthLayout,
        meta: { guest: true },
        props: {
            title: 'Create an account',
            description: 'Enter your details below to create your account',
        },
        children: [
            {
                path: '',
                name: 'register',
                component: () => import('@/pages/auth/Register.vue'),
            },
        ],
    },
    {
        path: '/',
        component: AppLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/dashboard',
            },
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/pages/Dashboard.vue'),
                meta: {
                    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();

    if (authStore.token && !authStore.user) {
        await authStore.fetchUser();
    }

    if (to.matched.some((r) => r.meta.requiresAuth)) {
        if (!authStore.isAuthenticated) {
            return next({ name: 'login' });
        }
    }

    if (to.matched.some((r) => r.meta.guest)) {
        if (authStore.isAuthenticated) {
            return next({ name: 'dashboard' });
        }
    }

    next();
});

export default router;
