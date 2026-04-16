import './bootstrap';
import { createApp, h } from 'vue';
import { createInertiaApp, router } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const guestRoutes = ['/login', '/register'];
const authRoutes  = ['/dashboard', '/categories'];

router.on('before', (event) => {
    const to    = event.detail.visit.url.pathname;
    const token = localStorage.getItem('auth_token');

    if (authRoutes.some((r) => to.startsWith(r)) && !token) {
        event.preventDefault();
        router.visit('/login');
    }

    if (guestRoutes.includes(to) && token) {
        event.preventDefault();
        router.visit('/dashboard');
    }
});

createInertiaApp({
    title: (title) => `${title} - ${import.meta.env.VITE_APP_NAME ?? 'Laravel'}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob('./Pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
